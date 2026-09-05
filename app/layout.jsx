import './globals.css';

export const metadata = {
  title: '24DEX — Apple of Fortune',
  description: 'Assistant Apple of Fortune — 24DEX',
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
