import { Question } from '../types';

export const questions: Question[] = [
  {
    id: 1,
    question_text: '休日はどう過ごしたいですか？',
    category: 'lifestyle',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    question_text: '理想的なデートスポットは？',
    category: 'romance',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    question_text: '将来の目標について話し合うことは重要ですか？',
    category: 'values',
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    question_text: 'お互いの趣味を尊重し合うことは大切ですか？',
    category: 'lifestyle',
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    question_text: 'コミュニケーションの頻度について、どう思いますか？',
    category: 'communication',
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
    question_text: 'お互いの成長を支え合うことは重要ですか？',
    category: 'growth',
    created_at: new Date().toISOString()
  },
  {
    id: 8,
    question_text: '信頼関係を築くために最も重要なことは何ですか？',
    category: 'trust',
    created_at: new Date().toISOString()
  },
  {
    id: 9,
    question_text: '困難な状況で支え合うことについてどう思いますか？',
    category: 'support',
    created_at: new Date().toISOString()
  },
  {
    id: 10,
    question_text: 'お互いの時間を大切にすることは重要ですか？',
    category: 'respect',
    created_at: new Date().toISOString()
  },
  {
    id: 11,
    question_text: '感情を素直に表現することについてどう思いますか？',
    category: 'communication',
    created_at: new Date().toISOString()
  },
  {
    id: 12,
    question_text: 'お互いの家族や友人との関係をどう考えますか？',
    category: 'social',
    created_at: new Date().toISOString()
  },
  {
    id: 13,
    question_text: '将来のライフスタイルについて一緒に考えることは大切ですか？',
    category: 'future',
    created_at: new Date().toISOString()
  },
  {
    id: 14,
    question_text: 'お互いの個性を尊重し合うことについてどう思いますか？',
    category: 'respect',
    created_at: new Date().toISOString()
  },
  {
    id: 15,
    question_text: '愛情表現の方法について話し合うことは重要ですか？',
    category: 'romance',
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