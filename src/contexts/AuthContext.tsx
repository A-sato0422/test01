import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any; needsQuiz?: boolean; tempData?: any; userExists?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  completeSignupQuiz: (tempData: any, answers: any[]) => Promise<{ error: any }>;
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
      
      // セッションが無効化された場合の処理
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        console.log('Auth state changed:', event);
      }
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
      // まず、メールアドレスが既に登録されているかチェック
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email.trim())
        .single();

      if (existingUser) {
        return { 
          error: null, 
          userExists: true 
        };
      }

      // checkErrorがあっても、それが「データが見つからない」エラーなら問題なし
      if (checkError && checkError.code !== 'PGRST116') {
        return { error: checkError };
      }

      // アカウント情報を一時保存（実際のアカウント作成は行わない）
      const tempData = {
        email: email.trim(),
        password: password,
        name: name.trim(),
        timestamp: new Date().toISOString()
      };

      // 質問回答が必要であることを示す
      return { error: null, needsQuiz: true, tempData };
    } catch (err) {
      return { error: err };
    }
  };

  const completeSignupQuiz = async (tempData: any, answers: any[]) => {
    try {
      // 質問回答完了後にアカウントを作成
      const { data, error: authError } = await supabase.auth.signUp({
        email: tempData.email,
        password: tempData.password,
        options: {
          data: {
            name: tempData.name,
          },
        },
      });

      if (authError) {
        return { error: authError };
      }

      if (!data.user) {
        return { error: new Error('アカウント作成に失敗しました') };
      }

      // usersテーブルにユーザー情報を保存
      const { error: insertUserError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            name: tempData.name,
            email: tempData.email,
          },
        ]);

      if (insertUserError) {
        console.error('Error inserting user data:', insertUserError);
        // ユーザー情報の保存に失敗した場合、認証ユーザーも削除
        await supabase.auth.admin.deleteUser(data.user.id);
        return { error: insertUserError };
      }

      // 回答をデータベースに保存
      const answersToInsert = answers.map(answer => ({
        user_id: data.user.id,
        question_id: answer.question_id,
        answer_value: answer.answer_value
      }));

      const { error: insertAnswersError } = await supabase
        .from('answers')
        .insert(answersToInsert);

      if (insertAnswersError) {
        console.error('Error inserting answers:', insertAnswersError);
        // 回答の保存に失敗した場合、作成したアカウントを削除
        await supabase.auth.admin.deleteUser(data.user.id);
        await supabase.from('users').delete().eq('id', data.user.id);
        return { error: insertAnswersError };
      }

      // アカウント作成完了後、自動的にサインイン
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: tempData.email,
        password: tempData.password,
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
    try {
      // ローカルセッションを先にクリア
      setSession(null);
      setUser(null);
      
      // Supabaseからのログアウトを試行
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // セッション関連のエラーは無視（既にログアウト済みの状態）
        if (error.message?.includes('session_not_found') || 
            error.message?.includes('Session from session_id claim in JWT does not exist') ||
            error.message?.includes('Invalid session') ||
            error.message?.includes('Auth session missing!') ||
            error.status === 403) {
          console.log('Session already invalidated or expired, user effectively logged out');
          return;
        }
        
        // その他のエラーは再スローするが、ローカル状態は既にクリア済み
        console.error('Logout error (but local state cleared):', error);
        return;
      }
      
      console.log('Successfully logged out');
    } catch (error: any) {
      // 予期しないエラーもローカル状態はクリア済みなので、ログのみ出力
      console.error('Unexpected logout error (but local state cleared):', error);
    }
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