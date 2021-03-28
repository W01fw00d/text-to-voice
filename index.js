const fs = require("fs");
const gTTS = require("gtts");
const audioconcat = require("audioconcat");
var ffmpeg = require("fluent-ffmpeg");

const transformFile = () => {
  const SOURCE_FOLDER = "src/";
  const INPUT_FOLDER = SOURCE_FOLDER + "input/";
  const OUTPUT_FOLDER = SOURCE_FOLDER + "output/";
  const SONGS_FOLDER = `${INPUT_FOLDER}songs/`;

  const AUDIO_EXTENSION = ".mp3";
  const DOC_EXTENSION = ".txt";
  const SPAIN_SPANISH = "es-es";
  const AMERICAN_SPANISH = "es-us";
  const VOICES = [SPAIN_SPANISH, AMERICAN_SPANISH];
  const UTF_8 = "utf8";

  // ---
  const bookCode = "cad1";
  const chapterCode = "cap13";
  const shallAddChapterNumber = false;
  // ---

  const filename = `${bookCode}/${bookCode}_${chapterCode}`;
  const openingSong = `${SONGS_FOLDER}opening/${bookCode}${AUDIO_EXTENSION}`;
  const closureSong = `${SONGS_FOLDER}closure/${bookCode}${AUDIO_EXTENSION}`;

  const generateVoiceFile = (text, filename, voice, callback) => {
    var gtts = new gTTS(text, voice);

    gtts.save(`${OUTPUT_FOLDER}${filename}${AUDIO_EXTENSION}`, (error, _) => {
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
    const fs = require("fs");
    let stream;
    let currentFile;
    let dhh = fs.createWriteStream(outputFilename);
    let index = 0;

    const main = () => {
      if (index >= filenames.length) {
        console.log(`${outputFilename} completed.`);
        console.log("[Task completed]");
        return;
      }
      currentFile = filenames[index];
      stream = fs.createReadStream(currentFile);
      stream.pipe(dhh, { end: false });
      stream.on("end", () => {
        console.log(currentFile + " appended");

        /* const folder = currentFile.split("/")[2];
        if (folder !== "songs") {
          deleteSegmentFile(currentFile);
        } */
        index++;
        main();
      });
    };
    main();
  };

  let lastAction = true;

  const combineVoiceFilesAudioconcat = (filenames, outputFilename) => {
    // Alternative to combineVoiceFiles
    // TODO: implement deleting segment files
    audioconcat(filenames)
      //.options("-ar 44100")
      .concat(outputFilename)
      .on("start", function (command) {
        console.log("ffmpeg process started:", command);
      })
      .on("error", function (err, stdout, stderr) {
        console.error("Error:", err);
        console.error("ffmpeg stderr:", stderr);
      })
      .on("end", function (output) {
        console.error("Audio created in:", output);

        /* if (lastAction) {
          lastAction = false;
          combineVoiceFilesAudioconcat(
            //[openingSong, outputFilename, closureSong], //BREAKS
            //[outputFilename, closureSong], // WORKS
            `${OUTPUT_FOLDER}cad1/cap1_cad14_def${AUDIO_EXTENSION}`
          );
        } */
      });
  };

  const combineVoiceFilesFfmpeg = (filenames, outputFilename) => {
    // Alternative to combineVoiceFiles
    // TODO: implement deleting segment files

    //TODO: can we print the full ffmpeg command? In case this API is lost...

    let ffmpegInstance = ffmpeg();

    filenames.forEach((filename) => {
      ffmpegInstance = ffmpegInstance.input(filename);
    });

    ffmpegInstance
      .on("error", function (err) {
        console.log("An error occurred: " + err.message);
      })
      .on("end", function () {
        console.log("ffmpeg merging finished!");
      })
      .mergeToFile(outputFilename, `${OUTPUT_FOLDER}cad1/temp`);
  };

  const readFile = (filename, shallAddChapterNumber) => {
    fs.readFile(
      `${INPUT_FOLDER}${filename}${DOC_EXTENSION}`,
      UTF_8,
      (error, text) => {
        if (error) {
          throw new Error(error);
        }

        const addChapterNumber = (text) => {
          const splittedFilename = filename.split("_");
          const chapterNumber = splittedFilename[
            splittedFilename.length - 1
          ].replace("cap", "");
          text = `Capítulo ${chapterNumber}: ` + text;

          return text;
        };

        console.log(`${filename} read succesfully.`);

        let segmentsFilenames = [openingSong];
        //let segmentsFilenames = [];

        const replaceAll = (string, search, replacement) =>
          string.split(search).join(replacement);

        let currentVoiceIndex = 1;
        let textSegmentIndex = 0;
        let textSubSegmentIndex = 0;

        if (shallAddChapterNumber) {
          text = addChapterNumber(text);
        }

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
                //segmentsFilenames.splice(1, 0, openingSong); // trying to add song in second position, but it doesnt avoid corruption
                segmentsFilenames.push(closureSong);

                //console.log("segmentsFilenames", segmentsFilenames);

                combineVoiceFilesFfmpeg(
                  segmentsFilenames,
                  `${OUTPUT_FOLDER}${filename}_ffmpeg${AUDIO_EXTENSION}`
                );
              }
            }
          };

          const subSegmentArray = segmentArray[textSegmentIndex].split("-");
          const textSubSegment = subSegmentArray[textSubSegmentIndex];
          if (textSubSegment && textSubSegment.trim().length > 0) {
            const isOdd = (number) => number % 2;

            currentVoiceIndex = isOdd(textSubSegmentIndex);

            const segmentFilename = `${filename}_${textSegmentIndex}_${textSubSegmentIndex}`;
            segmentsFilenames.push(
              `${OUTPUT_FOLDER}${segmentFilename}${AUDIO_EXTENSION}`
            );
            //console.log(`${currentVoiceIndex}. ${textSubSegment}`); //
            callback(); //
            /* generateVoiceFile(
              //
              textSubSegment,
              segmentFilename,
              VOICES[currentVoiceIndex],
              callback
            );  */ //
          } else {
            callback();
          }
        };

        iterate();
      }
    );
  };

  readFile(filename, shallAddChapterNumber);
};

transformFile();
