import { useState, useEffect } from 'react';

const STORAGE_KEY = 'bible-plan-v1';
const START_DAY_KEY = 'bible-plan-start-day';

export function useBiblePlan() {
  // Загружаем прогресс
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : Array(111).fill(false);
  });

  // Загружаем стартовый день
  const [startDay, setStartDay] = useState(() => {
    const saved = localStorage.getItem(START_DAY_KEY);
    return saved ? parseInt(saved) : 1;
  });

  // Сохраняем прогресс при изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Сохраняем стартовый день при изменении
  useEffect(() => {
    localStorage.setItem(START_DAY_KEY, startDay.toString());
  }, [startDay]);

  // Переключить день
  const toggleDay = (index) => {
    setState(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  // Сбросить всё
  const resetProgress = () => {
    setState(Array(111).fill(false));
    setStartDay(1);
  };

  // Продолжить с дня
  const continueFromDay = (day) => {
    if (day < 1 || day > 111) return;
    setStartDay(day);
    setState(prev => prev.map((_, i) => i < day - 1));
  };

  // Статистика
  const completedCount = state.filter(Boolean).length;

  return {
    state,
    startDay,
    toggleDay,
    resetProgress,
    continueFromDay,
    setStartDay,
    completedCount,
  };
}