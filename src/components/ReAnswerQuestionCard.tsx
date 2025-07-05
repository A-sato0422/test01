import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Question } from '../types';
import { answerLabels } from '../data/questions';
import { Check, Loader2, ArrowLeft, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ReAnswerQuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (value: number) => void;
  currentAnswer?: number;
  onCancel: () => void;
}

const ReAnswerQuestionCard: React.FC<ReAnswerQuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  currentAnswer,
  onCancel
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAnswer, setSubmittedAnswer] = useState<number | null>(null);

  const handleAnswerClick = async (value: number) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmittedAnswer(value);

    try {
      // 少し遅延を入れてローディング状態を見せる
      await new Promise(resolve => setTimeout(resolve, 800));
      await onAnswer(value);
    } catch (error) {
      console.error('回答の送信に失敗しました:', error);
      setIsSubmitting(false);
      setSubmittedAnswer(null);
    }
  };

  const getUserName = () => {
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'あなた';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      {/* 保存中のオーバーレイ */}
      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center"
          >
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
            <p className="text-gray-700 font-medium">回答を更新中...</p>
            <p className="text-sm text-gray-500 mt-1">しばらくお待ちください</p>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-md w-full relative ${
          isSubmitting ? 'pointer-events-none' : ''
        }`}
      >
        {/* キャンセルボタン */}
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* 保存中のプログレスバー */}
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t-3xl overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          </motion.div>
        )}

        {/* ヘッダー */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            質問の再回答
          </h2>
          <p className="text-sm text-gray-600">
            {getUserName()}さんの回答を編集できます
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              質問 {questionNumber} / {totalQuestions}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round((questionNumber / totalQuestions) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 leading-relaxed">
            {question.question_text}
          </h2>
          <p className="text-sm text-gray-600">
            現在の回答を変更する場合は、新しい選択肢をクリックしてください
          </p>
          {currentAnswer && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-700">
                現在の回答: <span className="font-medium">{answerLabels[currentAnswer - 1]}</span>
              </p>
            </div>
          )}
        </motion.div>

        {/* Answer Options */}
        <div className="space-y-3">
          {answerLabels.map((label, index) => {
            const isCurrentAnswer = currentAnswer === index + 1;
            const isSelected = submittedAnswer === index + 1;
            const isDisabled = isSubmitting;
            
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={!isDisabled ? { scale: 1.02 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
                onClick={() => handleAnswerClick(index + 1)}
                disabled={isDisabled}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left relative ${
                  isSelected
                    ? 'border-blue-400 bg-blue-50 shadow-lg'
                    : isCurrentAnswer
                    ? 'border-blue-300 bg-blue-25 shadow-md'
                    : isDisabled
                    ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                    : index === 0 ? 'border-red-200 hover:border-red-300 hover:bg-red-50' :
                      index === 1 ? 'border-orange-200 hover:border-orange-300 hover:bg-orange-50' :
                      index === 2 ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50' :
                      index === 3 ? 'border-blue-200 hover:border-blue-300 hover:bg-blue-50' :
                      'border-green-200 hover:border-green-300 hover:bg-green-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                    isSelected
                      ? 'border-blue-400 bg-blue-400'
                      : isCurrentAnswer
                      ? 'border-blue-300 bg-blue-100'
                      : index === 0 ? 'border-red-300' :
                        index === 1 ? 'border-orange-300' :
                        index === 2 ? 'border-gray-300' :
                        index === 3 ? 'border-blue-300' :
                        'border-green-300'
                  }`}>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                    {isCurrentAnswer && !isSelected && (
                      <div className="w-3 h-3 bg-blue-400 rounded-full" />
                    )}
                  </div>
                  <span className={`font-medium ${
                    isSelected ? 'text-blue-700' : 
                    isCurrentAnswer ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    {label}
                  </span>
                  {isCurrentAnswer && !isSelected && (
                    <span className="ml-auto text-xs text-blue-600 font-medium">
                      現在の回答
                    </span>
                  )}
                </div>

                {/* 送信中のローディングインジケーター */}
                {isSelected && isSubmitting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* 保存中のステータスメッセージ */}
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
          >
            <div className="flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin mr-2" />
              <span className="text-sm font-medium text-blue-700">
                回答を更新しています...
              </span>
            </div>
            <p className="text-xs text-blue-600 text-center mt-1">
              {questionNumber === totalQuestions 
                ? '完了まで少々お待ちください' 
                : '次の質問に進むまでお待ちください'
              }
            </p>
          </motion.div>
        )}

        {/* キャンセルボタン（下部） */}
        <div className="mt-6">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full bg-gray-100 text-gray-600 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            再回答をキャンセル
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ReAnswerQuestionCard;