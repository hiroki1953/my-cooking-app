"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

interface JoinFormData {
  code: string;
}

interface ApiResponse {
  message?: string;
  error?: string;
  group_id?: number; // サーバーが返す構造に合わせる
}

export default function JoinGroupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinFormData>();
  const [joinError, setJoinError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: JoinFormData) => {
    setJoinError(null);

    try {
      // 例: POST /api/v1/groups/join へ codeを渡す
      const response = await fetch("/api/v1/groups/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: data.code }),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok || result.error) {
        setJoinError(result.error || "グループ参加に失敗しました");
        return;
      }

      // サーバーが group_id を返すとして、それを使い画面遷移
      if (result.group_id) {
        router.push(`/groups/${result.group_id}/calendar`);
      } else {
        setJoinError("グループIDが取得できませんでした");
      }
    } catch (error) {
      console.error("Join group error:", error);
      setJoinError("招待コードでの参加中にエラーが発生しました");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 border">
        <h2 className="text-2xl text-center font-bold">招待コードで参加</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1">招待コード</label>
            <input
              type="text"
              {...register("code", { required: true })}
              className="border p-2 w-full"
              placeholder="例: ABC123"
            />
            {errors.code && (
              <p className="text-red-500 text-sm">コードを入力してください</p>
            )}
          </div>
          {joinError && (
            <p className="text-red-500 text-sm text-center">{joinError}</p>
          )}
          <button
            type="submit"
            className="bg-pink-500 text-white px-4 py-2 w-full rounded hover:bg-pink-600"
          >
            参加する
          </button>
        </form>
      </div>
    </div>
  );
}
