import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import ChapterCard from "../components/ChapterCard";
import type { BibleReading, ReadingDay } from "../utils/types";

interface DetailScreenProps {
  plan: ReadingDay[];
  onToggleChapter: (bookKey: string, chapter: number) => void;
}

export default function DetailScreen({ plan, onToggleChapter }: DetailScreenProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDay = location.state?.number;

  // Все хуки — строго в начале, без условий!
  const contentRef = useRef<HTMLDivElement>(null);

  // Проверка валидности и навигация — через useEffect или после хуков
  useEffect(() => {
    if (selectedDay == null || selectedDay < 0 || selectedDay >= plan.length) {
      navigate(-1);
    }
  }, [selectedDay, plan.length, navigate]);

  // Если данные некорректны — рендерим null, но ПОСЛЕ хуков
  if (selectedDay == null || selectedDay < 0 || selectedDay >= plan.length) {
    return null;
  }

  const day = plan[selectedDay];

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, []);

  return (
    <div className="detail-view">
      <header className="detail-header">
        <button
          className="back-button"
          onClick={handleGoBack}
          aria-label="Назад к списку дней"
          type="button"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 6L9 12L15 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h2 className="detail-title">
          День {day.day}: {day.title}
        </h2>
      </header>

      <main className="detail-content" ref={contentRef}>
        <div id="list">
          {day.readings.map((dayChapter: BibleReading) => (
            <div key={`${dayChapter.bookKey}-${dayChapter.chapter}`}>
              <ChapterCard
                chapter={dayChapter.chapter}
                bookKey={dayChapter.bookKey}
                bookName={dayChapter.bookName}
                completed={dayChapter.completed}
                onToggleChapter={onToggleChapter}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}