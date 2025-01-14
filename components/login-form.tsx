"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { InputField } from "./input-field";

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null); // エラー状態をリセット

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // APIから返されたエラーメッセージを表示
        setLoginError(result.error || "ログインに失敗しました");
        return;
      }

      console.log("Login successful:", result);
      alert("ログインに成功しました！");
      // 必要に応じてリダイレクトやトークンの保存を行います
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("ログイン中に予期せぬエラーが発生しました");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ログイン
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
          {loginError && (
            <div className="text-red-500 text-sm text-center" role="alert">
              {loginError}
            </div>
          )}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              ログイン
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
