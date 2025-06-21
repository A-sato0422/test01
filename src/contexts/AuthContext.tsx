import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: SupabaseUser | null;
  userData: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any; needsQuiz?: boolean; tempUserId?: string }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  completeSignupQuiz: (tempUserId: string, email: string, password: string, name: string, answers: any[]) => Promise<{ error: any }>;
  updateUserProfile: (name: string) => Promise<{ error: any }>;
  refreshUser: () => Promise<void>;
  isAdmin: () => boolean;
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
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        // 10秒のタイムアウトを設定
        timeoutId = setTimeout(() => {
          if (mounted && loading) {
            console.warn('認証の初期化がタイムアウトしました。ログアウトします。');
            handleAuthTimeout();
          }
        }, 10000);

        // 現在のセッションを取得
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            await handleAuthError();
          }
          return;
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
        }

        if (session?.user && mounted) {
          await fetchUserData(session.user.id);
        } else if (mounted) {
          setLoading(false);
        }

        // タイムアウトをクリア
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        if (mounted) {
          await handleAuthError();
        }
      }
    };

    const handleAuthTimeout = async () => {
      console.log('認証タイムアウト: 自動ログアウトを実行');
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error during timeout logout:', err);
      }
      
      setSession(null);
      setUser(null);
      setUserData(null);
      setLoading(false);
    };

    const handleAuthError = async () => {
      console.log('認証エラー: 自動ログアウトを実行');
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error during error logout:', err);
      }
      
      setSession(null);
      setUser(null);
      setUserData(null);
      setLoading(false);
    };

    initializeAuth();

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (!mounted) return;

      // タイムアウトをクリア
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          await fetchUserData(session.user.id);
        } catch (err) {
          console.error('Error fetching user data on auth change:', err);
          await handleAuthError();
        }
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      console.log('Fetching user data for:', userId);
      
      // ユーザーデータ取得にもタイムアウトを設定
      const fetchPromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('ユーザーデータの取得がタイムアウトしました')), 8000);
      });

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      if (error) {
        console.error('Error fetching user data:', error);
        throw error;
      }

      if (data) {
        console.log('User data fetched successfully:', data);
        setUserData(data);
      } else {
        console.log('No user data found, creating fallback');
        // ユーザーデータが見つからない場合、認証情報から作成
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const fallbackUserData: User = {
            id: authUser.id,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'ユーザー',
            email: authUser.email || '',
            role: 'user',
            created_at: authUser.created_at || new Date().toISOString()
          };
          
          // usersテーブルに挿入を試行（タイムアウト付き）
          try {
            const insertPromise = supabase
              .from('users')
              .insert([fallbackUserData]);

            const insertTimeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('ユーザーデータの作成がタイムアウトしました')), 5000);
            });

            await Promise.race([insertPromise, insertTimeoutPromise]);
            console.log('User data created successfully');
          } catch (insertError) {
            console.error('Error creating user data:', insertError);
            // 挿入に失敗してもfallbackデータを使用
          }
          
          setUserData(fallbackUserData);
        } else {
          throw new Error('認証ユーザー情報が取得できません');
        }
      }
    } catch (err) {
      console.error('Error in fetchUserData:', err);
      
      // エラーが発生した場合、認証ユーザーの情報から基本データを作成を試行
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const fallbackUserData: User = {
            id: authUser.id,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'ユーザー',
            email: authUser.email || '',
            role: 'user',
            created_at: authUser.created_at || new Date().toISOString()
          };
          setUserData(fallbackUserData);
          console.log('Using fallback user data due to error:', fallbackUserData);
        } else {
          throw new Error('フォールバックユーザーデータの作成に失敗');
        }
      } catch (fallbackErr) {
        console.error('Fallback user data creation failed:', fallbackErr);
        // 完全に失敗した場合はログアウト
        await signOut();
        throw fallbackErr;
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
        setUser(session.user);
        await fetchUserData(session.user.id);
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
      await signOut();
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
            role: 'user', // デフォルトは一般ユーザー
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
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error during sign out:', err);
    }
    setUserData(null);
    setSession(null);
    setUser(null);
    setLoading(false);
  };

  const isAdmin = () => {
    return userData?.role === 'admin';
  };

  const value = {
    user,
    userData,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    completeSignupQuiz,
    updateUserProfile,
    refreshUser,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};