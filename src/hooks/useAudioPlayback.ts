// src/hooks/useAudioPlayback.ts
import { useState, useEffect, useRef } from 'react';
import { getBookIdByEnglishName } from '../utils/bibleData';

const GITHUB_PAGES_BASE_URL_1 = 'https://chelvivl.github.io/music-server-1/';
const GITHUB_PAGES_BASE_URL_2 = 'https://chelvivl.github.io/music-server-2/';
const GITHUB_PAGES_BASE_URL_3 = 'https://chelvivl.github.io/music-server-3/';
const GITHUB_PAGES_BASE_URL_4 = 'https://chelvivl.github.io/music-server-4/';

interface AudioKey {
  book: number;
  chapter: number;
}

export const useAudioPlayback = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioKey, setCurrentAudioKey] = useState<AudioKey | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Синхронизируем playbackRate с текущим аудио
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const getAudioUrl = (book: number, chapter: number): string => {
    const detectedUrl = getBaseUrlByNumber(book)
    return `${detectedUrl}/bible${book}.${chapter}.mp3`;
  };

  const playChapter = async (bookKey: string, chapter: number) => {

    const book = getBookIdByEnglishName(bookKey)

    const isCurrent = currentAudioKey?.book === book && currentAudioKey?.chapter === chapter;

    if (isLoading) return;

    // Если уже играет текущая глава — ставим на паузу
    if (isCurrent && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentAudioKey(null);
      return;
    }

    // Если уже загружено аудио для этой главы — возобновляем
    if (audioRef.current) {
      const urlForCurrent = getAudioUrl(book, chapter);
      if (audioRef.current.src === urlForCurrent) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setCurrentAudioKey({ book, chapter });
        } catch (err) {
          console.error('Resume failed:', err);
          setIsPlaying(false);
          setCurrentAudioKey(null);
        }
        return;
      }

      // Иначе останавливаем текущее (если не то же самое)
      audioRef.current.pause();
    }

    setIsLoading(true);
    try {
      const url = getAudioUrl(book, chapter);
      const response = await fetch(url, { method: 'HEAD' }); // HEAD вместо GET для проверки существования

      if (!response.ok) {
        throw new Error(`Audio not found: ${response.status}`);
      }

      const audio = new Audio(url);
      audio.playbackRate = playbackRate;
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudioKey(null);
      };

      await audio.play();
      setIsPlaying(true);
      setCurrentAudioKey({ book, chapter });
    } catch (error) {
      console.error('Failed to load or play audio:', error);
      setIsPlaying(false);
      setCurrentAudioKey(null);
    } finally {
      setIsLoading(false);
    }
  };

  const setSpeed = (rate: number) => {
    setPlaybackRate(rate);
  };

 function getBaseUrlByNumber(num: number): string {
  if (num >= 1 && num <= 5) {
    return GITHUB_PAGES_BASE_URL_1;
  } else if (num >= 6 && num <= 12) {
    return GITHUB_PAGES_BASE_URL_2;
  } else if (num >= 13 && num <= 19) {
    return GITHUB_PAGES_BASE_URL_3;
  } else if (num >= 20 && num <= 39) {
    return GITHUB_PAGES_BASE_URL_4;
  } else {
    return GITHUB_PAGES_BASE_URL_1;
  }
}

  return {
    isLoading,
    isPlaying,
    currentAudioKey,
    playbackRate,
    playChapter,
    setSpeed,
  };
};