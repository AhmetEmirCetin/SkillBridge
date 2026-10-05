import './globals.css';

export const metadata = {
  title: 'SkillBridge AI',
  description: 'Yapay zeka destekli kişisel öğrenme yol haritası',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="min-h-screen" style={{ backgroundColor: '#0f0f0f', color: '#fff' }}>
        {children}
      </body>
    </html>
  );
}