import { useState } from 'react';
import { useReducedMotionPref } from '../hooks/useReducedMotionPref';

const TiltCard = ({ children, className = '', style = {} }) => {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const reduced = useReducedMotionPref();

  const handleMouseMove = (e) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rotateX: (0.5 - py) * 10,
      rotateY: (px - 0.5) * 10
    });
  };

  const handleMouseLeave = () => setTilt({ rotateX: 0, rotateY: 0 });

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        ...style,
        transform: reduced
          ? undefined
          : `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: 'transform 0.22s ease-out'
      }}
    >
      {children}
    </div>
  );
};

export default TiltCard;
