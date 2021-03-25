const fs = require("fs");
const gTTS = require("gtts");

const transformFile = (filename) => {
  const SOURCE_FOLDER = "src/";
  const INPUT_FOLDER = SOURCE_FOLDER + "input/";
  const OUTPUT_FOLDER = SOURCE_FOLDER + "output/";
  const FILE_EXTENSION = ".mp3";
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
      console.log(`${filename} segment transformed.`);
      callback();
    });
  };

  const deleteSegmentFile = (file) => {
    try {
      fs.unlinkSync(file);
      console.log(`${file} deleted.`);
    } catch (error) {
      console.error(error);
    }
  };

  const combineVoiceFiles = (filenames, outputFilename) => {
    console.log(
      "combineVoiceFiles",
      `${OUTPUT_FOLDER}${outputFilename}${FILE_EXTENSION}`
    );
    var fs = require("fs"),
      stream,
      currentFile,
      dhh = fs.createWriteStream(
        `${OUTPUT_FOLDER}${outputFilename}${FILE_EXTENSION}`
      );

    let index = 0;

    const main = () => {
      if (index >= filenames.length) {
        console.log(`${outputFilename} transformed.`);
        console.log("[Task completed]");
        return;
      }
      currentFile = `${OUTPUT_FOLDER}` + filenames[index] + FILE_EXTENSION;
      stream = fs.createReadStream(currentFile);
      stream.pipe(dhh, { end: false });
      stream.on("end", () => {
        console.log(currentFile + " appended");
        deleteSegmentFile(currentFile);
        index++;
        main();
      });
    };
    main();
  };

  const readFile = (filename) => {
    fs.readFile(`${INPUT_FOLDER}${filename}`, UTF_8, (error, text) => {
      if (error) {
        throw new Error(error);
      }

      console.log(`${filename} read succesfully.`);

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
            } else {
              // End of iteration
              combineVoiceFiles(segmentsFilenames, filename);
            }
          }
        };

        const subSegmentArray = segmentArray[textSegmentIndex].split("-");
        const textSubSegment = subSegmentArray[textSubSegmentIndex];
        if (textSubSegment && textSubSegment.trim().length > 0) {
          const isOdd = (number) => number % 2;

          currentVoiceIndex = isOdd(textSubSegmentIndex);

          const segmentFilename = `${filename}_${textSegmentIndex}_${textSubSegmentIndex}`;
          segmentsFilenames.push(segmentFilename);
          //console.log(`${currentVoiceIndex}. ${textSubSegment}`); //
          //callback(); //
          generateVoiceFile(
            textSubSegment,
            segmentFilename,
            VOICES[currentVoiceIndex],
            callback
          );
        } else {
          callback();
        }
      };

      iterate();
    });
  };

  readFile(filename);
};

// ----------------------------

transformFile("cad1/cad1_cap8");
