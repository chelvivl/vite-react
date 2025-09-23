// src/App.tsx — стал тонким "менеджером экранов"
import { useState, useEffect, useRef } from 'react';
import { useBiblePlan } from './hooks/useBiblePlan';
import MainScreen from './screens/MainScreen';
import DetailScreen from './screens/DetailScreen';

import './App.css'; // можно оставить только общие стили (если есть)

function App() {
  const { continueFromDay } = useBiblePlan();

  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef(0);

  const handleDayClick = (index: number) => {
    if (listRef.current) {
      scrollPosition.current = listRef.current.scrollTop;
    }
    setSelectedDayIndex(index);
  };

  const handleBack = () => {
    setSelectedDayIndex(null);
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollTop = scrollPosition.current;
      }
    }, 50);
  };

  const handleContinueFromDay = (day: number) => {
    continueFromDay(day);
    // Скролл будет обработан через эффект в MainScreen (если нужно — можно вынести сюда)
  };

  const showToast = (message: string) => {
    // Можно реализовать через контекст или передавать в MainScreen
    alert(message); // временно, или используй свой Toast
  };

  if (selectedDayIndex !== null) {
    return <DetailScreen dayIndex={selectedDayIndex} onBack={handleBack} />;
  }

  return (
    <MainScreen
      onDayClick={handleDayClick}
      onContinueFromDay={handleContinueFromDay}
      showToast={showToast}
    />
  );
}

export default App;