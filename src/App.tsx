// App.tsx — с анимациями и сохранением позиции
import { useState, useEffect, useRef } from 'react'; // 👈 добавлен useRef
import { useBiblePlan } from './hooks/useBiblePlan';
import DayList from './components/DayList';
import Menu from './components/Menu';
import ToastNotification from './components/ToastNotification';
import { plan } from './utils/plan';

import './App.css';

function App() {
  const {
    state,
    startDay,
    toggleDay,
    resetProgress,
    continueFromDay,
    completedCount,
  } = useBiblePlan();

  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [scrollToDay, setScrollToDay] = useState<number | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false); // 👈 для анимации

  // 👇 сохраняем позицию скролла
  const listRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef(0);

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 2500);
  };

  const handleContinueFromDay = (day: number) => {
    continueFromDay(day);
    setModalOpen(false);
    showToast(`✅ День ${day} установлен как сегодня!`);
    setScrollToDay(day);
  };

  useEffect(() => {
    if (scrollToDay !== null) {
      const el = document.getElementById(`day-${scrollToDay}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setScrollToDay(null);
    }
  }, [scrollToDay]);

  // 👇 Сохраняем позицию скролла перед уходом в детали
  const handleDayClick = (index: number) => {
    if (listRef.current) {
      scrollPosition.current = listRef.current.scrollTop;
    }
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedDayIndex(index);
      setIsTransitioning(false);
    }, 300); // Длина анимации — 300мс
  };

  // 👇 Восстанавливаем позицию скролла при возврате
  const handleBack = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedDayIndex(null);
      setIsTransitioning(false);
      // Восстанавливаем скролл в следующем кадре, после рендера
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollTop = scrollPosition.current;
        }
      }, 50);
    }, 300);
  };

  // Если выбран день — показываем экран деталей с анимацией
  if (selectedDayIndex !== null) {
    const dayText = plan[selectedDayIndex];
    const dayNumber = selectedDayIndex + 1;

    return (
      <div className={`detail-view ${isTransitioning ? 'slide-in' : ''}`}>
        <div className="detail-header">
          <button
            className="back-button"
            onClick={handleBack} // 👈 используем handleBack
            aria-label="Назад к списку дней"
          >
            ←
          </button>
          <h2 className="detail-title">
            День {dayNumber}: {dayText}
          </h2>
          <div className="placeholder-right"></div>
        </div>

        <div className="detail-content">
          <p>📖 Здесь будет содержание дня {dayNumber}...</p>
        </div>
      </div>
    );
  }

  // Основной экран — обернут в анимированный контейнер
  return (
    <div className={`main-view ${isTransitioning ? 'slide-out' : ''}`}>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      <h1>📖 Библия за 111 дней</h1>

      <div className="stats">
        Прогресс: {completedCount} из {state.length}
      </div>

      {/* 👇 Оборачиваем список в div с ref */}
      <div ref={listRef} id="list-wrapper" style={{ overflowY: 'auto', height: 'calc(100svh - 200px)' }}>
        <DayList
          state={state}
          startDay={startDay}
          onToggleDay={toggleDay}
          onDayClick={handleDayClick} // 👈 используем handleDayClick
        />
      </div>

      <Menu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onReset={resetProgress}
        onContinue={() => setModalOpen(true)}
        showToast={showToast}
      />

      {modalOpen && (
        <div className="modal-overlay active">
          <div className="modal">
            <h3>📖 Продолжить с дня...</h3>
            <p>Введи номер дня, который ты читаешь <strong>сегодня</strong><br /><small>Все предыдущие дни будут отмечены</small></p>
            <input
              type="number"
              id="day-input"
              min="1"
              max="111"
              placeholder="Например: 33"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const target = e.target as HTMLInputElement;
                  const day = parseInt(target.value);
                  if (isNaN(day) || day < 1 || day > 111) {
                    showToast('❌ Введи корректный номер дня (1–111)');
                    return;
                  }
                  handleContinueFromDay(day);
                }
              }}
            />
            <div className="modal-buttons">
              <button className="modal-btn cancel" onClick={() => setModalOpen(false)}>
                Отмена
              </button>
              <button
                className="modal-btn confirm"
                onClick={() => {
                  const input = document.getElementById('day-input') as HTMLInputElement | null;
                  if (!input) {
                    showToast('❌ Элемент ввода не найден');
                    return;
                  }
                  const day = parseInt(input.value);
                  if (isNaN(day) || day < 1 || day > 111) {
                    showToast('❌ Введи корректный номер дня (1–111)');
                    return;
                  }
                  handleContinueFromDay(day);
                }}
              >
                Применить
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastNotification show={toast.show} message={toast.message} />
    </div>
  );
}

export default App;