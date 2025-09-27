// src/hooks/useTrackers.ts
import { useState, useEffect } from 'react';
import { Tracker, BookProgress } from '../utils/types';
import { ALL_BOOKS } from '../utils/bibleData';

const TRACKERS_KEY = 'bible-trackers';

// Тип для ключа книги
type BookKey = keyof typeof ALL_BOOKS;

const initBookProgress = (chapters: number): BookProgress => {
  const progress: BookProgress = {};
  for (let i = 1; i <= chapters; i++) {
    progress[i] = false;
  }
  return progress;
};

export const createEmptyTracker = (name: string): Tracker => {
  const progress: Tracker['progress'] = {};
  (Object.keys(ALL_BOOKS) as BookKey[]).forEach((bookKey) => {
    progress[bookKey] = initBookProgress(ALL_BOOKS[bookKey].chapters);
  });
  return {
    id: Date.now().toString(),
    name,
    createdAt: new Date().toISOString(),
    progress,
  };
};

export const useTrackers = () => {
  const [trackers, setTrackers] = useState<Tracker[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(TRACKERS_KEY);
    if (saved) {
      try {
        setTrackers(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse trackers', e);
        setTrackers([]);
      }
    }
  }, []);

  const saveTrackers = (newTrackers: Tracker[]) => {
    setTrackers(newTrackers);
    localStorage.setItem(TRACKERS_KEY, JSON.stringify(newTrackers));
  };

  const createTracker = (name: string) => {
    const newTracker = createEmptyTracker(name);
    saveTrackers([...trackers, newTracker]);
    return newTracker;
  };

  // ✅ Исправлено: bookKey типизирован как BookKey
  const toggleChapter = (trackerId: string, bookKey: BookKey, chapter: number) => {
    const newTrackers = trackers.map((tracker) => {
      if (tracker.id === trackerId) {
        const newProgress = { ...tracker.progress };
        const bookProgress = { ...newProgress[bookKey] }; // ✅ Теперь TS знает, что bookKey — валидный ключ
        bookProgress[chapter] = !bookProgress[chapter];
        newProgress[bookKey] = bookProgress;
        return { ...tracker, progress: newProgress };
      }
      return tracker;
    });
    saveTrackers(newTrackers);
  };

  // ✅ Исправлено: bookKey типизирован как BookKey
  const markAllChapters = (trackerId: string, bookKey: BookKey, read: boolean) => {
    const book = ALL_BOOKS[bookKey];
    if (!book) return;

    const newTrackers = trackers.map((tracker) => {
      if (tracker.id === trackerId) {
        const newProgress = { ...tracker.progress };
        const bookProgress: BookProgress = {};
        for (let i = 1; i <= book.chapters; i++) {
          bookProgress[i] = read;
        }
        newProgress[bookKey] = bookProgress; // ✅ Без ошибки
        return { ...tracker, progress: newProgress };
      }
      return tracker;
    });
    saveTrackers(newTrackers);
  };

  const deleteTracker = (trackerId: string) => {
    saveTrackers(trackers.filter((t) => t.id !== trackerId));
  };

  return {
    trackers,
    createTracker,
    toggleChapter,
    markAllChapters,
    deleteTracker,
  };
};

// ✅ Расчёт прогресса — тоже с правильным типом
export const calculateProgress = (progress: Tracker['progress']) => {
  let read = 0;
  (Object.keys(ALL_BOOKS) as BookKey[]).forEach((bookKey) => {
    const bookProgress = progress[bookKey];
    if (bookProgress) {
      const book = ALL_BOOKS[bookKey];
      for (let i = 1; i <= book.chapters; i++) {
        if (bookProgress[i]) read++;
      }
    }
  });
  const total = Object.values(ALL_BOOKS).reduce((sum, book) => sum + book.chapters, 0);
  const percent = total === 0 ? 0 : Math.round((read / total) * 100);
  return { read, total, percent };
};