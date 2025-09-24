export interface BibleBook {
  title: string;
  chapters: number;
}

export interface BibleReading {
  bookKey: string;      // 'Genesis', 'Matthew' и т.д.
  bookName: string;     // 'Бытие', 'Матфея' ← НОВОЕ ПОЛЕ
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