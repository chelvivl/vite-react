// src/components/BibleChapterViewer.jsx
import { useState, useEffect } from 'react';
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

   console.log("Книга: " + bookId)
   console.log("Глава: " + chapterId)

  const [verses, setVerses] = useState<Verse[]>([]); // ← явно указываем тип!
  const [error, setError] = useState<string | null>(null);

      // 🔥 Сбрасываем прокрутку наверх при входе на экран
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // Пустой массив = выполнится один раз при монтировании

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

      <TopBar title={bookName + " " + chapterId} showBackButton={true}/>

      {error && (
        <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>
          {error}
        </p>
      )}

      <div
        style={{
          marginTop: '56px',
          padding: '0px',
          fontSize: '1.125rem', // ~18px
          lineHeight: 1.4,     // ← меньше расстояние между строками
          textAlign: 'justify', // ← выравнивание по ширине
          textJustify: 'inter-word',
          hyphens: 'auto',
          WebkitHyphens: 'auto',
          MozHyphens: 'auto'
        }}
      >
        {verses.length > 0 ? (
          verses.map((v) => (
            <span
              key={v.VerseId}
              style={{
                display: 'block',
                marginBottom: '8px',
                textIndent: '1em' // отступ первой строки (по классике)
              }}
            >
              <sup
                style={{
                  fontWeight: 'bold',
                  fontSize: '1.1em',
                  color: '#2c3e50',
                  marginRight: '6px',
                  verticalAlign: 'baseline'
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