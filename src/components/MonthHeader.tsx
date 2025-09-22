import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function MonthHeader({ date }) {
  const monthYearStr = format(date, 'LLLL yyyy', { locale: ru });
  return (
    <div className="month-header">
      📅 {monthYearStr}
    </div>
  );
}