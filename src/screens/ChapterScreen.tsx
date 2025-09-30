// src/components/BibleChapterViewer.jsx
import { useState, useEffect, useRef } from 'react';
import bibleData from '../data/rst.json';
import TopBar from '../components/TopBar'; // ← подключи TopBar
import { useLocation } from 'react-router-dom';
import { BibleData, Verse, Chapter } from '../types/bible';

const typedBibleData = bibleData as BibleData;

const BibleChapterViewer = () => {

  const location = useLocation();
  const chapterId = location.state?.chapter;
  const bookName = location.state?.bookName;
  const bookId = location.state?.bookId;

  const [verses, setVerses] = useState<Verse[]>([]); // ← явно указываем тип!
  const [error, setError] = useState<string | null>(null);

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
    setError("");
    setVerses([]);

    const book = typedBibleData.Books.find(b => b.BookId === bookId);

    if (!book) {
      setError('Книга не найдена');
      return;
    }

    const chapter = book.Chapters.find(ch => ch.ChapterId === chapterId);
    if (!chapterId) {
      setError('Глава не найдена');
      return;
    }


    const sortedVerses = [...(chapter as Chapter).Verses].sort((a, b) => a.VerseId - b.VerseId);
    setVerses(sortedVerses);
  };

  useEffect(() => {
    loadChapter();
  }, [bookId, chapterId]);

  return (
    <div style={{ padding: '20px', margin: '0 auto' }}>

      <TopBar title={bookName + " " + chapterId} showBackButton={true} />

      {error && (
        <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>
          {error}
        </p>
      )}

<div
        style={{
          position: 'absolute',
          top: '56px',
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: 'auto',
          paddingTop: '16px',
          paddingRight: '16px',
          paddingLeft: '16px',
          textAlign: 'justify', // ← выравнивание по ширине
          fontSize: `${fontSize}px`, // ← вот он!
          textJustify: 'inter-word',
             backgroundColor: '#F6F6F6'
        }}

              ref={textContainerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >

        {verses.length > 0 ? (
          verses.map((v) => (
            <span
              key={v.VerseId}
              style={{
                display: 'block',
                marginBottom: '8px',
                color: 'black',
                textIndent: '1em' // отступ первой строки (по классике)
              }}
            >
              <sup
                style={{
                  fontWeight: 'bold',
                  fontSize: '1.1em',
                  color: '#2c3e50',
                  marginRight: '6px',
                  verticalAlign: 'baseline',

                }}
              >
                {v.VerseId}
              </sup>
              {v.Text}
            </span>
          ))
        ) : (
          !error && <p style={{ textAlign: 'center', color: '#666' }}>Выберите книгу и главу</p>
        )}
      </div>
    </div>
  );
};

export default BibleChapterViewer;