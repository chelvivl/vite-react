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
  right: 0,
  width: '100px',
  maxHeight: '160px',
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
  textAlign: 'center',
});

// Компактный спиннер
const Spinner = () => (
  <div
    style={{
      width: '16px',
      height: '16px',
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
  const [isSpeedOpen, setIsSpeedOpen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  const bookRef = useRef<HTMLDivElement>(null);
  const chapterRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useClickOutside(bookRef, () => setIsBookOpen(false));
  useClickOutside(chapterRef, () => setIsChapterOpen(false));
  useClickOutside(speedRef, () => setIsSpeedOpen(false));

  // Применяем скорость к текущему аудио при её изменении
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Очистка аудио при смене главы/книги
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsLocalPlaying(false);
    }
  }, [selectedBookKey, selectedChapter]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsBookOpen(false);
        setIsChapterOpen(false);
        setIsSpeedOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentBook = ALL_BOOKS[selectedBookKey];
  const chapterOptions = Array.from({ length: currentBook.chapters }, (_, i) => i + 1);

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  const getAudioUrl = () => {
    return `${GITHUB_PAGES_BASE_URL}/bible1.${selectedChapter}.mp3`;
  };

  const handleLocalPlayPause = async () => {
    if (isLoadingAudio) return;

    if (isLocalPlaying) {
      audioRef.current?.pause();
      setIsLocalPlaying(false);
      return;
    }

    // Если аудио уже создано — просто возобновляем с текущей скоростью
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      try {
        await audioRef.current.play();
        setIsLocalPlaying(true);
      } catch (error) {
        console.error('Playback failed:', error);
      }
      return;
    }

    // Создаём новое аудио
    setIsLoadingAudio(true);

    try {
      const url = getAudioUrl();
      const response = await fetch(url);

      if (response.status !== 200 && response.status !== 304) {
        throw new Error(`HTTP ${response.status}`);
      }

      const audio = new Audio(url);
      audio.playbackRate = playbackRate; // ← устанавливаем скорость сразу
      audioRef.current = audio;

      audio.onended = () => {
        setIsLocalPlaying(false);
      };

      await audio.play();
      setIsLocalPlaying(true);
    } catch (error) {
      console.error('Failed to load or play audio:', error);
      setIsLocalPlaying(false);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    setIsSpeedOpen(false);
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
          height: '96px',
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
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
            boxSizing: 'border-box',
          }}
        >
          {/* Левая группа: управление */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                outline: 'none',
                padding: 0,
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
                fontSize: '20px',
                cursor: isLoadingAudio ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                outline: 'none',
                padding: 0,
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
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                outline: 'none',
                padding: 0,
              }}
              aria-label="Next chapter"
            >
              <IoPlaySkipForward />
            </button>
          </div>

          {/* Правая группа: скорость */}
          <div ref={speedRef} style={{ position: 'relative', minWidth: '60px' }}>
            <div
              onClick={() => setIsSpeedOpen(!isSpeedOpen)}
              style={{
                ...baseTriggerStyle,
                fontSize: '14px',
                padding: '6px 10px',
                minWidth: '60px',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
              }}
            >
              {playbackRate}x
            </div>

            {isSpeedOpen && (
              <div style={{ ...dropdownMenuStyle, width: '80px' }}>
                {speedOptions.map((rate) => (
                  <div
                    key={rate}
                    onClick={() => handleSpeedChange(rate)}
                    style={dropdownItemStyle(rate === playbackRate)}
                  >
                    {rate}x
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}