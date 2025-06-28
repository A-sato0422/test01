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
      <div className="text-center max-w-7xl mx-auto px-4 relative">
        {/* タイトル周りのスパークルアニメーション */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative"
        >
          {/* 上部の星 */}
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
            className="absolute top-8 left-1/2 transform -translate-x-1/2 -translate-x-20"
          >
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </motion.div>
          
          <motion.div
            animate={{ 
              rotate: [0, -15, 15, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1.2
            }}
            className="absolute top-12 left-1/2 transform -translate-x-1/2 translate-x-24"
          >
            <Sparkles className="w-6 h-6 text-purple-400" />
          </motion.div>

          {/* 左側の星 */}
          <motion.div
            animate={{ 
              rotate: [0, 12, -12, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ 
              duration: 2.8,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1.5
            }}
            className="absolute top-1/2 left-8 transform -translate-y-1/2 -translate-y-8"
          >
            <Sparkles className="w-7 h-7 text-pink-400" />
          </motion.div>

          <motion.div
            animate={{ 
              rotate: [0, -8, 8, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2.2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1.8
            }}
            className="absolute top-1/2 left-16 transform -translate-y-1/2 translate-y-12"
          >
            <Sparkles className="w-5 h-5 text-blue-400" />
          </motion.div>

          {/* 右側の星 */}
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2.6,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2
            }}
            className="absolute top-1/2 right-8 transform -translate-y-1/2 -translate-y-6"
          >
            <Sparkles className="w-6 h-6 text-green-400" />
          </motion.div>

          <motion.div
            animate={{ 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2.4,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2.2
            }}
            className="absolute top-1/2 right-16 transform -translate-y-1/2 translate-y-10"
          >
            <Sparkles className="w-7 h-7 text-orange-400" />
          </motion.div>

          {/* 下部の星 */}
          <motion.div
            animate={{ 
              rotate: [0, -12, 12, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ 
              duration: 2.7,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2.5
            }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 -translate-x-16"
          >
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </motion.div>

          <motion.div
            animate={{ 
              rotate: [0, 8, -8, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2.3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2.8
            }}
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2 translate-x-20"
          >
            <Sparkles className="w-5 h-5 text-teal-400" />
          </motion.div>
        </motion.div>

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