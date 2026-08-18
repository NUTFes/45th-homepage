const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const fontkit = require("fontkit");
const subsetFont = require("subset-font");

const ROOT_DIR = path.join(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT_DIR, "src/app/(frontend)/fonts/generated");
const FONT_OUTPUT_RELATIVE_DIR = "public/font/generated";
const FONT_OUTPUT_DIR = path.join(ROOT_DIR, FONT_OUTPUT_RELATIVE_DIR);
const FONT_PUBLIC_PATH = "/font/generated";
const CSS_FILE_NAME = "fonts.generated.css";
const MANIFEST_FILE_NAME = "fonts.manifest.json";
const JOYO_KANJI_PATH = path.join(ROOT_DIR, "assets/fonts/joyo-kanji.txt");

const SCHEMA_VERSION = 2;
const JOYO_KANJI_COUNT = 2136;
const EXTENDED_CHUNK_SIZE = 256;
const GENERATION_CONCURRENCY = 4;

const DISPLAY_COMMON_RANGES = [
  [0x20, 0x7e],
  [0x3000, 0x303f],
  [0x3040, 0x30ff],
  [0x31f0, 0x31ff],
  [0xff00, 0xffef],
];

const CONTENT_COMMON_RANGES = [
  [0x20, 0x7e],
  [0xa0, 0xff],
  [0x2000, 0x206f],
  [0x2190, 0x21ff],
  [0x2460, 0x24ff],
  [0x3000, 0x303f],
  [0x3040, 0x30ff],
  [0x31f0, 0x31ff],
  [0xff00, 0xffef],
];

const FONT_CONFIGS = [
  {
    id: "kaisotai",
    family: "Kaisotai Next 45th",
    source: "assets/fonts/kaisotai-next/Kaisotai-Next-UP-B.woff2",
    outputPrefix: "kaisotai-next",
    commonProfile: "display",
    style: "normal",
  },
  {
    id: "goldman-700",
    family: "Goldman",
    source: "assets/fonts/goldman/Goldman-Bold.ttf",
    outputPrefix: "goldman-700",
    commonProfile: "display",
    weight: "700",
    style: "normal",
  },
  {
    id: "zen-kaku-400",
    family: "Zen Kaku Gothic New 45th",
    source: "assets/fonts/zen-kaku-gothic-new/ZenKakuGothicNew-Regular.ttf",
    outputPrefix: "zen-kaku-gothic-new-400",
    commonProfile: "content",
    weight: "400",
    style: "normal",
  },
  {
    id: "zen-kaku-500",
    family: "Zen Kaku Gothic New 45th",
    source: "assets/fonts/zen-kaku-gothic-new/ZenKakuGothicNew-Medium.ttf",
    outputPrefix: "zen-kaku-gothic-new-500",
    commonProfile: "content",
    weight: "500",
    style: "normal",
  },
  {
    id: "zen-kaku-700",
    family: "Zen Kaku Gothic New 45th",
    source: "assets/fonts/zen-kaku-gothic-new/ZenKakuGothicNew-Bold.ttf",
    outputPrefix: "zen-kaku-gothic-new-700",
    commonProfile: "content",
    weight: "700",
    style: "normal",
  },
];

function fail(message) {
  throw new Error(message);
}

function toPosixPath(filePath) {
  return filePath.split(path.sep).join("/");
}

function toRelativePath(filePath) {
  return toPosixPath(path.relative(ROOT_DIR, filePath));
}

function absolutePath(relativePath) {
  return path.join(ROOT_DIR, relativePath);
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function sha256File(filePath) {
  return sha256(fs.readFileSync(filePath));
}

function writeFileAtomically(filePath, content) {
  const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);
  if (fs.existsSync(filePath) && fs.readFileSync(filePath).equals(buffer)) {
    return;
  }

  const temporaryPath = `${filePath}.${process.pid}.tmp`;
  fs.writeFileSync(temporaryPath, buffer);
  fs.renameSync(temporaryPath, filePath);
}

