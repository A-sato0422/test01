import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SignupQuiz from './SignupQuiz';
import { Answer } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onModeChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [tempUserId, setTempUserId] = useState('');
  const [signupData, setSignupData] = useState<{email: string, password: string, name: string} | null>(null);

  const { signIn, signUp, completeSignupQuiz } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        const { error, needsQuiz, tempUserId: newTempUserId } = await signUp(email, password, name);
        if (error) {
          setError(error.message);
        } else if (needsQuiz && newTempUserId) {
          setTempUserId(newTempUserId);
          setSignupData({ email, password, name });
          setShowQuiz(true);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          onClose();
        }
      }
    } catch (err) {
      setError('予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = async (answers: Answer[]) => {
    if (!signupData) return;
    
    setLoading(true);
    setError('');

    try {
      const { error } = await completeSignupQuiz(
        tempUserId, 
        signupData.email, 
        signupData.password, 
        signupData.name, 
        answers
      );
      
      if (error) {
        setError('アカウント作成に失敗しました: ' + error.message);
        setShowQuiz(false);
      } else {
        setShowQuiz(false);
        onClose();
        resetForm();
      }
    } catch (err) {
      setError('予期しないエラーが発生しました');
      setShowQuiz(false);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError('');
    setShowPassword(false);
    setShowQuiz(false);
    setTempUserId('');
    setSignupData(null);
  };

  const handleModeChange = (newMode: 'signin' | 'signup') => {
    resetForm();
    onModeChange(newMode);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  // 質問画面を表示
  if (showQuiz && signupData) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="w-full max-w-2xl">
          <SignupQuiz
            userName={signupData.name}
            userId={tempUserId}
            onComplete={handleQuizComplete}
            onCancel={() => {
              setShowQuiz(false);
              setError('');
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="inline-block p-4 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mb-4"
            >
              <User className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {mode === 'signup' ? 'アカウント作成' : 'ログイン'}
            </h2>
            <p className="text-gray-600">
              {mode === 'signup' 
                ? '新しいアカウントを作成して相性診断を始めましょう' 
                : 'アカウントにログインして相性診断を続けましょう'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  お名前
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="例: 田中花子"
                    required
                  />
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mode === 'signup' ? 0.3 : 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="例: hanako@example.com"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mode === 'signup' ? 0.4 : 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="パスワードを入力"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              {mode === 'signup' && (
                <p className="text-xs text-gray-500 mt-1">
                  パスワードは6文字以上で入力してください
                </p>
              )}
            </motion.div>

            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-blue-50 border border-blue-200 rounded-xl p-4"
              >
                <h4 className="font-semibold text-blue-800 mb-2">📝 アカウント作成の流れ</h4>
                <p className="text-sm text-blue-700">
                  「質問に回答」ボタンを押すと、15の質問に答える画面に移ります。
                  すべての質問に回答完了後、アカウントが正式に作成されます。
                </p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-3"
              >
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mode === 'signup' ? 0.6 : 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  処理中...
                </div>
              ) : (
                mode === 'signup' ? '質問に回答' : 'ログイン'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {mode === 'signup' ? 'すでにアカウントをお持ちですか？' : 'アカウントをお持ちでない方は'}
              <button
                onClick={() => handleModeChange(mode === 'signup' ? 'signin' : 'signup')}
                className="ml-1 text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                {mode === 'signup' ? 'ログイン' : 'アカウント作成'}
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;