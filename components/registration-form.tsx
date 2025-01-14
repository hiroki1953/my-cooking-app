"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { InputField } from "./input-field";

interface RegistrationFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegistrationForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegistrationFormData>();
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );

  const onSubmit = async (data: RegistrationFormData) => {
    setRegistrationError(null); // エラー状態をリセット

    // パスワード確認の一致をチェック
    if (data.password !== data.confirmPassword) {
      setRegistrationError("パスワードが一致しません。");
      return;
    }

    try {
      const response = await fetch("/api/v1/auth/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setRegistrationError(
          errorData.error || "登録中にエラーが発生しました。"
        );
        return;
      }

      const responseData = await response.json();
      console.log("Registration successful:", responseData);
      alert("ユーザー登録に成功しました！");
      //TOPへ遷移
      window.location.href = "/";
    } catch (error) {
      console.error("Registration error:", error);
      setRegistrationError("登録中に予期せぬエラーが発生しました。");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ユーザー登録
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label="ユーザー名"
            name="username"
            type="text"
            register={register}
            error={errors.username}
            placeholder="ユーザー名"
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
          <InputField
            label="パスワード（確認）"
            name="confirmPassword"
            type="password"
            register={register}
            error={errors.confirmPassword}
            placeholder="••••••••"
          />
          {registrationError && (
            <div className="text-red-500 text-sm text-center" role="alert">
              {registrationError}
            </div>
          )}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              登録
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
