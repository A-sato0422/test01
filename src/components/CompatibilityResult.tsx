import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Users, RotateCcw, Crown, Star } from 'lucide-react';

interface CompatibilityResultProps {
  user1Name: string;
  user2Name: string;
  compatibilityScore: number;
  onRestart: () => void;
  isSpecialCouple?: boolean;
}

const CompatibilityResult: React.FC<CompatibilityResultProps> = ({
  user1Name,
  user2Name,
  compatibilityScore,
  onRestart,
  isSpecialCouple = false
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

  const getSpecialMessage = () => {
    return {
      title: '奇跡の相性！',
      message: '運命的な出会いです！',
      description: `${user1Name}さんと${user2Name}さんは、まさに理想的なパートナーシップを築くことができる組み合わせです。

お二人の相性の素晴らしさ：
• 価値観と人生観が驚くほど一致している
• お互いの長所を最大限に引き出し合える関係
• コミュニケーションが自然で心地よい
• 困難な時も支え合い、乗り越えていける強い絆

仕事面での相乗効果：
• 異なる専門性を活かした最強のチームワーク
• お互いの創造性を刺激し合い、革新的なアイデアを生み出す
• 目標に向かって共に成長し続けられる関係
• プロフェッショナルとしても人生のパートナーとしても理想的

将来への可能性：
お二人が歩む未来は、きっと多くの人に希望と勇気を与える素晴らしいものになるでしょう。互いを深く理解し、尊重し合いながら、共に夢を実現していく姿は、真の愛の形そのものです。

この出会いは偶然ではなく、必然だったのかもしれません。お二人の幸せな未来を心から応援しています！`
    };
  };

  const scoreMessage = isSpecialCouple ? getSpecialMessage() : getScoreMessage(compatibilityScore);

  // 特別演出用のエフェクト
  const SpecialEffects = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* 金色の星のエフェクト */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ 
            opacity: 0, 
            scale: 0,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
          }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            rotate: [0, 360]
          }}
          transition={{ 
            duration: 3,
            delay: i * 0.2,
            repeat: Infinity,
            repeatDelay: 5
          }}
        >
          <Star className="w-6 h-6 text-yellow-400" fill="currentColor" />
        </motion.div>
      ))}
      
      {/* ハートのエフェクト */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`heart-${i}`}
          className="absolute"
          initial={{ 
            opacity: 0, 
            scale: 0,
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50
          }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: -100
          }}
          transition={{ 
            duration: 4,
            delay: i * 0.3,
            repeat: Infinity,
            repeatDelay: 6
          }}
        >
          <Heart className="w-8 h-8 text-pink-400" fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative ${
      isSpecialCouple 
        ? 'bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100' 
        : 'bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100'
    }`}>
      {isSpecialCouple && <SpecialEffects />}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className={`backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-2xl w-full text-center relative z-10 ${
          isSpecialCouple 
            ? 'bg-white/90 border-4 border-yellow-300' 
            : 'bg-white/80'
        }`}
      >
        {/* 特別カップル用の王冠アイコン */}
        {isSpecialCouple && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="absolute -top-8 left-1/2 transform -translate-x-1/2"
          >
            <Crown className="w-16 h-16 text-yellow-500" fill="currentColor" />
          </motion.div>
        )}

        {/* Animated Hearts */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative mb-6"
        >
          <div className="flex justify-center items-center">
            <Heart className={`w-16 h-16 mx-2 ${isSpecialCouple ? 'text-yellow-400' : 'text-pink-400'}`} fill="currentColor" />
            <Users className={`w-12 h-12 mx-2 ${isSpecialCouple ? 'text-yellow-500' : 'text-purple-400'}`} />
            <Heart className={`w-16 h-16 mx-2 ${isSpecialCouple ? 'text-yellow-400' : 'text-pink-400'}`} fill="currentColor" />
          </div>
          <Sparkles className={`w-6 h-6 absolute top-0 right-8 animate-pulse ${isSpecialCouple ? 'text-yellow-400' : 'text-yellow-400'}`} />
          <Sparkles className={`w-4 h-4 absolute bottom-2 left-8 animate-pulse ${isSpecialCouple ? 'text-yellow-400' : 'text-yellow-400'}`} />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`text-2xl font-bold mb-2 ${isSpecialCouple ? 'text-yellow-800' : 'text-gray-800'}`}
        >
          相性診断結果
        </motion.h2>

        {/* Names */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`text-lg mb-6 ${isSpecialCouple ? 'text-yellow-700 font-semibold' : 'text-gray-600'}`}
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
          <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-lg ${
            isSpecialCouple 
              ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 border-4 border-yellow-300' 
              : `bg-gradient-to-r ${getScoreColor(compatibilityScore)}`
          }`}>
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
          <h3 className={`text-xl font-bold mb-2 ${isSpecialCouple ? 'text-yellow-800' : 'text-gray-800'}`}>
            {scoreMessage.title}
          </h3>
          <p className={`${isSpecialCouple ? 'text-yellow-700' : 'text-gray-600'}`}>
            {scoreMessage.message}
          </p>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className={`rounded-2xl p-6 mb-6 ${
            isSpecialCouple 
              ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200' 
              : 'bg-gradient-to-r from-purple-50 to-pink-50'
          }`}
        >
          <h4 className={`font-semibold mb-3 ${isSpecialCouple ? 'text-yellow-800' : 'text-gray-800'}`}>
            {isSpecialCouple ? '特別な診断結果' : '診断について'}
          </h4>
          <div className={`text-sm leading-relaxed ${isSpecialCouple ? 'text-yellow-700' : 'text-gray-600'}`}>
            {isSpecialCouple ? (
              <div className="whitespace-pre-line text-left">
                {scoreMessage.description}
              </div>
            ) : (
              <p>
                この相性スコアは、15の質問に対するお二人の回答を分析して算出されました。
                価値観、ライフスタイル、コミュニケーションスタイルなど、
                様々な要素を総合的に評価しています。
              </p>
            )}
          </div>
        </motion.div>

        {/* Special congratulations message */}
        {isSpecialCouple && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl p-6 mb-6"
          >
            <h4 className="font-bold text-lg mb-2">🎉 特別なお祝いメッセージ 🎉</h4>
            <p className="text-sm">
              お二人の素晴らしい相性に心からお祝い申し上げます！
              この奇跡的な出会いが、永遠の幸せへと続きますように。
            </p>
          </motion.div>
        )}

        {/* Restart Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className={`w-full font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 ${
            isSpecialCouple 
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
              : 'bg-gradient-to-r from-purple-400 to-pink-500 text-white'
          }`}
        >
          <RotateCcw className="w-5 h-5" />
          もう一度診断する
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CompatibilityResult;