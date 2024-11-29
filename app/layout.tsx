import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"


export const metadata: Metadata = {
  title: "GPT-4o Voice Generator",
  description: "Generate fun and expressive voices for your projects using the advanced GPT-4o audio preview.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`font-sansantialiased bg-background text-foreground bg-gray-900`}
      >
        <header className="p-4 bg-primary-color bg-gray-800 drop-shadow-lg rounded-3xl mx-4 my-5 shadow-black text-white flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-2">Welcome to the GPT-4o Voice Generator</h1>
          <a
            href="https://github.com/ZeddBread"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 px-4 py-2 bg-teal-600 text-primary-color font-semibold text-lg rounded-full shadow-md hover:bg-gray-200 transition duration-300"
          >
            Visit My GitHub
          </a>
        </header>
        <main className="flex flex-col items-center justify-center bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 ">
          {children}
        </main>
        <footer className="p-4 bg-secondary-color text-center">
          <p className="text-lg">© 2024 <a href="https://github.com/ZeddBread" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 transition duration-300">GitHub.com/ZeddBread</a>. All rights reserved.</p>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
