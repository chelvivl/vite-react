// bibleData.ts

export interface BibleBook {
  title: string;
  chapters: number;
  bookId: number;
  testament: 'old' | 'new';
  shortTitle: string;
}

export const OldTestament: Record<string, BibleBook> = {
  Genesis: { title: 'Бытие', chapters: 50, bookId: 1, testament: 'old', shortTitle: 'Быт' },
  Exodus: { title: 'Исход', chapters: 40, bookId: 2, testament: 'old', shortTitle: 'Исх' },
  Leviticus: { title: 'Левит', chapters: 27, bookId: 3, testament: 'old', shortTitle: 'Лев' },
  Numbers: { title: 'Числа', chapters: 36, bookId: 4, testament: 'old', shortTitle: 'Чис' },
  Deuteronomy: { title: 'Второзаконие', chapters: 34, bookId: 5, testament: 'old', shortTitle: 'Втор' },
  Joshua: { title: 'Иисус Навин', chapters: 24, bookId: 6, testament: 'old', shortTitle: 'Нав' },
  Judges: { title: 'Судей', chapters: 21, bookId: 7, testament: 'old', shortTitle: 'Суд' },
  Ruth: { title: 'Руфь', chapters: 4, bookId: 8, testament: 'old', shortTitle: 'Руфь' },
  '1 Samuel': { title: '1 Царств', chapters: 31, bookId: 9, testament: 'old', shortTitle: '1 Цар' },
  '2 Samuel': { title: '2 Царств', chapters: 24, bookId: 10, testament: 'old', shortTitle: '2 Цар' },
  '1 Kings': { title: '3 Царств', chapters: 22, bookId: 11, testament: 'old', shortTitle: '3 Цар' },
  '2 Kings': { title: '4 Царств', chapters: 25, bookId: 12, testament: 'old', shortTitle: '4 Цар' },
  '1 Chronicles': { title: '1 Паралипоменон', chapters: 29, bookId: 13, testament: 'old', shortTitle: '1 Пар' },
  '2 Chronicles': { title: '2 Паралипоменон', chapters: 36, bookId: 14, testament: 'old', shortTitle: '2 Пар' },
  Ezra: { title: 'Ездра', chapters: 10, bookId: 15, testament: 'old', shortTitle: 'Езд' },
  Nehemiah: { title: 'Неемия', chapters: 13, bookId: 16, testament: 'old', shortTitle: 'Неем' },
  Esther: { title: 'Есфирь', chapters: 10, bookId: 17, testament: 'old', shortTitle: 'Есф' },
  Job: { title: 'Иов', chapters: 42, bookId: 18, testament: 'old', shortTitle: 'Иов' },
  Psalms: { title: 'Псалтирь', chapters: 150, bookId: 19, testament: 'old', shortTitle: 'Пс' },
  Proverbs: { title: 'Притчи', chapters: 31, bookId: 20, testament: 'old', shortTitle: 'Притч' },
  Ecclesiastes: { title: 'Екклесиаст', chapters: 12, bookId: 21, testament: 'old', shortTitle: 'Еккл' },
  'Song of Solomon': { title: 'Песнь Песней', chapters: 8, bookId: 22, testament: 'old', shortTitle: 'Песн' },
  Isaiah: { title: 'Исаия', chapters: 66, bookId: 23, testament: 'old', shortTitle: 'Ис' },
  Jeremiah: { title: 'Иеремия', chapters: 52, bookId: 24, testament: 'old', shortTitle: 'Иер' },
  Lamentations: { title: 'Плач Иеремии', chapters: 5, bookId: 25, testament: 'old', shortTitle: 'Плач' },
  Ezekiel: { title: 'Иезекииль', chapters: 48, bookId: 26, testament: 'old', shortTitle: 'Иез' },
  Daniel: { title: 'Даниил', chapters: 12, bookId: 27, testament: 'old', shortTitle: 'Дан' },
  Hosea: { title: 'Осия', chapters: 14, bookId: 28, testament: 'old', shortTitle: 'Ос' },
  Joel: { title: 'Иоиль', chapters: 3, bookId: 29, testament: 'old', shortTitle: 'Иоил' },
  Amos: { title: 'Амос', chapters: 9, bookId: 30, testament: 'old', shortTitle: 'Ам' },
  Obadiah: { title: 'Авдий', chapters: 1, bookId: 31, testament: 'old', shortTitle: 'Авд' },
  Jonah: { title: 'Иона', chapters: 4, bookId: 32, testament: 'old', shortTitle: 'Иона' },
  Micah: { title: 'Михей', chapters: 7, bookId: 33, testament: 'old', shortTitle: 'Мих' },
  Nahum: { title: 'Наум', chapters: 3, bookId: 34, testament: 'old', shortTitle: 'Наум' },
  Habakkuk: { title: 'Аввакум', chapters: 3, bookId: 35, testament: 'old', shortTitle: 'Авв' },
  Zephaniah: { title: 'Софония', chapters: 3, bookId: 36, testament: 'old', shortTitle: 'Сов' },
  Haggai: { title: 'Аггей', chapters: 2, bookId: 37, testament: 'old', shortTitle: 'Агг' },
  Zechariah: { title: 'Захария', chapters: 14, bookId: 38, testament: 'old', shortTitle: 'Зах' },
  Malachi: { title: 'Малахия', chapters: 4, bookId: 39, testament: 'old', shortTitle: 'Мал' },
};

