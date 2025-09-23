import { useEffect } from 'react';

interface MenuProps {
  open: boolean;
  onClose: () => void;
  onReset: () => void;
  onContinue: () => void;
}

export default function Menu({
  open,
  onClose,
  onReset,
  onContinue
}: MenuProps) {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.menu') && !target.closest('.menu-button')) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="menu" style={{ display: 'block' }}>
      <div className="menu-item" onClick={() => {
        onContinue();
        onClose();
      }}>
        📖 Продолжить с дня...
      </div>
      <div className="menu-item" onClick={() => {
        onReset();
        onClose();
      }}>
        🗑️ Сбросить всё
      </div>
    </div>
  );
}