'use server';

import { writeFileSync } from "node:fs";
import OpenAI from "openai";


export async function generateAudio(text: string, voice: string, fileOutput: string, accent: string, emotion: string, openaiApiKey: string) {
  const openai = new OpenAI({ apiKey: openaiApiKey });
  const zAccent = accent.toLowerCase();
  const zEmotion = emotion.toLowerCase();
  const zVoice = voice as "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" | "coral" | "verse" | "ballad" | "ash" | "sage";
  try {
    console.log("Generating audio...");

    // Generate an audio response to the given prompt
    const response = await openai.chat.completions.create({
      model: "gpt-4o-audio-preview",
      modalities: ["text", "audio"],
      audio: { voice: zVoice, format: "wav" },
      messages: [
        {
          role: "system",
          content: `You are a beautiful assistant that will speak in a beautiful voice with the accent of a ${zAccent} and with the emotion ${zEmotion}.
          You will say exactly what the user said in your best quality voice.
          You will not add any additional text or information to the user's prompt.`
        },
        {
          role: "user",
          content: "Please say the following text: " + text
        }
      ]
    });
    console.log(response);
    // Inspect returned data

    const audioData = response.choices[0]?.message?.audio;

    console.log(audioData);
    // Write audio data to a file
    if (audioData) {
      return audioData;
    } else {
      throw new Error("Audio data is undefined");
    }

  } catch (error) {
    console.error("Error generating audio:", error);
  }
}

export async function checkFileExists(fileOutput: string) {
  const fs = require('fs');
  let filePath = `public/${fileOutput}.wav`;
  let fileIndex = 1;
  while (fs.existsSync(filePath)) {
    filePath = `public/${fileOutput}_${fileIndex}.wav`;
    fileIndex++;
  }
  var finalName = `${fileOutput}_${fileIndex}`;
  return finalName;
}

export async function writeAudioFile(audioData: any, finalOutputName: string) {

  const zAudioFile = writeFileSync(
    `public/${finalOutputName}.wav`,
    Buffer.from(audioData.data, 'base64'),
    { encoding: 'utf-8' }
  );
  return zAudioFile;
}

