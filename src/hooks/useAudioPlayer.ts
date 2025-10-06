// src/hooks/useAudioPlayer.ts
import { useState, useEffect, useRef } from 'react';

// Настройка: базовый URL для аудиофайлов
const AUDIO_BASE_URL = 'https://chelvivl.github.io/music-server-1/'

export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSrcRef = useRef<string>('');

  // Очистка аудио при размонтировании
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playChapter = async (chapter: number) => {
    const src = `bible1.${chapter}.mp3`;

    // Если уже играет тот же файл — просто возобновляем
    if (audioRef.current && currentSrcRef.current === src) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
      return;
    }

    // Иначе — создаём новый аудио
    try {
      setIsLoading(true);
      setError(null);

      // Останавливаем предыдущее воспроизведение
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(AUDIO_BASE_URL + src);
      audioRef.current = audio;
      currentSrcRef.current = AUDIO_BASE_URL + src;

      // Обработка окончания
      audio.onended = () => {
        setIsPlaying(false);
      };

      // Загружаем и играем
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error('Ошибка воспроизведения:', err);
      setError('Не удалось загрузить аудио. Проверьте наличие файла.');
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return {
    isPlaying,
    isLoading,
    error,
    playChapter,
    togglePlayPause,
    stop,
    currentAudio: audioRef.current,
  };
}