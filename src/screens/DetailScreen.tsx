// src/components/DetailScreen.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import TopBar from '../components/TopBar';
import ChapterCard from '../components/ChapterCard';
import type { BibleReading, ReadingDay } from '../utils/types';
import { useRef, useLayoutEffect } from 'react';

interface DetailScreenProps {
  plan: ReadingDay[];
  onToggleChapter: (bookKey: string, chapter: number) => void;
}

export default function DetailScreen({ plan, onToggleChapter }: DetailScreenProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDay = location.state?.number;
  const containerRef = useRef<HTMLDivElement>(null);

  // Защита
  if (selectedDay === undefined || !plan[selectedDay]) {
    navigate('/');
    return null;
  }

  const day = plan[selectedDay];
  const title = `День ${day.day}`;
  const scrollKey = `detailScrollTop_day_${selectedDay}`;

  // Восстанавливаем прокрутку для этого дня
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (el) {
      const saved = sessionStorage.getItem(scrollKey);
      el.scrollTop = saved ? Number(saved) : 0;
    }
  }, [scrollKey]);

  // Сохраняем прокрутку для этого дня
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      sessionStorage.setItem(scrollKey, String(el.scrollTop));
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [scrollKey]);

  return (
    <div style={{ paddingTop: '56px' }}>
      <TopBar
        title={title}
        showBackButton={true}
      />
      <div
        ref={containerRef}
        style={{
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
        }}
      >
        {day.readings.map((dayChapter: BibleReading) => (
          <ChapterCard
            key={`${dayChapter.bookKey}-${dayChapter.chapter}`}
            chapter={dayChapter.chapter}
            bookKey={dayChapter.bookKey}
            bookName={dayChapter.bookName}
            bookId={dayChapter.bookId}
            completed={dayChapter.completed}
            onToggleChapter={onToggleChapter}
          />
        ))}
      </div>
    </div>
  );
}