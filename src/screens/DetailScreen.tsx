import { useNavigate } from "react-router-dom";
import { plan } from "../utils/plan";
import { useLocation } from "react-router-dom";
import ChapterCard from "../components/ChapterCard";

export default function DetailScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDay = location.state?.number;

  const dayText = plan[selectedDay]; // текст дня
  const dayNumber = selectedDay + 1; // номер дня

  const handleGoBack = () => {
    navigate(-1); // 👈 возврат на предыдущую страницу в истории
    // или: navigate('/'); — если хочешь всегда возвращаться на главную
  };

  const chapters = parseReadingPlan(dayText);

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
          День {dayNumber}: {dayText}
        </h2>
        <div></div> {/* для центрирования заголовка */}
      </div>
      <div >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {chapters.map((chapter, index) => (
            <ChapterCard key={index} chapter={chapter} onToggle={ () => {}} />
          ))}
        </div>
      </div>
    </div>
  );
}

function parseReadingPlan(text: string) {
  const result: string[] = [];

  // Разделяем по запятым (книги)
  const bookRanges = text.split(",").map((part) => part.trim());

  for (const bookRange of bookRanges) {
    // Разделяем название книги и диапазон глав
    const match = bookRange.match(/^([^\d]+)\s*(\d+)–(\d+)$/);

    if (!match) {
      console.warn(`Не удалось распарсить: ${bookRange}`);
      continue;
    }

    const [, bookName, startStr, endStr] = match;
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);

    // Генерируем главы
    for (let i = start; i <= end; i++) {
      result.push(`${bookName.trim()} ${i}`);
    }
  }

  return result;
}
