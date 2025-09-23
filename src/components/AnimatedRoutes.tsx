// components/AnimatedRoutes.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, useNavigationType } from 'react-router-dom';
import { ReactNode } from 'react';
import { useEffect, useState } from 'react';

interface AnimatedRoutesProps {
  children: ReactNode;
}

export default function AnimatedRoutes({ children }: AnimatedRoutesProps) {
  const location = useLocation();
  const navigationType = useNavigationType();

 const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  useEffect(() => {
    if (navigationType === 'POP') {
      setDirection('back');
    } else {
      setDirection('forward');
    }
  }, [location.pathname, navigationType]);

  return (
    <AnimatePresence mode="sync">
      <motion.div
        key={location.pathname}
        initial={{ x: direction === 'forward' ? '-100%' : '100%' }}
        animate={{ x: 0 }}
        exit={{ x: direction === 'forward' ? '100%' : '-100%' }}
        transition={{
          type: 'tween',
          duration: 0.3,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          overflowX: 'hidden',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}