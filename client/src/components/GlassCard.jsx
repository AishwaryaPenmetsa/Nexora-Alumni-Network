import React, { useState } from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hoverGlow = true, onClick }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate within the card
    const y = e.clientY - rect.top;  // y coordinate within the card
    setCoords({ x, y });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.01 }}
      className={`glass-card p-6 rounded-2xl relative overflow-hidden transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Dynamic light lighting effect */}
      {hoverGlow && isHovered && (
        <div
          className="absolute pointer-events-none rounded-full blur-[100px] opacity-35"
          style={{
            width: '240px',
            height: '240px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.45) 0%, rgba(139, 92, 246, 0.1) 70%, transparent 100%)',
            left: `${coords.x - 120}px`,
            top: `${coords.y - 120}px`,
            transition: 'left 0.15s ease-out, top 0.15s ease-out',
          }}
        />
      )}
      
      {/* Light border reflection */}
      {hoverGlow && isHovered && (
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl border border-primary/20"
          style={{
            maskImage: `radial-gradient(circle 80px at ${coords.x}px ${coords.y}px, black, transparent)`,
            WebkitMaskImage: `radial-gradient(circle 80px at ${coords.x}px ${coords.y}px, black, transparent)`,
          }}
        />
      )}

      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlassCard;
