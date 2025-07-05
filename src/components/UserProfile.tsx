import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, LogOut, Edit2, Save, X, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onStartReAnswer?: () => void;
  onProfileUpdated?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose, onStartReAnswer, onProfileUpdated }) => {
  const { user, signOut, updateUserProfile } = useAuth();
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

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user data:', error);
        setError('ユーザーデータの取得に失敗しました');
        return;
      }

      if (data) {
        setUserData(data);
        setEditName(data.name);
      } else {
        // ユーザーデータが見つからない場合は、認証情報から作成
        console.log('ユーザーデータが見つかりません。認証情報から作成します。');
        const fallbackUserData = {
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'ユーザー',
          email: user.email || '',
          created_at: user.created_at || new Date().toISOString()
        };
        
        // usersテーブルに挿入を試行
        const { error: insertError } = await supabase
          .from('users')
          .insert([fallbackUserData]);

        if (insertError) {
          console.error('Error creating user data:', insertError);
          setError('ユーザーデータの作成に失敗しました');
        } else {
          setUserData(fallbackUserData);
          setEditName(fallbackUserData.name);
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('予期しないエラーが発生しました');
    }
  };

  const handleUpdateProfile = async () => {
    if (!user || !editName.trim()) return;

    setLoading(true);
    setError('');

    try {
      const { error } = await updateUserProfile(editName.trim());

      if (error) {
        setError('プロフィールの更新に失敗しました: ' + error.message);
      } else {
        // 成功した場合、ローカルの状態を更新
        const updatedUserData = { ...userData, name: editName.trim() };
        setUserData(updatedUserData);
        setIsEditing(false);
        setError('');
        
        // プロフィール更新完了を親コンポーネントに通知
        if (onProfileUpdated) {
          console.log('Profile updated, notifying parent component');
          onProfileUpdated();
        }
      }
    } catch (err) {
      setError('予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const handleReAnswer = () => {
    console.log('handleReAnswer called');
    if (onStartReAnswer) {
      console.log('Calling onStartReAnswer');
      onStartReAnswer();
    } else {
      console.log('onStartReAnswer is not defined');
    }
  };

  const handleClose = () => {
    // 編集中の場合は元の値に戻す
    if (isEditing && userData) {
      setEditName(userData.name);
      setIsEditing(false);
    }
    setError('');
    onClose();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName(userData?.name || '');
    setError('');
  };

  if (!isOpen || !user) return null;

  // ユーザーデータの読み込み中
  if (!userData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 z-50"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-sm mx-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">プロフィールを読み込み中...</p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 z-50"
      onClick={handleClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-auto relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90vh' }}
      >
        {/* ヘッダー部分 */}
        <div className="relative p-6 pb-4">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
            style={{ 
              width: '36px', 
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="text-center pr-12">
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
        </div>

        {/* コンテンツ部分 */}
        <div className="px-6 pb-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              お名前
            </label>
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-base"
                  placeholder="お名前を入力"
                  disabled={loading}
                  style={{ fontSize: '16px' }} // iOS Safari のズーム防止
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={loading || !editName.trim() || editName.trim() === userData.name}
                    className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        保存
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors disabled:opacity-50 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center flex-1 min-w-0">
                  <User className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-800 truncate">{userData.name}</span>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0 ml-2"
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
              <Mail className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
              <span className="text-gray-800 truncate text-sm">{userData.email}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              登録日
            </label>
            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <Calendar className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
              <span className="text-gray-800 text-sm">
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
            onClick={handleReAnswer}
            className="w-full bg-gradient-to-r from-blue-400 to-purple-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mb-4"
          >
            <MessageSquare className="w-5 h-5" />
            質問に再回答
          </motion.button>

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