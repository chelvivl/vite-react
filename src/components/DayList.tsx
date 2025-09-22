import { useState, useEffect, useMemo } from 'react';
import { startOfDay, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import DayItem from './DayItem';
import MonthHeader from './MonthHeader';
import { plan } from '../utils/plan';

interface DayData {
  index: number;
  text: string;
  date: Date;
  isCompleted: boolean;
  isOverdue: boolean;
}

interface GroupedMonth {
  monthDate: Date;
  days: DayData[];
}

interface DayListProps {
  state: boolean[];
  startDay: number;
  onToggleDay: (index: number) => void;
}

export default function DayList({ state, startDay, onToggleDay }: DayListProps) {
  const today = startOfDay(new Date());

  const dayData = useMemo<DayData[]>(() => {
    return plan.map((text, index) => {
      const dayOffset = index + 1 - startDay;
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() + dayOffset);
      const isCompleted = state[index];
      const isOverdue = dayDate < today && !isCompleted;

      return {
        index,
        text,
        date: dayDate,
        isCompleted,
        isOverdue,
      };
    });
  }, [state, startDay, today]);

  const groupedByMonth = useMemo<GroupedMonth[]>(() => {
    const groups: GroupedMonth[] = [];
    let currentMonth: string | null = null;

    dayData.forEach(item => {
      const monthKey = format(item.date, 'yyyy-MM', { locale: ru });
      if (monthKey !== currentMonth) {
        currentMonth = monthKey;
        groups.push({
          monthDate: item.date,
          days: [],
        });
      }
      groups[groups.length - 1].days.push(item);
    });

    return groups;
  }, [dayData]);

  return (
    <div id="list">
      {groupedByMonth.map((group, idx) => (
        <div key={idx}>
          <MonthHeader date={group.monthDate} />
          {group.days.map(item => (
            <DayItem
              key={item.index}
              dayIndex={item.index}
              text={item.text}
              date={item.date}
              isCompleted={item.isCompleted}
              isOverdue={item.isOverdue}
              onToggle={() => onToggleDay(item.index)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}