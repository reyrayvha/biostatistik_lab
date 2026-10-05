import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AppStateInitializer from "@/src/components/AppStateInitializer";
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
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('app_theme');
                const theme = saved === 'dark' || saved === 'light' ? saved : 'light';
                document.documentElement.classList.toggle('dark', theme === 'dark');
                document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
              } catch (error) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <AppStateInitializer />
        {children}
      </body>
    </html>
  );
}
