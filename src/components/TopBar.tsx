import { useNavigate } from 'react-router-dom';
import './TopBar.css';

interface TopBarProps {
  title: string;
  showBackButton?: boolean;
}

export default function TopBar({ title, showBackButton = true }: TopBarProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="detail-header">
      {showBackButton && (
           <button
          className="back-button"
          onClick={() => handleBack()}
          aria-label="Назад к списку дней"
          type="button"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 6L9 12L15 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      <h1 className="detail-title">{title}</h1>
      <div className="top-bar-spacer"></div> {/* для баланса */}
    </div>
  );
}