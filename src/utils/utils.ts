import { ALL_BOOKS } from './bibleData'; // убедись, что ALL_BOOKS экспортирован
import type { ReadingDay } from './types';

// Группируем последовательные главы по книгам
export function generateReadingTitle(readings: { bookKey: string; chapter: number }[]): string {
  if (readings.length === 0) return '';

  const groups: { bookKey: string; start: number; end: number }[] = [];
  let currentBook = readings[0].bookKey;
  let startChapter = readings[0].chapter;
  let endChapter = readings[0].chapter;

  for (let i = 1; i < readings.length; i++) {
    const { bookKey, chapter } = readings[i];
    if (bookKey === currentBook && chapter === endChapter + 1) {
      // продолжаем последовательность
      endChapter = chapter;
    } else {
      // завершаем текущую группу
      groups.push({ bookKey: currentBook, start: startChapter, end: endChapter });
      // начинаем новую
      currentBook = bookKey;
      startChapter = chapter;
      endChapter = chapter;
    }
  }
  // не забываем последнюю группу
  groups.push({ bookKey: currentBook, start: startChapter, end: endChapter });

  // Преобразуем в строку с русскими названиями
  const parts = groups.map(group => {
    const bookTitle = ALL_BOOKS[group.bookKey as keyof typeof ALL_BOOKS]?.title || group.bookKey;
    if (group.start === group.end) {
      return `${bookTitle} ${group.start}`;
    } else {
      return `${bookTitle} ${group.start}–${group.end}`;
    }
  });

  return parts.join(', ');
}

// utils.ts
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0]; // "2024-06-15"
}

export function adjustPlanDates(
  plan: ReadingDay[],
  targetDayNumber: number // например, 45
): ReadingDay[] {
  const today = new Date();
  // Сколько дней нужно от сегодняшней даты отнять, чтобы targetDay стал "сегодня"
  const offset = targetDayNumber - 1; // потому что день 1 = +0 дней от старта

  // Новая дата старта = сегодня - offset
  const newStartDate = addDays(today, -offset);

  // Пересоздаём даты для всего плана
  return plan.map((day,index) => {
    const newDate = formatDateISO(addDays(newStartDate, index));
    return { ...day, date: newDate };
  });
}