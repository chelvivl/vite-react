// src/components/DetailScreen.tsx (или где он у тебя)
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import TopBar from '../components/TopBar'; // ← подключи TopBar
import ChapterCard from '../components/ChapterCard';
import type { BibleReading, ReadingDay } from '../utils/types';

interface DetailScreenProps {
  plan: ReadingDay[];
  onToggleChapter: (bookKey: string, chapter: number) => void;
}

export default function DetailScreen({ plan, onToggleChapter }: DetailScreenProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDay = location.state?.number;

      // 🔥 Сбрасываем прокрутку наверх при входе на экран
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // Пустой массив = выполнится один раз при монтировании

  // Защита от ошибок
  if (selectedDay === undefined || !plan[selectedDay]) {
    navigate('/'); // или куда-то безопасно
    return null;
  }

  const day = plan[selectedDay];

  // Заголовок для TopBar
  const title = `День ${day.day}`;

  return (
    <div style={{paddingTop: '56px'}}>
      <TopBar title={title} showBackButton={true}/>
      <div
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