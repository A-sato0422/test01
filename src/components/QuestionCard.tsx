import React from 'react';
import { motion } from 'framer-motion';
import { Question } from '../types';
import { answerLabels } from '../data/questions';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (value: number) => void;
  userName: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  userName
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-50 to-purple-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-md w-full"
      >
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              {userName}の回答
            </span>
            <span className="text-sm font-medium text-gray-600">
              {questionNumber} / {totalQuestions}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-pink-400 to-purple-500 h-2 rounded-full"
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
            あなたの気持ちに最も近いものを選んでください
          </p>
        </motion.div>

        {/* Answer Options */}
        <div className="space-y-3">
          {answerLabels.map((label, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAnswer(index + 1)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                index === 0 ? 'border-red-200 hover:border-red-300 hover:bg-red-50' :
                index === 1 ? 'border-orange-200 hover:border-orange-300 hover:bg-orange-50' :
                index === 2 ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50' :
                index === 3 ? 'border-blue-200 hover:border-blue-300 hover:bg-blue-50' :
                'border-green-200 hover:border-green-300 hover:bg-green-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 mr-3 ${
                  index === 0 ? 'border-red-300' :
                  index === 1 ? 'border-orange-300' :
                  index === 2 ? 'border-gray-300' :
                  index === 3 ? 'border-blue-300' :
                  'border-green-300'
                }`} />
                <span className="font-medium text-gray-700">{label}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default QuestionCard;