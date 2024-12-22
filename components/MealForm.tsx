"use client";

import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChevronLeft, GripVertical, Minus, Plus } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Dish, Ingredient, Step } from "@/types/dish";
import { fetchFromApi } from "@/lib/fetch";

interface MealFormProps {
  initialDish?: Dish;
  onSave: (dish: Dish) => void;
}

interface DraggableStepProps {
  stepKey: number; // 新たに受け取るプロパティ
  id: string;
  index: number;
  description: string;
  moveStep: (dragIndex: number, hoverIndex: number) => void;
  updateStep: (index: number, value: string) => void;
  removeStep: (index: number, id: number) => void;
}

const DraggableStep: React.FC<DraggableStepProps> = ({
  stepKey, // ここで受け取る
  id,
  index,
  description,
  moveStep,
  updateStep,
  removeStep,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "STEP",
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "STEP",
    hover(item: { id: string; index: number }) {
      if (!drag) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveStep(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  return (
    <div
      ref={(node) => {
        if (node) {
          drop(node);
          drag(node);
        }
      }}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="flex gap-2 items-start mb-2"
    >
      <div className="mt-2 cursor-move">
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>
      <div className="w-6 h-6 rounded-full bg-pink-400 text-white flex items-center justify-center flex-shrink-0 mt-2">
        {index + 1}
      </div>
      <Textarea
        value={description}
        onChange={(e) => updateStep(index, e.target.value)}
        placeholder="手順を入力"
        className="flex-1"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeStep(index, stepKey)}
      >
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  );
};

const MealForm: React.FC<MealFormProps> = ({ initialDish, onSave }) => {
  const defaultDish = {
    id: 0,
    name: "",
    description: "",
    category: "",
    ingredients: [{ id: 0, name: "", unit: "" }],
    steps: [{ step: "step-1", description: "" }],
  };

  const [dish, setDish] = useState({
    id: initialDish?.id || defaultDish.id,
    name: initialDish?.name || defaultDish.name,
    description: initialDish?.description || defaultDish.description,
    category: initialDish?.category || defaultDish.category,
    ingredients:
      initialDish?.ingredients && initialDish.ingredients.length > 0
        ? initialDish.ingredients
        : defaultDish.ingredients,
    steps:
      initialDish?.steps && initialDish.steps.length > 0
        ? initialDish.steps
        : defaultDish.steps,
  });

  const [countStep, setCountStep] = useState(dish.steps.length + 1);
  const router = useRouter();

  const handleIngredientChange = (
    ingredientIndex: number,
    field: "name" | "unit",
    value: string
  ) => {
    setDish((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, index) =>
        index === ingredientIndex
          ? { ...ingredient, [field]: value }
          : ingredient
      ),
    }));
  };

  const addIngredient = () => {
    setDish((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", unit: "" }],
    }));
  };

  const removeIngredient = (index: number, id: number) => {
    if (id !== 0) {
      deleteTable(id, "ingredients");
    }
    setDish((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients.filter((_, i) => i !== index)],
    }));
  };

  const addStep = () => {
    setCountStep(countStep + 1);
    const newStepId = `step-${countStep}`;
    setDish((prev) => ({
      ...prev,
      steps: [...prev.steps, { step: newStepId, description: "" }],
    }));
  };

  const removeStep = (stepIndex: number, id: number) => {
    setCountStep(countStep - 1);
    if (id) {
      deleteTable(id, "steps");
    }
    setDish((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, index) => index !== stepIndex),
    }));
  };

  const updateStep = (stepIndex: number, value: string) => {
    setDish((prev) => ({
      ...prev,
      steps: prev.steps.map((step, index) =>
        index === stepIndex ? { ...step, description: value } : step
      ),
    }));
  };
  const moveStep = useCallback((dragIndex: number, hoverIndex: number) => {
    setDish((prevDish) => {
      const newSteps = [...prevDish.steps];
      const draggedStep = newSteps[dragIndex];
      newSteps.splice(dragIndex, 1);
      newSteps.splice(hoverIndex, 0, draggedStep);

      return { ...prevDish, steps: newSteps };
    });
  }, []);

  const deleteTable = async (id: number, table: string) => {
    try {
      await fetchFromApi(`/api/edit`, {
        method: "DELETE",
        body: JSON.stringify({ id: id, table: table }),
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("予期しないエラーが発生しました");
    }
  };

  const normalizeSteps = (dish: {
    name: string;
    description: string;
    category: string;
    ingredients: Ingredient[];
    steps: Step[];
  }) => {
    // map を使って新しい steps 配列を生成
    const updatedSteps = dish.steps.map((step, index) => ({
      ...step,
      step: `step-${index + 1}`, // index+1でstep名を更新
    }));

    // 一度だけ setDish を呼び出して、steps プロパティのみ更新
    setDish((prev) => ({
      ...prev, // 前の状態を維持
      steps: updatedSteps, // steps を上書き
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await normalizeSteps(dish);

    onSave(dish);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <form onSubmit={handleSubmit}>
        <Card className="bg-white p-4 max-w-2xl mx-auto space-y-4">
          <CardContent className="p-4 space-y-4">
            {/* 料理名入力 */}
            <div className="flex items-center gap-2">
              <Input
                value={dish.name}
                onChange={(e) =>
                  setDish((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="料理名"
                className="flex-1"
              />
            </div>
            <Textarea
              value={dish.description}
              onChange={(e) =>
                setDish((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="説明を入力"
              className="min-h-[100px]"
            />

            <h3 className="font-bold">カテゴリー</h3>
            <Select
              value={dish.category} // dish.categoryが0~4の値を文字列化
              onValueChange={(value) => {
                // 選択された値をnumber型に戻して状態更新
                setDish((prev) => ({ ...prev, category: value }));
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="space-y-2">
                  <SelectItem value="1">和食</SelectItem>
                  <SelectItem value="2">中華</SelectItem>
                  <SelectItem value="3">洋食</SelectItem>
                  <SelectItem value="4">その他</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* 材料入力 */}
            <div className="space-y-2">
              <h3 className="font-bold">材料</h3>
              {dish.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={ingredient.name}
                    onChange={(e) =>
                      handleIngredientChange(index, "name", e.target.value)
                    }
                    placeholder="材料名"
                    className="flex-1"
                  />
                  <Input
                    value={ingredient.unit}
                    onChange={(e) =>
                      handleIngredientChange(index, "unit", e.target.value)
                    }
                    placeholder="分量"
                    className="w-24"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (ingredient.id) {
                        removeIngredient(index, ingredient.id);
                      }
                    }}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={addIngredient}
              >
                <Plus className="h-4 w-4 mr-2" />
                材料を追加
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold">作り方</h3>
              {dish.steps.map((step, index) => (
                <DraggableStep
                  key={index} // ここはReact用の特殊プロップとして使用
                  stepKey={index} // 子コンポーネントで使いたい場合は別名で渡す
                  id={step.step}
                  index={index}
                  description={step.description}
                  moveStep={moveStep}
                  updateStep={updateStep}
                  removeStep={removeStep}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={addStep}
              >
                <Plus className="h-4 w-4 mr-2" />
                手順を追加
              </Button>
            </div>
          </CardContent>
          {/* 登録ボタン */}
          <div className="flex gap-2">
            <Button
              className="flex-1 bg-pink-400 hover:bg-pink-500"
              type="submit"
            >
              <Plus className="h-4 w-4 mr-2" />
              登録する
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={(e) => {
                e.preventDefault(); // フォームのデフォルト動作を防ぐ
                router.back();
              }} // ここで直前のページに戻る
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
          </div>
        </Card>
      </form>
    </DndProvider>
  );
};

export default MealForm;
