import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Thejas Haridas - Data Analytics & Computer Science",
  description: "Portfolio of Thejas Haridas, a Computer Science graduate student specializing in Data Analytics, showcasing projects in AI, ML, and data analysis.",
  keywords: ["Data Analytics", "Computer Science", "Machine Learning", "AI", "Portfolio", "Thejas Haridas"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a1a] text-white overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
