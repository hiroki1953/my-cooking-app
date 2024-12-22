// app/layout.tsx
import "./globals.css"; // グローバルCSSのインポート

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-100 flex flex-col min-h-screen">
        <header className="bg-pink-300 text-white p-4">
          <h1 className="text-xl">レシピアプリ</h1>
        </header>
        <main className="flex-grow p-4">{children}</main>
        <footer className="bg-pink-300 text-white p-4 text-center">
          © 2024 レシピアプリ
        </footer>
      </body>
    </html>
  );
}
