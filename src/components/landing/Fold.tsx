import React from 'react';
import { motion } from 'framer-motion';

interface FoldProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  isHero?: boolean;
}

const Fold: React.FC<FoldProps> = ({ children, id, className = '', isHero = false }) => {
  return (
    <section
      id={id}
      className={`relative h-[100dvh] w-full flex flex-col items-center justify-center snap-start snap-always overflow-hidden ${
        isHero ? 'bg-transparent' : (className.includes('bg-') ? className : `bg-mat-obsidian ${className}`)
      }`}
    >
      {/* Background Layer with subtle movement */}
      {!isHero && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(123,45,66,0.1)_0%,transparent_50%)] op-30" />
        </div>
      )}
      
      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6"
      >
        {children}
      </motion.div>
    </section>
  );
};

export default Fold;
