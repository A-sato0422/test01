import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  message?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  message = "この機能を利用するにはログインが必要です" 
}) => {
  const { user, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-md w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block p-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mb-6"
            >
              <Lock className="w-8 h-8 text-white" />
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ログインが必要です
            </h2>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {message}
            </p>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setAuthMode('signin');
                  setAuthModalOpen(true);
                }}
                className="w-full bg-gradient-to-r from-purple-400 to-pink-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                ログイン
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setAuthMode('signup');
                  setAuthModalOpen(true);
                }}
                className="w-full bg-white border-2 border-purple-400 text-purple-600 font-semibold py-4 px-6 rounded-xl hover:bg-purple-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                新規登録
              </motion.button>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <h4 className="font-semibold text-gray-800 mb-2">アカウント作成の特典</h4>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li>• 診断結果の保存・履歴確認</li>
                <li>• 複数の相手との相性比較</li>
                <li>• 詳細な分析レポート</li>
                <li>• パーソナライズされた提案</li>
              </ul>
            </div>
          </motion.div>
        </div>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          mode={authMode}
          onModeChange={setAuthMode}
        />
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;