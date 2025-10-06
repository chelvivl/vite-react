// src/components/TopBar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ALL_BOOKS } from '../utils/bibleData';
import { useClickOutside } from '../hooks/useClickOutside';

interface BibleTopBarProps {
  selectedBookKey: string;
  selectedChapter: number;
  onBookChange: (bookKey: keyof typeof ALL_BOOKS) => void;
  onChapterChange: (chapter: number) => void;

  // Аудио-управление
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
}

const baseTriggerStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.4)',
  backgroundColor: 'rgba(0, 0, 0, 0.25)',
  color: 'white',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  outline: 'none',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const dropdownMenuStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  width: '100%',
  maxHeight: '240px',
  overflowY: 'auto',
  backgroundColor: '#2c3e50',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  zIndex: 2000,
  marginTop: '4px',
  padding: '4px 0',
  whiteSpace: 'nowrap',
};

const dropdownItemStyle = (isActive: boolean): React.CSSProperties => ({
  padding: '8px 12px',
  color: isActive ? '#667eea' : 'white',
  backgroundColor: isActive ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
  cursor: 'pointer',
  userSelect: 'none',
  borderBottom: '1px solid #3a506b',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  textAlign: 'left',
});

export default function BibleTopBar({
  selectedBookKey,
  selectedChapter,
  onBookChange,
  onChapterChange,
  isPlaying,
  onPlayPause,
  onPrevChapter,
  onNextChapter,
}: BibleTopBarProps) {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isChapterOpen, setIsChapterOpen] = useState(false);

  const bookRef = useRef<HTMLDivElement>(null);
  const chapterRef = useRef<HTMLDivElement>(null);

  useClickOutside(bookRef, () => setIsBookOpen(false));
  useClickOutside(chapterRef, () => setIsChapterOpen(false));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsBookOpen(false);
        setIsChapterOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentBook = ALL_BOOKS[selectedBookKey];
  const chapterOptions = Array.from({ length: currentBook.chapters }, (_, i) => i + 1);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '104px', // 56px (верх) + 48px (аудио)
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#667eea',
        zIndex: 1000,
        boxSizing: 'border-box',
      }}
    >
      {/* Верхняя панель: выбор книги и главы */}
      <div
        style={{
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '0 16px',
          fontSize: '17px',
          fontWeight: 600,
          color: 'white',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Выбор книги */}
          <div ref={bookRef} style={{ position: 'relative', minWidth: '200px' }}>
            <div
              onClick={() => setIsBookOpen(!isBookOpen)}
              style={{
                ...baseTriggerStyle,
                padding: '12px 12px',
                minWidth: '200px',
                justifyContent: 'space-between',
              }}
            >
              {currentBook.title}
              <span style={{ fontSize: '12px', marginLeft: '6px' }}>▼</span>
            </div>

            {isBookOpen && (
              <div style={dropdownMenuStyle}>
                {Object.entries(ALL_BOOKS).map(([key, book]) => (
                  <div
                    key={key}
                    onClick={() => {
                      onBookChange(key as keyof typeof ALL_BOOKS);
                      setIsBookOpen(false);
                    }}
                    style={dropdownItemStyle(key === selectedBookKey)}
                  >
                    {book.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Выбор главы */}
          <div ref={chapterRef} style={{ position: 'relative', minWidth: '80px' }}>
            <div
              onClick={() => setIsChapterOpen(!isChapterOpen)}
              style={{
                ...baseTriggerStyle,
                padding: '12px 12px',
                minWidth: '80px',
                justifyContent: 'space-between',
              }}
            >
              {selectedChapter}
              <span style={{ fontSize: '10px', marginLeft: '4px' }}>▼</span>
            </div>

            {isChapterOpen && (
              <div style={dropdownMenuStyle}>
                {chapterOptions.map((ch) => (
                  <div
                    key={ch}
                    onClick={() => {
                      onChapterChange(ch);
                      setIsChapterOpen(false);
                    }}
                    style={dropdownItemStyle(ch === selectedChapter)}
                  >
                    {ch}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Нижняя панель: аудио-управление */}
      <div
        style={{
          height: '48px',
          backgroundColor: '#2c3e50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          padding: '0 16px',
          boxSizing: 'border-box',
        }}
      >
        <button
          onClick={onPrevChapter}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '4px',
          }}
          aria-label="Предыдущая глава"
        >
          ⏮
        </button>

        <button
          onClick={onPlayPause}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label={isPlaying ? 'Пауза' : 'Воспроизведение'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <button
          onClick={onNextChapter}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '4px',
          }}
          aria-label="Следующая глава"
        >
          ⏭
        </button>
      </div>
    </header>
  );
}