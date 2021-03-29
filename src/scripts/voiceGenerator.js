module.exports = (text, filename, voice, callback) => {
  const gTTS = require("gtts");

  //console.log(`${voice}: ${text}`); //
  //callback(); //
  new gTTS(text, voice).save(filename, (error, _) => {
    if (error) {
      throw new Error(error);
    }
    console.log(`${filename} segment transformed.`);
    callback();
  });
};
