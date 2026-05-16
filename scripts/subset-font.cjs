const fs = require("fs");
const path = require("path");
const subsetFont = require("subset-font");

const FONT_PATH = path.join(__dirname, "../public/font/Kaisotai-Next-UP-B.woff2");
const OUTPUT_PATH = path.join(__dirname, "../public/font/Kaisotai-Next-UP-B.subset.woff2");
const FONT_USAGE_FILE_PATHS = [
  "../src/components/layout/Header.tsx",
  "../src/components/layout/Footer.tsx",
  "../src/components/ui/SectionTitle.tsx",
  "../src/modules/top/TopPageView.tsx",
  "../src/modules/top/ui/SponsorSection.tsx",
  "../src/modules/news/NewsPageView.tsx",
  "../src/modules/notfound/NotFoundView.tsx",
].map((relativePath) => path.join(__dirname, relativePath));

// 固定見出しで使うフォントなので、常用かな全体ではなく実使用文字とASCIIに絞る。
const BASIC_CHARS =
  "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ ";

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

async function main() {
  const fontBuffer = fs.readFileSync(FONT_PATH);
  const extractedChars = extractCharsFromFiles(FONT_USAGE_FILE_PATHS);
  const text = BASIC_CHARS + Array.from(extractedChars).join("");

  const subsetBuffer = await subsetFont(fontBuffer, text, {
    targetFormat: "woff2",
  });

  fs.writeFileSync(OUTPUT_PATH, subsetBuffer);
  console.log(`Subset font saved to ${OUTPUT_PATH}`);
  console.log(
    `Original: ${(fontBuffer.length / 1024).toFixed(1)}KB, Subset: ${(subsetBuffer.length / 1024).toFixed(1)}KB`,
  );
}

main().catch(console.error);
