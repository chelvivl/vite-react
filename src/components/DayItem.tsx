// DayItem.tsx — обновлённая версия
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DayItemProps {
  dayIndex: number;
  text: string;
  date: string;
  isCompleted: boolean;
  isOverdue: boolean;
  isCurrentDay: boolean;
  onToggle: () => void;
}

export default function DayItem({
  dayIndex,
  text,
  date,
  isCompleted,
  isOverdue,
  isCurrentDay,
  onToggle
}: DayItemProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const dayNumber = dayIndex + 1;
  const dateStr = format(date, 'd MMMM', { locale: ru });

const navigate = useNavigate();

 const handleClick = (dayIndex: number) => {
    navigate('/detail', {
      state: { number: dayIndex}, // 👈 передаём число
    });
  };

  const handleToggle = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.stopPropagation();
    }

    setIsAnimating(true);

    setTimeout(() => {
      onToggle();
      setIsAnimating(false);
    }, 150);
  };

return (
  <div
    id={`day-${dayNumber}`}
    className={`day ${isCompleted ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} ${
      isCurrentDay && !isCompleted ? 'current-day' : ''
    }`}
    onClick={(e) => {
      const target = e.target as HTMLElement;

      // Игнорируем клик по чекбоксу и по стрелке
      if (target.closest('.check-icon') || target.closest('.icon-arrow')) {
        return;
      }
      handleClick(dayIndex);
    }}
  >
    <div className="day-text">
      <strong>День {dayNumber}</strong>: {text}<br />
      <small>
        {dateStr}
        {isCurrentDay && (
          <span className="current-day-label"> ← Сегодня</span>
        )}
      </small>
    </div>

    {/* Чекбокс */}
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

    {/* Стрелка — открывает новый экран */}
    <svg
      className="icon-arrow"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: 'pointer' }}
    >
      <path
        d="M9 6L15 12L9 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);
}