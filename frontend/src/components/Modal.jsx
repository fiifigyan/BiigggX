import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
};

export default function Modal({ isOpen, onClose, onConfirm, title, children }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          // The semi-transparent background
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            // The modal container
            className="relative w-full max-w-md p-6"
            style={{
              background: '#111111',
              border: '1px solid rgba(229, 57, 53, 0.25)', // Crimson border
              clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
            }}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <h2 className="font-bebas text-3xl text-white mb-2">
              {title || 'Confirm Action'}
            </h2>

            <div className="font-montserrat text-sm text-urban/70 mb-6">
              {children}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="font-montserrat text-[10px] uppercase tracking-widest px-4 py-2 transition-all duration-200"
                style={{
                  color: '#B0B0B0',
                  border: '1px solid rgba(176, 176, 176, 0.2)',
                  background: 'transparent',
                  clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(176, 176, 176, 0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="font-montserrat text-[10px] uppercase tracking-widest px-4 py-2 transition-all duration-200"
                style={{
                  color: '#FFFFFF',
                  border: '1px solid #E53935',
                  background: '#E53935',
                  clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                  boxShadow: '0 0 15px rgba(229, 57, 53, 0.3)',
                }}
                onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
                onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
