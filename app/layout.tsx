import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "THRESHOLD · Longitudinal Health Synthesis",
  description: "Deterministic cross-institutional medical record reconciliation and longitudinal synthesis engine.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#08090C] text-[#F4F4F6] selection:bg-white/20 selection:text-white">
        {children}
      </body>
    </html>
  );
}
