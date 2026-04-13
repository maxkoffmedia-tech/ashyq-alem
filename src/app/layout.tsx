import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning style={{ height: '100%' }}>
      <body style={{ height: '100%', margin: 0, padding: 0, overflow: 'hidden', background: '#0a0a0a' }}>
        {children}
      </body>
    </html>
  );
}