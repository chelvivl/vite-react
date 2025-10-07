// src/components/TopBar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ALL_BOOKS } from '../utils/bibleData';
import { useClickOutside } from '../hooks/useClickOutside';
import { IoPlay, IoPause } from 'react-icons/io5';
import { useAudioPlayback } from '../hooks/useAudioPlayback';
import { getBookIdByEnglishName } from '../utils/bibleData';
import { getRussianNameByBookId } from '../utils/bibleData';

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
  maxHeight: '300px',
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
  textAlign: 'left'
});

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

interface BibleTopBarProps {
  selectedBookKey: string;
  selectedChapter: number;
  onBookChange: (bookKey: keyof typeof ALL_BOOKS) => void;
  onChapterChange: (chapter: number) => void;
}

export default function BibleTopBar({
  selectedBookKey,
  selectedChapter,
  onBookChange,
  onChapterChange
}: BibleTopBarProps) {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isChapterOpen, setIsChapterOpen] = useState(false);
  const [isSpeedOpen, setIsSpeedOpen] = useState(false);

  const bookRef = useRef<HTMLDivElement>(null);
  const chapterRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef<HTMLDivElement>(null);

  const {
    isLoading,
    isPlaying,
    currentAudioKey,
    playbackRate,
    playChapter,
    setSpeed,
  } = useAudioPlayback();

  console.log(isPlaying)

  useClickOutside(bookRef, () => setIsBookOpen(false));
  useClickOutside(chapterRef, () => setIsChapterOpen(false));
  useClickOutside(speedRef, () => setIsSpeedOpen(false));

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

  const handlePlayPause = () => {
    playChapter(selectedBookKey, selectedChapter);
  };

  const handleSpeedChange = (rate: number) => {
    setSpeed(rate);
    setIsSpeedOpen(false);
  };

  const isPlayingCurrent =
    currentAudioKey?.book === getBookIdByEnglishName(selectedBookKey) && currentAudioKey?.chapter === selectedChapter;

  return (
    <>
      <SpinnerStyle />
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '86px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#667eea',
          zIndex: 1000,
          boxSizing: 'border-box',
        }}
      >
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

          <button
            onClick={handlePlayPause}
            disabled={isLoading}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
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
              isLoading
                ? 'Loading...'
                : isPlayingCurrent
                ? 'Pause'
                : 'Play'
            }
          >
            {isLoading ? <Spinner /> : isPlayingCurrent ? <IoPause /> : <IoPlay />}
          </button>
        </div>

        <div
          style={{
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0px 3px 0px 15px',
            backgroundColor: '#d69e2e',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            {currentAudioKey !== null && <AudioWave />}
          </div>
             { currentAudioKey != null &&
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                  Сейчас играет: {getRussianNameByBookId(currentAudioKey?.book)} Глава {currentAudioKey?.chapter}
                 </div>
                 }


          <div ref={speedRef} style={{ position: 'relative', minWidth: '60px' }}>
            <div
              onClick={() => setIsSpeedOpen(!isSpeedOpen)}
              style={{
                ...baseTriggerStyle,
                fontSize: '10px',
                padding: '6px 10px',
                minWidth: '80px',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
              }}
            >
              {playbackRate}x
            </div>
            {isSpeedOpen && (
              <div style={{ ...dropdownMenuStyle }}>
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