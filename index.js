import ytdl from 'ytdl-core';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { getSubtitles } from 'youtube-captions-scraper';
import { translate } from '@vitalets/google-translate-api';

const language = {
  english: 'en',
  spanish: 'es',
  portuguese: 'pt',
};

async function downloadYouTubeVideo(url, outputPath) {
  try {
    if (!ytdl.validateURL(url)) {
      throw new Error('Invalid YouTube URL');
    }

    const info = await ytdl.getInfo(url);
    console.log(`Downloading: ${info.videoDetails.title}`);

    const videoStream = ytdl(url, { quality: 'highest' });
    const writeStream = fs.createWriteStream(outputPath);

    videoStream.pipe(writeStream);

    writeStream.on('finish', () => {
      console.log('Download complete.');
    });

    writeStream.on('error', (err) => {
      console.error('Error writing to file', err);
    });
  } catch (error) {
    console.error('Error downloading video:', error);
  }
}

async function generateSubtitles(videoUrl, subtitlesPath, lang) {
  try {
    if (!ytdl.validateURL(videoUrl)) {
      throw new Error('Invalid YouTube URL');
    }

    const videoId = ytdl.getURLVideoID(videoUrl);

    const subtitles = await getSubtitles({ videoID: videoId, lang });

    const srtContent = subtitles.map((caption, index) => {
      const startSeconds = parseFloat(caption.start);
      const durationSeconds = parseFloat(caption.dur);

      const start = new Date(startSeconds * 1000).toISOString().substr(11, 12).replace('.', ',');
      const end = new Date((startSeconds + durationSeconds) * 1000).toISOString().substr(11, 12).replace('.', ',');

      return `${index + 1}\n${start} --> ${end}\n${caption.text}\n`;
    }).join('\n');

    fs.writeFileSync(subtitlesPath, srtContent, 'utf8');
    console.log('Subtitles generated.');
  } catch (error) {
    console.error('Error generating subtitles:', error);
  }
}

async function translateSubtitles(subtitlesPath, translatedSubtitlesPath, targetLanguage) {
  try {
    const srtContent = fs.readFileSync(subtitlesPath, 'utf8');
    const subtitleBlocks = srtContent.split('\n\n');

    const translatedBlocks = [];

    for (const block of subtitleBlocks) {
      const lines = block.split('\n');
      if (lines.length < 3) {
        translatedBlocks.push(block);
        continue;
      }

      const textLines = lines.slice(2).join('\n');
      try {
        const translation = await translate(textLines, { to: targetLanguage });
        translatedBlocks.push(`${lines[0]}\n${lines[1]}\n${translation.text}`);
      } catch (err) {
        console.error('Translation error:', err);
        translatedBlocks.push(block); // Fallback to original if translation fails
      }

      await new Promise(resolve => setTimeout(resolve, 1000)); // Add delay between requests
    }

    const translatedSrtContent = translatedBlocks.join('\n\n');
    fs.writeFileSync(translatedSubtitlesPath, translatedSrtContent, 'utf8');
    console.log('Subtitles translated.');
  } catch (error) {
    console.error('Error translating subtitles:', error);
  }
}

async function addSubtitlesToVideo(videoPath, subtitlesPath, outputPath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(videoPath)) {
      return reject(new Error('Video file does not exist'));
    }
    if (!fs.existsSync(subtitlesPath)) {
      return reject(new Error('Subtitles file does not exist'));
    }

    ffmpeg(videoPath)
      .outputOptions([
        '-c:v libx264',
        '-c:a copy',
        '-vf', `subtitles=${subtitlesPath}:force_style='Alignment=2,MarginV=20,BackColor=&H80000000,BorderStyle=3'`,
      ])
      .output(outputPath)
      .on('end', () => {
        console.log('Subtitles added to video successfully.');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error adding subtitles to video:', err);
        reject(err);
      })
      .run();
  });
}

const youtubeURL = 'https://www.youtube.com/watch?v=Ix-LLiL4ulE';
const outputPath = '01-videoptg.mp4';
const subtitlesPath = '01-videoptg_sub_v1.srt';
const translatedSubtitlesPath = '01-videoptg_sub_v1_en.srt';
const finalVideoPath = '01-videoptg_sub_v1_en.mp4';

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

main();

/**
 * To download video: https://yt5s.biz/enxj100/
 
 GPT Prompt:
 Translate the following subtitles to [LANGUAGE]
 - Clean up any grammar mistakes
 - Edit time stamps so there is no overlap
 */