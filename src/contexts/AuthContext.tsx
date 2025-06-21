import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any; needsQuiz?: boolean; tempUserId?: string }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  completeSignupQuiz: (tempUserId: string, email: string, password: string, name: string, answers: any[]) => Promise<{ error: any }>;
  updateUserProfile: (name: string) => Promise<{ error: any }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 現在のセッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setSession(session);
      setUser(session.user);
    }
  };

  const updateUserProfile = async (name: string) => {
    if (!user) {
      return { error: new Error('ユーザーが認証されていません') };
    }

    try {
      // usersテーブルを更新
      const { error: updateError } = await supabase
        .from('users')
        .update({ name: name.trim() })
        .eq('id', user.id);

      if (updateError) {
        return { error: updateError };
      }

      // Supabase Authのuser_metadataも更新
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: { name: name.trim() }
      });

      if (authUpdateError) {
        console.warn('Auth metadata update failed:', authUpdateError);
        // usersテーブルの更新は成功しているので、エラーとしては扱わない
      }

      // ユーザー情報を再取得
      await refreshUser();

      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Supabaseの認証システムで直接サインアップを試行
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (authError) {
        return { error: authError };
      }

      if (!data.user) {
        return { error: new Error('アカウント作成に失敗しました') };
      }

      // 認証成功後、即座にusersテーブルにユーザー情報を保存
      const { error: insertUserError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            name: name,
            email: email,
          },
        ]);

      if (insertUserError) {
        console.error('Error inserting user data:', insertUserError);
        // ユーザー情報の保存に失敗した場合、認証ユーザーも削除
        await supabase.auth.admin.deleteUser(data.user.id);
        return { error: insertUserError };
      }

      // サインアップが成功した場合、クイズが必要であることを示す
      return { error: null, needsQuiz: true, tempUserId: data.user.id };
    } catch (err) {
      return { error: err };
    }
  };

  const completeSignupQuiz = async (tempUserId: string, email: string, password: string, name: string, answers: any[]) => {
    try {
      // 回答をデータベースに保存（ユーザー情報は既に保存済み）
      const answersToInsert = answers.map(answer => ({
        user_id: tempUserId,
        question_id: answer.question_id,
        answer_value: answer.answer_value
      }));

      const { error: insertAnswersError } = await supabase
        .from('answers')
        .insert(answersToInsert);

      if (insertAnswersError) {
        console.error('Error inserting answers:', insertAnswersError);
        return { error: insertAnswersError };
      }

      // サインアップ完了後、自動的にサインイン
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Error signing in after signup:', signInError);
        return { error: signInError };
      }

      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    completeSignupQuiz,
    updateUserProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};