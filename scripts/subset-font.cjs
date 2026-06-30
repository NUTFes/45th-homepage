const fs = require("fs");
const path = require("path");
const subsetFont = require("subset-font");

const PUBLIC_FONT_DIR = path.join(__dirname, "../public/font");
const SOURCE_FONT_DIR = path.join(__dirname, "../assets/fonts/zen-kaku-gothic-new");
const JOYO_KANJI_PATH = path.join(__dirname, "../assets/fonts/joyo-kanji.txt");
const KAISOTAI_FONT_PATH = path.join(PUBLIC_FONT_DIR, "Kaisotai-Next-UP-B.woff2");
const KAISOTAI_OUTPUT_PATH = path.join(PUBLIC_FONT_DIR, "Kaisotai-Next-UP-B.subset.woff2");

const ZEN_KAKU_FONT_PATHS = [
  {
    input: path.join(SOURCE_FONT_DIR, "ZenKakuGothicNew-Regular.ttf"),
    output: path.join(PUBLIC_FONT_DIR, "ZenKakuGothicNew-Regular.subset.woff2"),
  },
  {
    input: path.join(SOURCE_FONT_DIR, "ZenKakuGothicNew-Medium.ttf"),
    output: path.join(PUBLIC_FONT_DIR, "ZenKakuGothicNew-Medium.subset.woff2"),
  },
  {
    input: path.join(SOURCE_FONT_DIR, "ZenKakuGothicNew-Bold.ttf"),
    output: path.join(PUBLIC_FONT_DIR, "ZenKakuGothicNew-Bold.subset.woff2"),
  },
];

const KAISOTAI_FONT_USAGE_FILE_PATHS = [
  "scripts/test-subset-font.ts",
  "src/components/layout/Header.tsx",
  "src/components/layout/Footer.tsx",
  "src/components/ui/SectionTitle.tsx",
  "src/components/ui/EventIntroFrame.tsx",
  "src/modules/top/TopPageView.tsx",
  "src/modules/top/ui/SponsorSection.tsx",
  "src/modules/news/NewsPageView.tsx",
  "src/modules/attention/AttentionPageView.tsx",
  "src/modules/notfound/NotFoundView.tsx",
  "src/modules/sponsors/SponsorPageView.tsx",
].map((relativePath) => path.join(__dirname, "..", relativePath));

const ZEN_KAKU_FONT_USAGE_ROOTS = ["src/app/(frontend)", "src/components", "src/modules"].map(
  (relativePath) => path.join(__dirname, "..", relativePath),
);

// 固定見出しで使うフォントなので、常用かな全体ではなく実使用文字とASCIIに絞る。
const BASIC_CHARS =
  "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ 　\n";
const JAPANESE_MARKS_AND_KANA =
  "ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをんゔァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴー、。！？「」『』（）［］【】・〜…";
const JOYO_KANJI_COUNT = 2136;

function walkFiles(dir, filePaths = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walkFiles(entryPath, filePaths);
      continue;
    }

    if (/\.(css|md|mdx|ts|tsx)$/.test(entry.name)) {
      filePaths.push(entryPath);
    }
  }

  return filePaths;
}

function extractCharsFromFiles(filePaths) {
  const chars = new Set();

  for (const filePath of filePaths) {
    const content = fs.readFileSync(filePath, "utf-8");
    for (const char of content) {
      if (char.charCodeAt(0) > 127) {
        chars.add(char);
      }
    }
  }

  return chars;
}

function extractCharsFromText(text) {
  const chars = new Set();

  for (const char of text) {
    if (char.trim()) {
      chars.add(char);
    }
  }

  return chars;
}

async function subset(inputPath, outputPath, text) {
  const fontBuffer = fs.readFileSync(inputPath);

  const subsetBuffer = await subsetFont(fontBuffer, text, {
    targetFormat: "woff2",
  });

  fs.writeFileSync(outputPath, subsetBuffer);
  console.log(`Subset font saved to ${outputPath}`);
  console.log(
    `Original: ${(fontBuffer.length / 1024).toFixed(1)}KB, Subset: ${(subsetBuffer.length / 1024).toFixed(1)}KB`,
  );
}

async function main() {
  const kaisotaiChars = extractCharsFromFiles(KAISOTAI_FONT_USAGE_FILE_PATHS);
  const kaisotaiText = BASIC_CHARS + Array.from(kaisotaiChars).join("");
  await subset(KAISOTAI_FONT_PATH, KAISOTAI_OUTPUT_PATH, kaisotaiText);

  const zenKakuUsageFilePaths = ZEN_KAKU_FONT_USAGE_ROOTS.flatMap((root) => walkFiles(root));
  const zenKakuChars = extractCharsFromFiles(zenKakuUsageFilePaths);
  const joyoKanjiChars = extractCharsFromText(fs.readFileSync(JOYO_KANJI_PATH, "utf-8"));

  if (joyoKanjiChars.size !== JOYO_KANJI_COUNT) {
    throw new Error(`Expected ${JOYO_KANJI_COUNT} joyo kanji, but found ${joyoKanjiChars.size}.`);
  }

  const zenKakuText =
    BASIC_CHARS +
    JAPANESE_MARKS_AND_KANA +
    Array.from(joyoKanjiChars).join("") +
    Array.from(zenKakuChars).join("");

  for (const fontPath of ZEN_KAKU_FONT_PATHS) {
    await subset(fontPath.input, fontPath.output, zenKakuText);
  }
}

main().catch(console.error);
