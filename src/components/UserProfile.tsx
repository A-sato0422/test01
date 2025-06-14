import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, LogOut, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user, signOut } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && isOpen) {
      fetchUserData();
    }
  }, [user, isOpen]);

  const fetchUserData = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      setError('ユーザーデータの取得に失敗しました');
      return;
    }

    if (data) {
      setUserData(data);
      setEditName(data.name);
    } else {
      // ユーザーデータが見つからない場合はログアウトして認証画面に遷移
      console.log('ユーザーデータが見つかりません。ログアウトします。');
      await signOut();
      onClose();
    }
  };

  const handleUpdateProfile = async () => {
    if (!user || !editName.trim()) return;

    setLoading(true);
    setError('');

    const { error } = await supabase
      .from('users')
      .update({ name: editName.trim() })
      .eq('id', user.id);

    if (error) {
      setError('プロフィールの更新に失敗しました');
    } else {
      setUserData({ ...userData, name: editName.trim() });
      setIsEditing(false);
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  if (!isOpen || !user || !userData) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
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
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="inline-block p-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mb-4"
          >
            <User className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            プロフィール
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              お名前
            </label>
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="お名前を入力"
                />
                <button
                  onClick={handleUpdateProfile}
                  disabled={loading || !editName.trim()}
                  className="px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditName(userData.name);
                    setError('');
                  }}
                  className="px-4 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-800">{userData.name}</span>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス
            </label>
            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <span className="text-gray-800">{userData.email}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              登録日
            </label>
            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <Calendar className="w-5 h-5 text-gray-400 mr-3" />
              <span className="text-gray-800">
                {new Date(userData.created_at).toLocaleDateString('ja-JP')}
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSignOut}
            className="w-full bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            ログアウト
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserProfile;