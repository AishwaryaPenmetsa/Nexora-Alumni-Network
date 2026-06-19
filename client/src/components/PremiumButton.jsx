import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * PremiumButton – gradient button with subtle hover glow and magnetic attraction.
 * Accepts all standard button props.
 */
const PremiumButton = ({ children, className = '', ...rest }) => {
  const btnRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const offsetX = ((e.clientX - rect.left) / rect.width - 0.5) * 10; // max ±5px
      const offsetY = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
      btn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    };
    const handleMouseLeave = () => {
      btn.style.transform = 'translate(0, 0)';
    };
    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <motion.button
      ref={btnRef}
      whileTap={{ scale: 0.95 }}
      className={`btn-gradient rounded-xl px-5 py-2.5 font-medium text-white transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
};

export default PremiumButton;
