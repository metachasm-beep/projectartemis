import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  interpolate,
  Easing
} from 'react-native-reanimated';
import Svg, { Rect, Defs, RadialGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const GOLD = '#D4AF37';
const PLUM = '#4B0082';
const OBSIDIAN = '#0A0A0A';

/**
 * PlasmaBackground: A premium animated background inspired by react-bits.
 * Uses SVG gradients and Reanimated to create a fluid, futuristic "Obsidian" atmosphere.
 */
export const PlasmaBackground = () => {
  const animValue = useSharedValue(0);

  useEffect(() => {
    animValue.value = withRepeat(
      withTiming(1, { 
        duration: 8000, 
        easing: Easing.bezier(0.42, 0, 0.58, 1) 
      }),
      -1,
      true
    );
  }, []);

  const animatedProps1 = useAnimatedStyle(() => {
    const translateX = interpolate(animValue.value, [0, 1], [-width * 0.2, width * 0.2]);
    const translateY = interpolate(animValue.value, [0, 1], [-height * 0.1, height * 0.1]);
    return {
      transform: [{ translateX }, { translateY }],
    };
  });

  const animatedProps2 = useAnimatedStyle(() => {
    const translateX = interpolate(animValue.value, [0, 1], [width * 0.1, -width * 0.1]);
    const translateY = interpolate(animValue.value, [0, 1], [height * 0.2, -height * 0.2]);
    return {
      transform: [{ translateX }, { translateY }],
    };
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Deep Obsidian Base */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: OBSIDIAN }]} />
      
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="grad1" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor={PLUM} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={OBSIDIAN} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="grad2" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor={GOLD} stopOpacity="0.1" />
            <Stop offset="100%" stopColor={OBSIDIAN} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Animated.View style={[StyleSheet.absoluteFill, animatedProps1]}>
          <Svg height="150%" width="150%">
             <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad1)" />
          </Svg>
        </Animated.View>

        <Animated.View style={[StyleSheet.absoluteFill, animatedProps2]}>
          <Svg height="150%" width="150%">
             <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad2)" />
          </Svg>
        </Animated.View>
      </Svg>

      {/* Overlay Vignette */}
      <View style={[StyleSheet.absoluteFill, { 
        backgroundColor: 'transparent',
        borderWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 50,
      }]} />
    </View>
  );
};
