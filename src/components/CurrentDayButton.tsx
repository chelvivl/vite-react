import { useEffect, useState } from 'react';

export default function CurrentDayButton({ startDay }) {
  const [isVisible, setIsVisible] = useState(false);
  const [direction, setDirection] = useState('⬇️');

  useEffect(() => {
    const updateButton = () => {
      const currentDayEl = document.getElementById(`day-${startDay}`);
      if (!currentDayEl) {
        setIsVisible(false);
        return;
      }

      const rect = currentDayEl.getBoundingClientRect();
      const isVisibleInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;

      if (isVisibleInViewport) {
        setIsVisible(false);
        return;
      }

      setIsVisible(true);
      setDirection(rect.top < 0 ? '⬆️' : '⬇️');
    };

    updateButton();
    window.addEventListener('scroll', updateButton, { passive: true });

    return () => window.removeEventListener('scroll', updateButton);
  }, [startDay]);

  const scrollToCurrentDay = () => {
    const currentDayEl = document.getElementById(`day-${startDay}`);
    if (currentDayEl) {
      currentDayEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <button
      id="current-day-btn"
      className={isVisible ? 'show' : ''}
      onClick={scrollToCurrentDay}
      aria-label="Прокрутить к текущему дню"
    >
      {direction}
    </button>
  );
}