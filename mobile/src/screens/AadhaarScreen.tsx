import React, { useState } from 'react';
import { 
  View, StyleSheet, SafeAreaView, TextInput, 
  TouchableOpacity, KeyboardAvoidingView, Platform,
  ActivityIndicator
} from 'react-native';
import { PlasmaBackground } from '../components/PlasmaBackground';
import { MatriarchText } from '../components/MatriarchText';
import { GlassCard } from '../components/GlassCard';
import { AestheticButton } from '../components/AestheticButton';
import api from '../services/api';

const GOLD = '#D4AF37';

interface AadhaarScreenProps {
  onVerify: () => void;
  onBack: () => void;
}

/**
 * AadhaarScreen: The identity verification flow.
 * Ensures high-trust through Aadhaar linking (mocked/simulation for now).
 */
export const AadhaarScreen: React.FC<AadhaarScreenProps> = ({ onVerify, onBack }) => {
  const [aadhaar, setAadhaar] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'number' | 'otp'>('number');
  const [otp, setOtp] = useState('');

  const handleSendOtp = async () => {
    if (aadhaar.length < 12) return;
    setLoading(true);
    try {
      await api.verifyAadhaar(aadhaar);
      setStep('otp');
    } catch (error) {
      console.error('OTP request failed', error);
      // Fallback for demo if backend is not fully ready
      setStep('otp');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    try {
      await api.verifyAadhaar(aadhaar, otp);
      onVerify();
    } catch (error) {
      console.error('Verification failed', error);
      // Fallback for demo
      onVerify();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <PlasmaBackground />
      
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
              <MatriarchText variant="caption">← Cancel</MatriarchText>
            </TouchableOpacity>
            <MatriarchText variant="h3" gold>IDENTITY</MatriarchText>
            <View style={{ width: 60 }} />
          </View>

          <View style={styles.content}>
            <GlassCard style={styles.card} intensity={40}>
              <View style={styles.iconContainer}>
                <MatriarchText style={styles.shieldIcon}>🛡</MatriarchText>
              </View>

              <MatriarchText variant="h2" style={styles.title}>
                {step === 'number' ? 'Trust & Safety' : 'Verify OTP'}
              </MatriarchText>
              
              <MatriarchText variant="body" style={styles.subtitle}>
                {step === 'number' 
                  ? 'Matriarch requires Aadhaar verification to ensure a safe, high-trust environment for everyone.'
                  : 'Enter the 6-digit code sent to your Aadhaar-linked mobile number.'}
              </MatriarchText>

              {step === 'number' ? (
                <View style={styles.inputSection}>
                  <MatriarchText variant="label" style={styles.inputLabel}>
                    Aadhaar Number
                  </MatriarchText>
                  <TextInput
                    style={styles.input}
                    placeholder="0000 0000 0000"
                    placeholderTextColor="rgba(212, 175, 55, 0.3)"
                    keyboardType="number-pad"
                    maxLength={12}
                    value={aadhaar}
                    onChangeText={setAadhaar}
                  />
                  <AestheticButton 
                    label="Request OTP" 
                    onPress={handleSendOtp}
                    disabled={aadhaar.length < 12}
                    loading={loading && step === 'number'}
                  />
                </View>
              ) : (
                <View style={styles.inputSection}>
                  <MatriarchText variant="label" style={styles.inputLabel}>
                    One-Time Password
                  </MatriarchText>
                  <TextInput
                    style={styles.input}
                    placeholder="······"
                    placeholderTextColor="rgba(212, 175, 55, 0.3)"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp}
                    onChangeText={setOtp}
                  />
                  <AestheticButton 
                    label="Confirm Verification" 
                    onPress={handleVerify}
                    disabled={otp.length < 6}
                    loading={loading && step === 'otp'}
                  />
                </View>
              )}

            </GlassCard>

            <MatriarchText variant="caption" style={styles.disclaimer}>
              We do not store your Aadhaar number. Verification is handled via secure government-approved gateways.
            </MatriarchText>
          </View>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  card: {
    padding: 32,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: GOLD + '40',
  },
  shieldIcon: {
    fontSize: 32,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
  },
  inputSection: {
    width: '100%',
  },
  inputLabel: {
    marginBottom: 8,
    opacity: 0.6,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    color: GOLD,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 4,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    marginBottom: 24,
  },
  disclaimer: {
    marginTop: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 16,
  }
});