function removeUnexpectedFiles(directory, expectedFileNames) {
  for (const fileName of fs.readdirSync(directory)) {
    if (!expectedFileNames.has(fileName)) {
      fs.rmSync(path.join(directory, fileName), { force: true });
    }
  }
}

function isWebFontCodePoint(codePoint) {
  if (!Number.isInteger(codePoint) || codePoint < 0x20 || codePoint > 0x10ffff) {
    return false;
  }

  if (codePoint >= 0x7f && codePoint <= 0x9f) {
    return false;
  }

  if (codePoint >= 0xd800 && codePoint <= 0xdfff) {
    return false;
  }

  if (codePoint >= 0xfdd0 && codePoint <= 0xfdef) {
    return false;
  }

  const planeCodePoint = codePoint & 0xffff;
  return planeCodePoint !== 0xfffe && planeCodePoint !== 0xffff;
}

function sortedUniqueCodePoints(codePoints) {
  return [...new Set(codePoints)].filter(isWebFontCodePoint).sort((left, right) => left - right);
}

function codePointsFromRanges(ranges) {
  const codePoints = new Set();

  for (const [start, end] of ranges) {
    for (let codePoint = start; codePoint <= end; codePoint += 1) {
      codePoints.add(codePoint);
    }
  }

  return codePoints;
}

function createCommonProfiles() {
  const display = codePointsFromRanges(DISPLAY_COMMON_RANGES);
  for (const character of "技大祭") {
    display.add(character.codePointAt(0));
  }

  const joyoKanji = new Set(
    [...fs.readFileSync(JOYO_KANJI_PATH, "utf8")]
      .filter((character) => character.trim())
      .map((character) => character.codePointAt(0)),
  );

  if (joyoKanji.size !== JOYO_KANJI_COUNT) {
    fail(`Expected ${JOYO_KANJI_COUNT} joyo kanji, but found ${joyoKanji.size}.`);
  }

  const content = codePointsFromRanges(CONTENT_COMMON_RANGES);
  for (const codePoint of joyoKanji) {
    content.add(codePoint);
  }

  return { content, display };
}

function loadSourceFont(config) {
  const sourcePath = absolutePath(config.source);
  const buffer = fs.readFileSync(sourcePath);
  const font = fontkit.create(buffer);
  const codePoints = sortedUniqueCodePoints(font.characterSet);

  if (codePoints.length === 0) {
    fail(`No web font code points found in ${config.source}.`);
  }

  return {
    buffer,
    codePoints,
    config,
    sha256: sha256(buffer),
  };
}

function codePointsToRanges(codePoints) {
  if (codePoints.length === 0) {
    return [];
  }

  const ranges = [];
  let rangeStart = codePoints[0];
  let previous = codePoints[0];

  for (let index = 1; index < codePoints.length; index += 1) {
    const current = codePoints[index];
    if (current === previous + 1) {
      previous = current;
      continue;
    }

    ranges.push([rangeStart, previous]);
    rangeStart = current;
    previous = current;
  }

  ranges.push([rangeStart, previous]);
  return ranges;
}

function formatUnicodeRange(ranges) {
  return ranges
    .map(([start, end]) => {
      const formattedStart = start.toString(16).toUpperCase();
      const formattedEnd = end.toString(16).toUpperCase();
      return start === end ? `U+${formattedStart}` : `U+${formattedStart}-${formattedEnd}`;
    })
    .join(", ");
}

function createChunkDefinitions(sourceFont, commonProfiles) {
  const { config, codePoints: sourceCodePoints } = sourceFont;
  const sourceCodePointSet = new Set(sourceCodePoints);
  const requestedCommon = commonProfiles[config.commonProfile];

  if (!requestedCommon) {
    fail(`Unknown common profile: ${config.commonProfile}.`);
  }

  const commonCodePoints = [...requestedCommon]
    .filter((codePoint) => sourceCodePointSet.has(codePoint))
    .sort((left, right) => left - right);
  const commonCodePointSet = new Set(commonCodePoints);
  const extendedCodePoints = sourceCodePoints.filter(
    (codePoint) => !commonCodePointSet.has(codePoint),
  );

  const chunks = [createChunkDefinition(config, "common", "common", 0, commonCodePoints)];

  for (let offset = 0; offset < extendedCodePoints.length; offset += EXTENDED_CHUNK_SIZE) {
    const index = offset / EXTENDED_CHUNK_SIZE + 1;
    const label = `extended-${String(index).padStart(2, "0")}`;
    chunks.push(
      createChunkDefinition(
        config,
        "extended",
        label,
        index,
        extendedCodePoints.slice(offset, offset + EXTENDED_CHUNK_SIZE),
      ),
    );
  }

  return chunks;
}

