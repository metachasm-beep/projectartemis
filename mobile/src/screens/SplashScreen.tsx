import React from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions, Image } from 'react-native';
import { PlasmaBackground } from '../components/PlasmaBackground';
import { MatriarchText } from '../components/MatriarchText';
import { AestheticButton } from '../components/AestheticButton';
import { GlassCard } from '../components/GlassCard';

const { width } = Dimensions.get('window');

const GOLD = '#D4AF37';
const PLUM = '#4B0082';

interface SplashScreenProps {
  onNext: () => void;
}

/**
 * SplashScreen: The premium entry point of MATRIARCH.
 * Features a plasma background, glassmorphic card, and high-fidelity typography.
 */
export const SplashScreen: React.FC<SplashScreenProps> = ({ onNext }) => {
  return (
    <View style={styles.container}>
      <PlasmaBackground />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <GlassCard style={styles.logoCard} intensity={30}>
            <View style={styles.crownContainer}>
              <Image 
                source={require('../assets/logo.png')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            
            <MatriarchText variant="h1" gold style={styles.title}>
              MATRIARCH
            </MatriarchText>
            
            <View style={styles.divider} />
            
            <MatriarchText variant="body" style={styles.subtitle}>
              The future of selection.{'\n'}Women first. Always.
            </MatriarchText>
          </GlassCard>

          <View style={styles.buttonContainer}>
            <AestheticButton 
              label="Enter MATRIARCH" 
              onPress={onNext} 
              variant="primary"
            />
          </View>
        </View>

        <MatriarchText variant="caption" style={styles.footer}>
          ENCRYPTED · SELECTIVE · SECURE
        </MatriarchText>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoCard: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  crownContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: PLUM + '30',
    borderWidth: 1,
    borderColor: GOLD + '60',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  title: {
    textAlign: 'center',
  },
  divider: {
    height: 1,
    width: 60,
    backgroundColor: GOLD + '40',
    marginVertical: 24,
  },
  subtitle: {
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 48,
    width: '100%',
  },
  footer: {
    textAlign: 'center',
    marginBottom: 32,
    color: GOLD + '80',
  }
});
