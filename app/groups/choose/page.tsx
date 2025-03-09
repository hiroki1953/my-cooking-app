"use client";

import Link from "next/link";

export default function ChooseGroupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl mb-8">グループをどうしますか？</h1>
      <div className="flex gap-4">
        <Link
          href="/groups/create"
          className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
        >
          新規グループ作成
        </Link>
        <Link
          href="/groups/join"
          className="px-4 py-2 bg-white text-pink-500 border border-pink-500 rounded-md hover:bg-pink-50"
        >
          招待コードで参加
        </Link>
      </div>
    </div>
  );
}
