// src/hooks/useLessons.ts
// Lessons and phrases management

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Lesson, LessonWithCategory, Phrase, UserLessonProgress } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';

export function useLessons() {
  const { user } = useAuth();
  const { addXP, updateDailyGoals, dailyGoals } = useProfile();
  const [lessons, setLessons] = useState<LessonWithCategory[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [lessonProgress, setLessonProgress] = useState<Map<string, UserLessonProgress>>(new Map());
  const [loading, setLoading] = useState(true);

  // Fetch all lessons
  const fetchLessons = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select(`
          *,
          categories:category_id (*)
        `)
        .order('order_index');

      if (error) throw error;
      setLessons(data || []);
    } catch (err) {
      console.error('Error fetching lessons:', err);
    }
  }, []);

  // Fetch lessons by category
  const fetchLessonsByCategory = useCallback(async (categoryId: string) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select(`
          *,
          categories:category_id (*)
        `)
        .eq('category_id', categoryId)
        .order('order_index');

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching lessons by category:', err);
      return [];
    }
  }, []);

  // Fetch phrases for a lesson
  const fetchPhrases = useCallback(async (lessonId: string) => {
    try {
      const { data, error } = await supabase
        .from('phrases')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('order_index');

      if (error) throw error;
      setPhrases(data || []);
      return data || [];
    } catch (err) {
      console.error('Error fetching phrases:', err);
      return [];
    }
  }, []);

  // Fetch user's lesson progress
  const fetchLessonProgress = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const progressMap = new Map<string, UserLessonProgress>();
      (data || []).forEach(p => progressMap.set(p.lesson_id, p));
      setLessonProgress(progressMap);
    } catch (err) {
      console.error('Error fetching lesson progress:', err);
    }
  }, [user]);

  // Start a lesson
  const startLesson = useCallback(async (lesson: Lesson) => {
    if (!user) return;

    setCurrentLesson(lesson);
    await fetchPhrases(lesson.id);

    // Create or update progress record
    const existingProgress = lessonProgress.get(lesson.id);

    if (!existingProgress) {
      try {
        const { data, error } = await supabase
          .from('user_lesson_progress')
          .insert({
            user_id: user.id,
            lesson_id: lesson.id,
            status: 'in_progress',
            started_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;

        setLessonProgress(prev => {
          const newMap = new Map(prev);
          newMap.set(lesson.id, data);
          return newMap;
        });
      } catch (err) {
        console.error('Error starting lesson:', err);
      }
    } else if (existingProgress.status === 'not_started') {
      try {
        await supabase
          .from('user_lesson_progress')
          .update({
            status: 'in_progress',
            started_at: new Date().toISOString(),
          })
          .eq('id', existingProgress.id);
      } catch (err) {
        console.error('Error updating lesson progress:', err);
      }
    }
  }, [user, lessonProgress, fetchPhrases]);

  // Update phrase progress
  const updatePhraseProgress = useCallback(async (lessonId: string, phrasesCompleted: number) => {
    if (!user) return;

    const progress = lessonProgress.get(lessonId);
    if (!progress) return;

    try {
      const { data, error } = await supabase
        .from('user_lesson_progress')
        .update({
          phrases_completed: phrasesCompleted,
        })
        .eq('id', progress.id)
        .select()
        .single();

      if (error) throw error;

      setLessonProgress(prev => {
        const newMap = new Map(prev);
        newMap.set(lessonId, data);
        return newMap;
      });
    } catch (err) {
      console.error('Error updating phrase progress:', err);
    }
  }, [user, lessonProgress]);

  // Complete a lesson
  const completeLesson = useCallback(async (lessonId: string, score: number) => {
    if (!user) return;

    const lesson = lessons.find(l => l.id === lessonId);
    const progress = lessonProgress.get(lessonId);
    if (!lesson || !progress) return;

    const xpEarned = Math.round((score / 100) * lesson.xp_reward);

    try {
      const { data, error } = await supabase
        .from('user_lesson_progress')
        .update({
          status: 'completed',
          score,
          xp_earned: xpEarned,
          completed_at: new Date().toISOString(),
        })
        .eq('id', progress.id)
        .select()
        .single();

      if (error) throw error;

      setLessonProgress(prev => {
        const newMap = new Map(prev);
        newMap.set(lessonId, data);
        return newMap;
      });

      // Award XP
      await addXP(xpEarned, 'lesson_complete', `Completed lesson: ${lesson.title}`);

      // Update daily goals
      if (dailyGoals) {
        await updateDailyGoals({
          lessons_completed: dailyGoals.lessons_completed + 1,
        });
      }

      setCurrentLesson(null);
      setPhrases([]);
    } catch (err) {
      console.error('Error completing lesson:', err);
    }
  }, [user, lessons, lessonProgress, addXP, dailyGoals, updateDailyGoals]);

  // Get lesson progress status
  const getLessonStatus = useCallback((lessonId: string) => {
    const progress = lessonProgress.get(lessonId);
    return progress?.status || 'not_started';
  }, [lessonProgress]);

  // Get lesson completion percentage
  const getLessonCompletion = useCallback((lessonId: string) => {
    const progress = lessonProgress.get(lessonId);
    if (!progress) return 0;

    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return 0;

    // Find phrase count for this lesson
    const phraseCount = phrases.filter(p => p.lesson_id === lessonId).length;
    if (phraseCount === 0) return progress.status === 'completed' ? 100 : 0;

    return Math.round((progress.phrases_completed / phraseCount) * 100);
  }, [lessonProgress, lessons, phrases]);

  // Get next uncompleted lesson
  const getNextLesson = useCallback(() => {
    return lessons.find(lesson => {
      const status = getLessonStatus(lesson.id);
      return status !== 'completed';
    });
  }, [lessons, getLessonStatus]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchLessons(),
        fetchLessonProgress(),
      ]);
      setLoading(false);
    };

    loadData();
  }, [fetchLessons, fetchLessonProgress]);

  return {
    lessons,
    currentLesson,
    phrases,
    loading,
    startLesson,
    updatePhraseProgress,
    completeLesson,
    getLessonStatus,
    getLessonCompletion,
    getNextLesson,
    fetchLessonsByCategory,
    refetch: () => {
      fetchLessons();
      fetchLessonProgress();
    },
  };
}
