import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ArrowRight } from 'lucide-react';

interface UserRegistrationProps {
  userNumber: 1 | 2;
  onUserRegistered: (user: { name: string; email: string }) => void;
}

const UserRegistration: React.FC<UserRegistrationProps> = ({ userNumber, onUserRegistered }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      onUserRegistered({ name: name.trim(), email: email.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, x: userNumber === 1 ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-md w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block p-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-4"
          >
            <User className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {userNumber === 1 ? '1人目' : '2人目'}の情報
          </h2>
          <p className="text-gray-600">
            {userNumber === 1 ? 'あなたの' : 'お相手の'}情報を入力してください
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              お名前
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
              placeholder="例: 田中花子"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
              placeholder="例: hanako@example.com"
              required
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!name.trim() || !email.trim()}
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            次へ進む
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default UserRegistration;