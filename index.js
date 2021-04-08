const assembleChapter = require("./src/scripts/chapterAssembler");

const keys = ["bookCode", "chapterCode", "lang", "shallAddChapterNumber"];
const {
  bookCode,
  chapterCode,
  lang,
  shallAddChapterNumber,
} = process.argv.slice(2).reduce((accumulator, item, index) => {
  accumulator[keys[index]] = item;
  return accumulator;
}, {});

assembleChapter(
  bookCode,
  chapterCode,
  lang || "esp",
  shallAddChapterNumber !== undefined
);
