'use server';

import { writeFileSync } from "node:fs";
import OpenAI from "openai";



const openai = new OpenAI();

export async function generateAudio(text: string, voice: string, fileOutput: string) {
  try {
    console.log("Generating audio...");
    // Generate an audio response to the given prompt
    const response = await openai.chat.completions.create({
      model: "gpt-4o-audio-preview",
      modalities: ["text", "audio"],
      audio: { voice: voice as "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" | "coral" | "verse" | "ballad" | "ash" | "sage", format: "wav" },
      messages: [
        {
          role: "user",
          content: text
        }
      ]
    });

    // Inspect returned data
    console.log(response.choices[0]);
  
    const audioData = response.choices[0]?.message?.audio?.data;
    
    // Write audio data to a file
    if (audioData) {
      const audioFile = writeFileSync(
        fileOutput + ".wav",
        Buffer.from(audioData, 'base64')
      );
      return audioFile;
    } else {
      throw new Error("Audio data is undefined");
    }
    
  } catch (error) {
    console.error("Error generating audio:", error);
  }
}
