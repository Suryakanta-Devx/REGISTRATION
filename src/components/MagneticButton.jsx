import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotionPref } from '../hooks/useReducedMotionPref';

const MagneticButton = ({ children, className = '', onClick, type = 'button', disabled = false, ...rest }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotionPref();

  const handleMove = (e) => {
    if (reduced || disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
    setPos({ x, y });
  };

  const handleLeave = () => setPos({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={reduced ? undefined : { x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.4 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  );
};

export default MagneticButton;