export const NewTestament: Record<string, BibleBook> = {
  Matthew: { title: 'Матфея', chapters: 28, bookId: 40, testament: 'new', shortTitle: 'Мф' },
  Mark: { title: 'Марка', chapters: 16, bookId: 41, testament: 'new', shortTitle: 'Мк' },
  Luke: { title: 'Луки', chapters: 24, bookId: 42, testament: 'new', shortTitle: 'Лк' },
  John: { title: 'Иоанна', chapters: 21, bookId: 43, testament: 'new', shortTitle: 'Ин' },
  Acts: { title: 'Деяния', chapters: 28, bookId: 44, testament: 'new', shortTitle: 'Деян' },
  Romans: { title: 'Римлянам', chapters: 16, bookId: 45, testament: 'new', shortTitle: 'Рим' },
  '1 Corinthians': { title: '1 Коринфянам', chapters: 16, bookId: 46, testament: 'new', shortTitle: '1 Кор' },
  '2 Corinthians': { title: '2 Коринфянам', chapters: 13, bookId: 47, testament: 'new', shortTitle: '2 Кор' },
  Galatians: { title: 'Галатам', chapters: 6, bookId: 48, testament: 'new', shortTitle: 'Гал' },
  Ephesians: { title: 'Ефесянам', chapters: 6, bookId: 49, testament: 'new', shortTitle: 'Еф' },
  Philippians: { title: 'Филиппийцам', chapters: 4, bookId: 50, testament: 'new', shortTitle: 'Флп' },
  Colossians: { title: 'Колоссянам', chapters: 4, bookId: 51, testament: 'new', shortTitle: 'Кол' },
  '1 Thessalonians': { title: '1 Фессалоникийцам', chapters: 5, bookId: 52, testament: 'new', shortTitle: '1 Фес' },
  '2 Thessalonians': { title: '2 Фессалоникийцам', chapters: 3, bookId: 53, testament: 'new', shortTitle: '1 Фес' },
  '1 Timothy': { title: '1 Тимофею', chapters: 6, bookId: 54, testament: 'new', shortTitle: '1 Тим' },
  '2 Timothy': { title: '2 Тимофею', chapters: 4, bookId: 55, testament: 'new', shortTitle: '1 Тим' },
  Titus: { title: 'Титу', chapters: 3, bookId: 56, testament: 'new', shortTitle: 'Тит' },
  Philemon: { title: 'Филимону', chapters: 1, bookId: 57, testament: 'new', shortTitle: 'Флм' },
  Hebrews: { title: 'Евреям', chapters: 13, bookId: 58, testament: 'new', shortTitle: 'Евр' },
  James: { title: 'Иакова', chapters: 5, bookId: 59, testament: 'new', shortTitle: 'Иак' },
  '1 Peter': { title: '1 Петра', chapters: 5, bookId: 60, testament: 'new', shortTitle: '1 Пет' },
  '2 Peter': { title: '2 Петра', chapters: 3, bookId: 61, testament: 'new', shortTitle: '2 Пет' },
  '1 John': { title: '1 Иоанна', chapters: 5, bookId: 62, testament: 'new', shortTitle: '1 Ин' },
  '2 John': { title: '2 Иоанна', chapters: 1, bookId: 63, testament: 'new', shortTitle: '2 Ин' },
  '3 John': { title: '3 Иоанна', chapters: 1, bookId: 64, testament: 'new', shortTitle: '3 Ин' },
  Jude: { title: 'Иуда', chapters: 1, bookId: 65, testament: 'new', shortTitle: 'Иуд' },
  Revelation: { title: 'Откровение', chapters: 22, bookId: 66, testament: 'new', shortTitle: 'Откр' },
};

export const ALL_BOOKS: Record<string, BibleBook> = { ...OldTestament, ...NewTestament };

export function getBookIdByEnglishName(bookName: string): number {
  const book = ALL_BOOKS[bookName];
  if(book == null){
    return 1;
  } else {
    return book.bookId;
  }
}

export function getRussianNameByBookId(bookId: number): string {
  for (const book of Object.values(ALL_BOOKS)) {
    if (book.bookId === bookId) {
      return book.title;
    }
  }
  return "Нет данных";
}