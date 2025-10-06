// src/components/TopBar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ALL_BOOKS } from '../utils/bibleData';
import { useClickOutside } from '../hooks/useClickOutside';
import { IoPlay, IoPause } from 'react-icons/io5';

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

// Анимированная звуковая волна
const AudioWave = () => (
  <div style={{ display: 'flex', gap: '2px', alignItems: 'center', height: '24px' }}>
    {[0, 1, 2, 3, 4].map((i) => (
      <div
        key={i}
        style={{
          width: '3px',
          height: '100%',
          backgroundColor: 'white',
          borderRadius: '2px',
          animation: 'wave 1.2s infinite ease-in-out',
          animationDelay: `${i * 0.15}s`,
        }}
      />
    ))}
    <style>{`
      @keyframes wave {
        0%, 100% { height: 6px; }
        50% { height: 20px; }
      }
    `}</style>
  </div>
);

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
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isSpeedOpen, setIsSpeedOpen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [currentAudioKey, setCurrentAudioKey] = useState<{ bookKey: string; chapter: number } | null>(null);

  const bookRef = useRef<HTMLDivElement>(null);
  const chapterRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useClickOutside(bookRef, () => setIsBookOpen(false));
  useClickOutside(chapterRef, () => setIsChapterOpen(false));
  useClickOutside(speedRef, () => setIsSpeedOpen(false));

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // 🔴 НЕ останавливаем аудио при смене главы
  // (оставляем его играть)

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
  const speedOptions = [1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];

  const getAudioUrl = (chapter: number) => {
    return `${GITHUB_PAGES_BASE_URL}/bible1.${chapter}.mp3`;
  };

  const handleLocalPlayPause = async () => {
    const isCurrentChapterPlaying =
      currentAudioKey?.bookKey === selectedBookKey && currentAudioKey?.chapter === selectedChapter;

    if (isLoadingAudio) return;

    // Если уже играет текущая глава — ставим на паузу, НО НЕ УДАЛЯЕМ audioRef
    if (isCurrentChapterPlaying && audioRef.current) {
      audioRef.current.pause();
      setCurrentAudioKey(null); // больше не считаем, что текущая глава играет
      return;
    }

    // Если уже есть аудио для текущей главы (но оно на паузе) — возобновляем его
    if (audioRef.current && isCurrentChapterPlaying === false) {
      // Проверим: может, уже загружено аудио для этой главы?
      const urlForCurrent = getAudioUrl(selectedChapter);
      if (audioRef.current.src === urlForCurrent) {
        // То же аудио — просто play
        try {
          await audioRef.current.play();
          setCurrentAudioKey({ bookKey: selectedBookKey, chapter: selectedChapter });
        } catch (err) {
          console.error('Resume failed:', err);
          setCurrentAudioKey(null);
        }
        return;
      }
    }

    // Иначе — создаём новое аудио для текущей главы
    if (audioRef.current) {
      // Останавливаем предыдущее (если оно не то же самое)
      audioRef.current.pause();
    }

    setIsLoadingAudio(true);

    try {
      const url = getAudioUrl(selectedChapter);
      const response = await fetch(url);

      if (response.status !== 200 && response.status !== 304) {
        throw new Error(`HTTP ${response.status}`);
      }

      const audio = new Audio(url);
      audio.playbackRate = playbackRate;
      audioRef.current = audio;

      audio.onended = () => {
        setCurrentAudioKey(null);
      };

      await audio.play();
      setCurrentAudioKey({ bookKey: selectedBookKey, chapter: selectedChapter });
    } catch (error) {
      console.error('Failed to load or play audio:', error);
      setCurrentAudioKey(null);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    setIsSpeedOpen(false);
  };

  const isPlayingCurrent =
    currentAudioKey?.bookKey === selectedBookKey && currentAudioKey?.chapter === selectedChapter;

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
        {/* Верхняя панель */}
        <div
          style={{
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            fontSize: '17px',
            fontWeight: 600,
            color: 'white',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Книга */}
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

            {/* Глава */}
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

          {/* Кнопка Play/Pause */}
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
                : isPlayingCurrent
                ? 'Pause'
                : 'Play'
            }
          >
            {isLoadingAudio ? <Spinner /> : isPlayingCurrent ? <IoPause /> : <IoPlay />}
          </button>
        </div>

        {/* Нижняя панель */}
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
          {/* Волна — показывается всегда, если что-то играет */}
          <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            {currentAudioKey !== null && <AudioWave />}
          </div>

          {/* Скорость */}
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