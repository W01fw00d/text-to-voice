const fs = require("fs");
const gTTS = require("gtts");

const transformFile = (filename) => {
  const SOURCE_FOLDER = "src/";
  const INPUT_FOLDER = SOURCE_FOLDER + "input/";
  const OUTPUT_FOLDER = SOURCE_FOLDER + "output/";
  const FILE_EXTENSION = ".wav"; //".mp3"
  const SPAIN_SPANISH = "es-es";
  const AMERICAN_SPANISH = "es-us";
  const VOICES = [SPAIN_SPANISH, AMERICAN_SPANISH];
  const UTF_8 = "utf8";

  const generateVoiceFile = (text, filename, voice, callback) => {
    var gtts = new gTTS(text, voice);

    gtts.save(`${OUTPUT_FOLDER}${filename}${FILE_EXTENSION}`, (error, _) => {
      if (error) {
        throw new Error(error);
      }
      console.log(`${filename} transformed.`);
      callback();
    });
  };

  const combineVoiceFiles = (filenames, outputFilename, callback) => {
    console.log(
      "combineVoiceFiles",
      `${OUTPUT_FOLDER}${outputFilename}${FILE_EXTENSION}`
    );
    var fs = require("fs"),
      stream,
      currentfile,
      dhh = fs.createWriteStream(
        `${OUTPUT_FOLDER}${outputFilename}${FILE_EXTENSION}`
      );

    let index = 0;

    function main() {
      if (index >= filenames.length) {
        dhh.end("Done");
        return;
      }
      currentfile = `${OUTPUT_FOLDER}` + filenames[index] + FILE_EXTENSION;
      stream = fs.createReadStream(currentfile);
      stream.pipe(dhh, { end: false });
      stream.on("end", function () {
        console.log(currentfile + " appended");
        index++;
        main();
      });
    }
    main();
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

      let textSegmentIndex = 0;
      let textSubSegmentIndex = 0;
      const segmentArray = replaceAll(text, "–", "-").split("\n");

      const iterate = () => {
        const callback = () => {
          textSubSegmentIndex++;

          if (textSubSegmentIndex < subSegmentArray.length) {
            iterate();
          } else {
            textSegmentIndex++;

            if (textSegmentIndex < segmentArray.length) {
              textSubSegmentIndex = 0;
              iterate();
            }
          }
        };

        const subSegmentArray = segmentArray[textSegmentIndex].split("-");
        const textSubSegment = subSegmentArray[textSubSegmentIndex];
        if (textSubSegment && textSubSegment.trim().length > 0) {
          const isOdd = (number) => number % 2;

          currentVoiceIndex = isOdd(textSubSegmentIndex);

          const segmentFilename = `${filename}${
            textSegmentIndex === 0 && textSubSegmentIndex === 0
              ? ""
              : `_${textSegmentIndex}_${textSubSegmentIndex}`
          }`;
          segmentsFilenames.push(segmentFilename);
          callback(); //
          /* generateVoiceFile(
            textSubSegment,
            segmentFilename,
            VOICES[currentVoiceIndex],
            callback
          ); */
        } else {
          callback();
        }
      };

      iterate();
      combineVoiceFiles(segmentsFilenames, filename);
    });
  };

  readFile(filename);
};

const filename = "cad1/cad1_cap3";
transformFile(filename);
