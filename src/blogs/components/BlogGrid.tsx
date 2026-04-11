import React, { useState } from 'react';
import { BLOG_POSTS } from '../data/posts';
import BlogCard from './BlogCard';
import ScrollReveal from './bits/ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All', 'Love', 'Relationships', 'Sex', 'Dating'];

interface BlogGridProps {
  onSelect: (postId: string) => void;
}

const BlogGrid: React.FC<BlogGridProps> = ({ onSelect }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts = activeCategory === 'All' 
    ? BLOG_POSTS 
    : BLOG_POSTS.filter(post => post.category === activeCategory);

  return (
    <section className="py-24 px-6 md:px-12 bg-[#030303]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-20 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="max-w-2xl">
            <ScrollReveal 
              baseOpacity={0.1}
              textClassName="text-white font-bold"
              containerClassName="mb-4"
            >
              The Repository of Reflections
            </ScrollReveal>
            <p className="text-white/40 text-lg md:text-xl font-medium">
              Curated entries from the Matriarch archive, exploring the depths of modern intimacy.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase transition-all border ${
                  activeCategory === category 
                    ? 'bg-rose-500 border-rose-500 text-white' 
                    : 'bg-transparent border-white/10 text-white/40 hover:border-white/30 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {filteredPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} onSelect={onSelect} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="py-40 text-center">
            <p className="text-white/20 text-xl font-medium tracking-widest uppercase italic">No entries found in this archive.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogGrid;
