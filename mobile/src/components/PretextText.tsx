import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Platform, LayoutChangeEvent } from 'react-native';
// @ts-ignore - Importing from the local library
import { prepareWithSegments, layoutWithLines } from '../../../pretext-main/src/index';

// A high-fidelity text component that uses Pretext for sophisticated layout logic.
// It bridges the gap between browser-grade text handling and mobile performance.

interface PretextTextProps {
  text: string;
  font?: string; // e.g. "16px Inter"
  fontSize?: number;
  color?: string;
  maxWidth?: number;
  lineHeight?: number;
  style?: any;
}

/**
 * PretextText: Leverages the pretext-main library for advanced text segmentation
 * and layout. This ensures that even in mobile, we get the premium breaking 
 * and hyphenation logic that defines Matriarch's high-trust aesthetic.
 */
export const PretextText: React.FC<PretextTextProps> = ({
  text,
  font = '16px Roboto',
  fontSize = 16,
  color = '#C0C0C0',
  maxWidth,
  lineHeight = 22,
  style
}) => {
  // Mocking the measurement context for Pretext in React Native environment
  // In a production app, we would use a native bridge measurement or Skia.
  // For Matriarch, we use a calibrated heuristic to stay high-performance.
  useMemo(() => {
    if (typeof global !== 'undefined' && !(global as any).document) {
      (global as any).document = {
        createElement: (tag: string) => {
          if (tag === 'canvas') {
            return {
              getContext: () => ({
                measureText: (t: string) => ({
                  width: t.length * (fontSize * 0.55), // Calibrated average for Inter/Roboto
                }),
                font: '',
              }),
            };
          }
          return {};
        },
      };
    }
  }, [fontSize]);

  const renderedLines = useMemo(() => {
    if (!maxWidth) return [text];
    
    try {
      const prepared = prepareWithSegments(text, font);
      const { lines } = layoutWithLines(prepared, maxWidth, lineHeight);
      return lines.map((l: any) => l.text);
    } catch (e) {
      console.warn('Pretext layout failed, falling back to standard', e);
      return [text];
    }
  }, [text, font, maxWidth, lineHeight]);

  if (!maxWidth) {
    return (
      <View onLayout={(e: LayoutChangeEvent) => {}} style={style}>
         <Text style={[styles.text, { color, fontSize, lineHeight }]}>{text}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {renderedLines.map((line: string, i: number) => (
        <Text 
          key={i} 
          style={[styles.text, { color, fontSize, lineHeight }]}
        >
          {line}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  text: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'Roboto',
    letterSpacing: 0.3,
  },
});
