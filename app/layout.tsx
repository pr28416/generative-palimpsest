import type { Metadata } from "next";
import { IM_Fell_English, Spectral, Lora, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const imFell = IM_Fell_English({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-im-fell",
});

const spectral = Spectral({
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-spectral",
});

const lora = Lora({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-lora",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "Generative Palimpsest",
  description: "A layered, scrapeable digital book on memory, erasure, and the generative trace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${imFell.variable} ${spectral.variable} ${lora.variable} ${cormorant.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#1a1410] text-[#2c1f0e]">{children}</body>
    </html>
  );
}
