const SOURCE_FOLDER = "src";
const INPUT_FOLDER = SOURCE_FOLDER + "/input";

const SPAIN_SPANISH = "es-es";
const AMERICAN_SPANISH = "es-us";
const PORTUGUESE = "pt";
const ITALIAN = "it";

module.exports = {
  INPUT_FOLDER,
  OUTPUT_FOLDER: `${SOURCE_FOLDER}/output`,
  SONGS_FOLDER: "songs",

  AUDIO_EXTENSION: "mp3",
  DOC_EXTENSION: "txt",
  UTF_8: "utf8",

  getVoices: (lang) =>
    ({
      es: {
        INTRO: PORTUGUESE,
        NARRATOR: SPAIN_SPANISH,
        DIALOGUE: [AMERICAN_SPANISH, ITALIAN],
      },
      en: {
        INTRO: PORTUGUESE,
        NARRATOR: SPAIN_SPANISH,
        DIALOGUE: [AMERICAN_SPANISH, ITALIAN],
      },
    }[lang || "es"]),
};
