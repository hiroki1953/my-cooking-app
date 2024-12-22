export interface Ingredient {
  id?: number;
  name: string;
  unit: string;
}

export interface Step {
  id?: number;
  step: string;
  description: string;
}

export type Dish = {
  id: number;
  name: string;
  description: string;
  category: string;
  ingredients: Ingredient[]; // Ingredient型を使用
  steps: Step[]; // Step型を使用
};
