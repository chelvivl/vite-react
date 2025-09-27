// src/components/TopBar.tsx
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { IoChevronBack, IoEllipsisVertical } from 'react-icons/io5';

interface TopBarProps {
  title: string;
  showBackButton?: boolean;
  showRightButton?: boolean;
  rightIcon?: React.ReactNode;
  onRightClick?: () => void;
}

export default function TopBar({
  title,
  showBackButton = true,
  showRightButton = false,
  rightIcon,
  onRightClick
}: TopBarProps) {
  const navigate = useNavigate();

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 0px',
        backgroundColor: '#667eea',
        zIndex: 1000,
        fontSize: '17px',
        fontWeight: 600,
        color: 'white',
        boxSizing: 'border-box'
      }}
    >
      {/* Кнопка "Назад" */}
      {showBackButton ? (
        <button
          onClick={() => navigate(-1)}
          style={buttonStyle}
          aria-label="Назад"
        >
          <IoChevronBack size={24} color="white" />
        </button>
      ) : (
        <div style={{ width: '56px' }} />
      )}

      {/* Заголовок */}
      <h3
        style={{
          flex: 1,
          textAlign: 'center',
          margin: 0,
          padding: '0 16px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {title}
      </h3>

      {/* Правая кнопка */}
      {showRightButton ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRightClick?.();
          }}
          style={buttonStyle}
          aria-label="Меню"
        >
          {rightIcon || <IoEllipsisVertical size={24} color="white" />}
        </button>
      ) : (
        <div style={{ width: '56px' }} />
      )}
    </header>
  );
}

const buttonStyle: React.CSSProperties = {
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  border: 'none',
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  cursor: 'pointer',
  padding: 0,
  margin: 0,
};