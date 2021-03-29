module.exports = (bookCode, chapterCode, shallAddChapterNumber) => {
  const { readFile } = require("./fileSystemOperator");
  const {
    getTextArrayFormatted,
    addChapterNumber,
  } = require("./textManipulator");
  const { isOdd } = require("./mathUtils");
  const generateVoiceFile = require("./voiceGenerator");
  const combineVoiceFiles = require("./audioFilesCombinator");

  const {
    SONGS_FOLDER,
    OUTPUT_FOLDER,
    AUDIO_EXTENSION,
    VOICES,
  } = require("./constants");

  const filename = `${bookCode}/${bookCode}_${chapterCode}`;

  readFile(filename, (text) => {
    console.log(`${filename} read succesfully.`);

    const getSongPath = (name) =>
      `${SONGS_FOLDER}${name}/${bookCode}${AUDIO_EXTENSION}`;
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
              `${OUTPUT_FOLDER}${filename}${AUDIO_EXTENSION}`
            );
          }
        }
      };

      const subSegmentArray = segmentArray[textSegmentIndex].split("-");
      const textSubSegment = subSegmentArray[textSubSegmentIndex];
      if (textSubSegment && textSubSegment.trim().length > 0) {
        currentVoiceIndex = isOdd(textSubSegmentIndex);

        const segmentFilename = `${filename}_${textSegmentIndex}_${textSubSegmentIndex}`;
        segmentsFilenames.push(
          `${OUTPUT_FOLDER}${segmentFilename}${AUDIO_EXTENSION}`
        );

        generateVoiceFile(
          textSubSegment,
          `${OUTPUT_FOLDER}${segmentFilename}${AUDIO_EXTENSION}`,
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
