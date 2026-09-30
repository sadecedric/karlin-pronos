import './globals.css';

export const metadata = {
  title: 'KALIN PRONO â€” Apple of Fortune',
  description: 'Assistant Apple of Fortune â€” KALIN PRONO',
  icons: {
    icon: '/apple.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

