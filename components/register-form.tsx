"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { InputField } from "@/components/input-field";
import { useRouter } from "next/navigation";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

interface ApiResponse {
  message?: string;
  error?: string;
  data?: {
    user?: {
      id: string;
      email: string;
      email_confirmed_at?: string; // Supabaseで確認済みかどうか
    };
  };
}

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: RegisterFormData) => {
    setRegisterError(null);
    setSuccessMessage(null);

    try {
      // 1) 新規登録API呼び出し
      const response = await fetch("/api/v1/auth/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: ApiResponse = await response.json();
      if (!response.ok || result.error) {
        setRegisterError(result.error || "登録に失敗しました");
        return;
      }

      // 2) メール確認が必要であればここでメッセージ表示
      // SupabaseのEmail Confirmationsが有効だとユーザーは"unconfirmed"。
      // result.data.user.email_confirmed_at が存在しない可能性あり。
      if (result.data?.user && !result.data.user.email_confirmed_at) {
        setSuccessMessage(
          "ご登録ありがとうございます。メールにて確認用リンクを送信しましたので、認証をお願いいたします。"
        );
      } else {
        // メール認証を無効化しているなどで、即ログイン状態の場合
        // ここで次の画面に進む (ログイン or グループ作成など)
        router.push("/groups/choose");
      }
    } catch (error) {
      console.error("Register error:", error);
      setRegisterError("登録中に予期せぬエラーが発生しました");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            新規会員登録
          </h2>
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          method="POST"
        >
          <InputField
            label="ユーザー名"
            name="username"
            type="text"
            register={register}
            error={errors.username}
            placeholder="ユーザー名を入力"
          />
          <InputField
            label="メールアドレス"
            name="email"
            type="email"
            register={register}
            error={errors.email}
            placeholder="example@example.com"
          />
          <InputField
            label="パスワード"
            name="password"
            type="password"
            register={register}
            error={errors.password}
            placeholder="••••••••"
          />
          {registerError && (
            <div className="text-red-500 text-sm text-center" role="alert">
              {registerError}
            </div>
          )}
          {successMessage && (
            <div className="text-green-500 text-sm text-center" role="alert">
              {successMessage}
            </div>
          )}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4
                         border border-transparent text-sm font-medium
                         rounded-md text-white bg-pink-600 hover:bg-pink-700
                         focus:outline-none focus:ring-2 focus:ring-offset-2
                         focus:ring-pink-500"
              disabled={!!successMessage}
            >
              新規登録
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
