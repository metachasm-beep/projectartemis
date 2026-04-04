import React from 'react';
import { motion } from 'framer-motion';

export const SkeletonCard = () => (
  <div className="aspect-[3/4] rounded-[2.5rem] bg-mat-wine/5 border border-mat-rose/5 overflow-hidden p-8 flex flex-col justify-end gap-4">
     <motion.div 
        animate={{ opacity: [0.05, 0.12, 0.05] }} 
        transition={{ duration: 1.5, repeat: Infinity }} 
        className="w-2/3 h-8 bg-mat-wine/10 rounded-xl" 
     />
     <motion.div 
        animate={{ opacity: [0.05, 0.12, 0.05] }} 
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} 
        className="w-1/2 h-4 bg-mat-wine/10 rounded-lg" 
     />
  </div>
);

export const SkeletonRail = () => (
  <div className="flex gap-6 overflow-hidden">
     {[1, 2, 3, 4].map(i => (
        <div key={i} className="min-w-[280px] w-[280px]">
           <SkeletonCard />
        </div>
     ))}
  </div>
);
