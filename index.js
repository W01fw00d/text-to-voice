const fs = require("fs");
const gTTS = require("gtts");
const audioCombiner = require("./src/scripts/audio-combiner.js");

const transformFile = (filename) => {
  const SOURCE_FOLDER = "src/";
  const INPUT_FOLDER = SOURCE_FOLDER + "input/";
  const OUTPUT_FOLDER = SOURCE_FOLDER + "output/";
  const SPAIN_SPANISH = "es-es";
  const AMERICAN_SPANISH = "es-us";
  const VOICES = [AMERICAN_SPANISH, SPAIN_SPANISH];
  const UTF_8 = "utf8";

  const generateVoiceFile = (text, filename, voice) => {
    var gtts = new gTTS(text, voice);

    gtts.save(`${OUTPUT_FOLDER}${filename}`, (error, _) => {
      if (error) {
        throw new Error(error);
      }
      console.log(`${filename} transformed.`);
    });
  };

  const combineVoiceFiles = (filenames, outputFilename) => {
    const combineFiles = (segmentFile) => {
      audioCombiner.combineSamples(
        `${OUTPUT_FOLDER}${segmentFile}`,
        `${OUTPUT_FOLDER}${outputFilename}`,
        `${OUTPUT_FOLDER}${outputFilename}`,
        (error) => {
          if (error) {
            throw new Error(error);
          }

          console.log(
            `${segmentFile} file was included into ${outputFilename}`
          );
        }
      );
    };

    audioCombiner.soxPath = "./sox/sox";

    filenames.forEach(combineFiles);
  };

  const readFile = (filename) => {
    fs.readFile(`${INPUT_FOLDER}${filename}`, UTF_8, (error, text) => {
      if (error) {
        throw new Error(error);
      }

      console.log(`${filename} read.`);

      let segmentsFilenames = [];

      const replaceAll = (string, search, replacement) =>
        string.split(search).join(replacement);

      //replaceAll(text, "\n", "-")
      replaceAll(text, "–", "-")
        .split("-")
        .forEach((textSegment, index) => {
          const isOdd = (number) => number % 2;

          console.log(`${index}. ${textSegment}`);
          /* const segmentFilename = `${filename}${
            index === 0 ? "" : `_${index}`
          }`;
          segmentsFilenames.push(segmentFilename);
          generateVoiceFile(textSegment, segmentFilename, VOICES[isOdd(index)]); */
        });

      //combineVoiceFiles(segmentsFilenames, filename);
    });
  };

  readFile(filename);
};

const filename = "cad1/cad1_cap3";
transformFile(filename);
