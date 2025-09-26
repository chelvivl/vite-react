// components/ChapterCard.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ChapterCardProps {
  chapter: number,
  bookKey: string,
  bookName: String,
  bookId: number,
  completed: boolean,
  onToggleChapter: (bookKey: string, chapter: number) => void;
}

export default function ChapterCard({
  chapter, bookKey, bookName, bookId, completed, onToggleChapter
}: ChapterCardProps) {

  const [isAnimating] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
      onToggleChapter(bookKey, chapter)
  };

  const handleClick = () => {
    navigate('/chapter', {
      state: { chapter: chapter, bookName: bookName, bookId: bookId }, // 👈 передаём число
    });
//       onToggleChapter(bookKey, chapter)
  };

  return (
    <div
      className={`day ${completed ? 'completed' : ''}`}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('.check-icon')) return; // игнорируем клик по чекбоксу
        handleClick()
      }}
    >
      {/* Текст главы */}
      <div className="day-text" style={{ textAlign: 'left', flex: 1, color: 'black' }}>
        <div style={{color: 'black'}}>{bookName} {chapter}</div>
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
        aria-label={completed ? "Отметить как не выполненное" : "Отметить как выполненное"}
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
        {completed ? (
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