function createChunkDefinition(config, kind, label, index, codePoints) {
  if (codePoints.length === 0) {
    fail(`Cannot generate an empty ${config.id} ${label} chunk.`);
  }

  return {
    codePoints,
    family: config.family,
    fileBase: `${config.outputPrefix}-${label}`,
    fontId: config.id,
    index,
    kind,
    label,
    style: config.style,
    weight: config.weight,
  };
}

function serializeChunkDefinition(chunk, asset) {
  return {
    fontId: chunk.fontId,
    family: chunk.family,
    weight: chunk.weight ?? null,
    style: chunk.style,
    kind: chunk.kind,
    index: chunk.index,
    label: chunk.label,
    fileBase: chunk.fileBase,
    codePointCount: chunk.codePoints.length,
    ...(asset ? { asset } : {}),
  };
}

function renderCss(chunkDefinitions, serializedChunks) {
  const lines = ["/* Generated by scripts/font-assets.cjs. Do not edit. */", ""];

  for (const [index, chunk] of chunkDefinitions.entries()) {
    const asset = serializedChunks[index].asset;
    const ranges = codePointsToRanges(chunk.codePoints);
    lines.push("@font-face {");
    lines.push(`  font-family: "${chunk.family}";`);
    lines.push(`  font-style: ${chunk.style};`);
    if (chunk.weight) {
      lines.push(`  font-weight: ${chunk.weight};`);
    }
    lines.push("  font-display: swap;");
    lines.push(`  src: url("${FONT_PUBLIC_PATH}/${asset}") format("woff2");`);
    lines.push(`  unicode-range: ${formatUnicodeRange(ranges)};`);
    lines.push("}", "");
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

function codePointsToText(codePoints) {
  return codePoints.map((codePoint) => String.fromCodePoint(codePoint)).join("");
}

function assertCodePointsEqual(actual, expected, label) {
  if (actual.length !== expected.length) {
    fail(`${label} has ${actual.length} code points; expected ${expected.length}.`);
  }

  for (let index = 0; index < expected.length; index += 1) {
    if (actual[index] !== expected[index]) {
      fail(
        `${label} differs at index ${index}: U+${actual[index].toString(16).toUpperCase()} != U+${expected[index].toString(16).toUpperCase()}.`,
      );
    }
  }
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = Array.from({ length: items.length });
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  const workerCount = Math.min(concurrency, items.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

function configuredInputPaths() {
  return [
    toRelativePath(__filename),
    toRelativePath(JOYO_KANJI_PATH),
    ...FONT_CONFIGS.map((config) => config.source),
  ].sort();
}

function createInputRecords() {
  return configuredInputPaths().map((relativePath) => ({
    path: relativePath,
    sha256: sha256File(absolutePath(relativePath)),
  }));
}

function createFileRecord(relativePath) {
  const buffer = fs.readFileSync(absolutePath(relativePath));
  return {
    path: relativePath,
    bytes: buffer.length,
    sha256: sha256(buffer),
  };
}

function readManifest() {
  const manifestPath = path.join(OUTPUT_DIR, MANIFEST_FILE_NAME);
  return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
}

function compareJson(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${label} is stale. Run \`pnpm run fonts:generate\`.`);
  }
}

function validateManifestFiles(manifest) {
  const expectedMetadataEntries = [CSS_FILE_NAME, MANIFEST_FILE_NAME].sort();
  const actualMetadataEntries = fs.readdirSync(OUTPUT_DIR).sort();
  compareJson(actualMetadataEntries, expectedMetadataEntries, "Generated font metadata file list");

  const expectedFontEntries = manifest.chunks.map((chunk) => chunk.asset).sort();
  const actualFontEntries = fs.readdirSync(FONT_OUTPUT_DIR).sort();
  compareJson(actualFontEntries, expectedFontEntries, "Generated font asset file list");

  const expectedFilePaths = [
    toRelativePath(path.join(OUTPUT_DIR, CSS_FILE_NAME)),
    ...manifest.chunks.map((chunk) =>
      toPosixPath(path.join(FONT_OUTPUT_RELATIVE_DIR, chunk.asset)),
    ),
  ].sort();
  compareJson(
    manifest.files.map((file) => file.path).sort(),
    expectedFilePaths,
    "Font manifest file records",
  );

  const fileByPath = new Map();
  for (const expectedFile of manifest.files) {
    const actualFile = createFileRecord(expectedFile.path);
    compareJson(actualFile, expectedFile, `Generated font file ${expectedFile.path}`);
    fileByPath.set(expectedFile.path, expectedFile);
  }

  for (const chunk of manifest.chunks) {
    const relativePath = toPosixPath(path.join(FONT_OUTPUT_RELATIVE_DIR, chunk.asset));
    const file = fileByPath.get(relativePath);
    const expectedAsset = `${chunk.fileBase}.${file.sha256.slice(0, 12)}.woff2`;
    if (chunk.asset !== expectedAsset) {
      fail(`Generated font asset name is stale: ${chunk.asset}.`);
    }
  }
}

function validateChunkCoverage(sourceFonts, chunkDefinitions, manifestChunks) {
  for (const sourceFont of sourceFonts) {
    const chunks = chunkDefinitions
      .map((definition, index) => ({
        asset: manifestChunks[index].asset,
        definition,
      }))
      .filter(({ definition }) => definition.fontId === sourceFont.config.id);
    const covered = new Set();

    for (const { asset, definition } of chunks) {
      const outputPath = path.join(FONT_OUTPUT_DIR, asset);
      const outputFont = fontkit.create(fs.readFileSync(outputPath));
      const actualCodePoints = sortedUniqueCodePoints(outputFont.characterSet);
      assertCodePointsEqual(actualCodePoints, definition.codePoints, asset);

      for (const codePoint of actualCodePoints) {
        if (covered.has(codePoint)) {
          fail(
            `${sourceFont.config.id} contains duplicate coverage for U+${codePoint.toString(16).toUpperCase()}.`,
          );
        }
        covered.add(codePoint);
      }
    }

    const coveredCodePoints = [...covered].sort((left, right) => left - right);
    assertCodePointsEqual(
      coveredCodePoints,
      sourceFont.codePoints,
      `${sourceFont.config.id} total coverage`,
    );
  }
}

function expectedFontRecords(sourceFonts) {
  return sourceFonts.map((sourceFont) => ({
    id: sourceFont.config.id,
    family: sourceFont.config.family,
    source: sourceFont.config.source,
    sha256: sourceFont.sha256,
    codePointCount: sourceFont.codePoints.length,
    commonProfile: sourceFont.config.commonProfile,
    weight: sourceFont.config.weight ?? null,
    style: sourceFont.config.style,
  }));
}

function validateGeneratedAssets({ logSuccess = true } = {}) {
  const manifest = readManifest();
  if (manifest.schemaVersion !== SCHEMA_VERSION) {
    fail(`Unsupported font manifest schema version: ${manifest.schemaVersion}.`);
  }

  const commonProfiles = createCommonProfiles();
  const sourceFonts = FONT_CONFIGS.map(loadSourceFont);
  const chunkDefinitions = sourceFonts.flatMap((sourceFont) =>
    createChunkDefinitions(sourceFont, commonProfiles),
  );
  const serializedChunks = chunkDefinitions.map((chunk) => serializeChunkDefinition(chunk));
  const manifestChunksWithoutAssets = manifest.chunks.map(({ asset: _asset, ...chunk }) => chunk);

  compareJson(manifest.inputs, createInputRecords(), "Font manifest inputs");
  compareJson(manifest.fonts, expectedFontRecords(sourceFonts), "Font manifest sources");
  compareJson(manifestChunksWithoutAssets, serializedChunks, "Font manifest chunks");
  const expectedCss = renderCss(chunkDefinitions, manifest.chunks);
  const cssPath = path.join(OUTPUT_DIR, CSS_FILE_NAME);
  if (fs.readFileSync(cssPath, "utf8") !== expectedCss) {
    fail("Generated font CSS is stale. Run `pnpm run fonts:generate`.");
  }

  validateManifestFiles(manifest);
  validateChunkCoverage(sourceFonts, chunkDefinitions, manifest.chunks);

  if (logSuccess) {
    const totalBytes = manifest.files.reduce((sum, file) => sum + file.bytes, 0);
    console.log(
      `Validated ${manifest.chunks.length} font chunks (${(totalBytes / 1024).toFixed(1)} KiB).`,
    );
  }
}

async function generateAssets() {
  const commonProfiles = createCommonProfiles();
  const sourceFonts = FONT_CONFIGS.map(loadSourceFont);
  const chunkDefinitions = sourceFonts.flatMap((sourceFont) =>
    createChunkDefinitions(sourceFont, commonProfiles),
  );
  const sourceFontById = new Map(
    sourceFonts.map((sourceFont) => [sourceFont.config.id, sourceFont]),
  );

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(FONT_OUTPUT_DIR, { recursive: true });

  const serializedChunks = await mapWithConcurrency(
    chunkDefinitions,
    GENERATION_CONCURRENCY,
    async (chunk) => {
      const sourceFont = sourceFontById.get(chunk.fontId);
      if (!sourceFont) {
        fail(`Missing source font for ${chunk.fontId}.`);
      }

      const subsetBuffer = await subsetFont(sourceFont.buffer, codePointsToText(chunk.codePoints), {
        targetFormat: "woff2",
      });
      const asset = `${chunk.fileBase}.${sha256(subsetBuffer).slice(0, 12)}.woff2`;
      writeFileAtomically(path.join(FONT_OUTPUT_DIR, asset), subsetBuffer);
      return serializeChunkDefinition(chunk, asset);
    },
  );

  writeFileAtomically(
    path.join(OUTPUT_DIR, CSS_FILE_NAME),
    renderCss(chunkDefinitions, serializedChunks),
  );

  const outputFilePaths = [
    toRelativePath(path.join(OUTPUT_DIR, CSS_FILE_NAME)),
    ...serializedChunks.map((chunk) =>
      toPosixPath(path.join(FONT_OUTPUT_RELATIVE_DIR, chunk.asset)),
    ),
  ].sort();
  const manifest = {
    schemaVersion: SCHEMA_VERSION,
    inputs: createInputRecords(),
    fonts: expectedFontRecords(sourceFonts),
    chunks: serializedChunks,
    files: outputFilePaths.map(createFileRecord),
  };

  writeFileAtomically(
    path.join(OUTPUT_DIR, MANIFEST_FILE_NAME),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  removeUnexpectedFiles(FONT_OUTPUT_DIR, new Set(serializedChunks.map((chunk) => chunk.asset)));
  removeUnexpectedFiles(OUTPUT_DIR, new Set([CSS_FILE_NAME, MANIFEST_FILE_NAME]));

  validateGeneratedAssets({ logSuccess: false });

  const totalBytes = manifest.files.reduce((sum, file) => sum + file.bytes, 0);
  console.log(
    `Generated ${manifest.chunks.length} font chunks (${(totalBytes / 1024).toFixed(1)} KiB).`,
  );
}

async function main() {
  const command = process.argv[2];
  if (command === "generate") {
    await generateAssets();
    return;
  }

  if (command === "check") {
    validateGeneratedAssets();
    return;
  }

  fail("Usage: node scripts/font-assets.cjs <generate|check>");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
