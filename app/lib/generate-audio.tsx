'use server';

import { writeFileSync } from "node:fs";
import OpenAI from "openai";



const openai = new OpenAI();

export async function generateAudio(text: string, voice: string, fileOutput: string, accent: string, emotion: string) {
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
          content: `You are a beautiful assistant that will speak in a beautiful voice in the specified format: 
          Accent: ${zAccent}
          Emotion: ${zEmotion}
          You will only say the what has been passed to you with your best quality voice.`
        },
        {
          role: "assistant",
          content: text
        }
      ]
    });

    // Inspect returned data
    console.log(response.choices);

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

export async function writeAudioFile(audioData: any, fileOutput: string) {
  const audioFile = await writeFileSync(
    fileOutput + ".wav",
    Buffer.from(audioData.data, 'base64'),
    { encoding: 'utf-8' }
  );
  return audioFile;
}

