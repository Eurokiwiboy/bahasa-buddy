// src/integrations/supabase/types.ts
// Complete database types for Bahasa Buddy

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          native_language: string
          learning_level: 'beginner' | 'elementary' | 'intermediate' | 'upper_intermediate' | 'advanced'
          xp_total: number
          xp_today: number
          current_streak: number
          longest_streak: number
          last_practice_date: string | null
          timezone: string
          notifications_enabled: boolean
          sound_enabled: boolean
          dark_mode: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          native_language?: string
          learning_level?: 'beginner' | 'elementary' | 'intermediate' | 'upper_intermediate' | 'advanced'
          xp_total?: number
          xp_today?: number
          current_streak?: number
          longest_streak?: number
          last_practice_date?: string | null
          timezone?: string
          notifications_enabled?: boolean
          sound_enabled?: boolean
          dark_mode?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          native_language?: string
          learning_level?: 'beginner' | 'elementary' | 'intermediate' | 'upper_intermediate' | 'advanced'
          xp_total?: number
          xp_today?: number
          current_streak?: number
          longest_streak?: number
          last_practice_date?: string | null
          timezone?: string
          notifications_enabled?: boolean
          sound_enabled?: boolean
          dark_mode?: boolean
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          color: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          color?: string
          order_index?: number
          created_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          icon?: string | null
          color?: string
          order_index?: number
        }
      }
      splash_cards: {
        Row: {
          id: string
          category_id: string | null
          indonesian_text: string
          english_translation: string
          pronunciation_guide: string | null
          audio_url: string | null
          image_url: string | null
          example_sentence_id: string | null
          example_sentence_en: string | null
          cultural_note: string | null
          difficulty: number
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          indonesian_text: string
          english_translation: string
          pronunciation_guide?: string | null
          audio_url?: string | null
          image_url?: string | null
          example_sentence_id?: string | null
          example_sentence_en?: string | null
          cultural_note?: string | null
          difficulty?: number
          order_index?: number
          created_at?: string
        }
        Update: {
          category_id?: string | null
          indonesian_text?: string
          english_translation?: string
          pronunciation_guide?: string | null
          audio_url?: string | null
          image_url?: string | null
          example_sentence_id?: string | null
          example_sentence_en?: string | null
          cultural_note?: string | null
          difficulty?: number
          order_index?: number
        }
      }
      user_card_progress: {
        Row: {
          id: string
          user_id: string
          card_id: string
          mastery_level: number
          times_seen: number
          times_correct: number
          times_incorrect: number
          ease_factor: number
          interval_days: number
          last_reviewed: string | null
          next_review: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          card_id: string
          mastery_level?: number
          times_seen?: number
          times_correct?: number
          times_incorrect?: number
          ease_factor?: number
          interval_days?: number
          last_reviewed?: string | null
          next_review?: string
          created_at?: string
        }
        Update: {
          mastery_level?: number
          times_seen?: number
          times_correct?: number
          times_incorrect?: number
          ease_factor?: number
          interval_days?: number
          last_reviewed?: string | null
          next_review?: string
        }
      }
      lessons: {
        Row: {
          id: string
          category_id: string | null
          title: string
          description: string | null
          difficulty: number
          xp_reward: number
          estimated_minutes: number
          order_index: number
          is_premium: boolean
          created_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          title: string
          description?: string | null
          difficulty?: number
          xp_reward?: number
          estimated_minutes?: number
          order_index?: number
          is_premium?: boolean
          created_at?: string
        }
        Update: {
          category_id?: string | null
          title?: string
          description?: string | null
          difficulty?: number
          xp_reward?: number
          estimated_minutes?: number
          order_index?: number
          is_premium?: boolean
        }
      }
      phrases: {
        Row: {
          id: string
          lesson_id: string
          indonesian_text: string
          english_translation: string
          pronunciation_guide: string | null
          audio_url: string | null
          image_url: string | null
          example_dialogue_id: string | null
          example_dialogue_en: string | null
          grammar_note: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          indonesian_text: string
          english_translation: string
          pronunciation_guide?: string | null
          audio_url?: string | null
          image_url?: string | null
          example_dialogue_id?: string | null
          example_dialogue_en?: string | null
          grammar_note?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          indonesian_text?: string
          english_translation?: string
          pronunciation_guide?: string | null
          audio_url?: string | null
          image_url?: string | null
          example_dialogue_id?: string | null
          example_dialogue_en?: string | null
          grammar_note?: string | null
          order_index?: number
        }
      }
      user_lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          status: 'not_started' | 'in_progress' | 'completed'
          phrases_completed: number
          score: number
          xp_earned: number
          started_at: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          status?: 'not_started' | 'in_progress' | 'completed'
          phrases_completed?: number
          score?: number
          xp_earned?: number
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          status?: 'not_started' | 'in_progress' | 'completed'
          phrases_completed?: number
          score?: number
          xp_earned?: number
          started_at?: string | null
          completed_at?: string | null
        }
      }
      chat_rooms: {
        Row: {
          id: string
          name: string
          description: string | null
          level_requirement: string
          topic: string | null
          icon: string
          is_active: boolean
          is_official: boolean
          member_count: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          level_requirement?: string
          topic?: string | null
          icon?: string
          is_active?: boolean
          is_official?: boolean
          member_count?: number
          created_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          level_requirement?: string
          topic?: string | null
          icon?: string
          is_active?: boolean
          is_official?: boolean
          member_count?: number
        }
      }
      chat_room_members: {
        Row: {
          id: string
          room_id: string
          user_id: string
          joined_at: string
          last_read_at: string
          is_muted: boolean
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          joined_at?: string
          last_read_at?: string
          is_muted?: boolean
        }
        Update: {
          last_read_at?: string
          is_muted?: boolean
        }
      }
      chat_messages: {
        Row: {
          id: string
          room_id: string
          user_id: string
          content: string
          message_type: 'text' | 'voice' | 'image' | 'system'
          voice_url: string | null
          image_url: string | null
          reply_to_id: string | null
          is_edited: boolean
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          content: string
          message_type?: 'text' | 'voice' | 'image' | 'system'
          voice_url?: string | null
          image_url?: string | null
          reply_to_id?: string | null
          is_edited?: boolean
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          content?: string
          is_edited?: boolean
          is_deleted?: boolean
          updated_at?: string
        }
      }
      message_reactions: {
        Row: {
          id: string
          message_id: string
          user_id: string
          emoji: string
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          user_id: string
          emoji: string
          created_at?: string
        }
        Update: {
          emoji?: string
        }
      }
      daily_goals: {
        Row: {
          id: string
          user_id: string
          goal_date: string
          lessons_target: number
          lessons_completed: number
          cards_target: number
          cards_completed: number
          chat_minutes_target: number
          chat_minutes_completed: number
          xp_target: number
          xp_earned: number
          all_goals_met: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal_date?: string
          lessons_target?: number
          lessons_completed?: number
          cards_target?: number
          cards_completed?: number
          chat_minutes_target?: number
          chat_minutes_completed?: number
          xp_target?: number
          xp_earned?: number
          all_goals_met?: boolean
          created_at?: string
        }
        Update: {
          lessons_completed?: number
          cards_completed?: number
          chat_minutes_completed?: number
          xp_earned?: number
          all_goals_met?: boolean
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string
          icon: string
          category: string
          xp_reward: number
          requirement_type: string
          requirement_value: number
          is_secret: boolean
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          icon: string
          category?: string
          xp_reward?: number
          requirement_type: string
          requirement_value: number
          is_secret?: boolean
          order_index?: number
          created_at?: string
        }
        Update: {
          name?: string
          description?: string
          icon?: string
          category?: string
          xp_reward?: number
          requirement_type?: string
          requirement_value?: number
          is_secret?: boolean
          order_index?: number
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          earned_at?: string
        }
        Update: {
          earned_at?: string
        }
      }
      xp_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          source: string
          source_id: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          source: string
          source_id?: string | null
          description?: string | null
          created_at?: string
        }
        Update: never
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_xp: {
        Args: {
          p_user_id: string
          p_amount: number
          p_source: string
          p_description?: string
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Category = Database['public']['Tables']['categories']['Row']
export type SplashCard = Database['public']['Tables']['splash_cards']['Row']
export type UserCardProgress = Database['public']['Tables']['user_card_progress']['Row']

export type Lesson = Database['public']['Tables']['lessons']['Row']
export type Phrase = Database['public']['Tables']['phrases']['Row']
export type UserLessonProgress = Database['public']['Tables']['user_lesson_progress']['Row']

export type ChatRoom = Database['public']['Tables']['chat_rooms']['Row']
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row']
export type ChatRoomMember = Database['public']['Tables']['chat_room_members']['Row']

export type DailyGoals = Database['public']['Tables']['daily_goals']['Row']
export type Achievement = Database['public']['Tables']['achievements']['Row']
export type UserAchievement = Database['public']['Tables']['user_achievements']['Row']

// Extended types with relations
export type SplashCardWithCategory = SplashCard & {
  categories: Category | null
}

export type ChatMessageWithUser = ChatMessage & {
  profiles: Profile | null
}

export type LessonWithCategory = Lesson & {
  categories: Category | null
}
