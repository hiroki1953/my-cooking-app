"use client";

import { RecipeCalendar } from "@/components/recipe-calendar";
import { useGroupId } from "@/hooks/useGroupId";
import { useFetchRecipes } from "@/hooks/useFetchRecipes";

export default function RecipeCalendarPage() {
  const { groupId, error: groupIdError } = useGroupId();
  const {
    initialRecipes,
    loading,
    error: fetchError,
  } = useFetchRecipes(groupId);

  if (groupIdError)
    return <div className="text-center text-red-500">{groupIdError}</div>;
  if (loading) return <div className="text-center">データを読み込み中...</div>;
  if (fetchError)
    return <div className="text-center text-red-500">{fetchError}</div>;

  return (
    <div className="container mx-auto py-8">
      <RecipeCalendar initialRecipes={initialRecipes} />
    </div>
  );
}
