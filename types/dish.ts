export interface Ingredient {
  ingredients: {
    ingredient_name: string;
  };
  id?: number;
  unit: string;
  quantity: number;
}

export interface Step {
  id?: number;
  step_num: number;
  step_description: string;
}

export type Dish = {
  id: number;
  name: string;
  description: string;
  category: string;
  ingredients: Ingredient[]; // Ingredient型を使用
  steps: Step[]; // Step型を使用
};
