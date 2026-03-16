import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Category, UserLessonProgress } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';

interface UnitLesson {
  id: string;
  title: string;
  lesson_number: number;
  order_index: number;
}

interface CurriculumUnit {
  id: string;
  name: string;
  icon: string | null;
  unit_number: number;
  stage: string;
  cefr_level: string;
  unit_description: string | null;
  requires_unit_id: string | null;
  min_completion_percent: number;
  lessons: UnitLesson[];
  completion: number;
  locked: boolean;
}

interface CurriculumStage {
  name: string;
  cefr: string;
  key: string;
  units: CurriculumUnit[];
}

const STAGE_LABELS: Record<string, string> = {
  survival: 'Survival',
  daily_life: 'Daily Life',
  fluency: 'Fluency',
};

export function useCurriculum() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [lessonsMap, setLessonsMap] = useState<Map<string, UnitLesson[]>>(new Map());
  const [progressMap, setProgressMap] = useState<Map<string, UserLessonProgress>>(new Map());
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [catRes, lessonRes, progressRes] = await Promise.all([
        supabase
          .from('categories')
          .select('*')
          .not('unit_number', 'is', null)
          .order('unit_number'),
        supabase
          .from('lessons')
          .select('id, title, lesson_number, order_index, category_id')
          .order('order_index'),
        user
          ? supabase
              .from('user_lesson_progress')
              .select('*')
              .eq('user_id', user.id)
          : Promise.resolve({ data: [], error: null }),
      ]);

      if (catRes.data) setCategories(catRes.data);

      if (lessonRes.data) {
        const map = new Map<string, UnitLesson[]>();
        for (const l of lessonRes.data) {
          const catId = (l as any).category_id;
          if (!catId) continue;
          if (!map.has(catId)) map.set(catId, []);
          map.get(catId)!.push({
            id: l.id,
            title: l.title,
            lesson_number: l.lesson_number,
            order_index: l.order_index,
          });
        }
        setLessonsMap(map);
      }

      if (progressRes.data) {
        const pMap = new Map<string, UserLessonProgress>();
        for (const p of progressRes.data) {
          pMap.set(p.lesson_id, p);
        }
        setProgressMap(pMap);
      }
    } catch (err) {
      console.error('Error loading curriculum:', err);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getUnitCompletion = useCallback(
    (unitId: string): number => {
      const lessons = lessonsMap.get(unitId) || [];
      if (lessons.length === 0) return 0;
      const completed = lessons.filter(
        (l) => progressMap.get(l.id)?.status === 'completed'
      ).length;
      return Math.round((completed / lessons.length) * 100);
    },
    [lessonsMap, progressMap]
  );

  const isUnitUnlocked = useCallback(
    (unit: Category): boolean => {
      if (!unit.requires_unit_id) return true;
      const reqCompletion = getUnitCompletion(unit.requires_unit_id);
      return reqCompletion >= (unit.min_completion_percent ?? 80);
    },
    [getUnitCompletion]
  );

  const stages = useMemo((): CurriculumStage[] => {
    const stageOrder = ['survival', 'daily_life', 'fluency'];
    const grouped = new Map<string, CurriculumUnit[]>();

    for (const cat of categories) {
      const stage = cat.stage || 'survival';
      if (!grouped.has(stage)) grouped.set(stage, []);

      const lessons = lessonsMap.get(cat.id) || [];
      const completion = getUnitCompletion(cat.id);
      const locked = !isUnitUnlocked(cat);

      grouped.get(stage)!.push({
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        unit_number: cat.unit_number!,
        stage,
        cefr_level: cat.cefr_level || 'A1',
        unit_description: cat.unit_description || null,
        requires_unit_id: cat.requires_unit_id,
        min_completion_percent: cat.min_completion_percent,
        lessons,
        completion,
        locked,
      });
    }

    return stageOrder
      .filter((s) => grouped.has(s))
      .map((s) => ({
        name: STAGE_LABELS[s] || s,
        cefr: grouped.get(s)?.[0]?.cefr_level || '',
        key: s,
        units: grouped.get(s)!.sort((a, b) => a.unit_number - b.unit_number),
      }));
  }, [categories, lessonsMap, getUnitCompletion, isUnitUnlocked]);

  const currentUnit = useMemo(() => {
    for (const stage of stages) {
      for (const unit of stage.units) {
        if (!unit.locked && unit.completion < 100) return unit;
      }
    }
    return null;
  }, [stages]);

  return {
    stages,
    getUnitCompletion,
    isUnitUnlocked: (unitId: string) => {
      const cat = categories.find((c) => c.id === unitId);
      return cat ? isUnitUnlocked(cat) : false;
    },
    currentUnit,
    loading,
    refetch: fetchData,
  };
}
