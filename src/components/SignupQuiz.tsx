import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ArrowLeft, X } from 'lucide-react';
import { questions, answerLabels } from '../data/questions';
import { Answer } from '../types';

interface SignupQuizProps {
  userName: string;
  onComplete: (answers: Answer[]) => void;
  onCancel: () => void;
}

const SignupQuiz: React.FC<SignupQuizProps> = ({ userName, onComplete, onCancel }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const handleAnswer = (value: number) => {
    const answer: Answer = {
      id: currentQuestionIndex + 1,
      user_id: '', // 一時的に空文字、実際のユーザーIDは後で設定
      question_id: currentQuestionIndex + 1,
      answer_value: value,
      created_at: new Date().toISOString()
    };

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-h-screen overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl max-w-md w-full mx-auto relative my-4"
      >
        {/* キャンセルボタン */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* ヘッダー */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block p-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-3"
          >
            <User className="w-6 h-6 text-white" />
          </motion.div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            プロフィール設定
          </h2>
          <p className="text-sm text-gray-600">
            {userName}さん、質問に答えてアカウントを作成しましょう
          </p>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-xs text-blue-700">
              ⚠️ 質問回答完了後にアカウントが作成されます
            </p>
          </div>
        </div>

        {/* プログレスバー */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              質問 {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* 質問 */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-6"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-3 leading-relaxed">
            {currentQuestion.question_text}
          </h3>
          <p className="text-sm text-gray-600">
            あなたの気持ちに最も近いものを選んでください
          </p>
        </motion.div>

        {/* 回答選択肢 */}
        <div className="space-y-2 mb-6">
          {answerLabels.map((label, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(index + 1)}
              className={`w-full p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                index === 0 ? 'border-red-200 hover:border-red-300 hover:bg-red-50' :
                index === 1 ? 'border-orange-200 hover:border-orange-300 hover:bg-orange-50' :
                index === 2 ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50' :
                index === 3 ? 'border-blue-200 hover:border-blue-300 hover:bg-blue-50' :
                'border-green-200 hover:border-green-300 hover:bg-green-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                  index === 0 ? 'border-red-300' :
                  index === 1 ? 'border-orange-300' :
                  index === 2 ? 'border-gray-300' :
                  index === 3 ? 'border-blue-300' :
                  'border-green-300'
                }`} />
                <span className="font-medium text-gray-700 text-sm">{label}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* ナビゲーションボタン */}
        <div className="flex gap-2">
          {currentQuestionIndex > 0 && (
            <>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handlePrevious}
                className="flex-1 bg-gray-100 text-gray-600 font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                前の質問
              </motion.button>
            </>
          )}
          
          <button
            onClick={onCancel}
            className="flex-1 bg-red-100 text-red-600 font-semibold py-3 px-4 rounded-xl hover:bg-red-200 transition-all duration-300 text-sm"
          >
            キャンセル
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupQuiz;