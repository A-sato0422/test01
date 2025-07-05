import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ArrowLeft, X, Loader2, Check } from 'lucide-react';
import { answerLabels } from '../data/questions';
import { Answer } from '../types';
import { supabase } from '../lib/supabase';

interface SignupQuizProps {
  userName: string;
  onComplete: (answers: Answer[]) => void;
  onCancel: () => void;
}

const SignupQuiz: React.FC<SignupQuizProps> = ({ userName, onComplete, onCancel }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAnswer, setSubmittedAnswer] = useState<number | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  // 質問データを取得
  React.useEffect(() => {
    const fetchQuestions = async () => {
      console.log('[SignupQuiz] Starting to fetch questions...');
      setQuestionsLoading(true);
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .order('id');

        console.log('[SignupQuiz] Supabase response:', { data, error });
        if (error) {
          console.log('[SignupQuiz] Error fetching questions from database:', error);
          // エラーの場合はローカルデータにフォールバック
          const { questions: localQuestions } = await import('../data/questions');
          console.log('[SignupQuiz] Using local questions as fallback:', localQuestions);
          setQuestions(localQuestions);
        } else if (data && data.length > 0) {
          console.log('[SignupQuiz] Successfully fetched questions from database:', data);
          setQuestions(data);
        } else {
          console.log('[SignupQuiz] No questions found in database, using local fallback');
          // データが空の場合もローカルデータにフォールバック
          const { questions: localQuestions } = await import('../data/questions');
          console.log('[SignupQuiz] Using local questions as fallback:', localQuestions);
          setQuestions(localQuestions);
        }
      } catch (err) {
        console.log('[SignupQuiz] Unexpected error fetching questions:', err);
        // 予期しないエラーの場合もローカルデータにフォールバック
        try {
          const { questions: localQuestions } = await import('../data/questions');
          console.log('[SignupQuiz] Using local questions as fallback after error:', localQuestions);
          setQuestions(localQuestions);
        } catch (importErr) {
          console.log('[SignupQuiz] Failed to import local questions:', importErr);
          // 最後の手段として、ハードコードされた質問を使用
          const hardcodedQuestions = [
            { id: 1, question_text: '休日はどう過ごしたいですか？', category: 'lifestyle', created_at: new Date().toISOString() },
            { id: 2, question_text: '理想的なデートスポットは？', category: 'romance', created_at: new Date().toISOString() },
            { id: 3, question_text: '将来の目標について話し合うことは重要ですか？', category: 'values', created_at: new Date().toISOString() },
            { id: 4, question_text: 'お互いの趣味を尊重し合うことは大切ですか？', category: 'lifestyle', created_at: new Date().toISOString() },
            { id: 5, question_text: 'コミュニケーションの頻度について、どう思いますか？', category: 'communication', created_at: new Date().toISOString() }
          ];
          console.log('[SignupQuiz] Using hardcoded questions as final fallback:', hardcodedQuestions);
          setQuestions(hardcodedQuestions);
        }
      } finally {
        console.log('[SignupQuiz] Questions loading completed');
        setQuestionsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = async (value: number) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmittedAnswer(value);

    try {
      // 少し遅延を入れてローディング状態を見せる
      await new Promise(resolve => setTimeout(resolve, 600));

      const answer: Answer = {
        id: currentQuestionIndex + 1,
        user_id: '', // 一時的に空文字、実際のユーザーIDは後で設定
        question_id: currentQuestionIndex + 1,
        answer_value: value,
        created_at: new Date().toISOString()
      };

      const newAnswers = [...answers, answer];
      setAnswers(newAnswers);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsSubmitting(false);
        setSubmittedAnswer(null);
      } else {
        // 最後の質問の場合、アカウント作成処理を開始
        setIsCompleting(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        onComplete(newAnswers);
      }
    } catch (error) {
      console.error('回答の保存に失敗しました:', error);
      setIsSubmitting(false);
      setSubmittedAnswer(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0 && !isSubmitting) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setAnswers(answers.slice(0, -1));
      setSubmittedAnswer(null);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // 質問データの読み込み中
  if (questionsLoading) {
    return (
      <div className="max-h-screen overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl max-w-md w-full mx-auto relative my-4"
        >
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">質問を読み込み中...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // 質問データが空の場合
  if (questions.length === 0) {
    return (
      <div className="max-h-screen overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl max-w-md w-full mx-auto relative my-4"
        >
          <div className="text-center">
            <p className="text-red-600 mb-4">質問データの読み込みに失敗しました</p>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              戻る
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-h-screen overflow-y-auto">
      {/* アカウント作成中のオーバーレイ */}
      {isCompleting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center max-w-sm mx-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full mb-4"
            />
            <h3 className="text-lg font-bold text-gray-800 mb-2">アカウントを作成中</h3>
            <p className="text-sm text-gray-600 text-center mb-4">
              回答内容を保存してアカウントを作成しています...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl max-w-md w-full mx-auto relative my-4 ${
          isSubmitting || isCompleting ? 'pointer-events-none' : ''
        }`}
      >
        {/* 保存中のプログレスバー */}
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t-3xl overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-blue-500"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
          </motion.div>
        )}

        {/* キャンセルボタン */}
        <button
          onClick={onCancel}
          disabled={isSubmitting || isCompleting}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* ヘッダー */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block p-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-3"
          >
            <User className="w-6 h-6 text-white" />
          </motion.div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            プロフィール設定
          </h2>
          <p className="text-sm text-gray-600">
            {userName}さん、質問に答えてアカウントを作成しましょう
          </p>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-xs text-blue-700">
              ⚠️ 質問回答完了後にアカウントが作成されます
            </p>
          </div>
        </div>

        {/* プログレスバー */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              質問 {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* 質問 */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-6"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-3 leading-relaxed">
            {currentQuestion.question_text}
          </h3>
          <p className="text-sm text-gray-600">
            あなたの気持ちに最も近いものを選んでください
          </p>
        </motion.div>

        {/* 回答選択肢 */}
        <div className="space-y-2 mb-6">
          {answerLabels.map((label, index) => {
            const isSelected = submittedAnswer === index + 1;
            const isDisabled = isSubmitting || isCompleting;
            
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={!isDisabled ? { scale: 1.02 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
                onClick={() => handleAnswer(index + 1)}
                disabled={isDisabled}
                className={`w-full p-3 rounded-xl border-2 transition-all duration-200 text-left relative ${
                  isSelected
                    ? 'border-green-400 bg-green-50 shadow-lg'
                    : isDisabled
                    ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                    : index === 0 ? 'border-red-200 hover:border-red-300 hover:bg-red-50' :
                      index === 1 ? 'border-orange-200 hover:border-orange-300 hover:bg-orange-50' :
                      index === 2 ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50' :
                      index === 3 ? 'border-blue-200 hover:border-blue-300 hover:bg-blue-50' :
                      'border-green-200 hover:border-green-300 hover:bg-green-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    isSelected
                      ? 'border-green-400 bg-green-400'
                      : index === 0 ? 'border-red-300' :
                        index === 1 ? 'border-orange-300' :
                        index === 2 ? 'border-gray-300' :
                        index === 3 ? 'border-blue-300' :
                        'border-green-300'
                  }`}>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </div>
                  <span className={`font-medium text-gray-700 text-sm ${
                    isSelected ? 'text-green-700' : ''
                  }`}>
                    {label}
                  </span>
                </div>

                {/* 送信中のローディングインジケーター */}
                {isSelected && isSubmitting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <Loader2 className="w-4 h-4 text-green-500 animate-spin" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* 保存中のステータスメッセージ */}
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl"
          >
            <div className="flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-green-500 animate-spin mr-2" />
              <span className="text-sm font-medium text-green-700">
                {isLastQuestion ? 'アカウントを作成中...' : '回答を保存中...'}
              </span>
            </div>
            <p className="text-xs text-green-600 text-center mt-1">
              {isLastQuestion 
                ? 'しばらくお待ちください' 
                : '次の質問に進むまでお待ちください'
              }
            </p>
          </motion.div>
        )}

        {/* ナビゲーションボタン */}
        <div className="flex gap-2">
          {currentQuestionIndex > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handlePrevious}
              disabled={isSubmitting || isCompleting}
              className="flex-1 bg-gray-100 text-gray-600 font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              前の質問
            </motion.button>
          )}
          
          <button
            onClick={onCancel}
            disabled={isSubmitting || isCompleting}
            className="flex-1 bg-red-100 text-red-600 font-semibold py-3 px-4 rounded-xl hover:bg-red-200 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            キャンセル
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupQuiz;