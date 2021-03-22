var fs = require("fs");
const gTTS = require("gtts");

const transformFile = (filename) => {
  const sourceFolder = "src/";
  const inputFolder = sourceFolder + "input/";
  const outputFolder = sourceFolder + "output/";

  const generateVoiceFile = (text, filename) => {
    var gtts = new gTTS(text, "es");

    gtts.save(`${outputFolder}${filename}.mp3`, (error, _) => {
      if (error) {
        throw new Error(error);
      }
      console.log(`${filename} transformed.`);
    });
  };

  const readFile = (filename) => {
    fs.readFile(`${inputFolder}${filename}`, "utf8", (error, text) => {
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
