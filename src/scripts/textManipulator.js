const replaceAll = (string, search, replacement) =>
  string.split(search).join(replacement);

exports.getTextArrayFormatted = (text) =>
  replaceAll(text, "–", "-").split("\n");

exports.addChapterNumber = (text) => {
  const splittedFilename = filename.split("_");
  const chapterNumber = splittedFilename[splittedFilename.length - 1].replace(
    "cap",
    ""
  );

  return `Capítulo ${chapterNumber}: ${text}`;
};
