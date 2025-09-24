import DayItem from './DayItem';
import type { ReadingDay } from '../utils/types';

interface DayListProps {
  plan: ReadingDay[];
  onToggle: (dayNumber: number) => void;
}

export default function DayList({ plan, onToggle }: DayListProps) {
   const todayISO = new Date().toISOString().split('T')[0];
  return (
    <div id="list">
      {plan.map( (day: ReadingDay) => {
            const isOverdue = day.date < todayISO && !day.completed;

            return (
        <div key={day.day}>
           <DayItem
              key={day.day}
              dayIndex={day.day - 1}
              text={day.title}
              date={day.date}
              isCompleted={day.completed}
              isOverdue={isOverdue}
              isCurrentDay={false}
              onToggle={() => {
                console.log("этого дня: " + day.date)
                console.log("сегодня: " + todayISO)
              onToggle(day.day)
              }}
            />
        </div>
      )
      })}
    </div>
  );
}