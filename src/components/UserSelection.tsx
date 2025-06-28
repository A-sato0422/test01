import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Check, Search, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import { questions } from '../data/questions';

interface UserSelectionProps {
  onUsersSelected: (user1: User, user2: User) => void;
  currentUser: User;
}

interface UserWithAnswerStatus extends User {
  hasAnswers: boolean;
  answerCount: number;
}

const UserSelection: React.FC<UserSelectionProps> = ({ onUsersSelected, currentUser }) => {
  const [users, setUsers] = useState<UserWithAnswerStatus[]>([]);
  const [selectedUser1, setSelectedUser1] = useState<UserWithAnswerStatus | null>(null);
  const [selectedUser2, setSelectedUser2] = useState<UserWithAnswerStatus | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');

    try {
      // ユーザー一覧を取得
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) {
        setError('ユーザー一覧の取得に失敗しました');
        return;
      }

      // 各ユーザーの回答状況を取得
      const usersWithAnswerStatus = await Promise.all(
        (usersData || []).map(async (user) => {
          const { data: answers } = await supabase
            .from('answers')
            .select('id')
            .eq('user_id', user.id);

          return {
            ...user,
            hasAnswers: (answers?.length || 0) === questions.length,
            answerCount: answers?.length || 0
          };
        })
      );

      setUsers(usersWithAnswerStatus);
    } catch (err) {
      setError('予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = (user: UserWithAnswerStatus, position: 1 | 2) => {
    if (position === 1) {
      setSelectedUser1(user);
      // 同じユーザーが選択されている場合、2人目をクリア
      if (selectedUser2?.id === user.id) {
        setSelectedUser2(null);
      }
    } else {
      setSelectedUser2(user);
      // 同じユーザーが選択されている場合、1人目をクリア
      if (selectedUser1?.id === user.id) {
        setSelectedUser1(null);
      }
    }
  };

  const handleStartDiagnosis = () => {
    if (selectedUser1 && selectedUser2) {
      onUsersSelected(selectedUser1, selectedUser2);
    }
  };

  const isUserSelected = (user: UserWithAnswerStatus) => {
    return selectedUser1?.id === user.id || selectedUser2?.id === user.id;
  };

  const getSelectionLabel = (user: UserWithAnswerStatus) => {
    if (selectedUser1?.id === user.id) return '1人目';
    if (selectedUser2?.id === user.id) return '2人目';
    return null;
  };

  const getAnswerStatusIcon = (user: UserWithAnswerStatus) => {
    if (user.hasAnswers) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (user.answerCount > 0) {
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getAnswerStatusText = (user: UserWithAnswerStatus) => {
    if (user.hasAnswers) {
      return '回答済み';
    } else if (user.answerCount > 0) {
      return `${user.answerCount}/${questions.length}問回答済み`;
    } else {
      return '未回答';
    }
  };

  const getDiagnosisButtonText = () => {
    if (!selectedUser1 || !selectedUser2) {
      return '2人のユーザーを選択してください';
    }

    const bothHaveAnswers = selectedUser1.hasAnswers && selectedUser2.hasAnswers;
    if (bothHaveAnswers) {
      return `${selectedUser1.name} と ${selectedUser2.name} の相性診断結果を表示`;
    } else {
      return `${selectedUser1.name} と ${selectedUser2.name} の相性診断を開始`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block p-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mb-4"
          >
            <Users className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ユーザー選択
          </h1>
          <p className="text-gray-600 mb-4">
            相性診断を行う2人のユーザーを選択してください
          </p>
        </motion.div>

        {/* 選択状況表示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">選択状況</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
              <div className="w-3 h-3 bg-pink-400 rounded-full mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">1人目</p>
                <p className="text-gray-800">
                  {selectedUser1 ? selectedUser1.name : '未選択'}
                </p>
                {selectedUser1 && (
                  <div className="flex items-center mt-1">
                    {getAnswerStatusIcon(selectedUser1)}
                    <span className="text-xs text-gray-500 ml-1">
                      {getAnswerStatusText(selectedUser1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">2人目</p>
                <p className="text-gray-800">
                  {selectedUser2 ? selectedUser2.name : '未選択'}
                </p>
                {selectedUser2 && (
                  <div className="flex items-center mt-1">
                    {getAnswerStatusIcon(selectedUser2)}
                    <span className="text-xs text-gray-500 ml-1">
                      {getAnswerStatusText(selectedUser2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 検索バー */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="名前またはメールアドレスで検索..."
            />
            <button
              onClick={fetchUsers}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </motion.div>

        {/* ユーザー一覧 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              登録ユーザー覧 ({filteredUsers.length}人)
            </h3>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                回答済み
              </div>
              <div className="flex items-center">
                <AlertCircle className="w-3 h-3 text-yellow-500 mr-1" />
                部分回答
              </div>
              <div className="flex items-center">
                <AlertCircle className="w-3 h-3 text-gray-400 mr-1" />
                未回答
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">読み込み中...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchUsers}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                再試行
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {searchTerm ? '検索条件に一致するユーザーが見つかりません' : 'ユーザーが登録されていません'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {filteredUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      isUserSelected(user)
                        ? selectedUser1?.id === user.id
                          ? 'border-pink-400 bg-pink-50'
                          : 'border-blue-400 bg-blue-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    {isUserSelected(user) && (
                      <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        selectedUser1?.id === user.id ? 'bg-pink-400' : 'bg-blue-400'
                      }`}>
                        <Check className="w-4 h-4" />
                      </div>
                    )}

                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-800">{user.name}</h4>
                        {getAnswerStatusIcon(user)}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        登録日: {new Date(user.created_at).toLocaleDateString('ja-JP')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getAnswerStatusText(user)}
                      </p>
                    </div>

                    {getSelectionLabel(user) && (
                      <div className={`text-xs font-medium mb-2 ${
                        selectedUser1?.id === user.id ? 'text-pink-600' : 'text-blue-600'
                      }`}>
                        {getSelectionLabel(user)}として選択中
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUserSelect(user, 1)}
                        disabled={selectedUser2?.id === user.id}
                        className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-colors ${
                          selectedUser1?.id === user.id
                            ? 'bg-pink-400 text-white'
                            : selectedUser2?.id === user.id
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                        }`}
                      >
                        1人目に選択
                      </button>
                      <button
                        onClick={() => handleUserSelect(user, 2)}
                        disabled={selectedUser1?.id === user.id}
                        className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-colors ${
                          selectedUser2?.id === user.id
                            ? 'bg-blue-400 text-white'
                            : selectedUser1?.id === user.id
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}
                      >
                        2人目に選択
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* 診断開始ボタン */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center"
        >
          <button
            onClick={handleStartDiagnosis}
            disabled={!selectedUser1 || !selectedUser2}
            className={`px-8 py-4 font-semibold rounded-2xl shadow-lg transition-all duration-300 ${
              selectedUser1 && selectedUser2
                ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white hover:shadow-xl hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {getDiagnosisButtonText()}
          </button>
          
          {selectedUser1 && selectedUser2 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-700">
                {selectedUser1.hasAnswers && selectedUser2.hasAnswers
                  ? '💡 両方のユーザーが回答済みのため、すぐに結果を表示します'
                  : selectedUser1.hasAnswers || selectedUser2.hasAnswers
                  ? '📝 一方のユーザーが未回答のため、質問に答えてから結果を表示します'
                  : '📝 両方のユーザーが未回答のため、順番に質問に答えてから結果を表示します'
                }
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserSelection;