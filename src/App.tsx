import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import StartScreen from './components/StartScreen';
import UserSelection from './components/UserSelection';
import QuestionCard from './components/QuestionCard';
import CompatibilityResult from './components/CompatibilityResult';
import SplashScreen from './components/SplashScreen';
import { calculateCompatibility } from './utils/compatibility';
import { User, Question, Answer } from './types';
import { supabase } from './lib/supabase';

type AppState = 'splash' | 'start' | 'userSelection' | 'quiz1' | 'quiz2' | 'result';

function AppContent() {
  const [state, setState] = useState<AppState>('splash');
  const [selectedUser1, setSelectedUser1] = useState<User | null>(null);
  const [selectedUser2, setSelectedUser2] = useState<User | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [user1Answers, setUser1Answers] = useState<Answer[]>([]);
  const [user2Answers, setUser2Answers] = useState<Answer[]>([]);
  const [compatibilityScore, setCompatibilityScore] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);

  // 質問データを取得
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .order('id');

        if (error) {
          console.error('Error fetching questions:', error);
        } else if (data) {
          setQuestions(data);
        }
      } catch (err) {
        console.error('Unexpected error fetching questions:', err);
      } finally {
        setQuestionsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // ページ最上部にスクロールする関数
  const scrollToTop = () => {
    // 複数の方法でスクロールを確実に実行
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // 追加の確実性のため、少し遅延してもう一度実行
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);
  };

  const handleSplashComplete = () => {
    setState('start');
  };

  const handleStart = () => {
    setState('userSelection');
  };

  const handleHomeClick = () => {
    setState('start');
    setSelectedUser1(null);
    setSelectedUser2(null);
    setCurrentQuestionIndex(0);
    setUser1Answers([]);
    setUser2Answers([]);
    setCompatibilityScore(0);
  };

  // 特別なユーザー組み合わせをチェックする関数
  const isSpecialUserCombination = (user1: User, user2: User): boolean => {
    const specialNames = ['畑中美菜子', '阿知良憲'];
    return (
      (user1.name === specialNames[0] && user2.name === specialNames[1]) ||
      (user1.name === specialNames[1] && user2.name === specialNames[0])
    );
  };

  const handleUsersSelected = async (user1: User, user2: User) => {
    setSelectedUser1(user1);
    setSelectedUser2(user2);
    
    // 特別なユーザー組み合わせの場合は直接結果画面へ
    if (isSpecialUserCombination(user1, user2)) {
      setCompatibilityScore(100);
      
      // 結果画面に遷移する前にスクロールを最上部に移動
      scrollToTop();
      
      // 少し遅延してから画面遷移（スクロールが完了してから）
      setTimeout(() => {
        setState('result');
      }, 200);
      return;
    }
    
    // 既存の回答データを取得
    const [user1AnswersData, user2AnswersData] = await Promise.all([
      supabase.from('answers').select('*').eq('user_id', user1.id).order('question_id'),
      supabase.from('answers').select('*').eq('user_id', user2.id).order('question_id')
    ]);

    const user1ExistingAnswers = user1AnswersData.data || [];
    const user2ExistingAnswers = user2AnswersData.data || [];

    // 両方のユーザーが全ての質問に回答済みかチェック
    const hasAllAnswers1 = user1ExistingAnswers.length === questions.length;
    const hasAllAnswers2 = user2ExistingAnswers.length === questions.length;

    if (hasAllAnswers1 && hasAllAnswers2) {
      // 両方とも回答済み - 直接結果を計算
      setUser1Answers(user1ExistingAnswers);
      setUser2Answers(user2ExistingAnswers);
      
      const score = calculateCompatibility(user1ExistingAnswers, user2ExistingAnswers);
      setCompatibilityScore(score);

      // 相性結果をデータベースに保存
      await supabase
        .from('compatibility_results')
        .upsert([{
          user1_id: user1.id,
          user2_id: user2.id,
          compatibility_score: score
        }], { onConflict: 'user1_id,user2_id' });

      // 結果画面に遷移する前にスクロールを最上部に移動
      scrollToTop();
      
      // 少し遅延してから画面遷移（スクロールが完了してから）
      setTimeout(() => {
        setState('result');
      }, 200);
    } else if (hasAllAnswers1 && !hasAllAnswers2) {
      // ユーザー1は回答済み、ユーザー2は未回答
      setUser1Answers(user1ExistingAnswers);
      setUser2Answers([]);
      setCurrentQuestionIndex(0);
      setState('quiz2');
    } else if (!hasAllAnswers1 && hasAllAnswers2) {
      // ユーザー1は未回答、ユーザー2は回答済み
      setUser1Answers([]);
      setUser2Answers(user2ExistingAnswers);
      setCurrentQuestionIndex(0);
      setState('quiz1');
    } else {
      // 両方とも未回答または部分的に回答済み
      setUser1Answers(user1ExistingAnswers);
      setUser2Answers(user2ExistingAnswers);
      setCurrentQuestionIndex(user1ExistingAnswers.length);
      setState('quiz1');
    }
  };

  const handleUser1Answer = async (value: number) => {
    if (!selectedUser1) return;

    const answer: Answer = {
      id: currentQuestionIndex + 1,
      user_id: selectedUser1.id,
      question_id: currentQuestionIndex + 1,
      answer_value: value,
      created_at: new Date().toISOString()
    };

    // データベースに回答を保存
    await supabase
      .from('answers')
      .upsert([{
        user_id: selectedUser1.id,
        question_id: currentQuestionIndex + 1,
        answer_value: value
      }]);

    const newAnswers = [...user1Answers, answer];
    setUser1Answers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // ユーザー2の回答状況をチェック
      const { data: user2ExistingAnswers } = await supabase
        .from('answers')
        .select('*')
        .eq('user_id', selectedUser2!.id)
        .order('question_id');

      if (user2ExistingAnswers && user2ExistingAnswers.length === questions.length) {
        // ユーザー2も回答済み - 直接結果を計算
        setUser2Answers(user2ExistingAnswers);
        const score = calculateCompatibility(newAnswers, user2ExistingAnswers);
        setCompatibilityScore(score);

        // 相性結果をデータベースに保存
        await supabase
          .from('compatibility_results')
          .upsert([{
            user1_id: selectedUser1.id,
            user2_id: selectedUser2!.id,
            compatibility_score: score
          }], { onConflict: 'user1_id,user2_id' });

        // 結果画面に遷移する前にスクロールを最上部に移動
        scrollToTop();
        
        // 少し遅延してから画面遷移（スクロールが完了してから）
        setTimeout(() => {
          setState('result');
        }, 200);
      } else {
        // ユーザー2の質問に進む
        setCurrentQuestionIndex(user2ExistingAnswers?.length || 0);
        setState('quiz2');
      }
    }
  };

  const handleUser2Answer = async (value: number) => {
    if (!selectedUser2) return;

    const answer: Answer = {
      id: currentQuestionIndex + 1,
      user_id: selectedUser2.id,
      question_id: currentQuestionIndex + 1,
      answer_value: value,
      created_at: new Date().toISOString()
    };

    // データベースに回答を保存
    await supabase
      .from('answers')
      .upsert([{
        user_id: selectedUser2.id,
        question_id: currentQuestionIndex + 1,
        answer_value: value
      }]);

    const newAnswers = [...user2Answers, answer];
    setUser2Answers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 相性スコアを計算
      const score = calculateCompatibility(user1Answers, newAnswers);
      setCompatibilityScore(score);

      // 相性結果をデータベースに保存
      if (selectedUser1 && selectedUser2) {
        await supabase
          .from('compatibility_results')
          .upsert([{
            user1_id: selectedUser1.id,
            user2_id: selectedUser2.id,
            compatibility_score: score
          }], { onConflict: 'user1_id,user2_id' });
      }

      // 結果画面に遷移する前にスクロールを最上部に移動
      scrollToTop();
      
      // 少し遅延してから画面遷移（スクロールが完了してから）
      setTimeout(() => {
        setState('result');
      }, 200);
    }
  };

  const handleRestart = () => {
    // ユーザー選択画面に遷移（トップ画面ではなく）
    setState('userSelection');
    // 選択されたユーザーは保持し、回答データのみリセット
    setCurrentQuestionIndex(0);
    setUser1Answers([]);
    setUser2Answers([]);
    setCompatibilityScore(0);
  };

  // 結果画面が表示された時にもスクロールを確実に実行
  useEffect(() => {
    if (state === 'result') {
      // 画面遷移後に再度スクロールを実行
      setTimeout(() => {
        scrollToTop();
      }, 100);
    }
  }, [state]);

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {state === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SplashScreen onComplete={handleSplashComplete} />
          </motion.div>
        )}

        {state !== 'splash' && (
          <>
            <Header onHomeClick={handleHomeClick} />
            <div className="pt-3">
              {state === 'start' && (
                <motion.div
                  key="start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ProtectedRoute message="">
                    <StartScreen onStart={handleStart} />
                  </ProtectedRoute>
                </motion.div>
              )}

              {state === 'userSelection' && (
                <motion.div
                  key="userSelection"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <ProtectedRoute>
                    <UserSelection
                      onUsersSelected={handleUsersSelected}
                      currentUser={selectedUser1!}
                    />
                  </ProtectedRoute>
                </motion.div>
              )}

              {state === 'quiz1' && (
                <motion.div
                  key="quiz1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <ProtectedRoute>
                    {questionsLoading ? (
                      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-50 to-purple-100 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                          <p className="text-gray-600">質問を読み込み中...</p>
                        </div>
                      </div>
                    ) : questions.length > 0 ? (
                      <QuestionCard
                        question={questions[currentQuestionIndex]}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={questions.length}
                        onAnswer={handleUser1Answer}
                        userName={selectedUser1?.name || 'ユーザー1'}
                      />
                    ) : (
                      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-50 to-purple-100 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-red-600">質問データの読み込みに失敗しました</p>
                        </div>
                      </div>
                    )}
                  </ProtectedRoute>
                </motion.div>
              )}

              {state === 'quiz2' && (
                <motion.div
                  key="quiz2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <ProtectedRoute>
                    {questionsLoading ? (
                      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-50 to-purple-100 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                          <p className="text-gray-600">質問を読み込み中...</p>
                        </div>
                      </div>
                    ) : questions.length > 0 ? (
                      <QuestionCard
                        question={questions[currentQuestionIndex]}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={questions.length}
                        onAnswer={handleUser2Answer}
                        userName={selectedUser2?.name || 'ユーザー2'}
                      />
                    ) : (
                      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-50 to-purple-100 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-red-600">質問データの読み込みに失敗しました</p>
                        </div>
                      </div>
                    )}
                  </ProtectedRoute>
                </motion.div>
              )}

              {state === 'result' && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="pt-16"
                >
                  <ProtectedRoute>
                    <CompatibilityResult
                      user1Name={selectedUser1?.name || 'ユーザー1'}
                      user2Name={selectedUser2?.name || 'ユーザー2'}
                      compatibilityScore={compatibilityScore}
                      onRestart={handleRestart}
                      isSpecialCouple={selectedUser1 && selectedUser2 ? isSpecialUserCombination(selectedUser1, selectedUser2) : false}
                    />
                  </ProtectedRoute>
                </motion.div>
              )}
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;