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
    <div className="fixed inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center z-50">
      <div className="text-center max-w-6xl mx-auto px-4">
        {/* スパークルアニメーション */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-8 relative"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
            className="absolute top-10 right-20"
          >
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </motion.div>
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1.5
            }}
            className="absolute top-32 left-16"
          >
            <Sparkles className="w-6 h-6 text-purple-400" />
          </motion.div>
          <motion.div
            animate={{ 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2
            }}
            className="absolute bottom-10 right-16"
          >
            <Sparkles className="w-7 h-7 text-pink-400" />
          </motion.div>
        </motion.div>

        {/* 手書き風タイトル */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <HandWrittenTitle 
            title="Mnk-26" 
            subtitle="May this year be a good one."
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