// src/components/TopBar.jsx
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  title: string;
  showBackButton: boolean;
  showMenuButton: boolean;
  onMenuClick: () => void;
}

export default function TopBar({ title, showBackButton = true, showMenuButton = false, onMenuClick } : TopBarProps) {
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
        pointerEvents: 'auto',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        fontSize: '17px',
        touchAction: 'none',
        fontWeight: 600,
        color: 'white'
      }}
      onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
    >
      {!showBackButton && (
        <div style={{ width: '56px' }}></div>
      )}
      {showBackButton && (
        <button
          onClick={() => navigate(-1)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: 'none',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer'
          }}
          aria-label="Назад"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"   style={{ transform: 'scale(1.5)' }} >
            <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      )}
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
       {showMenuButton && (
        <button

         onClick={(e) => {
 e.stopPropagation();
         onMenuClick()
          }}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: 'none',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer'
          }}
          aria-label="Назад"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>  </svg>
        </button>
      )}
       {!showMenuButton && (
        <div style={{ width: '56px' }}></div>
      )}
    </header>
  );
}