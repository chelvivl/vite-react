// App.tsx — обновлённая версия с экраном деталей дня
import { useState, useEffect } from 'react';
import { useBiblePlan } from './hooks/useBiblePlan';
import DayList from './components/DayList';
import Menu from './components/Menu';
import ToastNotification from './components/ToastNotification';
import { plan } from './utils/plan'; // 👈 импортируем план для отображения текста

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

  // Основной экран (список дней)
  return (
    <>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      <h1>📖 Библия за 111 дней</h1>

      <div className="stats">
        Прогресс: {completedCount} из {state.length}
      </div>

      <DayList
        state={state}
        startDay={startDay}
        onToggleDay={toggleDay}
      />

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
      ) }

      <ToastNotification show={toast.show} message={toast.message} />
    </>
  );
}

export default App;