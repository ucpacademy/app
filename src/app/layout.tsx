import './globals.css';

export const metadata = {
  title: 'My Majors App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-black min-h-screen flex flex-col text-slate-900 dark:text-slate-50 antialiased selection:bg-blue-200 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
