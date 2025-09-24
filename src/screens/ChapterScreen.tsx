import { useNavigate, useLocation } from 'react-router-dom';

export default function ChapterScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const chapter = location.state?.chapter;

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="detail-view">
      <div className="detail-header">
        <button
          className="back-button"
          onClick={() => handleGoBack()}
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
        <h2 className="detail-title">
        {chapter}
        </h2>
        <div></div> {/* для центрирования заголовка */}
      </div>
    </div>
  );
}