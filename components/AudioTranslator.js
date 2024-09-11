import React, { useState } from "react";

const AudioTranslator = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [translation, setTranslation] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLang, setSelectedLang] = useState("zh");

  let audioChunks = [];

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setIsRecording(true);
      setStatusMessage("Recording...");

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
        const newAudioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(newAudioUrl);
        uploadAudio(audioBlob);
        setStatusMessage("Recording stopped. Uploading...");
        audioChunks = [];
      };

      recorder.start();
    });
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const uploadAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.mp3");

    try {
      const response = await fetch("http://localhost:10000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload file");

      const result = await response.json();
      const filePath = result.file_path;
      setStatusMessage("Audio uploaded. Fetching translation...");
      fetchTranslation(filePath);
    } catch (err) {
      setStatusMessage("Failed to upload file");
    }
  };

  const fetchTranslation = async (filePath) => {
    try {
      const response = await fetch("http://localhost:10000/process", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          file_path: filePath,
          action: "translate",
          lang: selectedLang,
        }),
      });

      const result = await response.json();
      setTranslation(result.result);
      setStatusMessage("Translation fetched successfully.");
    } catch (error) {
      setStatusMessage("Failed to fetch translation.");
    }
  };

  return (
    <div className="flex flex-col items-center p-10 text-center">
      <h1 className="text-3xl font-bold mb-8">Audio Recorder and Translator</h1>
      <div className="flex space-x-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
          onClick={startRecording}
          disabled={isRecording}
        >
          Start Recording
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
          onClick={stopRecording}
          disabled={!isRecording}
        >
          Stop Recording
        </button>
      </div>
      <div className="mt-4">
        <label className="mr-2 text-lg font-semibold text-gray-700">
          Select Language:
        </label>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedLang("zh")}
            className={`py-2 px-4 rounded-lg font-semibold transition ${
              selectedLang === "zh" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Chinese
          </button>
          <button
            onClick={() => setSelectedLang("en")}
            className={`py-2 px-4 rounded-lg font-semibold transition ${
              selectedLang === "en" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setSelectedLang("id")}
            className={`py-2 px-4 rounded-lg font-semibold transition ${
              selectedLang === "id" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Bahasa
          </button>
        </div>
      </div>
      <div className="mt-4 text-gray-700"><p>{statusMessage}</p></div>
      {audioUrl && <audio controls><source src={audioUrl} type="audio/mpeg" /></audio>}
      {translation && (
        <div className="mt-6 p-4 bg-gray-100 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">Translation:</h2>
          <p>{translation}</p>
        </div>
      )}
    </div>
  );
};

export default AudioTranslator;