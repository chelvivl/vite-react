import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

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
  const dayNumber = dayIndex + 1;
  const dateStr = format(date, 'd MMMM', { locale: ru });

  return (
    <div
      className={`day ${isCompleted ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
      onClick={(e) => {
      if (e.target instanceof HTMLInputElement) return;
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