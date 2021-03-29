const SOURCE_FOLDER = "src/";
const INPUT_FOLDER = SOURCE_FOLDER + "input/";

const SPAIN_SPANISH = "es-es";
const AMERICAN_SPANISH = "es-us";

// TODO: do not include '/' into folder constants
module.exports = {
  INPUT_FOLDER,
  OUTPUT_FOLDER: `${SOURCE_FOLDER}output/`,
  SONGS_FOLDER: `${INPUT_FOLDER}songs/`,

  AUDIO_EXTENSION: ".mp3",
  DOC_EXTENSION: ".txt",
  UTF_8: "utf8",

  VOICES: [SPAIN_SPANISH, AMERICAN_SPANISH],
};
