import React, { useState } from 'react';
import { Post } from '../data/posts';
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
    color: '#07000f',
    content: post.image ? (
      <div
        className="w-full h-32 rounded-xl overflow-hidden mb-4 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity"
        style={{ backgroundImage: `url(${post.image})` }}
      />
    ) : null,
    onClick: () => onSelect(post.id),
  }));

  return (
    <div className="w-full">
      {/* Category Filter */}
      <div className="flex flex-col items-center mb-16">
        <div className="flex flex-wrap gap-3 justify-center bg-white/[0.03] backdrop-blur-3xl p-2 rounded-full border border-white/5 shadow-2xl">
          {CATEGORIES.map(category => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category)}
              className={`px-7 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all ${
                activeCategory === category
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                  : 'text-white/30 hover:text-white'
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
            <p className="text-white/10 text-2xl font-black tracking-[0.4em] uppercase italic">Archives Depleted</p>
            <p className="text-white/5 text-xs font-medium tracking-widest mt-4">Select another frequency to continue.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogGrid;
