import { Answer } from '../types';

export const calculateCompatibility = (
  user1Answers: Answer[],
  user2Answers: Answer[]
): number => {
  if (user1Answers.length !== user2Answers.length) {
    throw new Error('両方のユーザーの回答数が一致しません');
  }

  let totalScore = 0;
  let maxPossibleScore = 0;

  for (let i = 0; i < user1Answers.length; i++) {
    const answer1 = user1Answers.find(a => a.question_id === i + 1);
    const answer2 = user2Answers.find(a => a.question_id === i + 1);

    if (answer1 && answer2) {
      // 回答の差の絶対値を計算（5段階評価なので最大差は4）
      // 順番が逆になったので、値を反転させる必要がある
      const value1 = 6 - answer1.answer_value; // 1→5, 2→4, 3→3, 4→2, 5→1
      const value2 = 6 - answer2.answer_value;
      const difference = Math.abs(value1 - value2);
      
      // 差が小さいほど高いスコア（最大4点、最小0点）
      const questionScore = 4 - difference;
      
      totalScore += questionScore;
      maxPossibleScore += 4;
    }
  }

  // パーセンテージに変換（0-100%）
  const compatibilityPercentage = Math.round((totalScore / maxPossibleScore) * 100);
  
  return compatibilityPercentage;
};

export const getCategoryScores = (
  user1Answers: Answer[],
  user2Answers: Answer[]
): { [category: string]: number } => {
  const categoryScores: { [category: string]: { score: number; count: number } } = {};
  
  // カテゴリ別の質問マッピング
  const questionCategories: { [questionId: number]: string } = {
    1: 'lifestyle',
    2: 'romance',
    3: 'values',
    4: 'lifestyle',
    5: 'communication',
    6: 'values',
    7: 'growth',
    8: 'trust',
    9: 'support',
    10: 'respect',
    11: 'communication',
    12: 'social',
    13: 'future',
    14: 'respect',
    15: 'romance'
  };

  for (let i = 0; i < user1Answers.length; i++) {
    const answer1 = user1Answers.find(a => a.question_id === i + 1);
    const answer2 = user2Answers.find(a => a.question_id === i + 1);
    const category = questionCategories[i + 1];

    if (answer1 && answer2 && category) {
      const difference = Math.abs(answer1.answer_value - answer2.answer_value);
      // 順番が逆になったので、値を反転させる必要がある
      const value1 = 6 - answer1.answer_value;
      const value2 = 6 - answer2.answer_value;
      const adjustedDifference = Math.abs(value1 - value2);
      const questionScore = 4 - adjustedDifference;

      if (!categoryScores[category]) {
        categoryScores[category] = { score: 0, count: 0 };
      }

      categoryScores[category].score += questionScore;
      categoryScores[category].count += 1;
    }
  }

  // 各カテゴリのパーセンテージを計算
  const finalScores: { [category: string]: number } = {};
  for (const [category, data] of Object.entries(categoryScores)) {
    finalScores[category] = Math.round((data.score / (data.count * 4)) * 100);
  }

  return finalScores;
};