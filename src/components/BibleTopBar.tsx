import { ALL_BOOKS } from '../utils/bibleData';

interface BibleTopBarProps {
  title: string,
  selectedBookKey: keyof typeof ALL_BOOKS;
  selectedChapter: number;
  onBookChange: (bookKey: keyof typeof ALL_BOOKS) => void;
  onChapterChange: (chapter: number) => void;
}

export default function BibleTopBar({
  selectedBookKey,
  selectedChapter,
  onBookChange,
  onChapterChange
}: BibleTopBarProps) {
  const currentBook = ALL_BOOKS[selectedBookKey];
  const chapterOptions = Array.from({ length: currentBook.chapters }, (_, i) => i + 1);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 0px',
        backgroundColor: '#667eea',
        zIndex: 1000,
        fontSize: '17px',
        fontWeight: 600,
        color: 'white',
        boxSizing: 'border-box'
      }}
    >

       {/* Выбор книги и главы */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
       <select
          value={selectedBookKey}
          onChange={(e) => onBookChange(e.target.value as keyof typeof ALL_BOOKS)}
          style={{
            fontSize: '16px',
            fontWeight: 600,
            marginLeft: '16px',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.4)', // легкая граница для контраста
            backgroundColor: 'rgba(0, 0, 0, 0.2)', // темный полупрозрачный фон
            color: 'white',
            outline: 'none',
            WebkitAppearance: 'none', // убирает стрелку на iOS (опционально)
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
            backgroundSize: '16px 16px',
            paddingRight: '32px', // место для стрелки
          }}
        >
          {Object.entries(ALL_BOOKS).map(([key, book]) => (
            <option key={key} value={key} style={{ color: '#000', backgroundColor: '#fff' }}>
              {book.title}
            </option>
          ))}
        </select>

     <select
          value={selectedChapter}
          onChange={(e) => onChapterChange(Number(e.target.value))}
          style={{
            fontSize: '16px',
            fontWeight: 600,
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.4)', // легкая граница для контраста
            backgroundColor: 'rgba(0, 0, 0, 0.2)', // темный полупрозрачный фон
            color: 'white',
            outline: 'none',
            WebkitAppearance: 'none', // убирает стрелку на iOS (опционально)
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
            backgroundSize: '16px 16px',
            paddingRight: '32px', // место для стрелки
          }}
        >
          {chapterOptions.map((ch) => (
                <option key={ch} value={ch} style={{ color: '#000', backgroundColor: '#fff' }}>
              {ch}
            </option>
          ))}
        </select>
      </div>

    </header>
  );
}