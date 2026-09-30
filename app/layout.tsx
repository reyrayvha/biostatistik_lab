import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SMART-MATH MEDICS — Ujian Interaktif Mahasiswa Kedokteran",
  description:
    "Aplikasi kuis interaktif untuk mahasiswa kedokteran. Pelajari biostatistik melalui kuis bertahap dengan validasi real-time dan leaderboard.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
