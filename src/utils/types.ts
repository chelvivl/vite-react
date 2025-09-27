import { OldTestament, NewTestament } from './bibleData'; // ← путь может отличаться!

export interface BibleBook {
  title: string;
  chapters: number;
}

export interface BibleReading {
  bookKey: string;
  bookName: string;
  bookId: number,
  chapter: number;
  completed: boolean;
}

export interface ReadingDay {
  day: number;
  date: string;
  title: string;
  readings: BibleReading[];
  completed: boolean;
}

// types.ts
export type BookProgress = {
  [chapter: number]: boolean; // true = прочитано
};

export type TestamentProgress = {
  [bookKey in keyof typeof OldTestament | keyof typeof NewTestament]?: BookProgress;
};

export interface Tracker {
  id: string;
  name: string;
  createdAt: string;
  progress: TestamentProgress;
}