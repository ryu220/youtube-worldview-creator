import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YouTube World View Creator',
  description: 'AIと四柱推命でYouTubeチャンネルの世界観を自動生成',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
