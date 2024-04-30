import Navbar from "@/components/Navbar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        {children}
      </div>
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2024 AnonymousMsg. All rights reserved.
      </footer>
    </div>
  );
}
