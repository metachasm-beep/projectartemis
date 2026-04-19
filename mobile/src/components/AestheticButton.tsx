import React from 'react';
import { TouchableOpacity, StyleSheet, View, Animated as RNAnimated, ActivityIndicator } from 'react-native';
import { MatriarchText } from './MatriarchText';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  interpolateColor
} from 'react-native-reanimated';

const GOLD = '#D4AF37';
const PLUM = '#4B0082';

interface AestheticButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
}

/**
 * AestheticButton: A high-fidelity button inspired by react-bits.
 * Uses spring animations and premium color transitions.
 */
export const AestheticButton: React.FC<AestheticButtonProps> = ({ 
  label, 
  onPress, 
  variant = 'primary',
  disabled,
  loading
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: styles.primaryContainer,
          text: styles.primaryText,
        };
      case 'secondary':
        return {
          container: styles.secondaryContainer,
          text: styles.secondaryText,
        };
      case 'outline':
        return {
          container: styles.outlineContainer,
          text: styles.outlineText,
        };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[styles.baseContainer, vStyles.container, (disabled || loading) && styles.disabled]}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? GOLD : variant === 'outline' ? GOLD : '#C0C0C0'} />
        ) : (
          <MatriarchText variant="label" style={vStyles.text}>
            {label}
          </MatriarchText>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: 16,
    paddingVertical: 20, // Ensures > 44px touch target (Enhancement #3)
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginVertical: 4,
  },
  primaryContainer: {
    backgroundColor: PLUM,
    borderColor: GOLD + '60',
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryText: {
    color: GOLD,
    fontWeight: '800',
  },
  secondaryContainer: {
    backgroundColor: '#1C1C1C',
    borderColor: '#3A3A3A',
  },
  secondaryText: {
    color: '#C0C0C0',
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderColor: GOLD + '40',
  },
  outlineText: {
    color: GOLD,
  },
  disabled: {
    opacity: 0.5,
  }
});
