// src/hooks/useProfile.ts
// User profile and stats management

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile, ProfileUpdate, DailyGoals, Achievement, UserAchievement } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';

// Level titles mapping
export const levelTitles: Record<number, string> = {
  1: 'Pemula',
  2: 'Pemula',
  3: 'Pelajar',
  4: 'Pelajar',
  5: 'Mahir',
  6: 'Mahir',
  7: 'Ahli',
  8: 'Ahli',
  9: 'Master',
  10: 'Master',
};

// XP required for each level
export const xpPerLevel = 500;

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dailyGoals, setDailyGoals] = useState<DailyGoals | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [earnedAchievements, setEarnedAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    }
  }, [user]);

  // Fetch daily goals
  const fetchDailyGoals = useCallback(async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    try {
      // Try to get today's goals
      let { data, error } = await supabase
        .from('daily_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('goal_date', today)
        .single();

      // If no goals for today, create them
      if (error && error.code === 'PGRST116') {
        const { data: newData, error: insertError } = await supabase
          .from('daily_goals')
          .insert({
            user_id: user.id,
            goal_date: today,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        data = newData;
      } else if (error) {
        throw error;
      }

      setDailyGoals(data);
    } catch (err) {
      console.error('Error fetching daily goals:', err);
    }
  }, [user]);

  // Fetch achievements
  const fetchAchievements = useCallback(async () => {
    if (!user) return;

    try {
      // Get all achievements
      const { data: allAchievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .order('order_index');

      if (achievementsError) throw achievementsError;
      setAchievements(allAchievements || []);

      // Get user's earned achievements
      const { data: earned, error: earnedError } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      if (earnedError) throw earnedError;
      setEarnedAchievements(earned || []);
    } catch (err) {
      console.error('Error fetching achievements:', err);
    }
  }, [user]);

  // Update profile
  const updateProfile = useCallback(async (updates: ProfileUpdate) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      console.error('Error updating profile:', err);
      return { data: null, error: err instanceof Error ? err.message : 'Failed to update profile' };
    }
  }, [user]);

  // Update daily goals
  const updateDailyGoals = useCallback(async (updates: Partial<DailyGoals>) => {
    if (!user || !dailyGoals) return;

    try {
      const { data, error } = await supabase
        .from('daily_goals')
        .update(updates)
        .eq('id', dailyGoals.id)
        .select()
        .single();

      if (error) throw error;
      setDailyGoals(data);
    } catch (err) {
      console.error('Error updating daily goals:', err);
    }
  }, [user, dailyGoals]);

  // Add XP (uses database function)
  const addXP = useCallback(async (amount: number, source: string, description?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('add_xp', {
        p_user_id: user.id,
        p_amount: amount,
        p_source: source,
        p_description: description,
      });

      if (error) throw error;

      // Refresh profile and daily goals
      await fetchProfile();
      await fetchDailyGoals();
    } catch (err) {
      console.error('Error adding XP:', err);
    }
  }, [user, fetchProfile, fetchDailyGoals]);

  // Calculate level from XP
  const getLevel = useCallback(() => {
    if (!profile) return 1;
    return Math.floor(profile.xp_total / xpPerLevel) + 1;
  }, [profile]);

  // Calculate XP to next level
  const getXPToNextLevel = useCallback(() => {
    if (!profile) return xpPerLevel;
    const currentLevel = getLevel();
    return currentLevel * xpPerLevel;
  }, [profile, getLevel]);

  // Calculate XP progress percentage
  const getXPProgress = useCallback(() => {
    if (!profile) return 0;
    const currentLevelXP = (getLevel() - 1) * xpPerLevel;
    const xpInCurrentLevel = profile.xp_total - currentLevelXP;
    return (xpInCurrentLevel / xpPerLevel) * 100;
  }, [profile, getLevel]);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchProfile(),
        fetchDailyGoals(),
        fetchAchievements(),
      ]);
      setLoading(false);
    };

    if (user) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user, fetchProfile, fetchDailyGoals, fetchAchievements]);

  return {
    profile,
    dailyGoals,
    achievements,
    earnedAchievements,
    loading,
    error,
    updateProfile,
    updateDailyGoals,
    addXP,
    getLevel,
    getXPToNextLevel,
    getXPProgress,
    levelTitle: levelTitles[getLevel()] || 'Master',
    refetch: () => {
      fetchProfile();
      fetchDailyGoals();
      fetchAchievements();
    },
  };
}
