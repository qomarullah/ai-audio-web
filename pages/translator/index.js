import React from "react";
import AudioTranslator from "@/components/AudioTranslator";
import { useRouter } from "next/router";

const TranslatorPage = () => {
  const router = useRouter();
  const goBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gray-100 p-4">
      {/* Go Back Button */}
      

      {/* Main Translator Component */}
      <AudioTranslator />

        {/* Go Back Button */}
        <button
        onClick={goBack}
        className="px-4 py-2 mb-4 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition"
      >
        Go To Main
      </button>
    </div>
  );
};

export default TranslatorPage;
