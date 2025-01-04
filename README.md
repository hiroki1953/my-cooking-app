# **データベース設計**

このドキュメントでは、料理レシピ管理アプリのデータベース設計を記載します。この設計は、ユーザー、グループ、カレンダー、およびレシピ情報を効率的に管理することを目的としています。

---

## **エンティティ設計**

### **1. recipes**

- **説明**: ユーザーが保存する料理レシピの情報を管理。
- **主キー**: `recipe_id`
- **カラム**:
  - `recipe_id` (INT, Primary Key) - レシピのユニーク ID。
  - `recipe_name` (VARCHAR) - レシピ名。
  - `cooking_time` (INT) - 調理時間（分）。
  - `calories` (NUMERIC) - カロリー情報。
  - `category` (VARCHAR) - レシピのカテゴリ（例: 和食、洋食）。
  - `created_at` (TIMESTAMP) - レシピ作成日時。
  - `servings` (SMALLINT) - 何人前か。
  - `protein` (NUMERIC) - タンパク質量。
  - `fat` (NUMERIC) - 脂質量。
  - `carbohydrate` (NUMERIC) - 炭水化物量。

---

### **2. ingredients**

- **説明**: 料理に使用する材料の情報を管理。
- **主キー**: `ingredient_id`
- **カラム**:
  - `ingredient_id` (INT, Primary Key) - 材料のユニーク ID。
  - `ingredient_name` (VARCHAR) - 材料名。

---

### **3. recipe_ingredients**

- **説明**: レシピと材料の関係を管理する中間テーブル。
- **主キー**: (`recipe_id`, `ingredient_id`)
- **カラム**:
  - `recipe_id` (INT, Foreign Key) - `recipes` テーブルを参照。
  - `ingredient_id` (INT, Foreign Key) - `ingredients` テーブルを参照。
  - `quantity` (NUMERIC) - 材料の分量。
  - `unit` (VARCHAR) - 材料の単位（例: g, mL）。

---

### **4. steps**

- **説明**: レシピの手順情報を管理。
- **主キー**: `step_id`
- **カラム**:
  - `step_id` (INT, Primary Key) - 手順のユニーク ID。
  - `recipe_id` (INT, Foreign Key) - `recipes` テーブルを参照。
  - `step_num` (SMALLINT) - 手順の順序。
  - `step_description` (TEXT) - 手順の説明。

---

### **5. calendar_recipes**

- **説明**: カレンダーの日付に登録されるレシピ情報を管理。
- **主キー**: `id`
- **カラム**:
  - `id` (INT, Primary Key) - カレンダーエントリのユニーク ID。
  - `group_id` (INT, Foreign Key) - `groups` テーブルを参照。
  - `date` (DATE) - カレンダーの日付。
  - `recipe_id` (INT, Foreign Key) - `recipes` テーブルを参照。
  - `created_at` (TIMESTAMP) - レコード作成日時。

---

### **6. users**

- **説明**: アプリのユーザー情報を管理。
- **主キー**: `user_id`
- **カラム**:
  - `user_id` (INT, Primary Key) - ユーザーのユニーク ID。
  - `user_name` (VARCHAR) - ユーザー名。
  - `email` (VARCHAR) - メールアドレス。
  - `password_hash` (VARCHAR) - ハッシュ化されたパスワード。

---

### **7. groups**

- **説明**: グループ情報を管理。
- **主キー**: `group_id`
- **カラム**:
  - `group_id` (INT, Primary Key) - グループのユニーク ID。
  - `group_name` (VARCHAR) - グループ名。
  - `created_by_user_id` (INT, Foreign Key) - グループ作成者の `user_id` を参照。

---

### **8. group_members**

- **説明**: グループとユーザーの関係を管理する中間テーブル。
- **主キー**: (`group_id`, `user_id`)
- **カラム**:
  - `group_id` (INT, Foreign Key) - `groups` テーブルを参照。
  - `user_id` (INT, Foreign Key) - `users` テーブルを参照。
  - `joined_at` (TIMESTAMP) - グループ参加日時。

---

### **9. group_recipes**

- **説明**: グループごとに共有されるレシピ情報を管理。
- **主キー**: `id`
- **カラム**:
  - `id` (INT, Primary Key) - ユニーク ID。
  - `group_id` (INT, Foreign Key) - `groups` テーブルを参照。
  - `recipe_id` (INT, Foreign Key) - `recipes` テーブルを参照。
  - `created_at` (TIMESTAMP) - 作成日時。

---

## **リレーション図**

### **リレーション**

- **recipes** と **recipe_ingredients**
  - `recipes.recipe_id → recipe_ingredients.recipe_id`
- **ingredients** と **recipe_ingredients**
  - `ingredients.ingredient_id → recipe_ingredients.ingredient_id`
- **recipes** と **steps**
  - `recipes.recipe_id → steps.recipe_id`
- **calendar_recipes** と **groups**
  - `groups.group_id → calendar_recipes.group_id`
- **calendar_recipes** と **recipes**
  - `recipes.recipe_id → calendar_recipes.recipe_id`
- **groups** と **group_members**
  - `groups.group_id → group_members.group_id`
- **users** と **group_members**
  - `users.user_id → group_members.user_id`
- **groups** と **group_recipes**
  - `groups.group_id → group_recipes.group_id`
- **recipes** と **group_recipes**
  - `recipes.recipe_id → group_recipes.recipe_id`

---

## **使用技術**

- **データベース**: PostgreSQL（Supabase）
- **ER 図作成ツール**: Supabase Schema Visualizer

---
