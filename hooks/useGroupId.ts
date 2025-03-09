"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export function useGroupId() {
  const params = useParams();
  const [groupId, setGroupId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;

      if (!resolvedParams.groupId) {
        setError("グループIDが見つかりません");
        return;
      }
      setGroupId(resolvedParams.groupId);
    }

    resolveParams();
  }, [params]);

  return { groupId, error };
}
