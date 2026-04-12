import React from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';

interface ParallaxLayerProps {
  children: React.ReactNode;
  scrollYProgress: MotionValue<number>;
  range?: [number, number];
  output?: [string | number, string | number];
  className?: string;
}

const ParallaxLayer: React.FC<ParallaxLayerProps> = ({ 
  children, 
  scrollYProgress, 
  range = [0, 1], 
  output = ["0%", "20%"], 
  className = "" 
}) => {
  const y = useTransform(scrollYProgress, range, output);

  return (
    <motion.div style={{ y }} className={`absolute inset-0 ${className}`}>
      {children}
    </motion.div>
  );
};

export default ParallaxLayer;
