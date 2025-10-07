import BibleTopBar from '../components/BibleTopBar';
import { useState, useRef, useEffect } from 'react';
import bibleData from '../data/rst.json';
import { ALL_BOOKS } from '../utils/bibleData';
import { BibleData, Verse } from '../types/bible';

const typedBibleData = bibleData as BibleData;

export default function BibleScreen() {
  const [selectedBookKey, setSelectedBookKey] = useState('Genesis');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('bibleFontSize');
    return saved ? parseInt(saved, 10) : 16;
  });

  // Анимация перехода
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | null>(null);
  const [nextVerses, setNextVerses] = useState<Verse[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Для пинча
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [initialDistance, setInitialDistance] = useState(0);
  const [isPinching, setIsPinching] = useState(false);
  const initialFontSizeRef = useRef(fontSize);

  // Для свайпов
  const [startX, setStartX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const SWIPE_THRESHOLD = 100;

  // Настройки анимации — УДВОЕНАЯ ДЛИТЕЛЬНОСТЬ
  const ANIMATION_DURATION = 500

  const bookKeys = Object.keys(ALL_BOOKS);
  const currentBookInfo = ALL_BOOKS[selectedBookKey];
  const currentBookIndex = bookKeys.indexOf(selectedBookKey);
  const currentBookData = typedBibleData.Books.find(b => b.BookId === currentBookInfo.bookId);
  const totalChapters = currentBookData?.Chapters.length || 1;

  const getDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setIsPinching(true);
      setInitialDistance(getDistance(e.touches[0] as Touch, e.touches[1] as Touch));
      initialFontSizeRef.current = fontSize;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && isPinching) {
      e.preventDefault();
      const currentDistance = getDistance(e.touches[0] as Touch, e.touches[1] as Touch);
      const scale = currentDistance / initialDistance;
      let newFontSize = initialFontSizeRef.current * scale;
      newFontSize = Math.min(Math.max(newFontSize, 6), 32);
      setFontSize(newFontSize);
    }
  };

  const handleTouchEnd = () => {
    setIsPinching(false);
    setInitialDistance(0);
  };

  const handleTouchStartSwipe = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && !isPinching && !isAnimating) {
      setIsSwiping(true);
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEndSwipe = (e: React.TouchEvent) => {
    if (!isSwiping || isAnimating || e.changedTouches.length === 0) {
      setIsSwiping(false);
      return;
    }

    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    let newBookKey = selectedBookKey;
    let newChapter = selectedChapter;
    let direction: 'left' | 'right' | null = null;

    if (diff > SWIPE_THRESHOLD) {
      if (selectedChapter < totalChapters) {
        newChapter = selectedChapter + 1;
        direction = 'left';
      } else if (currentBookIndex < bookKeys.length - 1) {
        newBookKey = bookKeys[currentBookIndex + 1];
        newChapter = 1;
        direction = 'left';
      }
    } else if (diff < -SWIPE_THRESHOLD) {
      if (selectedChapter > 1) {
        newChapter = selectedChapter - 1;
        direction = 'right';
      } else if (currentBookIndex > 0) {
        newBookKey = bookKeys[currentBookIndex - 1];
        const prevBook = typedBibleData.Books.find(b => b.BookId === ALL_BOOKS[newBookKey].bookId);
        newChapter = prevBook?.Chapters.length || 1;
        direction = 'right';
      }
    }

    if (direction) {
      const loadVerses = (bookKey: string, chapter: number): Verse[] | null => {
        const bookInfo = ALL_BOOKS[bookKey];
        const book = typedBibleData.Books.find(b => b.BookId === bookInfo.bookId);
        if (!book) return null;
        const chapterData = book.Chapters.find(ch => ch.ChapterId === chapter);
        return chapterData ? chapterData.Verses : null;
      };

      const nextVersesData = loadVerses(newBookKey, newChapter);
      if (nextVersesData) {
        setTransitionDirection(direction);
        setNextVerses(nextVersesData);
        setIsAnimating(true);

        setTimeout(() => {
          setSelectedBookKey(newBookKey);
          setSelectedChapter(newChapter);
          setVerses(nextVersesData);
          setIsAnimating(false);
          setTransitionDirection(null);
        }, ANIMATION_DURATION);
      }
    }

    setIsSwiping(false);
  };

  useEffect(() => {
    const loadVerses = (bookKey: string, chapter: number): Verse[] | null => {
      const bookInfo = ALL_BOOKS[bookKey];
      const book = typedBibleData.Books.find(b => b.BookId === bookInfo.bookId);
      if (!book) return null;
      const chapterData = book.Chapters.find(ch => ch.ChapterId === chapter);
      return chapterData ? chapterData.Verses : null;
    };

    const currentVerses = loadVerses(selectedBookKey, selectedChapter);
    if (currentVerses) {
      setVerses(currentVerses);
    }
  }, [selectedBookKey, selectedChapter]);

  useEffect(() => {
    if (textContainerRef.current && !isAnimating) {
      textContainerRef.current.scrollTop = 0;
    }
  }, [selectedBookKey, selectedChapter, isAnimating]);

  useEffect(() => {
    localStorage.setItem('bibleFontSize', fontSize.toString());
  }, [fontSize]);

  const renderVerses = (versesList: Verse[]) => (
    <>
      {versesList.map((v) => (
        <span
          key={v.VerseId}
          style={{
            display: 'block',
            marginBottom: '8px',
            textIndent: '1em',
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
      ))}
    </>
  );

  return (
    <div style={{ overflow: 'hidden', height: '100dvh', position: 'relative', bottom: '16px' }}>
      <BibleTopBar
        selectedBookKey={selectedBookKey}
        selectedChapter={selectedChapter}
        onBookChange={setSelectedBookKey}
        onChapterChange={setSelectedChapter}
      />

      {/* Текущая страница */}
      <div
        style={{
          position: 'absolute',
          top: '110px',
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: 'auto',
          paddingTop: '16px',
          paddingRight: '16px',
          paddingLeft: '16px',
          textAlign: 'justify',
          fontSize: `${fontSize}px`,
          textJustify: 'inter-word',
          backgroundColor: '#F6F6F6',
          color: 'black',
          touchAction: 'pan-y',
          zIndex: isAnimating ? 2 : 1,
          transition: isAnimating
            ? `transform ${ANIMATION_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`
            : 'none',
          transform: isAnimating
            ? transitionDirection === 'left'
              ? 'translateX(-100%)'
              : 'translateX(100%)'
            : 'translateX(0)',
        }}
        ref={textContainerRef}
        onTouchStart={(e) => {
          handleTouchStart(e);
          handleTouchStartSwipe(e);
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={(e) => {
          handleTouchEnd();
          handleTouchEndSwipe(e);
        }}
      >
        {renderVerses(verses)}
      </div>

      {/* Следующая страница (для анимации) */}
      {isAnimating && (
        <div
          style={{
            position: 'absolute',
            top: '110px',
            left: 0,
            right: 0,
            bottom: 0,
            overflowY: 'auto',
            paddingTop: '16px',
            paddingRight: '16px',
            paddingLeft: '16px',
            textAlign: 'justify',
            fontSize: `${fontSize}px`,
            textJustify: 'inter-word',
            backgroundColor: '#F6F6F6',
            color: 'black',
            zIndex: 1,
            transition: `transform ${ANIMATION_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`,
            transform: 'translateX(0)',
          }}
        >
          {renderVerses(nextVerses)}
        </div>
      )}
    </div>
  );
}