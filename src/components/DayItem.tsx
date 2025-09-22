import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';

interface DayItemProps {
  dayIndex: number;
  text: string;
  date: Date;
  isCompleted: boolean;
  isOverdue: boolean;
  onToggle: () => void;
}

export default function DayItem({
  dayIndex,
  text,
  date,
  isCompleted,
  isOverdue,
  onToggle,
}: DayItemProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const dayNumber = dayIndex + 1;
  const dateStr = format(date, 'd MMMM', { locale: ru });

  const handleToggle = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.stopPropagation();
    }

    // Запускаем анимацию
    setIsAnimating(true);

    // Через 150мс меняем состояние
    setTimeout(() => {
      onToggle();
      setIsAnimating(false);
    }, 150);
  };

  return (
    <div
      className={`day ${isCompleted ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('.check-icon')) return;
        handleToggle();
      }}
    >
      <div className="day-text">
        <strong>День {dayNumber}</strong>: {text}<br />
        <small>{dateStr}</small>
      </div>
      <div
        className={`check-icon ${isAnimating ? 'animating' : ''}`}
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        aria-label={isCompleted ? "Отметить как не выполненное" : "Отметить как выполненное"}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
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
            <circle cx="12" cy="12" r="10" fill="transparent" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
          </svg>
        )}
      </div>
    </div>
  );
}