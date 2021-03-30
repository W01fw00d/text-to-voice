module.exports = (bookCode, chapterCode, shallAddChapterNumber) => {
  const { readFile } = require("./fileSystemOperator");
  const {
    getTextArrayFormatted,
    getSubSegmentArrayFormatted,
    addChapterNumber,
  } = require("./textManipulator");
  const { isOdd } = require("./mathUtils");
  const generateVoiceFile = require("./voiceGenerator");
  const combineVoiceFiles = require("./audioFilesCombinator");

  const {
    INPUT_FOLDER,
    SONGS_FOLDER,
    OUTPUT_FOLDER,
    AUDIO_EXTENSION,
    VOICES,
  } = require("./constants");

  const filename = `${bookCode}/${bookCode}_${chapterCode}`;

  readFile(filename, (text) => {
    console.log(`${filename} read succesfully.`);

    const getSongPath = (name) =>
      `${INPUT_FOLDER}/${bookCode}/${SONGS_FOLDER}/${name}.${AUDIO_EXTENSION}`;
    const openingSong = getSongPath("opening");
    const closureSong = getSongPath("closure");

    let segmentsFilenames = [openingSong];

    let currentVoiceIndex = 1;
    let textSegmentIndex = 0;
    let textSubSegmentIndex = 0;

    if (shallAddChapterNumber) {
      text = addChapterNumber(text);
    }

    const segmentArray = getTextArrayFormatted(text);

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
            segmentsFilenames.push(closureSong);

            //console.log("segmentsFilenames", segmentsFilenames);
            combineVoiceFiles(
              bookCode,
              segmentsFilenames,
              `${OUTPUT_FOLDER}/${filename}.${AUDIO_EXTENSION}`
            );
          }
        }
      };

      const subSegmentArray = segmentArray[textSegmentIndex]
        .split("-")
        .reduce((accumulator, item, index) => {
          const voice = VOICES[isOdd(index)];

          getSubSegmentArrayFormatted(item).forEach((subItem) => {
            accumulator.push({
              text: subItem,
              voice,
            });
          });

          return accumulator;
        }, []);

      const subSegment = subSegmentArray[textSubSegmentIndex];
      if (subSegment && subSegment.text && subSegment.text.trim().length > 0) {
        const segmentFilename = `${filename}_${textSegmentIndex}_${textSubSegmentIndex}`;
        const segmentFilePath = `${OUTPUT_FOLDER}/${segmentFilename}.${AUDIO_EXTENSION}`;
        segmentsFilenames.push(segmentFilePath);

        generateVoiceFile(
          subSegment.text,
          segmentFilePath,
          subSegment.voice,
          callback
        );
      } else {
        callback();
      }
    };

    iterate();
  });
};
