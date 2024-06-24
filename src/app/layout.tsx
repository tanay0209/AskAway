import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react"
const inter = Inter({ subsets: ["latin"] });



export const metadata: Metadata = {
    title: "SpeakOut",
    description: "SpeakOut is a web application where users can ask questions to others without revealing their identity.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <AuthProvider>
                <body className={inter.className}>
                    {children}
                    <Toaster />
                </body>
                <Analytics />
            </AuthProvider>
        </html>
    );
}
