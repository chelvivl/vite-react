// src/contexts/MainScreenStateContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface MainScreenState {
  menuOpen: boolean;
  modalOpen: boolean;
  clearAll: boolean;
  dayListScrollTop: number;
}

interface MainScreenActions {
  setMenuOpen: (open: boolean) => void;
  setModalOpen: (open: boolean) => void;
  setClearAll: (open: boolean) => void;
  setDayListScrollTop: (scrollTop: number) => void;
}

const MainScreenStateContext = createContext<MainScreenState>({
  menuOpen: false,
  modalOpen: false,
  clearAll: false,
  dayListScrollTop: 0,
});

const MainScreenActionsContext = createContext<MainScreenActions>({
  setMenuOpen: () => {},
  setModalOpen: () => {},
  setClearAll: () => {},
  setDayListScrollTop: () => {},
});

export const useMainScreenState = () => useContext(MainScreenStateContext);
export const useMainScreenActions = () => useContext(MainScreenActionsContext);

export const MainScreenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [clearAll, setClearAll] = useState(false);
  const [dayListScrollTop, setDayListScrollTop] = useState(0);

  // Опционально: сохранять в localStorage/sessionStorage
  // Но для прокрутки лучше не сохранять между сессиями — только в памяти

  return (
    <MainScreenStateContext.Provider value={{ menuOpen, modalOpen, clearAll, dayListScrollTop }}>
      <MainScreenActionsContext.Provider
        value={{
          setMenuOpen,
          setModalOpen,
          setClearAll,
          setDayListScrollTop,
        }}
      >
        {children}
      </MainScreenActionsContext.Provider>
    </MainScreenStateContext.Provider>
  );
};