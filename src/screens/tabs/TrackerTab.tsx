// src/screens/TrackerTab.tsx
import TopBar from '../../components/TopBar';
import { IoAdd, IoTrash } from 'react-icons/io5';
import { useState, useRef, useEffect } from 'react';
import { useTrackers, calculateProgress } from '../../hooks/useTrackers';
import CircularProgress from '../../components/CircularProgress';
import '../../components/Modal.css';
import './TrackerTab.css';
import { IoBookOutline } from 'react-icons/io5';

// Размер кнопки удаления (в px)
const DELETE_BUTTON_WIDTH = 80;

export default function TrackerTab() {
  const { trackers, createTracker, deleteTracker } = useTrackers();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [swipeOffset, setSwipeOffset] = useState(0);

  const [activeSwipeId, setActiveSwipeId] = useState<string | null>(null);
  const touchStartX = useRef(0);
  const currentId = useRef<string | null>(null);


  const handleCreate = () => {
    if (newName.trim()) {
      createTracker(newName.trim());
      setNewName('');
      setShowCreateModal(false);
    }
  };

const handleTouchStart = (id: string, e: React.TouchEvent | React.MouseEvent) => {
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
  touchStartX.current = clientX;
  currentId.current = id;
  // Сброс при новом свайпе
  setActiveSwipeId(id);
  setSwipeOffset(0);
};

const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
  if (!currentId.current || currentId.current !== activeSwipeId) return;

  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
  const diff = clientX - touchStartX.current;

  if (diff <= 0) {
    const offset = Math.max(diff, -DELETE_BUTTON_WIDTH);
    setSwipeOffset(offset);
  } else {
    // Свайп вправо — закрыть
    setSwipeOffset(0);
    setActiveSwipeId(null);
  }
};
  const handleTouchEnd = () => {
  if (activeSwipeId && swipeOffset < -DELETE_BUTTON_WIDTH / 2) {
    setSwipeOffset(-DELETE_BUTTON_WIDTH);
  } else {
    setSwipeOffset(0);
    setActiveSwipeId(null);
  }
  currentId.current = null;
};

  const confirmDelete = (id: string) => {
    deleteTracker(id);
    setActiveSwipeId(null);
    setSwipeOffset(0);
  };

  // Закрывать свайп при изменении списка
  useEffect(() => {
    setActiveSwipeId(null);
    setSwipeOffset(0);
  }, [trackers.length]);

  return (
    <div style={{overflow: 'hidden'}}>
      <TopBar
        title="Трекеры"
        showBackButton={false}
        showRightButton={true}
        rightIcon={<IoAdd size={24} color="white" />}
        onRightClick={() => setShowCreateModal(true)}
      />

      <div className="trackers-list">
        {trackers.length === 0 ? (
                  <div className="empty-trackers">
            <div className="empty-icon">
              <IoBookOutline size={64} color="#667eea" />
            </div>
            <h2 className="empty-title">Нет трекеров</h2>
            <p className="empty-subtitle">
              Создайте первый трекер, чтобы отслеживать своё чтение Библии
            </p>
            <button
              className="empty-create-btn"
              onClick={() => setShowCreateModal(true)}
            >
              <IoAdd size={20} />
              Новый трекер
            </button>
          </div>
        ) : (
          trackers.map((tracker) => {
  const { percent } = calculateProgress(tracker.progress);
  const isSwiped = activeSwipeId === tracker.id;
  const currentOffset = isSwiped ? swipeOffset : 0;

  return (
    <div key={tracker.id} className="tracker-item" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Кнопка удаления */}
      <div
        className="delete-button"
        onClick={() => confirmDelete(tracker.id)}
        style={{
          width: DELETE_BUTTON_WIDTH,
          height: '100%',
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: '#ff4d4f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <IoTrash size={20} />
      </div>

      {/* Контент — двигается ТОЛЬКО если это активный трекер */}
      <div
        className="tracker-row"
        style={{
          transform: `translateX(${currentOffset}px)`,
          transition: isSwiped && currentOffset === -DELETE_BUTTON_WIDTH ? 'none' : 'transform 0.2s',
          padding: '16px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        }}
        onTouchStart={(e) => handleTouchStart(tracker.id, e)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={(e) => handleTouchStart(tracker.id, e)}
        onMouseMove={(e) => {
          if (currentId.current === tracker.id) handleTouchMove(e);
        }}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        <CircularProgress percent={percent} size={60} />
        <div className="tracker-text">
          <h4>{tracker.name}</h4>
          <p>Создан: {new Date(tracker.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
})
        )}
      </div>

      {/* Модал создания */}
      {showCreateModal && (
        <div className="modal-overlay active">
          <div className="modal">
            <h3>Новый трекер</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Введите название"
              className="modal-input"
              autoFocus
            />
            <div className="modal-buttons">
              <button
                className="modal-btn cancel"
                onClick={() => {
                  setNewName('');
                  setShowCreateModal(false);
                }}
              >
                Отмена
              </button>
              <button
                className="modal-btn confirm"
                disabled={!newName.trim()}
                onClick={handleCreate}
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}