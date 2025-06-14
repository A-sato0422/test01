import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StartScreen from './components/StartScreen';
import UserRegistration from './components/UserRegistration';
import QuestionCard from './components/QuestionCard';
import CompatibilityResult from './components/CompatibilityResult';
import { questions } from './data/questions';
import { calculateCompatibility } from './utils/compatibility';
import { User, Question, Answer } from './types';

type AppState = 'start' | 'register1' | 'register2' | 'quiz1' | 'quiz2' | 'result';

function App() {
  const [state, setState] = useState<AppState>('start');
  const [user1, setUser1] = useState<User | null>(null);
  const [user2, setUser2] = useState<User | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [user1Answers, setUser1Answers] = useState<Answer[]>([]);
  const [user2Answers, setUser2Answers] = useState<Answer[]>([]);
  const [compatibilityScore, setCompatibilityScore] = useState<number>(0);

  const handleStart = () => {
    setState('register1');
  };

  const handleUser1Registration = (userData: { name: string; email: string }) => {
    const newUser: User = {
      id: '1',
      name: userData.name,
      email: userData.email,
      created_at: new Date().toISOString()
    };
    setUser1(newUser);
    setState('register2');
  };

  const handleUser2Registration = (userData: { name: string; email: string }) => {
    const newUser: User = {
      id: '2',
      name: userData.name,
      email: userData.email,
      created_at: new Date().toISOString()
    };
    setUser2(newUser);
    setState('quiz1');
  };

  const handleUser1Answer = (value: number) => {
    const answer: Answer = {
      id: currentQuestionIndex + 1,
      user_id: '1',
      question_id: currentQuestionIndex + 1,
      answer_value: value,
      created_at: new Date().toISOString()
    };

    const newAnswers = [...user1Answers, answer];
    setUser1Answers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentQuestionIndex(0);
      setState('quiz2');
    }
  };

  const handleUser2Answer = (value: number) => {
    const answer: Answer = {
      id: currentQuestionIndex + 1,
      user_id: '2',
      question_id: currentQuestionIndex + 1,
      answer_value: value,
      created_at: new Date().toISOString()
    };

    const newAnswers = [...user2Answers, answer];
    setUser2Answers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 相性スコアを計算
      const score = calculateCompatibility(user1Answers, newAnswers);
      setCompatibilityScore(score);
      setState('result');
    }
  };

  const handleRestart = () => {
    setState('start');
    setUser1(null);
    setUser2(null);
    setCurrentQuestionIndex(0);
    setUser1Answers([]);
    setUser2Answers([]);
    setCompatibilityScore(0);
  };

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {state === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StartScreen onStart={handleStart} />
          </motion.div>
        )}

        {state === 'register1' && (
          <motion.div
            key="register1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <UserRegistration
              userNumber={1}
              onUserRegistered={handleUser1Registration}
            />
          </motion.div>
        )}

        {state === 'register2' && (
          <motion.div
            key="register2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <UserRegistration
              userNumber={2}
              onUserRegistered={handleUser2Registration}
            />
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
            <QuestionCard
              question={questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onAnswer={handleUser1Answer}
              userName={user1?.name || 'ユーザー1'}
            />
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
            <QuestionCard
              question={questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onAnswer={handleUser2Answer}
              userName={user2?.name || 'ユーザー2'}
            />
          </motion.div>
        )}

        {state === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <CompatibilityResult
              user1Name={user1?.name || 'ユーザー1'}
              user2Name={user2?.name || 'ユーザー2'}
              compatibilityScore={compatibilityScore}
              onRestart={handleRestart}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;