import { useState, useEffect } from 'react';
import DayList from '../components/DayList';
import Menu from '../components/Menu';
import type { ReadingDay } from '../utils/types';

import '../App.css';

interface MainScreenProps {
  plan: ReadingDay[];
  onToggle: (dayNumber: number) => void;
  onResetAll: () => void;
  continueFromDay: (dayNumber: number) => void;
}

export default function MainScreen({ plan, onToggle, onResetAll, continueFromDay }: MainScreenProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [clearAll, setClearAll] = useState(false);
  const [scrollToDay, setScrollToDay] = useState<number | null>(null);
  const [bannerVisible, setBannerVisible] = useState(false);

  const todayISO = new Date().toISOString().split('T')[0];

  // === Определяем статус ===
  let statusMessage = '';
  let statusClass = '';

  const firstUncompleted = plan.find(day => !day.completed);

  if (!firstUncompleted) {
    statusMessage = '🎉 Поздравляем! Ты завершил весь план чтения!';
    statusClass = 'status-completed';
  } else {
    const firstUncompletedDate = new Date(firstUncompleted.date);
    const today = new Date(todayISO);
    const timeDiff = firstUncompletedDate.getTime() - today.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (dayDiff > 0) {
      statusMessage = `✅ Ты опережаешь график на ${dayDiff} дн.`;
      statusClass = 'status-ahead';
    } else if (dayDiff < 0) {
      statusMessage = `⚠️ Ты отстаёшь от графика на ${-dayDiff} дн.`;
      statusClass = 'status-behind';
    } else {
      statusMessage = '📅 Сегодняшний день ещё не прочитан.';
      statusClass = 'status-on-time';
    }
  }

  // === Анимация появления баннера ===
  useEffect(() => {
    const timer = setTimeout(() => setBannerVisible(true), 100);
    return () => clearTimeout(timer);
  }, [statusMessage]);

  // === Скролл ===
  useEffect(() => {
    if (scrollToDay !== null) {
      const el = document.getElementById(`day-${scrollToDay}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setScrollToDay(null);
    }
  }, [scrollToDay]);

  // === Обработчики ===
  const handleContinueFromDay = (day: number) => {
    continueFromDay(day);
    setModalOpen(false);
    setScrollToDay(day);
  };

  return (
    <div className="app-container">
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      <h1>📖 Библия за 111 дней</h1>

      {/* === Баннер статуса с анимацией === */}
      <div className={`status-banner ${statusClass} ${bannerVisible ? 'status-banner-visible' : ''}`}>
        {statusMessage}
      </div>

      <DayList plan={plan} onToggle={onToggle} />

      <Menu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onReset={() => setClearAll(true)}
        onContinue={() => setModalOpen(true)}
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
                  if (isNaN(day) || day < 1 || day > 111) return;
                  handleContinueFromDay(day - 1);
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
                  if (!input) return;
                  const day = parseInt(input.value);
                  if (isNaN(day) || day < 1 || day > 111) return;
                  handleContinueFromDay(day - 1);
                }}
              >
                Применить
              </button>
            </div>
          </div>
        </div>
      )}

      {clearAll && (
        <div className="modal-overlay active">
          <div className="modal">
            <h3>Сбросить план</h3>
            <p>Вы действительно хотите сбросить текущий план чтения?<br /></p>
            <div className="modal-buttons">
              <button className="modal-btn cancel" onClick={() => setClearAll(false)}>
                Отмена
              </button>
              <button
                className="modal-btn confirm"
                onClick={() => {
                  onResetAll();
                  setClearAll(false);
                }}
              >
                Сбросить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}