import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Users, RotateCcw } from 'lucide-react';

interface CompatibilityResultProps {
  user1Name: string;
  user2Name: string;
  compatibilityScore: number;
  onRestart: () => void;
}

const CompatibilityResult: React.FC<CompatibilityResultProps> = ({
  user1Name,
  user2Name,
  compatibilityScore,
  onRestart
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'from-pink-400 to-red-400';
    if (score >= 80) return 'from-purple-400 to-pink-400';
    if (score >= 70) return 'from-blue-400 to-purple-400';
    if (score >= 60) return 'from-green-400 to-blue-400';
    return 'from-yellow-400 to-green-400';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return { title: '運命の相手！', message: '完璧な相性です！' };
    if (score >= 80) return { title: '最高の相性！', message: 'とても素晴らしい関係です！' };
    if (score >= 70) return { title: '良い相性！', message: 'お互いを理解し合えます！' };
    if (score >= 60) return { title: 'まあまあの相性', message: '努力次第で良い関係に！' };
    return { title: '異なる個性', message: 'お互いから学ぶことがたくさん！' };
  };

  const scoreMessage = getScoreMessage(compatibilityScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-md w-full text-center"
      >
        {/* Animated Hearts */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative mb-6"
        >
          <div className="flex justify-center items-center">
            <Heart className="w-16 h-16 text-pink-400 mx-2" fill="currentColor" />
            <Users className="w-12 h-12 text-purple-400 mx-2" />
            <Heart className="w-16 h-16 text-pink-400 mx-2" fill="currentColor" />
          </div>
          <Sparkles className="w-6 h-6 text-yellow-400 absolute top-0 right-8 animate-pulse" />
          <Sparkles className="w-4 h-4 text-yellow-400 absolute bottom-2 left-8 animate-pulse" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-gray-800 mb-2"
        >
          相性診断結果
        </motion.h2>

        {/* Names */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-lg text-gray-600 mb-6"
        >
          {user1Name} × {user2Name}
        </motion.p>

        {/* Score Circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 150 }}
          className="relative mb-6"
        >
          <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${getScoreColor(compatibilityScore)} flex items-center justify-center mx-auto shadow-lg`}>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-3xl font-bold text-white"
            >
              {compatibilityScore}%
            </motion.span>
          </div>
        </motion.div>

        {/* Score Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mb-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {scoreMessage.title}
          </h3>
          <p className="text-gray-600">
            {scoreMessage.message}
          </p>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6"
        >
          <h4 className="font-semibold text-gray-800 mb-3">診断について</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            この相性スコアは、15の質問に対するお二人の回答を分析して算出されました。
            価値観、ライフスタイル、コミュニケーションスタイルなど、
            様々な要素を総合的に評価しています。
          </p>
        </motion.div>

        {/* Restart Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className="w-full bg-gradient-to-r from-purple-400 to-pink-500 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          もう一度診断する
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CompatibilityResult;