import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import "../styles/globals.css";

const Page = () => {


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
      <nav className="flex flex-col items-center space-y-6 p-8 bg-white shadow-lg rounded-lg mb-8 max-w-xl">
        <div className="text-2xl font-semibold text-gray-800 mb-4">Menu</div>

        <Link href="/summarizer" passHref>
          <div className="p-6 w-full bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 hover:shadow-xl transition transform hover:scale-105 cursor-pointer">
            <div className="text-lg font-bold">Summarizer</div>
            <p className="text-sm font-light mt-2">
              Quickly summarize long texts into concise and meaningful information.
            </p>
          </div>
        </Link>

        <Link href="/translator" passHref>
          <div className="p-6 w-full bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 hover:shadow-xl transition transform hover:scale-105 cursor-pointer">
            <div className="text-lg font-bold">Translator</div>
            <p className="text-sm font-light mt-2">
              Translate text between multiple languages seamlessly and efficiently.
            </p>
          </div>
        </Link>
      </nav>
    </div>
  );
};

export default Page;
