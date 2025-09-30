import BibleTopBar from '../../components/BibleTopBar'; // ← подключи TopBar
import { useState, useRef } from 'react';
import bibleData from '../../data/rst.json';
import { ALL_BOOKS } from '../../utils/bibleData';
import { useEffect } from 'react';
import { BibleData, Verse } from '../../types/bible';

const typedBibleData = bibleData as BibleData;

export default function BibleTab() {

  const [selectedBookKey, setSelectedBookKey] = useState('Genesis');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [verses, setVerses] = useState<Verse[]>([]); // ← явно указываем тип!
    const [fontSize, setFontSize] = useState(() => {
      const saved = localStorage.getItem('bibleFontSize');
      return saved ? parseInt(saved, 10) : 16;
    });

const textContainerRef = useRef<HTMLDivElement>(null);
const [initialDistance, setInitialDistance] = useState(0);
const [isPinching, setIsPinching] = useState(false);
const initialFontSizeRef = useRef(fontSize); // чтобы не "прыгал" при новом жесте

const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
  const dx = touch2.clientX - touch1.clientX;
  const dy = touch2.clientY - touch1.clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

const handleTouchStart = (e: React.TouchEvent) => {
  if (e.touches.length === 2) {
    setIsPinching(true);
    setInitialDistance(getDistance(e.touches[0], e.touches[1]));
    initialFontSizeRef.current = fontSize; // фиксируем начальный размер
  }
};

const handleTouchMove = (e: React.TouchEvent) => {
  if (e.touches.length === 2 && isPinching) {
    e.preventDefault(); // блокируем нативный зум

    const currentDistance = getDistance(e.touches[0], e.touches[1]);
    const scale = currentDistance / initialDistance;

    // Новый размер = начальный * масштаб
    let newFontSize = initialFontSizeRef.current * scale;

    // Ограничиваем разумными пределами (например, 12px – 28px)
    newFontSize = Math.min(Math.max(newFontSize, 6), 32);

    setFontSize(newFontSize);
  }
};

const handleTouchEnd = () => {
  setIsPinching(false);
  setInitialDistance(0);
};

    useEffect(() => {
      localStorage.setItem('bibleFontSize', fontSize.toString());
    }, [fontSize]);

      const loadChapter = () => {
        const currentBook = ALL_BOOKS[selectedBookKey];
        const book = typedBibleData.Books.find(b => b.BookId === currentBook.bookId);
        if (!book) {
          return;
        }
        const chapter = book.Chapters.find(ch => ch.ChapterId === selectedChapter)
        if(!chapter){
            return;
        }
        setVerses(chapter.Verses)

  };

  useEffect(() => {
    loadChapter();
  }, [selectedBookKey, selectedChapter]);

  return (
    <div style={{overflow: 'hidden'}}>
      <BibleTopBar
                selectedBookKey={selectedBookKey}
                selectedChapter={selectedChapter}
                onBookChange={setSelectedBookKey}
                onChapterChange={setSelectedChapter}
              />
          <div
      style={{
        position: "absolute",
        top: "56px",
        left: 0,
        right: 0,
        bottom: "90px",
        overflowY: "auto",
        paddingTop: "16px",
        paddingRight: "16px",
        paddingLeft: "16px",
        textAlign: "justify", // ← выравнивание по ширине
        fontSize: `${fontSize}px`, // ← вот он!
        textJustify: "inter-word",
        backgroundColor: "#F6F6F6",
      }}
      ref={textContainerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
    >
      {
      verses.map((v) => (
            <span
              key={v.VerseId}
              style={{
                display: "block",
                marginBottom: "8px",
                color: "black",
                textIndent: "1em", // отступ первой строки (по классике)
              }}
            >
              <sup
                style={{
                  fontWeight: "bold",
                  fontSize: "1.1em",
                  color: "#2c3e50",
                  marginRight: "6px",
                  verticalAlign: "baseline",
                }}
              >{v.VerseId}</sup>
              {v.Text}
            </span>
          ))}
    </div>
  </div>
  );
}