import React, { useState } from "react";

const AudioSummarizer = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [summary, setSummary] = useState("");
  const [isRecording, setIsRecording] = useState(false);

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
      setStatusMessage("Audio uploaded. Fetching summary...");
      fetchSummary(filePath);
    } catch (err) {
      setStatusMessage("Failed to upload file");
    }
  };

  const fetchSummary = async (filePath) => {
    try {
      const response = await fetch("http://localhost:10000/process", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          file_path: filePath,
          action: "summarize",
          length: "medium",
        }),
      });

      const result = await response.json();
      setSummary(result.result);
      setStatusMessage("Summary fetched successfully.");
    } catch (error) {
      setStatusMessage("Failed to fetch summary.");
    }
  };

  return (
    <div className="flex flex-col items-center p-10 text-center">
      <h1 className="text-3xl font-bold mb-8">Audio Recorder and Summarizer</h1>
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
      <div className="mt-4 text-gray-700">
        <p>{statusMessage}</p>
      </div>
      {audioUrl && <audio controls><source src={audioUrl} type="audio/mpeg" /></audio>}
      {summary && (
        <div className="mt-6 p-4 bg-gray-100 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default AudioSummarizer;