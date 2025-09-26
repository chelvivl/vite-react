// src/components/TopBar.jsx
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  title: string;
  showBackButton: boolean;
}

export default function TopBar({ title, showBackButton = true } : TopBarProps) {
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
        padding: '0 16px',
        backgroundColor: '#667eea',
        zIndex: 1000,
        fontSize: '17px',
        fontWeight: 600,
        color: 'white'
      }}
    >
      {showBackButton && (
        <button
          onClick={() => navigate(-1)}
          style={{
            width: '36px',
            height: '36px',
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
      {showBackButton && (
       <div style={{ width: '36px' }}></div>
      )}
    </header>
  );
}