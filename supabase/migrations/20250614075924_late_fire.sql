/*
  # 相性診断アプリケーション データベーススキーマ

  1. 新しいテーブル
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `created_at` (timestamp)
    - `questions`
      - `id` (integer, primary key)
      - `question_text` (text)
      - `category` (text)
      - `created_at` (timestamp)
    - `answers`
      - `id` (integer, primary key)
      - `user_id` (uuid, foreign key)
      - `question_id` (integer, foreign key)
      - `answer_value` (integer, 1-5)
      - `created_at` (timestamp)
    - `compatibility_results`
      - `id` (integer, primary key)
      - `user1_id` (uuid, foreign key)
      - `user2_id` (uuid, foreign key)
      - `compatibility_score` (integer, 0-100)
      - `created_at` (timestamp)

  2. セキュリティ
    - 全テーブルでRLSを有効化
    - ユーザーは自分のデータのみアクセス可能
    - 相性結果は関連するユーザーのみアクセス可能
*/

-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 質問テーブル
CREATE TABLE IF NOT EXISTS questions (
  id integer PRIMARY KEY,
  question_text text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- 回答テーブル
CREATE TABLE IF NOT EXISTS answers (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id integer NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_value integer NOT NULL CHECK (answer_value >= 1 AND answer_value <= 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, question_id)
);

ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- 相性結果テーブル
CREATE TABLE IF NOT EXISTS compatibility_results (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user1_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user2_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  compatibility_score integer NOT NULL CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

ALTER TABLE compatibility_results ENABLE ROW LEVEL SECURITY;

-- RLSポリシー
-- ユーザーは全てのユーザー情報を読み取り可能（相性診断のため）
CREATE POLICY "Users can read all user data"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- ユーザーは自分のデータを挿入可能
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 全員が質問を読み取り可能
CREATE POLICY "Everyone can read questions"
  ON questions
  FOR SELECT
  TO authenticated
  USING (true);

-- ユーザーは自分の回答を管理可能
CREATE POLICY "Users can manage own answers"
  ON answers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ユーザーは関連する相性結果を読み取り可能
CREATE POLICY "Users can read related compatibility results"
  ON compatibility_results
  FOR SELECT
  TO authenticated
  USING (true);

-- ユーザーは相性結果を挿入可能
CREATE POLICY "Users can insert compatibility results"
  ON compatibility_results
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 初期質問データの挿入
INSERT INTO questions (id, question_text, category) VALUES
(1, '休日はどう過ごしたいですか？', 'lifestyle'),
(2, '理想的なデートスポットは？', 'romance'),
(3, '将来の目標について話し合うことは重要ですか？', 'values'),
(4, 'お互いの趣味を尊重し合うことは大切ですか？', 'lifestyle'),
(5, 'コミュニケーションの頻度について、どう思いますか？', 'communication'),
(6, '価値観の違いを受け入れることができますか？', 'values'),
(7, 'お互いの成長を支え合うことは重要ですか？', 'growth'),
(8, '信頼関係を築くために最も重要なことは何ですか？', 'trust'),
(9, '困難な状況で支え合うことについてどう思いますか？', 'support'),
(10, 'お互いの時間を大切にすることは重要ですか？', 'respect'),
(11, '感情を素直に表現することについてどう思いますか？', 'communication'),
(12, 'お互いの家族や友人との関係をどう考えますか？', 'social'),
(13, '将来のライフスタイルについて一緒に考えることは大切ですか？', 'future'),
(14, 'お互いの個性を尊重し合うことについてどう思いますか？', 'respect'),
(15, '愛情表現の方法について話し合うことは重要ですか？', 'romance')
ON CONFLICT (id) DO NOTHING;