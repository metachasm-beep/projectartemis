import React from 'react';
import { View, StyleSheet, ViewStyle, useColorScheme } from 'react-native';
// import { BlurView } from 'expo-blur'; // Temporarily disabled for immediate demo stability

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  borderColor?: string;
}

const GOLD = '#D4AF37';

/**
 * GlassCard: A premium glassmorphic container inspired by react-bits aesthetics.
 * Provides a translucent, blurred background with a subtle border.
 */
export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  style, 
  intensity = 20,
  borderColor = GOLD + '30'
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme !== 'light';

  return (
    <View style={[
      styles.container, 
      { borderColor: isDarkMode ? borderColor : 'rgba(0,0,0,0.1)' }, 
      !isDarkMode && styles.lightContainer,
      style
    ]}>
      <View style={[
        StyleSheet.absoluteFill, 
        isDarkMode ? styles.fallback : styles.lightFallback
      ]} />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  fallback: {
    backgroundColor: 'rgba(20, 20, 30, 0.85)',
  },
  lightContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lightFallback: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Enhancement #9: bg-white/85 floor
  },
  content: {
    padding: 16,
  }
});
