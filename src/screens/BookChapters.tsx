// src/screens/BookChapters.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { useTrackers } from '../hooks/useTrackers';
import { ALL_BOOKS } from '../utils/bibleData';
import { IoCheckmarkDoneCircle } from 'react-icons/io5'; // ← иконка "отметить всё"
import './BookChapters.css';

// Тип для ключа книги
type BookKey = keyof typeof ALL_BOOKS;

export default function BookChapters() {
  const { trackerId, bookKey: bookKeyParam } = useParams<{ trackerId?: string; bookKey?: string }>();
  const navigate = useNavigate();
  const { trackers, toggleChapter, markAllChapters } = useTrackers();
  const [tracker, setTracker] = useState<any>(null);
  const [book, setBook] = useState<any>(null);
  const [bookKey, setBookKey] = useState<BookKey | null>(null);

  useEffect(() => {
    if (!trackerId || !bookKeyParam) {
      navigate('/tracker');
      return;
    }

    // Проверяем, что bookKeyParam — валидный ключ
    if (!(bookKeyParam in ALL_BOOKS)) {
      console.warn('Неверный ключ книги:', bookKeyParam);
      navigate('/tracker');
      return;
    }

    const typedBookKey = bookKeyParam as BookKey;
    const foundTracker = trackers.find(t => t.id === trackerId);
    const foundBook = ALL_BOOKS[typedBookKey];

    if (foundTracker && foundBook) {
      setTracker(foundTracker);
      setBook(foundBook);
      setBookKey(typedBookKey);
    } else {
    }
  }, [trackerId, bookKeyParam, trackers, navigate]);

  if (!tracker || !book || !bookKey) {
    return <div>Загрузка...</div>;
  }

  // Теперь bookKey — точно BookKey, а не string | undefined
  const bookProgress = tracker.progress[bookKey] || {};
  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);

  const handleChapterClick = (chapter: number) => {
    toggleChapter(trackerId!, bookKey, chapter);
  };

      // Новая функция: отметить все главы
  const handleMarkAll = () => {
    // Проверим, сколько уже прочитано
    const readCount = Object.values(bookProgress).filter(Boolean).length;
    const markAsRead = readCount < book.chapters; // если не всё прочитано — отметить всё, иначе снять отметки
    markAllChapters(trackerId!, bookKey, markAsRead);
  };


  return (
    <>
      <TopBar
        title={book.title + " "+ Math.round((Object.values(bookProgress).filter(Boolean).length / book.chapters) * 100) + "%"}
        showBackButton={true}
        showRightButton={true}
        rightIcon={<IoCheckmarkDoneCircle size={22} color="white" />}
        onRightClick={handleMarkAll}
      />

      <div style={{
          position: 'absolute',
          top: '56px',
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: 'auto',
          paddingTop: '16px',
          paddingRight: '16px',
          paddingLeft: '16px',
          paddingBottom: '16px',
          backgroundColor: '#F6F6F6'
        }} className='chapters-grid'>
        {chapters.map(chapter => {
          const isRead = bookProgress[chapter] || false;
          return (
            <button
              key={chapter}
              className={`chapter-item ${isRead ? 'read' : ''}`}
              onClick={() => handleChapterClick(chapter)}
            >
              {chapter}
            </button>
          );
        })}
      </div>
    </>
  );
}