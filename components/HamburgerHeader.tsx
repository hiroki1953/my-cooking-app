"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useGroupId } from "@/hooks/useGroupId"; // グループID取得用フック

export function HamburgerHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { groupId, error } = useGroupId();
  const menuRef = useRef<HTMLDivElement | null>(null);

  // メニュー外をクリックしたら閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="bg-pink-300 text-white p-4 flex items-center justify-between relative">
      <Link href={`/groups/${groupId}/calendar`}>
        <h1 className="text-xl font-bold">share recipe</h1>
      </Link>

      {/* ハンバーガーアイコン */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden block focus:outline-none"
        aria-label="Toggle Menu"
      >
        <div className="w-6 h-1 bg-white mb-1" />
        <div className="w-6 h-1 bg-white mb-1" />
        <div className="w-6 h-1 bg-white" />
      </button>

      {/* PC表示用のメニュー */}
      <nav className="hidden md:flex gap-6 items-center">
        <Link href="/login" className="hover:underline">
          ログイン
        </Link>
        <Link href="/register" className="hover:underline">
          新規登録
        </Link>
        {groupId && !error && (
          <Link
            href={`/groups/${groupId}/invite`}
            className="hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            招待
          </Link>
        )}
      </nav>

      {/* ハンバーガーメニュー展開時 (モバイル) */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-16 right-4 bg-pink-200 text-black p-4 rounded shadow-md md:hidden"
        >
          <ul className="flex flex-col gap-4">
            <li>
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                ログイン
              </Link>
            </li>
            <li>
              <Link href="/register" onClick={() => setMenuOpen(false)}>
                新規登録
              </Link>
            </li>
            {groupId && !error && (
              <li>
                <Link
                  href={`/groups/${groupId}/invite`}
                  className="hover:underline"
                  onClick={() => setMenuOpen(false)}
                >
                  招待
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
