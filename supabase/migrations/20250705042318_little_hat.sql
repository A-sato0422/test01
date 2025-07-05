/*
  # 質問内容の更新

  1. 既存の質問データを削除
  2. 新しい15個の質問を挿入
  3. カテゴリも適切に設定
*/

-- 既存の質問データを削除
DELETE FROM questions;

-- 新しい質問データを挿入
INSERT INTO questions (id, question_text, category) VALUES
(1, '休日は家でゆっくり過ごすのが好きですか？', 'lifestyle'),
(2, '人と話すことでエネルギーを得られますか？', 'communication'),
(3, '計画を立てて行動するのが好きですか？', 'planning'),
(4, '周りの人の気持ちを察するのが得意ですか？', 'empathy'),
(5, 'お互いの時間を大切にすることは重要ですか？', 'respect'),
(6, '価値観の違いを受け入れることができますか？', 'values'),
(7, 'デートは事前に計画を立てて楽しみたいですか？', 'romance'),
(8, 'パートナーとは頻繁に連絡を取り合いたいですか？', 'communication'),
(9, '恋人の前では素の自分を出せるタイプですか？', 'authenticity'),
(10, 'パートナーの趣味や興味に合わせるのが好きですか？', 'adaptation'),
(11, '恋愛においてロマンチックなサプライズを重視しますか？', 'romance'),
(12, '恋人とは友達のような関係性を築きたいですか？', 'relationship'),
(13, '束縛されるより自由な関係を好みますか？', 'freedom'),
(14, '喧嘩をしたらすぐに仲直りしたいタイプですか？', 'conflict'),
(15, '長期的な関係を築くことを大切にしたいですか？', 'commitment')
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  category = EXCLUDED.category;

-- データが正しく挿入されたかを確認
SELECT COUNT(*) as question_count FROM questions;