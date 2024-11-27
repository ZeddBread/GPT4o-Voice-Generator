"use client";
import { useState, useEffect } from "react";
import { generateAudio } from "@/app/lib/generate-audio";

export default function Home() {
  const [text, setText] = useState("");
  const [accent, setAccent] = useState("");
  const [emotion, setEmotion] = useState("");
  const [voice, setVoice] = useState("");
  const [fileOutput, setFileOutput] = useState("");
  const [error, setError] = useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ text, accent, emotion, voice, fileOutput });
    try {
      generateAudio(text, voice, fileOutput);
    } catch (error) {
      console.error("Error generating audio:", error);
      setError(true);
    }
  };

  useEffect(() => {
    document.getElementById("error-message")!.textContent = "";
  }, [text, accent, emotion, voice, fileOutput]);

  return (
    <div className="flex flex-col items-center w-full text-gray-950 justify-center min-h-screen p-4 sm:p-6 md:p-8 bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 sm:gap-6 items-center w-full max-w-5xl bg-white p-4 sm:p-6 rounded-lg shadow-md"
      >
        <textarea
          placeholder="Enter text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:border-primary-color focus:outline-none resize-y text-base sm:text-lg md:text-xl"
        />
        <input
          type="text"
          placeholder="Enter accent"
          value={accent}
          onChange={(e) => setAccent(e.target.value)}
          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:border-primary-color focus:outline-none text-base sm:text-lg md:text-xl"
        />
        <input
          type="text"
          placeholder="Enter emotion"
          value={emotion}
          onChange={(e) => setEmotion(e.target.value)}
          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:border-primary-color focus:outline-none text-base sm:text-lg md:text-xl"
          title="Enter emotion"
        />
        <select
          defaultValue="alloy"
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:border-primary-color focus:outline-none text-base sm:text-lg md:text-xl"
          title="Select voice"
        >
          <option value="alloy">Alloy</option>
          <option value="ash">Ash</option>
          <option value="ballad">Ballad</option>
          <option value="coral">Coral</option>
          <option value="echo">Echo</option>
          <option value="sage">Sage</option>
          <option value="shimmer">Shimmer</option>
          <option value="verse">Verse</option>
        </select>
        <input
          type="text"
          placeholder="Enter file output"
          value={fileOutput}
          onChange={(e) => setFileOutput(e.target.value)}
          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:border-primary-color focus:outline-none text-base sm:text-lg md:text-xl"
        />
        <button
          type="submit"
          className="w-full py-2 sm:py-3 bg-primary-color text-white rounded-lg hover:bg-primary-color-dark transition-colors text-base sm:text-lg md:text-xl"
        >
          Submit
        </button>
        <div className="w-full flex flex-col items-center bg-red-900 p-4 sm:p-6 rounded-lg" id="error-container" hidden={!error}>
          <p className="text-base sm:text-lg md:text-xl text-red-500 font-bold">Error</p>
          <p className="text-base sm:text-lg md:text-xl text-red-500" id="error-message"></p>
        </div>
        
        <div className="w-full flex flex-col items-center">
          <p className="text-base sm:text-lg md:text-xl">Audio Player</p>
          <div className="w-full" id="audio-player">
            <audio src={fileOutput + ".wav"} controls />
          </div>
        </div>

      </form>
    </div>
  );
}
