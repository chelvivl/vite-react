import { ALL_BOOKS } from './bibleData';
import { generateReadingTitle, addDays, formatDateISO } from './utils';
import type { BibleReading, ReadingDay } from './types';
import { BOOK_KEY_TO_RUSSIAN_NAME } from './bookNames';

// Собираем все книги в правильном порядке с их ключами
const ALL_BOOKS_ORDER = [
  // Ветхий Завет
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
  'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
  'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  // Новый Завет
  'Matthew', 'Mark', 'Luke', 'John', 'Acts',
  'Romans', '1 Corinthians', '2 Corinthians', 'Galatians',
  'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians',
  '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus',
  'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
  '1 John', '2 John', '3 John', 'Jude', 'Revelation',
] as const;

export function generateBibleReadingPlan(startDate: Date = new Date()): ReadingDay[] {
  const totalChapters = 1189;
  const totalDays = 111;
  const plan: ReadingDay[] = [];

  // Собираем все главы с bookName на русском
  const allChapters: BibleReading[] = [];

  for (const bookKey of ALL_BOOKS_ORDER) {
    const book = ALL_BOOKS[bookKey];
    const bookName = BOOK_KEY_TO_RUSSIAN_NAME[bookKey] || bookKey;
    for (let ch = 1; ch <= book.chapters; ch++) {
      allChapters.push({
        bookKey,
        bookName,
        bookId: book.bookId,
        chapter: ch,
        completed: false
      });
    }
  }

  if (allChapters.length !== totalChapters) {
    console.warn(`⚠️ Ожидалось 1189 глав, получено: ${allChapters.length}`);
  }

  let index = 0;
  for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
    const remainingChapters = totalChapters - index;
    const remainingDays = totalDays - dayNum + 1;
    const chaptersToday = Math.ceil(remainingChapters / remainingDays);

    const readings = allChapters.slice(index, index + chaptersToday);
    index += chaptersToday;

    const title = generateReadingTitle(readings);
    const date = formatDateISO(addDays(startDate, dayNum - 1));

    plan.push({
      day: dayNum,
      date,
      title,
      readings,
      completed: false,
    });

    if (index >= totalChapters) break;
  }

  return plan;
}