import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainScreen from './screens/MainScreen';
import DetailScreen from './screens/DetailScreen';
import ChapterScreen from './screens/ChapterScreen';
import { useState, useEffect } from 'react';
import { generateBibleReadingPlan } from './utils/generateReadingPlan'
import { adjustPlanDates } from './utils/utils'
import type { ReadingDay } from './utils/types';
import { MainScreenProvider } from './contexts/MainScreenStateContext';

function App() {

  const [plan, setPlan] = useState<ReadingDay[]>([]);

    // Загрузка при старте
  useEffect(() => {
    const saved = localStorage.getItem('bibleReadingPlan');
    if (saved) {
      try {
        setPlan(JSON.parse(saved));
        return;
      } catch (e) {
        console.warn('Не удалось загрузить сохранённый план');
      }
    }
    // Если нет сохранённого — создаём новый
    setPlan(generateBibleReadingPlan());
  }, []);

 const toggleDay = (dayNumber: number) => {
  const updatedPlan = plan.map((day:ReadingDay) => {
    if (day.day === dayNumber) {
      // Определяем новый статус: если день был завершён — снимаем, иначе — ставим
      const newDayCompleted = !day.completed;

      // Обновляем КАЖДУЮ главу в этом дне
      const updatedReadings = day.readings.map(reading => ({
        ...reading,
        completed: newDayCompleted, // все главы = статусу дня
      }));

      return {
        ...day,
        completed: newDayCompleted,
        readings: updatedReadings,
      };
    }
    return day;
  });

  setPlan(updatedPlan);
  localStorage.setItem('bibleReadingPlan', JSON.stringify(updatedPlan));
};


    const toggleChapter = (bookKey: string, chapter: number) => {
      const updatedPlan = plan.map(day => {
        const updatedReadings = day.readings.map(reading => {
          if (reading.bookKey === bookKey && reading.chapter === chapter) {
            return { ...reading, completed: !reading.completed };
          }
          return reading;
        });

        // Опционально: обновить статус дня (если все главы прочитаны)
        const dayCompleted = updatedReadings.every(r => r.completed);

        return {
          ...day,
          readings: updatedReadings,
          completed: dayCompleted, // синхронизируем с прогрессом глав
        };
      });

      setPlan(updatedPlan);
      localStorage.setItem('bibleReadingPlan', JSON.stringify(updatedPlan));
};


   // Сброс прогресса
  const resetProgress = () => {
    const freshPlan = generateBibleReadingPlan();
    setPlan(freshPlan);
    localStorage.setItem('bibleReadingPlan', JSON.stringify(freshPlan));
  };

 const continueFromDay = (dayNumber: number) => {
  if (dayNumber < 1 || dayNumber > plan.length) return;

  const updatedPlan = plan.map(day => {
    if (day.day < dayNumber) {
      // Все дни ДО target — полностью прочитаны
      return {
        ...day,
        readings: day.readings.map(r => ({ ...r, completed: true })),
        completed: true,
      };
    } else if (day.day === dayNumber) {
      // Целевой день — тоже полностью прочитан (пользователь говорит: "я читаю его СЕГОДНЯ", значит, уже прочитал)
      return {
        ...day,
        readings: day.readings.map(r => ({ ...r, completed: true })),
        completed: true,
      };
    } else {
      // Дни ПОСЛЕ — не прочитаны
      return {
        ...day,
        readings: day.readings.map(r => ({ ...r, completed: false })),
        completed: false,
      };
    }
  });

  // Пересчитываем даты
  const adjustedPlan = adjustPlanDates(updatedPlan, dayNumber);
  setPlan(adjustedPlan);
  localStorage.setItem('bibleReadingPlan', JSON.stringify(adjustedPlan));
};

  return (
 <MainScreenProvider>
    <BrowserRouter>
      <div style={{
      minHeight: '100dvh',
    }}>
          <Routes>
         <Route path="/" element={<MainScreen plan={plan} onToggle={toggleDay} onResetAll={resetProgress} continueFromDay={continueFromDay}/>} />
         <Route path="/detail" element={<DetailScreen plan={plan} onToggleChapter={toggleChapter}/>} />
         <Route path="/chapter" element={<ChapterScreen />} />
         </Routes>

      </div>
    </BrowserRouter>
       </MainScreenProvider>
  );
}

export default App;