import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: 'user' | 'admin'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          role?: 'user' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'user' | 'admin'
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: number
          question_text: string
          category: string
          created_at: string
        }
        Insert: {
          id?: number
          question_text: string
          category: string
          created_at?: string
        }
        Update: {
          id?: number
          question_text?: string
          category?: string
          created_at?: string
        }
      }
      answers: {
        Row: {
          id: number
          user_id: string
          question_id: number
          answer_value: number
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          question_id: number
          answer_value: number
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          question_id?: number
          answer_value?: number
          created_at?: string
        }
      }
      compatibility_results: {
        Row: {
          id: number
          user1_id: string
          user2_id: string
          compatibility_score: number
          created_at: string
        }
        Insert: {
          id?: number
          user1_id: string
          user2_id: string
          compatibility_score: number
          created_at?: string
        }
        Update: {
          id?: number
          user1_id?: string
          user2_id?: string
          compatibility_score?: number
          created_at?: string
        }
      }
    }
  }
}