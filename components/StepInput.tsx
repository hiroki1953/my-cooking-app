"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus } from "lucide-react";
import { Label } from "@/components/ui/label";
import React from "react";

interface Step {
  description: string;
}

// 親が使うprops
interface StepsInputProps {
  steps: Step[];
  setSteps: React.Dispatch<React.SetStateAction<Step[]>>;
}

export function StepsInput({ steps, setSteps }: StepsInputProps) {
  // 手順を追加
  const addStep = () => {
    setSteps((prev) => [...prev, { description: "" }]);
  };

  // 手順を削除
  const removeStep = (index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  // 入力値を更新
  const updateStep = (index: number, value: string) => {
    setSteps((prev) =>
      prev.map((step, i) =>
        i === index ? { ...step, description: value } : step
      )
    );
  };

  return (
    <div className="space-y-4">
      <Label>作り方</Label>
      {steps.map((step, index) => (
        <div key={index} className="flex items-start gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-pink-400 text-white flex items-center justify-center flex-shrink-0 mt-2">
            {index + 1}
          </div>
          <Textarea
            value={step.description}
            onChange={(e) => updateStep(index, e.target.value)}
            placeholder="手順を入力してください"
            className="flex-1"
          />
          <Button
            variant="destructive"
            size="icon"
            type="button"
            onClick={() => removeStep(index)}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addStep}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        手順を追加
      </Button>

      {/*
        hidden inputで steps をJSON化して送信
        name="steps" として渡すことで formData.get("steps") で取得できる
      */}
      <input type="hidden" name="steps" value={JSON.stringify(steps)} />
    </div>
  );
}
