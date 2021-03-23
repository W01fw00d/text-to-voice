const fs = require("fs");
const gTTS = require("gtts");
const audioCombiner = require("./src/scripts/audio-combiner.js");

const transformFile = (filename) => {
  const SOURCE_FOLDER = "src/";
  const INPUT_FOLDER = SOURCE_FOLDER + "input/";
  const OUTPUT_FOLDER = SOURCE_FOLDER + "output/";
  const MP3_EXTENSION = ".wav"; //".mp3"
  const SPAIN_SPANISH = "es-es";
  const AMERICAN_SPANISH = "es-us";
  const VOICES = [SPAIN_SPANISH, AMERICAN_SPANISH];
  const UTF_8 = "utf8";

  const generateVoiceFile = (text, filename, voice) => {
    var gtts = new gTTS(text, voice);

    gtts.save(`${OUTPUT_FOLDER}${filename}${MP3_EXTENSION}`, (error, _) => {
      if (error) {
        throw new Error(error);
      }
      console.log(`${filename} transformed.`);
    });
  };

  const combineVoiceFiles = (filenames, outputFilename) => {
    const combineFiles = (segmentFile) => {
      audioCombiner.combineSamples(
        `${OUTPUT_FOLDER}${segmentFile}${MP3_EXTENSION}`,
        `${OUTPUT_FOLDER}${outputFilename}${MP3_EXTENSION}`,
        `${OUTPUT_FOLDER}${outputFilename}${MP3_EXTENSION}`,
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

    audioCombiner.soxPath = "sox";

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

      let currentVoiceIndex = 1;

      //Instead of forEach, do waits for each file read
      // Try to save voice as .wav
      // If cannot save directly as wav, find a way to convert from mp3 to wav or any extension sox can understand
      replaceAll(text, "–", "-")
        .split("\n")
        .forEach((textSegment, textSegmentIndex) => {
          const isDialogue = (string) => string[0] === "-";

          currentVoiceIndex = isDialogue(textSegment) ? 0 : 1;

          textSegment
            .split("-")
            .forEach((textSubSegment, textSubSegmentIndex) => {
              if (textSubSegment) {
                const isOdd = (number) => number % 2;

                currentVoiceIndex = isOdd(textSubSegmentIndex);

                console.log(`${currentVoiceIndex}. ${textSubSegment}`);
                const segmentFilename = `${filename}${
                  textSegmentIndex === 0 && textSubSegmentIndex === 0
                    ? ""
                    : `_${textSegmentIndex}_${textSubSegmentIndex}`
                }`;
                segmentsFilenames.push(segmentFilename);
                /* generateVoiceFile(
                  textSubSegment,
                  segmentFilename,
                  VOICES[currentVoiceIndex]
                ); */
              }
            });
        });

      //combineVoiceFiles(segmentsFilenames, filename);
    });
  };

  readFile(filename);
};

const filename = "cad1/cad1_cap3";
transformFile(filename);
