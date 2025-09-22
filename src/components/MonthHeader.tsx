import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface MonthHeaderProps {
  date: Date;
}

export default function MonthHeader({ date }: MonthHeaderProps) {
  const monthYearStr = format(date, 'LLLL yyyy', { locale: ru });
  return (
    <div className="month-header">
      📅 {monthYearStr}
    </div>
  );
}