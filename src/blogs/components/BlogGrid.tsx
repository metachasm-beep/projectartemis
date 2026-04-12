import React, { useState } from 'react';
import { Post } from '../data/posts';
import BlogCard from './BlogCard';
import ScrollReveal from './bits/ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';

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

  return (
    <div className="w-full">
      {/* Refined Category Navigation */}
      <div className="flex flex-col items-center mb-20">
        <div className="flex flex-wrap gap-4 justify-center bg-white/5 backdrop-blur-3xl p-2 rounded-full border border-white/5 shadow-2xl">
          {CATEGORIES.map(category => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category)}
              className={`px-8 py-2.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all ${
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

      {/* High-Density Asymmetric Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-12 gap-10"
      >
        <AnimatePresence mode='popLayout'>
          {filteredPosts.map((post, index) => {
            // Create a premium asymmetric layout pattern
            const isFeatured = index % 7 === 0;
            const spanClass = isFeatured 
               ? "md:col-span-8 lg:col-span-8 h-[500px]" 
               : "md:col-span-4 lg:col-span-4 h-[500px]";

            return (
              <motion.div 
                key={post.id} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${spanClass}`}
              >
                <BlogCard 
                  post={post} 
                  index={index} 
                  onSelect={onSelect} 
                  isFeatured={isFeatured}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-60 text-center"
        >
          <p className="text-white/10 text-2xl font-black tracking-[0.4em] uppercase italic">Archives Depleted</p>
          <p className="text-white/5 text-xs font-medium tracking-widest mt-4">Select another frequency to continue.</p>
        </motion.div>
      )}
    </div>
  );
};

export default BlogGrid;

