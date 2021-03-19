const gTTS = require("gtts");

var speech = "Esto es un Cadáver Exquisito";
var gtts = new gTTS(speech, "es");

gtts.save("src/output/Voice.mp3", function (err, result) {
  if (err) {
    throw new Error(err);
  }
  console.log("Text to speech converted!");
});
