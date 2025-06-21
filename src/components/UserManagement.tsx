import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Edit2, Trash2, Save, X, Search, RefreshCw, Shield, User as UserIcon, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface UserManagementProps {
  onBack: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onBack }) => {
  const { userData: currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<'user' | 'admin'>('user');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin()) {
      onBack();
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError('ユーザー一覧の取得に失敗しました');
        return;
      }

      setUsers(data || []);
    } catch (err) {
      setError('予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleEditStart = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditRole(user.role);
  };

  const handleEditCancel = () => {
    setEditingUser(null);
    setEditName('');
    setEditRole('user');
  };

  const handleEditSave = async () => {
    if (!editingUser || !editName.trim()) return;

    setActionLoading(editingUser.id);
    setError('');

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: editName.trim(),
          role: editRole
        })
        .eq('id', editingUser.id);

      if (error) {
        setError('ユーザー情報の更新に失敗しました');
        return;
      }

      // ローカル状態を更新
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, name: editName.trim(), role: editRole }
          : user
      ));

      handleEditCancel();
    } catch (err) {
      setError('予期しないエラーが発生しました');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteConfirm = (userId: string) => {
    setDeleteConfirm(userId);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUser?.id) {
      setError('自分自身を削除することはできません');
      return;
    }

    setActionLoading(userId);
    setError('');

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        setError('ユーザーの削除に失敗しました');
        return;
      }

      // ローカル状態を更新
      setUsers(users.filter(user => user.id !== userId));
      setDeleteConfirm(null);
    } catch (err) {
      setError('予期しないエラーが発生しました');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role: 'user' | 'admin') => {
    return role === 'admin' ? (
      <Shield className="w-4 h-4 text-orange-500" />
    ) : (
      <UserIcon className="w-4 h-4 text-blue-500" />
    );
  };

  const getRoleLabel = (role: 'user' | 'admin') => {
    return role === 'admin' ? '管理者' : '一般ユーザー';
  };

  if (!isAdmin()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-pink-100 p-4">
      <div className="max-w-6xl mx-auto pt-20">
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
            className="inline-block p-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mb-4"
          >
            <Users className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ユーザー管理
          </h1>
          <p className="text-gray-600 mb-4">
            登録されているユーザーの管理を行います
          </p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            戻る
          </button>
        </motion.div>

        {/* 検索バー */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6"
        >
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="名前またはメールアドレスで検索..."
              />
            </div>
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              更新
            </button>
          </div>
        </motion.div>

        {/* ユーザー一覧 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              ユーザー一覧 ({filteredUsers.length}人)
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-orange-500" />
                管理者
              </div>
              <div className="flex items-center gap-1">
                <UserIcon className="w-4 h-4 text-blue-500" />
                一般ユーザー
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">読み込み中...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {searchTerm ? '検索条件に一致するユーザーが見つかりません' : 'ユーザーが登録されていません'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">ユーザー情報</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">権限</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">登録日</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          {editingUser?.id === user.id ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="名前を入力"
                              />
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          ) : (
                            <div>
                              <p className="font-medium text-gray-800">
                                {user.name}
                                {user.id === currentUser?.id && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                    あなた
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {editingUser?.id === user.id ? (
                            <select
                              value={editRole}
                              onChange={(e) => setEditRole(e.target.value as 'user' | 'admin')}
                              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                              <option value="user">一般ユーザー</option>
                              <option value="admin">管理者</option>
                            </select>
                          ) : (
                            <div className="flex items-center gap-2">
                              {getRoleIcon(user.role)}
                              <span className="text-sm font-medium">
                                {getRoleLabel(user.role)}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-600">
                            {new Date(user.created_at).toLocaleDateString('ja-JP')}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            {editingUser?.id === user.id ? (
                              <>
                                <button
                                  onClick={handleEditSave}
                                  disabled={actionLoading === user.id || !editName.trim()}
                                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                                >
                                  {actionLoading === user.id ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Save className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={handleEditCancel}
                                  disabled={actionLoading === user.id}
                                  className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditStart(user)}
                                  disabled={actionLoading !== null}
                                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                {user.id !== currentUser?.id && (
                                  <button
                                    onClick={() => handleDeleteConfirm(user.id)}
                                    disabled={actionLoading !== null}
                                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* 削除確認モーダル */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={handleDeleteCancel}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    ユーザーを削除
                  </h3>
                  <p className="text-gray-600 mb-6">
                    このユーザーを削除してもよろしいですか？<br />
                    この操作は取り消すことができません。
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteCancel}
                      disabled={actionLoading === deleteConfirm}
                      className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors disabled:opacity-50"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={() => handleDeleteUser(deleteConfirm)}
                      disabled={actionLoading === deleteConfirm}
                      className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {actionLoading === deleteConfirm ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="w-5 h-5" />
                          削除
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserManagement;