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