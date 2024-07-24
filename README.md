# Hi, Sergio!

- Remember to uncomment one function at a time.
- Also keep in mind you need to update the subtitles path and final video path for each language, or you will overwrite it.
- Don't forget to save before running `node .` each time.

## Step 0 - Setup

- Make sure you have node.js installed
- You will need VS code installed
- Clone repo from GitHub
  - `gh repo clone insitewebio/subtitles-generation-script`
- Run `npm install`




## Step 1 - Adjust Variables

```javascript
// the youtube url
const youtubeURL = 'https://www.youtube.com/watch?v=Ix-LLiL4ulE';

// What the video will be called once it is downloaded
// This will overwrite any other videos with the same name. Use Caution.
const outputPath = 'video.mp4';

// Name for subtitles file once generated
const subtitlesPath = 'subtitles.srt';

// Name for subtitle file that will be added to video
const translatedSubtitlesPath = 'translated_subtitles-spanish.srt';

// What the video will be called when it's done adding the subtitles
const finalVideoPath = 'video_with_subtitles-spanish.mp4';
```



## Step 2 - Download YouTube video

- Uncomment the function to downloadYouTubeVideo. It will look like below.

### Example
```javascript
const main = async () => {
  try {
    // if it doesn't work you can use online downloader
    await downloadYouTubeVideo(youtubeURL, outputPath);

    // seems to work well
    // await generateSubtitles(youtubeURL, subtitlesPath, language.portuguese);

    // IP is blocked
    // await translateSubtitles(subtitlesPath, translatedSubtitlesPath, language.english);

    // works well
    // await addSubtitlesToVideo(outputPath, translatedSubtitlesPath, finalVideoPath);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

- Run `node .` in working directory.

### If this does not work.

- Open a browser window in incognito.
- Visit `https://yt5s.biz/enxj100/` and paste the youtube url.
- Download the 1080p resolution.




## Step 3 - Get the portuguese subtitles

- Comment out the download youtube video function
- Uncomment the generate subtitles function

### Example
```javascript
const main = async () => {
  try {
    // if it doesn't work you can use online downloader
    // await downloadYouTubeVideo(youtubeURL, outputPath);

    // seems to work well
    await generateSubtitles(youtubeURL, subtitlesPath, language.portuguese);

    // IP is blocked
    // await translateSubtitles(subtitlesPath, translatedSubtitlesPath, language.english);

    // works well
    // await addSubtitlesToVideo(outputPath, translatedSubtitlesPath, finalVideoPath);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

- Run `node .` from the working directory.




## Step 4 - Translate the transcripts to Spanish and English

- Go to GPT, use GPT 4 or 4o
- Edit and paste the prompt below:

 ### GPT Prompt:
 ```
 Translate the following subtitles to [LANGUAGE]
 - Clean up any grammar mistakes
 - Edit time stamps so there is no overlap

 <Copy and paste the contents of the subtitle srt file below the prompt>
 ```

 - Create a new file ending in .srt and paste the translated results. One file per language.
 - video-one_Enlgish.srt




## Step 5 - Add the subtitles to the video

- Comment out the generate subtitles function
- Uncomment the add subtitles video function

```javascript
const main = async () => {
  try {
    // if it doesn't work you can use online downloader
    // await downloadYouTubeVideo(youtubeURL, outputPath);

    // seems to work well
    // await generateSubtitles(youtubeURL, subtitlesPath, language.portuguese);

    // IP is blocked
    // await translateSubtitles(subtitlesPath, translatedSubtitlesPath, language.english);

    // works well
    await addSubtitlesToVideo(outputPath, translatedSubtitlesPath, finalVideoPath);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

- run `node .` from the working directory
- Comment out the add subtitles to video function




## Step 6 - Move artifacts to google drive
- Video with subtitles
- Portuguese subtitles .srt file
- English subtitles .srt file
- Spanish subtitles .srt file




## Step 7 - Rinse and Repeat

- Go to step 1


