import React from 'react';
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col text-gray-800">
      <Navbar />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <footer className="text-center p-4 md:p-6">
        Designed and Developed with &#10084;
      </footer>
    </div>
  );
}
