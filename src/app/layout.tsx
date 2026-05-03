import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Note記事ジェネレーター | プロ級記事を簡単作成",
  description:
    "質問に答えるだけで、日本一のコピーライターが書くようなnote記事をAIが自動生成。Claude AI搭載。登録不要・APIキーのみで即使用可能。",
  keywords: ["note", "記事生成", "AI", "Claude", "コピーライター", "ブログ", "自動生成"],
  openGraph: {
    title: "Note記事ジェネレーター | プロ級記事を簡単作成",
    description:
      "質問に答えるだけで、日本一のコピーライターが書くようなnote記事をAIが自動生成します。",
    type: "website",
    url: "https://note-article-generator.vercel.app",
    locale: "ja_JP",
    siteName: "Note記事ジェネレーター",
  },
  twitter: {
    card: "summary_large_image",
    title: "Note記事ジェネレーター | プロ級記事を簡単作成",
    description: "質問に答えるだけでプロ級のnote記事が完成。Claude AI搭載。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
