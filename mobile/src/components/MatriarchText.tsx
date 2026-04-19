import React from 'react';
import { Text, TextProps, StyleSheet, Platform, useColorScheme } from 'react-native';

const SILVER = '#C0C0C0';

interface MatriarchTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  gold?: boolean;
}

const GOLD = '#D4AF37';

/**
 * MatriarchText: A high-fidelity text component inspired by pretext principles.
 * Ensures consistent weight, letter spacing, and premium color palettes.
 */
export const MatriarchText: React.FC<MatriarchTextProps> = ({ 
  children, 
  style, 
  variant = 'body', 
  gold,
  ...props 
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme !== 'light';
  const variantStyle = styles[variant];
  
  // Enhancement #9: Contrast-safe colors
  const defaultColor = isDarkMode ? SILVER : '#0F172A';
  const color = gold ? GOLD : (style as any)?.color || defaultColor;

  return (
    <Text 
      style={[
        styles.base, 
        variantStyle, 
        { color }, 
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'Roboto', // Fallback to system premium
    letterSpacing: 0.5,
  },
  h1: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 8,
    textTransform: 'uppercase',
  },
  h2: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  h3: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.8,
  },
  caption: {
    fontSize: 10,
    letterSpacing: 3,
    textTransform: 'uppercase',
    opacity: 0.6,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  }
});
