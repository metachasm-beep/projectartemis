import React, { useState } from 'react';
import type { Post } from '../data/posts';
import { motion, AnimatePresence } from 'framer-motion';
import MagicBento from './MagicBento';

const CATEGORIES = ['All', 'Love', 'Relationships', 'Sex', 'Dating'];

interface BlogGridProps {
  posts: Post[];
  onSelect: (postId: string) => void;
}

const BlogGrid: React.FC<BlogGridProps> = ({ posts, onSelect }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts = activeCategory === 'All'
    ? posts
    : posts.filter(post => post.category === activeCategory);

  // Map posts to MagicBento card format
  const bentoCards = filteredPosts.map((post) => ({
    id: post.id,
    title: post.title,
    description: post.excerpt ?? '',
    label: post.category,
    color: '#FDFBF7',
    content: post.image ? (
      <div
        className="w-full h-32 rounded-xl overflow-hidden mb-4 bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity brightness-[0.98]"
        style={{ backgroundImage: `url(${post.image})` }}
      />
    ) : null,
    onClick: () => onSelect(post.id),
  }));

  return (
    <div className="w-full">
      {/* Category Filter */}
      <div className="flex flex-col items-center mb-16">
        <div className="flex flex-wrap gap-3 justify-center bg-[#3C2F2F]/[0.08] p-2 rounded-full border border-[#3C2F2F]/10 shadow-xl">
          {CATEGORIES.map(category => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category)}
              className={`px-7 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all ${
                activeCategory === category
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                  : 'text-[#3C2F2F]/40 hover:text-[#3C2F2F]'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* MagicBento Grid */}
      <AnimatePresence mode="wait">
        {filteredPosts.length > 0 ? (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <MagicBento
              cards={bentoCards}
              spotlightRadius={400}
              glowColor="180, 80, 80"
              enableStars={true}
              enableBorderGlow={true}
              enableTilt={false}
              enableMagnetism={false}
              clickEffect={true}
              className="w-full"
            />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-60 text-center"
          >
            <p className="text-[#3C2F2F]/20 text-2xl font-black tracking-[0.4em] uppercase italic">Archives Depleted</p>
            <p className="text-[#3C2F2F]/10 text-xs font-medium tracking-widest mt-4">Select another frequency to continue.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogGrid;
