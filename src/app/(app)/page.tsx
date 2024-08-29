'use client';
import React from 'react';
import { TypewriterEffect } from "@/components/ui/typewriter-effect";

const words = [
  {
    text: "Ask",
  },
  {
    text: "questions",
  },
  {
    text: "anonymously",
  },
  {
    text: "with",
  },
  {
    text: "AskAway",
    className: "text-blue-600",
  },
];

export default function Home() {
  return (
    <div className='w-full relative overflow-hidden bg-gradient-to-b from-blue-100 to-white min-h-[calc(100vh-4rem)] flex flex-col justify-center'>
      <div className="flex flex-col items-center justify-center px-4 md:px-24 py-12 relative z-10">
        <section className="text-center mb-12">
          <div className="mx-auto mb-4">
            <TypewriterEffect words={words} />
          </div>
          <p className="mt-4 text-xl text-gray-600">
            Where your identity remains a secret. &#128521;
          </p>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Start Your Journey
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join our community of anonymous question askers and get the answers you need without revealing your identity.
          </p>
        </section>
      </div>
    </div>
  );
}
