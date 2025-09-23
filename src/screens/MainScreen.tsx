// src/screens/MainScreen.tsx
import { useState } from 'react';
import DayList from '../components/DayList';
import Menu from '../components/Menu';
import ToastNotification from '../components/ToastNotification';
import CurrentDayButton from '../components/CurrentDayButton';
import { useBiblePlan } from '../hooks/useBiblePlan';

import './MainScreen.css';

interface MainScreenProps {
  onDayClick: (index: number) => void;
  onContinueFromDay: (day: number) => void;
  showToast: (message: string) => void;
}

export default function MainScreen({
  onDayClick,
  onContinueFromDay,
  showToast,
}: MainScreenProps) {
  const {
    state,
    startDay,
    toggleDay,
    resetProgress,
    completedCount,
  } = useBiblePlan();

  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [scrollToDay, setScrollToDay] = useState<number | null>(null);

  const handleToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 2500);
  };

  const handleContinueFromDay = (day: number) => {
    onContinueFromDay(day);
    setModalOpen(false);
    handleToast(`✅ День ${day} установлен как сегодня!`);
    setScrollToDay(day);
  };

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

      <div id="list-wrapper">
        <DayList
          state={state}
          startDay={startDay}
          onToggleDay={toggleDay}
          onDayClick={onDayClick}
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
                    handleToast('❌ Введи корректный номер дня (1–111)');
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
                    handleToast('❌ Элемент ввода не найден');
                    return;
                  }
                  const day = parseInt(input.value);
                  if (isNaN(day) || day < 1 || day > 111) {
                    handleToast('❌ Введи корректный номер дня (1–111)');
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

      <CurrentDayButton startDay={startDay} />
    </>
  );
}