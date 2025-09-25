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
  const title = `День ${day.day}: ${day.title}`;

  return (
    <div className="detail-view">
      <TopBar title={title} showBackButton={true}/>

      <div id="list" className="detail-list">
        {day.readings.map((dayChapter: BibleReading) => (
          <ChapterCard
            key={`${dayChapter.bookKey}-${dayChapter.chapter}`}
            chapter={dayChapter.chapter}
            bookKey={dayChapter.bookKey}
            bookName={dayChapter.bookName}
            completed={dayChapter.completed}
            onToggleChapter={onToggleChapter}
          />
        ))}
      </div>
    </div>
  );
}