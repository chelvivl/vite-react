// src/screens/TrackerDetail.tsx
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { useTrackers } from '../hooks/useTrackers';
import { ALL_BOOKS } from '../utils/bibleData';
import './TrackerDetail.css';

export default function TrackerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { trackers } = useTrackers();
  const [tracker, setTracker] = useState<any>(null);

  const oldTestamentRef = useRef<HTMLHeadingElement>(null);
  const newTestamentRef = useRef<HTMLHeadingElement>(null);
  type BibleBook = (typeof ALL_BOOKS)[keyof typeof ALL_BOOKS];

  useEffect(() => {
    if (id) {
      const found = trackers.find(t => t.id === id);
      if (found) {
        setTracker(found);
      }
    }
  }, [id, trackers]);

  if (!tracker) {
    return <div className="tracker-detail">Загрузка...</div>;
  }

  // --- Вычисление прогресса ---
  const oldTestamentBooks = Object.entries(ALL_BOOKS).filter(([, book]) => book.testament === 'old') as [string, BibleBook][];;
  const newTestamentBooks = Object.entries(ALL_BOOKS).filter(([, book]) => book.testament === 'new') as [string, BibleBook][];;
  const allBooks = [...oldTestamentBooks, ...newTestamentBooks];

const calculateTestamentProgress = (
  books: [string, BibleBook][]
) => {
  let totalChapters = 0;
  let readChapters = 0;

  books.forEach(([bookKey, book]) => {
    totalChapters += book.chapters;
    const bookProgress = tracker.progress[bookKey] || {};
    readChapters += Object.values(bookProgress).filter(Boolean).length;
  });

  if (totalChapters === 0) return "0.0";

  const percent = (readChapters / totalChapters) * 100;
  return percent.toFixed(1); // Всегда 1 знак после запятой, например: "73.4"
};

  const oldTestamentProgress = calculateTestamentProgress(oldTestamentBooks);
  const newTestamentProgress = calculateTestamentProgress(newTestamentBooks);
  const totalBibleProgress = calculateTestamentProgress(allBooks);

  const renderBookList = (books: [string, BibleBook][]) => {
    return books.map(([bookKey, book]) => {
      const bookProgress = tracker.progress[bookKey] || {};
      const readChapters = Object.values(bookProgress).filter(Boolean).length;
      const percent = book.chapters > 0 ? Math.round((readChapters / book.chapters) * 100) : 0;

      return (
        <div
          key={bookKey}
          className="book-item"
          onClick={() => navigate(`/tracker/${tracker.id}/book/${bookKey}`)}
        >
          <div className="book-short-title">{book.shortTitle}</div>
          <div className="book-full-title">{book.title}</div>
          <div className="book-progress-bar">
            <div
              className="book-progress-fill"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      );
    });
  };

  const scrollToRef = (ref: React.RefObject<HTMLHeadingElement>) => {
    if (ref.current) {
      const container = document.querySelector('.tracker-detail-content');
      if (container) {
        const topOffset = ref.current.offsetTop - 60;
        container.scrollTo({
          top: topOffset,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <div
    style={{
          position: 'absolute',
          top: '56px',
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: 'auto',
          backgroundColor: '#F6F6F6'
        }} className="tracker-detail-wrapper">
      <TopBar
        title={tracker.name}
        showBackButton={true}
        showRightButton={false}
      />

      <div className="tracker-detail-content">
        {/* === Круг "вся библия" — ОТДЕЛЬНО СВЕРХУ, УВЕЛИЧЕННЫЙ === */}
        <div className="bible-overall-card">
          <div className="bible-circle">
            <svg width="140" height="140" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#667eea"
                strokeWidth="3"
                strokeDasharray={`${totalBibleProgress} 100`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
            </svg>
            <div className="bible-circle-text">
              <div className="bible-circle-title">Вся Библия</div>
              <div className="bible-circle-percent">{totalBibleProgress}%</div>
            </div>
          </div>
        </div>

        {/* === Информация по заветам: ВЗ и НЗ рядом === */}
        <div className="testament-progress-card">
          <div className="testament-progress-item">
            <div className="progress-percent">{oldTestamentProgress}%</div>
            <div className="progress-label">Ветхий Завет</div>
          </div>
          <div className="testament-progress-item">
            <div className="progress-percent">{newTestamentProgress}%</div>
            <div className="progress-label">Новый Завет</div>
          </div>
        </div>

        {/* === Списки книг === */}
        <h2 ref={oldTestamentRef} className="testament-title">Ветхий Завет</h2>
        <div className="books-grid">
          {renderBookList(oldTestamentBooks)}
        </div>

        <h2 ref={newTestamentRef} className="testament-title">Новый Завет</h2>
        <div className="books-grid">
          {renderBookList(newTestamentBooks)}
        </div>

        {/* === Кнопки навигации внизу === */}
        <div className="testament-nav-buttons">
          <button
            className="nav-button"
            onClick={() => scrollToRef(oldTestamentRef)}
          >
            Ветхий Завет
          </button>
          <button
            className="nav-button"
            onClick={() => scrollToRef(newTestamentRef)}
          >
            Новый Завет
          </button>
        </div>
      </div>
    </div>
  );
}