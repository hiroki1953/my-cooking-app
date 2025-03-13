"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface InvitationResponse {
  message?: string;
  invitation_code?: string;
  group_id?: string;
  error?: string;
}

export default function InvitePage() {
  const { groupId } = useParams(); // dynamic routeの [groupId]
  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerateCode = async () => {
    setInvitationCode(null);
    setErrorMessage(null);

    try {
      // /api/v1/groups/[groupId]/invite にPOST
      const response = await fetch(`/api/v1/groups/${groupId}/invite`, {
        method: "POST",
      });

      const result: InvitationResponse = await response.json();
      if (!response.ok || result.error) {
        setErrorMessage(result.error || "招待コードの発行に失敗しました");
        return;
      }

      // 成功 → 招待コードを表示
      if (result.invitation_code) {
        setInvitationCode(result.invitation_code);
      }
    } catch (error) {
      console.error("Error generating invitation code:", error);
      setErrorMessage("予期せぬエラーが発生しました");
    }
  };

  const handleBack = () => {
    // グループ詳細やカレンダー画面へ戻る例
    router.push(`/groups/${groupId}/calendar`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold text-center">招待コードの発行</h1>

        <p className="text-center">
          この画面から招待コードを発行し、他のユーザーに共有できます。
        </p>

        {invitationCode && (
          <div className="bg-green-100 p-4 rounded text-center">
            <p className="text-green-700 font-semibold">
              招待コードが発行されました:
            </p>
            <p className="text-green-900 mt-2 text-lg break-words">
              {invitationCode}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              このコードを招待するユーザーに渡してください。
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 p-4 rounded text-center">
            <p className="text-red-700">{errorMessage}</p>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleGenerateCode}
            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
          >
            招待コードを発行
          </button>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-white text-pink-500 border border-pink-500 rounded hover:bg-pink-50"
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  );
}
