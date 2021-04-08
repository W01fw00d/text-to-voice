const replaceAll = (string, search, replacement) =>
  string.split(search).join(replacement);

exports.getTextArrayFormatted = (text) =>
  replaceAll(
    replaceAll(
      replaceAll(
        replaceAll(text, "»", "-"),
        "–",
        "-"
      ) /* Unify dialogue delimiters */,
      /\*{4,}/ /* Reduce asterisk delimiters to avoid repetitive voice */,
      "***"
    ),
    /(?<=[A-z])\-(?=[A-z])/,
    "..." /* Gets "-"" used to express stuttering and replace them by "..." to avoid confusion with dialogue delimiters */
  ).split("\n");

exports.addChapterNumber = (filename, text, DELIMITER) => {
  const splittedFilename = filename.split("_");
  const chapterNumber = splittedFilename[splittedFilename.length - 1].replace(
    "cap",
    ""
  );

  return `${DELIMITER} ${chapterNumber}: ${text}`;
};
