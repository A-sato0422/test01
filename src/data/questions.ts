import { Question } from '../types';

export const questions: Question[] = [
  {
    id: 1,
    question_text: '休日は家でゆっくり過ごすのが好きですか？',
    category: 'lifestyle',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    question_text: '人と話すことでエネルギーを得られますか？',
    category: 'communication',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    question_text: '計画を立てて行動するのが好きですか？',
    category: 'planning',
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    question_text: '周りの人の気持ちを察するのが得意ですか？',
    category: 'empathy',
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    question_text: 'お互いの時間を大切にすることは重要ですか？',
    category: 'respect',
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    question_text: '価値観の違いを受け入れることができますか？',
    category: 'values',
    created_at: new Date().toISOString()
  },
  {
    id: 7,
    question_text: 'デートは事前に計画を立てて楽しみたいですか？',
    category: 'romance',
    created_at: new Date().toISOString()
  },
  {
    id: 8,
    question_text: 'パートナーとは頻繁に連絡を取り合いたいですか？',
    category: 'communication',
    created_at: new Date().toISOString()
  },
  {
    id: 9,
    question_text: '恋人の前では素の自分を出せるタイプですか？',
    category: 'authenticity',
    created_at: new Date().toISOString()
  },
  {
    id: 10,
    question_text: 'パートナーの趣味や興味に合わせるのが好きですか？',
    category: 'adaptation',
    created_at: new Date().toISOString()
  },
  {
    id: 11,
    question_text: '恋愛においてロマンチックなサプライズを重視しますか？',
    category: 'romance',
    created_at: new Date().toISOString()
  },
  {
    id: 12,
    question_text: '恋人とは友達のような関係性を築きたいですか？',
    category: 'relationship',
    created_at: new Date().toISOString()
  },
  {
    id: 13,
    question_text: '束縛されるより自由な関係を好みますか？',
    category: 'freedom',
    created_at: new Date().toISOString()
  },
  {
    id: 14,
    question_text: '喧嘩をしたらすぐに仲直りしたいタイプですか？',
    category: 'conflict',
    created_at: new Date().toISOString()
  },
  {
    id: 15,
    question_text: '長期的な関係を築くことを大切にしたいですか？',
    category: 'commitment',
    created_at: new Date().toISOString()
  }
];

export const answerLabels = [
  '強くそう思う',
  'そう思う',
  'どちらでもない',
  'あまりそう思わない',
  '全くそう思わない'
];