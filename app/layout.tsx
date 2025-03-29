// app/layout.tsx
import "./globals.css";
import { HamburgerHeader } from "@/components/HamburgerHeader"; // 後述するヘッダー

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-100 flex flex-col min-h-screen">
        {/* ヘッダー (クライアントコンポーネント) */}
        <HamburgerHeader />
        <main className="flex-grow p-4">{children}</main>
        <footer className="bg-pink-300 text-white p-4 text-center">
          © 2025 share recipe
        </footer>
      </body>
    </html>
  );
}
