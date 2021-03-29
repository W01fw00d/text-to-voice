module.exports = (bookCode, filenames, outputFilename) => {
  const ffmpeg = require("fluent-ffmpeg");

  const { OUTPUT_FOLDER } = require("./constants");
  const FFMPEG_TEMP_FOLDER = "ffmpeg_temp";

  const TEMP_FOLDER = `${OUTPUT_FOLDER}${bookCode}/${FFMPEG_TEMP_FOLDER}`;
  // TODO: add missing - to dialogues in .txt file
  // TODO: implement deleting segment files, after every merge if possible
  //TODO: can we print the full ffmpeg command? In case this API is lost...

  const ffmpegInstanceWithInputs = filenames.reduce(
    (accumulator, filename) => accumulator.input(filename),
    ffmpeg()
  );

  ffmpegInstanceWithInputs
    .on("error", ({ message }) => {
      console.log(`An error occurred: ${message}`);
    })
    .on("end", () => {
      console.log("Audio files merged!");
    })
    .mergeToFile(outputFilename, TEMP_FOLDER);
};
