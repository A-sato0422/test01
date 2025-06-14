import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any; needsQuiz?: boolean; userId?: string }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  completeSignupQuiz: (userId: string, answers: any[]) => Promise<{ error: any }>;
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

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (!error && data.user) {
      // ユーザー情報をusersテーブルに保存
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            name: name,
            email: email,
          },
        ]);

      if (insertError) {
        console.error('Error inserting user data:', insertError);
        return { error: insertError };
      }

      // 新規ユーザーには質問回答が必要
      return { error: null, needsQuiz: true, userId: data.user.id };
    }

    return { error };
  };

  const completeSignupQuiz = async (userId: string, answers: any[]) => {
    try {
      // 回答をデータベースに保存
      const answersToInsert = answers.map(answer => ({
        user_id: userId,
        question_id: answer.question_id,
        answer_value: answer.answer_value
      }));

      const { error } = await supabase
        .from('answers')
        .insert(answersToInsert);

      return { error };
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};