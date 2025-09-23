// components/ChapterCard.tsx
import { useState } from 'react';

interface ChapterCardProps {
  chapter: string; // например: "Бытие 1"
  initiallyCompleted?: boolean;
  onToggle?: (chapter: string, isCompleted: boolean) => void;
}

export default function ChapterCard({
  chapter,
  initiallyCompleted = false,
  onToggle,
}: ChapterCardProps) {
  const [isCompleted, setIsCompleted] = useState(initiallyCompleted);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    const newStatus = !isCompleted;
    setIsCompleted(newStatus);

    // Через 300ms убираем анимацию
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);

    // Уведомляем родителя
    onToggle?.(chapter, newStatus);
  };

  return (
    <div
      className={`day ${isCompleted ? 'completed' : ''}`}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('.check-icon')) return; // игнорируем клик по чекбоксу
        handleToggle();
      }}
    >
      {/* Текст главы */}
      <div className="day-text" style={{ textAlign: 'left', flex: 1 }}>
        <strong>{chapter}</strong>
      </div>

      {/* Чекбокс справа */}
      <div
        className={`check-icon ${isAnimating ? 'animating' : ''}`}
        onClick={(e) => {
          e.stopPropagation(); // не всплываем до карточки
          handleToggle();
        }}
        role="button"
        tabIndex={0}
        aria-label={isCompleted ? "Отметить как не выполненное" : "Отметить как выполненное"}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
        style={{
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        {isCompleted ? (
          <svg
            className={`check-icon-svg ${isAnimating ? 'fade-out' : 'fade-in'}`}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" fill="#4CAF50" stroke="white" strokeWidth="2" />
            <path
              d="M7 12.5L10 15.5L17 8.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            className={`check-icon-svg ${isAnimating ? 'fade-out' : 'fade-in'}`}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" fill="transparent" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
          </svg>
        )}
      </div>
    </div>
  );
}