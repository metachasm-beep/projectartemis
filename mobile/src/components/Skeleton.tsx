import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing, ViewStyle } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Skeleton: A glassmorphic loading placeholder.
 * Prevents layout shifts (Enhancement #6) with a premium shimmer effect.
 */
export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 8,
  style 
}) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width as any, width as any],
  });

  return (
    <View style={[styles.container, { width, height, borderRadius }, style]}>
      <Animated.View 
        style={[
          styles.shimmer, 
          { 
            transform: [{ translateX }],
            width: width,
            height: '100%',
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  shimmer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    opacity: 0.5,
  }
});
