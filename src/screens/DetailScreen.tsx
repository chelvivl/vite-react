// src/screens/DetailScreen.tsx
import { plan } from '../utils/plan';
import './DetailScreen.css';

interface DetailScreenProps {
  dayIndex: number;
  onBack: () => void;
}

export default function DetailScreen({ dayIndex, onBack }: DetailScreenProps) {
  const dayText = plan[dayIndex];
  const dayNumber = dayIndex + 1;

  return (
    <div className="detail-screen">
      <div className="detail-header">
        <button
          className="back-button"
          onClick={onBack}
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