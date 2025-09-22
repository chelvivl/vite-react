import { format, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function DayItem({ dayIndex, text, date, isCompleted, isOverdue, onToggle }) {
  const dayNumber = dayIndex + 1;
  const dateStr = format(date, 'd MMMM', { locale: ru });

  return (
    <div
      className={`day ${isCompleted ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
      onClick={(e) => {
        if (e.target.tagName === 'INPUT') return;
        onToggle();
      }}
    >
      <div className="day-text">
        <strong>День {dayNumber}</strong>: {text}<br />
        <small>{dateStr}</small>
      </div>
      <input
        type="checkbox"
        className="check"
        checked={isCompleted}
        onChange={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      />
    </div>
  );
}