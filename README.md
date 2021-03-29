# Trasnsform text doc to voice audio file

| Based on:

- https://www.npmjs.com/package/node-gtts

| Setup

- Install [ffmpeg](http://www.ffmpeg.org/). It's recommended to install full version to be sure to have all needed features
- `[Windows]` Add `ffmpeg` and `ffprobe` to your `PATH`

- Install dependencies:

```
npm install
```

| How to use

- Expected filename structure: `cad{bookCode}_cap{chapterCode}`

- Add the input text doc in `.txt` format in `src/input/{bookcode}/`

- Add desired opening song in `input/songs/opening`. Add the closure song in its own folder too

- Update `index.js` variables with your files data

A) `bookCode`: The name of the folder for your chosen input file, as well as the desired location for the output file. It's part of the input and output file name too

B) `chapterCode`: Part of the input and output file name

C) `shallAddChapterNumber`: Set true for adding a voice line at the beginning mentioning the chapter number

- Execute task:

```
node index.js
```

- Output `.mp3` audio file will appear on `src/output/{bookcode}`
