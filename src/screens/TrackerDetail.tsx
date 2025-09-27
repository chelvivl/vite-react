// src/screens/TrackerDetail.tsx
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (id) {
      const found = trackers.find(t => t.id === id);
      if (found) {
        setTracker(found);
      } else {
      }
    }
  }, [id, trackers, navigate]);

  if (!tracker) {
    return <div className="tracker-detail">Загрузка...</div>;
  }

  return (
    <div style={{ paddingTop: '56px' }}>
      <TopBar
        title={tracker.name}
        showBackButton={true}
        showRightButton={false}
      />

      <div  style={{
          position: 'absolute',
          top: '56px',
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: 'auto',
          paddingTop: '16px',
          paddingRight: '16px',
          paddingLeft: '16px',
          backgroundColor: '#F6F6F6'
        }}>
        {/* Здесь будет список книг */}
        {Object.entries(ALL_BOOKS).map(([bookKey, book]) => {
          const bookProgress = tracker.progress[bookKey] || {};
          const readChapters = Object.values(bookProgress).filter(Boolean).length;
          const percent = book.chapters > 0 ? Math.round((readChapters / book.chapters) * 100) : 0;

          return (
            <div key={bookKey} className="book-item">
              <div className="book-info">
                <h3>{book.title}</h3>
                <span>{readChapters} / {book.chapters}</span>
              </div>
              <div className="book-progress-bar">
                <div
                  className="book-progress-fill"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div   >
  );
}