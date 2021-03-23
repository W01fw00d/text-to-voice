var fs = require("fs");
const gTTS = require("gtts");

const transformFile = (filename) => {
  const SOURCE_FOLDER = "src/";
  const INPUT_FOLDER = SOURCE_FOLDER + "input/";
  const OUTPUT_FOLDER = SOURCE_FOLDER + "output/";
  const SPAIN_SPANISH = "es-es";
  const AMERICAN_SPANISH = "es-us";
  const UTF_8 = "utf8";

  const generateVoiceFile = (text, filename) => {
    var gtts = new gTTS(text, SPAIN_SPANISH);

    gtts.save(`${OUTPUT_FOLDER}${filename}.mp3`, (error, _) => {
      if (error) {
        throw new Error(error);
      }
      console.log(`${filename} transformed.`);
    });
  };

  const readFile = (filename) => {
    fs.readFile(`${INPUT_FOLDER}${filename}`, UTF_8, (error, text) => {
      if (error) {
        throw new Error(error);
      }

      console.log(`${filename} read.`);
      generateVoiceFile(text, filename);
    });
  };

  readFile(filename);
};

const filename = "cad1/cad1_cap2";
transformFile(filename);
