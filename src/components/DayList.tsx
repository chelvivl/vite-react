import DayItem from "./DayItem";
import type { ReadingDay } from "../utils/types";
import { useEffect, useRef } from 'react';
import { useMainScreenState, useMainScreenActions } from '../contexts/MainScreenStateContext';

interface DayListProps {
  plan: ReadingDay[];
  onToggle: (dayNumber: number) => void;
}

// Вспомогательная функция для получения названия месяца по дате в формате 'YYYY-MM-DD'
const getMonthName = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleString("ru-RU", { month: "long" }); // "сентябрь", "октябрь" и т.д.
};

export default function DayList({ plan, onToggle }: DayListProps) {
  const todayISO = new Date().toISOString().split("T")[0];

  const { dayListScrollTop } = useMainScreenState();
  const { setDayListScrollTop } = useMainScreenActions();
  const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = dayListScrollTop;
        }
      }, []);

      // Сохранять прокрутку при скролле
      useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleScroll = () => {
          setDayListScrollTop(el.scrollTop);
        };

        el.addEventListener('scroll', handleScroll);
        return () => el.removeEventListener('scroll', handleScroll);
  }, [setDayListScrollTop]);

  return (
    <div
       ref={containerRef}
        style={{
          position: 'absolute',
          top: '56px',
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: 'auto',
          paddingTop: '16px',
          paddingRight: '16px',
          paddingLeft: '16px',
          backgroundColor: '#F6F6F6'
        }}
      >
      {plan.map((day: ReadingDay, index: number) => {
        const isOverdue = day.date < todayISO && !day.completed;

        // Проверяем, начинается ли новый месяц
        const showMonthHeader =
          index === 0 || // всегда показываем месяц для первого элемента
          day.date.substring(0, 7) !== plan[index - 1].date.substring(0, 7); // сравниваем YYYY-MM

        return (
          <div key={day.day} style={{color: 'black'}}>
            {index != 0 && showMonthHeader && (
              <div className="month-header">
                {getMonthName(day.date)}
              </div>
            )}
            <DayItem
              dayIndex={day.day - 1}
              text={day.title}
              date={day.date}
              isCompleted={day.completed}
              isOverdue={isOverdue}
              isCurrentDay={false}
              onToggle={() => {
                onToggle(day.day);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}