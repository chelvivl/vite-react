export interface Verse {
  VerseId: number;
  Text: string;
}

export interface Chapter {
  ChapterId: number;
  Verses: Verse[];
}

export interface Book {
  BookId: number;
  Chapters: Chapter[];
  // Name может отсутствовать — у вас его нет в JSON
}

export interface BibleData {
  Translation: string;
  Books: Book[];
}