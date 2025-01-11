import './global.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Dr. Rufus' Spreadsheets</title>
      </head>
      <body className="bg-[#F5F5F7]">
        <main className="min-h-screen">
          <div className="max-w-3xl mx-auto px-4 py-12">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}