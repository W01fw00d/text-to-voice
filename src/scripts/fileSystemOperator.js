const fs = require("fs");

exports.readFile = (filename, callback) => {
  const { INPUT_FOLDER, DOC_EXTENSION, UTF_8 } = require("./constants");

  fs.readFile(
    `${INPUT_FOLDER}/${filename}.${DOC_EXTENSION}`,
    UTF_8,
    (error, text) => {
      if (error) {
        throw new Error(error);
      }

      callback(text);
    }
  );
};

exports.deleteSegmentFile = (file) => {
  try {
    fs.unlinkSync(file);
    console.log(`${file} deleted.`);
  } catch (error) {
    console.error(error);
  }
};
