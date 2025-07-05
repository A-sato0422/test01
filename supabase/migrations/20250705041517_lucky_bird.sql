/*
  # 質問データの修正と再挿入

  1. 既存の質問データをクリア
  2. 新しい質問データを挿入
  3. データの整合性を確認
*/

-- 既存の質問データを削除（もしあれば）
DELETE FROM questions;

-- 質問データを再挿入
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
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  category = EXCLUDED.category;

-- データが正しく挿入されたかを確認
SELECT COUNT(*) as question_count FROM questions;