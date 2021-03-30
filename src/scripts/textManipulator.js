const replaceAll = (string, search, replacement) =>
  string.split(search).join(replacement);

exports.getTextArrayFormatted = (text) =>
  replaceAll(text, "–", "-") // Unify different dialogue indicators
    .split("\n"); // Divide by paragraphs to allow use of different voices

exports.getSubSegmentArrayFormatted = (
  text // Add a newline only after single ".", ",", " y ", " ni ", " o " and ";"
) =>
  replaceAll(
    replaceAll(
      replaceAll(
        replaceAll(
          replaceAll(
            replaceAll(
              replaceAll(replaceAll(text, "...", "{ellipsis}"), ".", ".\n"),
              "{ellipsis}",
              "..."
            ),
            ",",
            ",\n"
          ),
          ";",
          ";\n"
        ),
        " y ",
        " y\n"
      ),
      " ni ",
      " ni\n"
    ),
    " o ",
    " o\n"
  ).split("\n"); // Avoid long phrases that could "break" the voice.

exports.addChapterNumber = (text) => {
  const splittedFilename = filename.split("_");
  const chapterNumber = splittedFilename[splittedFilename.length - 1].replace(
    "cap",
    ""
  );

  return `Capítulo ${chapterNumber}: ${text}`;
};
