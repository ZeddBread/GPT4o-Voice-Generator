'use server';

import { writeFileSync } from "node:fs";
import OpenAI from "openai";
import fs from "node:fs";

// Add a type for the return value
export interface AudioResponse {
  data: string;
  transcript?: string;
  seed?: number;
}

export async function generateAudio(
  text: string,
  voice: string,
  accent: string,
  emotion: string,
  openaiApiKey: string,
  seed?: number
): Promise<AudioResponse | undefined> {
  const openai = new OpenAI({ apiKey: openaiApiKey });
  const zAccent = accent.toLowerCase();
  const zEmotion = emotion.toLowerCase();
  const zVoice = voice as "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" | "coral" | "verse" | "ballad" | "ash" | "sage";
  
  try {
    console.log("Generating audio...");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-audio-preview",
      modalities: ["text", "audio"],
      // @ts-expect-error: Suppress type error due to outdated type definitions
      audio: { voice: zVoice, format: "wav" },
      seed: seed,
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

    const audioData = response.choices[0]?.message?.audio;
    
    if (audioData) {
      return {
        data: audioData.data ?? '',
        transcript: response.choices[0]?.message?.content ?? '',
        seed: seed
      };
    } else {
      throw new Error("Audio data is undefined");
    }

  } catch (error) {
    console.error("Error generating audio:", error);
    throw error; // Re-throw to handle in the client
  }
}

export async function checkFileExists(fileOutput: string) {
  let filePath = `public/${fileOutput}.wav`;
  let fileIndex = 0;
  while (fs.existsSync(filePath)) {
    fileIndex++;
    filePath = `public/${fileOutput}_${fileIndex}.wav`;
  }
  const finalName = fileIndex === 0 ? fileOutput : `${fileOutput}_${fileIndex}`;
  return finalName;
}

export async function writeAudioFile(audioData: { data: string }, finalOutputName: string) {

  const zAudioFile = writeFileSync(
    `public/${finalOutputName}.wav`,
    Buffer.from(audioData.data, 'base64'),
    { encoding: 'utf-8' }
  );
  return zAudioFile;
}

