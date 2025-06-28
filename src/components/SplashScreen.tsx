import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { HandWrittenTitle } from './ui/hand-writing-text';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    // 4秒後にホーム画面に遷移
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center z-50 overflow-hidden">
      {/* 画面全体に配置された星のアニメーション */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="absolute inset-0"
      >
        {/* 左上エリアの星 */}
        <motion.div
          animate={{ 
            rotate: [0, 15, -15, 0],
            scale: [1, 1.2, 1],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5
          }}
          className="absolute top-8 left-8"
        >
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </motion.div>

        <motion.div
          animate={{ 
            rotate: [0, -12, 12, 0],
            scale: [1, 1.1, 1],
            x: [0, 5, 0]
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
          className="absolute top-20 left-32"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
        </motion.div>

        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ 
            duration: 2.8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1.5
          }}
          className="absolute top-32 left-16"
        >
          <Sparkles className="w-5 h-5 text-pink-400" />
        </motion.div>

        {/* 右上エリアの星 */}
        <motion.div
          animate={{ 
            rotate: [0, -18, 18, 0],
            scale: [1, 1.3, 1],
            y: [0, -8, 0]
          }}
          transition={{ 
            duration: 2.2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.8
          }}
          className="absolute top-12 right-12"
        >
          <Sparkles className="w-7 h-7 text-blue-400" />
        </motion.div>

        <motion.div
          animate={{ 
            rotate: [0, 8, -8, 0],
            scale: [1, 1.1, 1],
            x: [0, -5, 0]
          }}
          transition={{ 
            duration: 2.6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1.2
          }}
          className="absolute top-24 right-28"
        >
          <Sparkles className="w-5 h-5 text-green-400" />
        </motion.div>

        <motion.div
          animate={{ 
            rotate: [0, -14, 14, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 3.2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
          className="absolute top-40 right-20"
        >
          <Sparkles className="w-6 h-6 text-orange-400" />
        </motion.div>

        {/* 左下エリアの星 */}
        <motion.div
          animate={{ 
            rotate: [0, 12, -12, 0],
            scale: [1, 1.25, 1],
            y: [0, 8, 0]
          }}
          transition={{ 
            duration: 2.4,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1.8
          }}
          className="absolute bottom-16 left-10"
        >
          <Sparkles className="w-6 h-6 text-indigo-400" />
        </motion.div>

        <motion.div
          animate={{ 
            rotate: [0, -10, 10, 0],
            scale: [1, 1.1, 1],
            x: [0, 8, 0]
          }}
          transition={{ 
            duration: 2.7,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2.2
          }}
          className="absolute bottom-32 left-24"
        >
          <Sparkles className="w-4 h-4 text-teal-400" />
        </motion.div>

        <motion.div
          animate={{ 
            rotate: [0, 16, -16, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ 
            duration: 2.9,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2.5
          }}
          className="absolute bottom-8 left-40"
        >
          <Sparkles className="w-5 h-5 text-red-400" />
        </motion.div>

        {/* 右下エリアの星 */}
        <motion.div
          animate={{ 
            rotate: [0, -20, 20, 0],
            scale: [1, 1.3, 1],
            y: [0, 10, 0]
          }}
          transition={{ 
            duration: 2.1,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1.3
          }}
          className="absolute bottom-12 right-16"
        >
          <Sparkles className="w-7 h-7 text-cyan-400" />
        </motion.div>

        <motion.div
          animate={{ 
            rotate: [0, 9, -9, 0],
            scale: [1, 1.1, 1],
            x: [0, -6, 0]
          }}
          transition={{ 
            duration: 2.8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1.7
          }}
          className="absolute bottom-28 right-32"
        >
          <Sparkles className="w-5 h-5 text-lime-400" />
        </motion.div>

        <motion.div
          animate={{ 
            rotate: [0, -11, 11, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 3.1,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2.8
          }}
          className="absolute bottom-40 right-8"
        >
          <Sparkles className="w-6 h-6 text-violet-400" />
        </motion.div>

        {/* 中央上部の星 */}
        <motion.div
          animate={{ 
            rotate: [0, 13, -13, 0],
            scale: [1, 1.4, 1],
            y: [0, -12, 0]
          }}
          transition={{ 
            duration: 2.3,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.7
          }}
          className="absolute top-6 left-1/2 transform -translate-x-1/2"
        >
          <Sparkles className="w-8 h-8 text-rose-400" />
        </motion.div>

        {/* 中央下部の星 */}
        <motion.div
          animate={{ 
            rotate: [0, -17, 17, 0],
            scale: [1, 1.35, 1],
            y: [0, 12, 0]
          }}
          transition={{ 
            duration: 2.6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2.3
          }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
        >
          <Sparkles className="w-8 h-8 text-emerald-400" />
        </motion.div>

        {/* 左中央の星 */}
        <motion.div
          animate={{ 
            rotate: [0, 14, -14, 0],
            scale: [1, 1.25, 1],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 2.4,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1.6
          }}
          className="absolute top-1/2 left-4 transform -translate-y-1/2"
        >
          <Sparkles className="w-7 h-7 text-amber-400" />
        </motion.div>

        {/* 右中央の星 */}
        <motion.div
          animate={{ 
            rotate: [0, -16, 16, 0],
            scale: [1, 1.3, 1],
            x: [0, -10, 0]
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1.9
          }}
          className="absolute top-1/2 right-4 transform -translate-y-1/2"
        >
          <Sparkles className="w-7 h-7 text-fuchsia-400" />
        </motion.div>

        {/* 追加の装飾星（小さめ） */}
        <motion.div
          animate={{ 
            rotate: [0, 25, -25, 0],
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 3
          }}
          className="absolute top-1/4 left-1/4"
        >
          <Sparkles className="w-3 h-3 text-sky-400" />
        </motion.div>

        <motion.div
          animate={{ 
            rotate: [0, -22, 22, 0],
            scale: [1, 1.4, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 3.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 3.5
          }}
          className="absolute top-1/3 right-1/4"
        >
          <Sparkles className="w-3 h-3 text-slate-400" />
        </motion.div>

        <motion.div
          animate={{ 
            rotate: [0, 18, -18, 0],
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 3.8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 4
          }}
          className="absolute bottom-1/4 left-1/3"
        >
          <Sparkles className="w-3 h-3 text-stone-400" />
        </motion.div>

        <motion.div
          animate={{ 
            rotate: [0, -24, 24, 0],
            scale: [1, 1.6, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 3.3,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 4.2
          }}
          className="absolute bottom-1/3 right-1/3"
        >
          <Sparkles className="w-3 h-3 text-zinc-400" />
        </motion.div>
      </motion.div>

      {/* メインコンテンツ */}
      <div className="text-center max-w-7xl mx-auto px-4 relative z-10">
        {/* 手書き風タイトル */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <HandWrittenTitle 
            title="H.MNK" 
            subtitle="Happy Birthday 26 years"
          />
        </motion.div>

        {/* ローディングドット */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="flex justify-center items-center gap-2 mt-8"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-pink-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </motion.div>

        {/* サブテキスト */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="text-gray-500 text-sm mt-6"
        >
          読み込み中...
        </motion.p>
      </div>
    </div>
  );
};

export default SplashScreen;