// src/components/TopBar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ALL_BOOKS } from '../utils/bibleData';
import { useClickOutside } from '../hooks/useClickOutside';
import { IoPlay, IoPause, IoPlaySkipBack, IoPlaySkipForward } from 'react-icons/io5';

// ⚠️ ЗАМЕНИ НА СВОЙ URL!
const GITHUB_PAGES_BASE_URL = 'https://chelvivl.github.io/music-server-1/';

interface BibleTopBarProps {
  selectedBookKey: string;
  selectedChapter: number;
  onBookChange: (bookKey: keyof typeof ALL_BOOKS) => void;
  onChapterChange: (chapter: number) => void;
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

// Простой спиннер
const Spinner = () => (
  <div
    style={{
      width: '20px',
      height: '20px',
      border: '2px solid rgba(255,255,255,0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }}
  />
);

const SpinnerStyle = () => (
  <style>{`
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}</style>
);

export default function BibleTopBar({
  selectedBookKey,
  selectedChapter,
  onBookChange,
  onChapterChange
}: BibleTopBarProps) {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isChapterOpen, setIsChapterOpen] = useState(false);
  const [isLocalPlaying, setIsLocalPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const bookRef = useRef<HTMLDivElement>(null);
  const chapterRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null); // ← для управления аудио

  useClickOutside(bookRef, () => setIsBookOpen(false));
  useClickOutside(chapterRef, () => setIsChapterOpen(false));

  // Очистка аудио при размонтировании или смене главы/книги
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [selectedBookKey, selectedChapter]);

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

  const getAudioUrl = () => {
    return `${GITHUB_PAGES_BASE_URL}bible1.1.mp3`;
  };

  const handleLocalPlayPause = async () => {
    if (isLoadingAudio) return;

    // Если уже играет — ставим на паузу
    if (isLocalPlaying) {
      audioRef.current?.pause();
      setIsLocalPlaying(false);
      return;
    }

    // Если аудио уже создано и не играет — просто возобновляем
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsLocalPlaying(true);
      } catch (error) {
        console.error('Playback failed:', error);
      }
      return;
    }

    // Иначе — создаём и загружаем
    setIsLoadingAudio(true);

    try {
      const url = getAudioUrl();
      const response = await fetch(url);

      if (response.status !== 200 && response.status !== 304) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Создаём аудио-элемент
      const audio = new Audio(url);
      audioRef.current = audio;

      // Обработчики событий (опционально)
      audio.onended = () => {
        setIsLocalPlaying(false);
      };

      // Запускаем воспроизведение
      await audio.play();
      setIsLocalPlaying(true);
    } catch (error) {
      console.error('Failed to load or play audio:', error);
      setIsLocalPlaying(false);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  return (
    <>
      <SpinnerStyle />
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '104px',
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

        {/* Аудио-панель */}
        <div
          style={{
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 16px',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                outline: 'none',
              }}
              aria-label="Previous chapter"
            >
              <IoPlaySkipBack />
            </button>

            <button
              onClick={handleLocalPlayPause}
              disabled={isLoadingAudio}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: isLoadingAudio ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                outline: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }}
              aria-label={
                isLoadingAudio
                  ? 'Loading...'
                  : isLocalPlaying
                  ? 'Pause'
                  : 'Play'
              }
            >
              {isLoadingAudio ? <Spinner /> : isLocalPlaying ? <IoPause /> : <IoPlay />}
            </button>

            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                outline: 'none',
              }}
              aria-label="Next chapter"
            >
              <IoPlaySkipForward />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}