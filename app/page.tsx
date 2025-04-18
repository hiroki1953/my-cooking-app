"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white">
      <section className="max-w-3xl text-center space-y-8 p-8">
        <h1 className="text-4xl font-bold">share recipe</h1>
        <p className="text-lg text-gray-600">
          レシピを簡単に登録ができ、複数人でシェアできるアプリです。
          <br />
          家族やカップルで日々の献立を共有しましょう。
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/register"
            className="px-6 py-3 bg-pink-500 text-white rounded hover:bg-pink-600"
          >
            新規会員登録
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border border-pink-500 text-pink-500 rounded hover:bg-pink-50"
          >
            ログイン
          </Link>
        </div>
      </section>
    </main>
  );
}
