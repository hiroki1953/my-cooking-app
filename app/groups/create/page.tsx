"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { InputField } from "@/components/input-field";
import { useRouter } from "next/navigation";

interface CreateGroupFormData {
  group_name: string;
}

interface ApiResponse {
  message: string;
  group: {
    group_id: number; // APIの返却に合わせて型を調整
    group_name: string;
  };
}

export default function CreateGroupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGroupFormData>();
  const [createError, setCreateError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: CreateGroupFormData) => {
    setCreateError(null);

    try {
      // グループ作成API呼び出し
      const response = await fetch("/api/v1/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // { group_name }
      });

      if (!response.ok) {
        const errorResult = await response.json();
        setCreateError(errorResult.error || "グループ作成に失敗しました");
        return;
      }

      const result: ApiResponse = await response.json();

      // 作成されたグループIDを取得して画面遷移
      // 例: カレンダー画面へリダイレクト
      router.push(`/groups/${result.group.group_id}/calendar`);
    } catch (error) {
      console.error("Create group error:", error);
      setCreateError("グループ作成中に予期せぬエラーが発生しました");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            グループ作成
          </h2>
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          method="POST"
        >
          <InputField
            label="グループ名"
            name="group_name"
            type="text"
            register={register}
            error={errors.group_name}
            placeholder="新しいグループ名"
          />
          {createError && (
            <div className="text-red-500 text-sm text-center" role="alert">
              {createError}
            </div>
          )}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4
                         border border-transparent text-sm font-medium
                         rounded-md text-white bg-pink-600
                         hover:bg-pink-700 focus:outline-none focus:ring-2
                         focus:ring-offset-2 focus:ring-pink-500"
            >
              作成
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
