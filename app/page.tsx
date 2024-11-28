"use client";
import { useState } from "react";
//TODO: import { select } from "select2"; //Change to current options to be used in the select
import { checkFileExists, generateAudio, writeAudioFile } from "@/app/lib/generate-audio";
//TODO: import { TagLessExpressive, TagFemale, TagMostExpressive, TagMale, TagUnisex } from "@/app/lib/tags";
import { retrieveAudioFromSession, storeAudio } from "@/app/lib/save-audio";

export default function Home() {
  const [text, setText] = useState("");
  const [accent, setAccent] = useState("");
  const [emotion, setEmotion] = useState("");
  const [voice, setVoice] = useState("");
  const [fileOutput, setFileOutput] = useState("");
  const [error, setError] = useState(false);
  const [audioGenerated, setAudioGenerated] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [audioTranscript, setAudioTranscript] = useState("");
  const [audioFile, setAudioFile] = useState("");
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [seed, setSeed] = useState<number | null>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    setOpenaiApiKey(openaiApiKey);
    setAudioFile("/");
    setAudioTranscript("");
    setAudioReady(false);
    setAudioGenerated(false);
    const filename = fileOutput.concat(Date.now().toString());
    console.log({ text, accent, emotion, voice, filename, seed });
    try {
      const audioData = await generateAudio(text, voice, accent, emotion, openaiApiKey, seed ?? undefined);
      const transcript = audioData?.transcript;
      if (transcript) {
        setAudioTranscript(transcript);
      }
      if (audioData) {
        const audioFile = await storeAudio(audioData.data, filename);
        //TODO: Update list of audio files in session storage

        const audioFileUrl = await retrieveAudioFromSession(filename);
        if (audioFileUrl) {
          console.log("Audio file written: ", audioFileUrl);
          setAudioFile(audioFileUrl);
          setAudioReady(true);
          setAudioGenerated(true);
        }
      }
    } catch (error) {
      console.error("Error generating audio:", error);
      setError(true);
    }
  };


  return (
    <div className="flex flex-col items-center w-full text-gray-950 justify-center min-h-screen p-4 sm:p-6 md:p-8 rounded-3xl bg-gray-800">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 sm:gap-6 items-center w-full max-w-5xl bg-gray-300 p-4 sm:p-6 rounded-3xl shadow-md"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">GPT-4o Voice Generator</h1>
        <p className="text-base sm:text-lg md:text-xl text-center">Generate fun and expressive voices for your projects using the advanced GPT-4o audio preview!</p>

        <div id="OpenAI API Key" className="w-full flex flex-col items-center">
          <p className="text-base sm:text-lg md:text-xl text-center">Enter your OpenAI API key to generate audio:</p>
          <input
            type="password"
            value={openaiApiKey}
            onChange={(e) => setOpenaiApiKey(e.target.value)}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:border-primary-color focus:outline-none sm:text-sm md:text-md "
          />
        </div>
        <div className="flex flex-row gap-2 w-full justify-center items-center">
          <label htmlFor="text" className=" w-32 font-bold text-gray-600 sm:text-md md:text-lg">Generated speech:</label>
          <textarea
            id="text"
            placeholder="Enter text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:border-primary-color focus:outline-none resize-y text-base sm:text-lg md:text-xl"
          />
        </div>

        <div className="flex flex-row col gap-2 w-full justify-center items-center">
          <label htmlFor="accent" className=" w-32 font-bold text-gray-600 sm:text-md md:text-lg">Accent:</label>
          <input
            id="accent"
            type="text"
            placeholder="Enter accent"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:border-primary-color focus:outline-none text-base sm:text-lg md:text-xl"
          />
        </div>

        <div className="flex flex-row gap-2 w-full justify-center items-center">
          <label htmlFor="emotion" className=" w-32 font-bold text-gray-600 sm:text-md md:text-lg">Emotion:</label>
          <input
            id="emotion"
            type="text"
            placeholder="Enter emotion"
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:border-primary-color focus:outline-none text-base sm:text-lg md:text-xl"
            title="Enter emotion"
          />
        </div>

        <div className="flex flex-row gap-2 w-full justify-center items-center">
          <label htmlFor="voice" className=" w-32 font-bold text-gray-600 sm:text-md md:text-lg">Voice:</label>
          <select
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:border-primary-color focus:outline-none text-base sm:text-lg md:text-xl"
            title="Select voice"
          >
            <option defaultValue="">Select voice</option>
            <option value="alloy">Alloy</option>
            <option value="echo">Echo</option>
            <option value="fable">Fable</option>
            <option value="onyx">Onyx</option>
            <option value="nova">Nova</option>
            <option value="shimmer">Shimmer</option>
            <option value="coral">Coral</option>
            <option value="verse">Verse</option>
            <option value="ballad">Ballad</option>
            <option value="ash">Ash</option>
            <option value="sage">Sage</option>
          </select>
        </div>

        <div className="flex flex-row gap-2 w-full justify-center items-center">
          <label htmlFor="seed" className=" w-32 font-bold text-gray-600 sm:text-md md:text-lg">Seed: (optional)</label>
          <input
            id="seed"
            type="number"
            value={seed || ""}
            onChange={(e) => setSeed(parseInt(e.target.value))}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:border-primary-color focus:outline-none text-base sm:text-lg md:text-xl"
          />
        </div>

        <div className="flex flex-row gap-2 w-full justify-center items-center">
          <label htmlFor="fileOutput" className=" w-32 font-bold text-gray-600 sm:text-md md:text-lg">Filename:</label>
          <input
            id="fileOutput"
            type="text"
            placeholder="Enter filename"
            value={fileOutput}
            onChange={(e) => setFileOutput(e.target.value)}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:border-primary-color focus:outline-none text-base sm:text-lg md:text-xl"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 sm:py-3 bg-primary-color text-white rounded-lg hover:bg-primary-color-dark transition-colors text-base sm:text-lg md:text-xl"
        >
          Submit
        </button>

        {error && (
          <div className="w-full flex flex-col items-center bg-red-900 p-4 sm:p-6 rounded-lg" id="error-container">
            <p className="text-base sm:text-lg md:text-xl text-red-500 font-bold">Error</p>
            <p className="text-base sm:text-lg md:text-xl text-red-500" id="error-message">{`${error}`}</p>
          </div>
        )}

        {audioGenerated && (
          <div className="w-full flex flex-col items-center" id="audio-container">
            <div className="w-auto" id="audio-player">
              {!audioReady ? (
                <div className="w-full flex justify-center items-center">
                  <div className="text-red-500 font-bold">No file yet</div>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <p className="text-center text-2xl py-4">{audioTranscript}</p>
                  <audio key={audioFile} src={audioFile} controlsList="download" controls autoPlay className="w-full p-4" />
                  <a href={audioFile} download className="mt-2 py-2 px-4 bg-primary-color text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors text-base sm:text-lg md:text-xl">Download</a>
                </div>
              )
              }
            </div>
          </div>
        )}

      </form>
    </div>
  );
}
