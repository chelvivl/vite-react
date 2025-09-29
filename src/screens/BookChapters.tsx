// src/screens/BookChapters.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { useTrackers } from '../hooks/useTrackers';
import { ALL_BOOKS } from '../utils/bibleData';
import { IoCheckmarkDoneCircle } from 'react-icons/io5';
import './BookChapters.css';

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
    return <div className="loading">Загрузка...</div>;
  }

  const bookProgress = tracker.progress[bookKey] || {};
  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);

  const handleChapterClick = (chapter: number) => {
    toggleChapter(trackerId!, bookKey, chapter);
  };

  const handleMarkAll = () => {
    const readCount = Object.values(bookProgress).filter(Boolean).length;
    const markAsRead = readCount < book.chapters;
    markAllChapters(trackerId!, bookKey, markAsRead);
  };

  return (
    <>
      <TopBar
        title={`${book.title} ${((Object.values(bookProgress).filter(Boolean).length / book.chapters) * 100).toFixed(1)}%`}
        showBackButton={true}
        showRightButton={true}
        rightIcon={<IoCheckmarkDoneCircle size={22} color="white" />}
        onRightClick={handleMarkAll}
      />

      {/* Обычный блок, без position: absolute */}
      <div className="chapters-grid">
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