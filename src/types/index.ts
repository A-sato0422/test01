export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  created_at: string
}

export interface Question {
  id: number
  question_text: string
  category: string
  created_at: string
}

export interface Answer {
  id: number
  user_id: string
  question_id: number
  answer_value: number
  created_at: string
}

export interface CompatibilityResult {
  id: number
  user1_id: string
  user2_id: string
  compatibility_score: number
  created_at: string
}

export interface QuizData {
  user1: User
  user2: User
  questions: Question[]
  user1Answers: Answer[]
  user2Answers: Answer[]
  compatibilityScore?: number
}