// src/hooks/useCards.ts
// Splash cards with spaced repetition

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Category, SplashCard, SplashCardWithCategory, UserCardProgress } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';

// SM-2 Spaced Repetition Algorithm
function calculateNextReview(
  quality: number, // 0-5 (0-2 = incorrect, 3-5 = correct)
  easeFactor: number,
  interval: number
): { newEaseFactor: number; newInterval: number; nextReview: Date } {
  // Update ease factor
  let newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEaseFactor < 1.3) newEaseFactor = 1.3;

  // Calculate new interval
  let newInterval: number;
  if (quality < 3) {
    // Incorrect - reset to 1 day
    newInterval = 1;
  } else if (interval === 0) {
    newInterval = 1;
  } else if (interval === 1) {
    newInterval = 6;
  } else {
    newInterval = Math.round(interval * newEaseFactor);
  }

  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + newInterval);

  return { newEaseFactor, newInterval, nextReview };
}

export function useCards() {
  const { user } = useAuth();
  const { addXP, updateDailyGoals, dailyGoals } = useProfile();
  const [categories, setCategories] = useState<Category[]>([]);
  const [cards, setCards] = useState<SplashCardWithCategory[]>([]);
  const [cardProgress, setCardProgress] = useState<Map<string, UserCardProgress>>(new Map());
  const [loading, setLoading] = useState(true);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  // Fetch cards by category
  const fetchCardsByCategory = useCallback(async (categoryId: string) => {
    try {
      const { data, error } = await supabase
        .from('splash_cards')
        .select(`
          *,
          categories:category_id (*)
        `)
        .eq('category_id', categoryId)
        .order('order_index');

      if (error) throw error;
      setCards(data || []);
      return data || [];
    } catch (err) {
      console.error('Error fetching cards:', err);
      return [];
    }
  }, []);

  // Fetch all cards
  const fetchAllCards = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('splash_cards')
        .select(`
          *,
          categories:category_id (*)
        `)
        .order('difficulty')
        .order('order_index');

      if (error) throw error;
      setCards(data || []);
      return data || [];
    } catch (err) {
      console.error('Error fetching all cards:', err);
      return [];
    }
  }, []);

  // Fetch user's card progress
  const fetchCardProgress = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_card_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const progressMap = new Map<string, UserCardProgress>();
      (data || []).forEach(p => progressMap.set(p.card_id, p));
      setCardProgress(progressMap);
    } catch (err) {
      console.error('Error fetching card progress:', err);
    }
  }, [user]);

  // Get cards due for review
  const getCardsForReview = useCallback((categoryId?: string) => {
    const now = new Date();

    return cards.filter(card => {
      // Filter by category if specified
      if (categoryId && card.category_id !== categoryId) return false;

      const progress = cardProgress.get(card.id);

      // If no progress, card is new and should be shown
      if (!progress) return true;

      // Check if due for review
      const nextReview = new Date(progress.next_review);
      return nextReview <= now;
    });
  }, [cards, cardProgress]);

  // Record card review result
  const recordCardReview = useCallback(async (
    cardId: string,
    isCorrect: boolean,
    quality?: number // 0-5, default based on isCorrect
  ) => {
    if (!user) return;

    const actualQuality = quality ?? (isCorrect ? 4 : 2);
    const existingProgress = cardProgress.get(cardId);

    const currentEaseFactor = existingProgress?.ease_factor || 2.5;
    const currentInterval = existingProgress?.interval_days || 0;

    const { newEaseFactor, newInterval, nextReview } = calculateNextReview(
      actualQuality,
      currentEaseFactor,
      currentInterval
    );

    try {
      const progressData = {
        user_id: user.id,
        card_id: cardId,
        mastery_level: isCorrect
          ? Math.min((existingProgress?.mastery_level || 0) + 1, 5)
          : Math.max((existingProgress?.mastery_level || 0) - 1, 0),
        times_seen: (existingProgress?.times_seen || 0) + 1,
        times_correct: (existingProgress?.times_correct || 0) + (isCorrect ? 1 : 0),
        times_incorrect: (existingProgress?.times_incorrect || 0) + (isCorrect ? 0 : 1),
        ease_factor: newEaseFactor,
        interval_days: newInterval,
        last_reviewed: new Date().toISOString(),
        next_review: nextReview.toISOString(),
      };

      const { error } = await supabase
        .from('user_card_progress')
        .upsert(progressData, {
          onConflict: 'user_id,card_id',
        });

      if (error) throw error;

      // Update local state
      setCardProgress(prev => {
        const newMap = new Map(prev);
        newMap.set(cardId, progressData as UserCardProgress);
        return newMap;
      });

      // Award XP for correct answers
      if (isCorrect) {
        await addXP(5, 'card_review', 'Correct flashcard answer');

        // Update daily goals
        if (dailyGoals) {
          await updateDailyGoals({
            cards_completed: dailyGoals.cards_completed + 1,
          });
        }
      }
    } catch (err) {
      console.error('Error recording card review:', err);
    }
  }, [user, cardProgress, addXP, dailyGoals, updateDailyGoals]);

  // Get category progress
  const getCategoryProgress = useCallback((categoryId: string) => {
    const categoryCards = cards.filter(c => c.category_id === categoryId);
    if (categoryCards.length === 0) return 0;

    const masteredCards = categoryCards.filter(card => {
      const progress = cardProgress.get(card.id);
      return progress && progress.mastery_level >= 3;
    });

    return Math.round((masteredCards.length / categoryCards.length) * 100);
  }, [cards, cardProgress]);

  // Get mastery level for a card
  const getCardMasteryLevel = useCallback((cardId: string) => {
    const progress = cardProgress.get(cardId);
    return progress?.mastery_level || 0;
  }, [cardProgress]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchCategories(),
        fetchAllCards(),
        fetchCardProgress(),
      ]);
      setLoading(false);
    };

    loadData();
  }, [fetchCategories, fetchAllCards, fetchCardProgress]);

  return {
    categories,
    cards,
    loading,
    fetchCardsByCategory,
    fetchAllCards,
    getCardsForReview,
    recordCardReview,
    getCategoryProgress,
    getCardMasteryLevel,
    refetch: () => {
      fetchCategories();
      fetchAllCards();
      fetchCardProgress();
    },
  };
}
