import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { PlasmaBackground } from '../components/PlasmaBackground';
import { MatriarchText } from '../components/MatriarchText';
import { GlassCard } from '../components/GlassCard';
import { useUserStore } from '../store/userStore';

const GOLD = '#D4AF37';
const PLUM = '#4B0082';
const GRAPHITE = '#1C1C1C';

interface RoleSelectionScreenProps {
  onSelect: (role: 'woman' | 'man') => void;
}

/**
 * RoleSelectionScreen: Asymmetric role selection.
 * Highlights the power of women and the goal-oriented Nature for men.
 */
export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onSelect }) => {
  const setRole = useUserStore(state => state.setRole);
  const [agreedToTerms, setAgreedToTerms] = React.useState(false);
  const [agreedToData, setAgreedToData] = React.useState(false);

  const handleRoleSelect = (role: 'woman' | 'man') => {
    if (agreedToTerms && agreedToData) {
      setRole(role);
      onSelect(role);
    }
  };

  return (
    <View style={styles.container}>
      <PlasmaBackground />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <MatriarchText variant="h2" gold style={styles.header}>
            MATRIARCH
          </MatriarchText>
          <MatriarchText variant="body" style={styles.subtitle}>
            Join the future of selection.
          </MatriarchText>

          <View style={styles.consentBlock}>
            <TouchableOpacity 
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              style={styles.checkboxRow}
            >
              <View style={[styles.checkbox, agreedToTerms && styles.checkboxActive]}>
                {agreedToTerms && <View style={styles.checkmark} />}
              </View>
              <MatriarchText variant="body" style={styles.consentText}>
                I agree to the <MatriarchText gold>Terms</MatriarchText> and <MatriarchText gold>Privacy Policy</MatriarchText> and confirm I am <MatriarchText gold>18+ years old</MatriarchText>.
              </MatriarchText>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setAgreedToData(!agreedToData)}
              style={styles.checkboxRow}
            >
              <View style={[styles.checkbox, agreedToData && styles.checkboxActive]}>
                {agreedToData && <View style={styles.checkmark} />}
              </View>
              <MatriarchText variant="body" style={styles.consentText}>
                I consent to <MatriarchText gold>Data Processing</MatriarchText> for analytics and ranking algorithms.
              </MatriarchText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => handleRoleSelect('woman')}
            activeOpacity={0.9}
            style={[styles.roleButton, (!agreedToTerms || !agreedToData) && styles.disabledButton]}
          >
            <GlassCard style={styles.womanCard} intensity={40} borderColor={GOLD}>
              <Image 
                source={require('../assets/role_woman.png')} 
                style={styles.roleIcon}
                resizeMode="contain"
              />
              <MatriarchText variant="h3" gold style={styles.roleTitle}>
                WOMAN
              </MatriarchText>
              <MatriarchText variant="body" style={styles.roleDesc}>
                Browse, select, and control{'\n'}every step of the connection.
              </MatriarchText>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleRoleSelect('man')}
            activeOpacity={0.9}
            style={[styles.roleButton, (!agreedToTerms || !agreedToData) && styles.disabledButton]}
          >
            <GlassCard style={styles.manCard} intensity={20}>
              <Image 
                source={require('../assets/role_man.png')} 
                style={styles.roleIcon}
                resizeMode="contain"
              />
              <MatriarchText variant="h3" style={styles.roleTitleMan}>
                MAN
              </MatriarchText>
              <MatriarchText variant="body" style={styles.roleDesc}>
                Build your profile, improve your{'\n'}rank, and wait to be discovered.
              </MatriarchText>
            </GlassCard>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 28,
    justifyContent: 'center',
  },
  header: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 48,
    opacity: 0.6,
  },
  roleButton: {
    marginBottom: 20,
  },
  womanCard: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: PLUM + '40',
  },
  manCard: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: GRAPHITE + '80',
  },
  roleIcon: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  roleTitle: {
    marginBottom: 8,
  },
  roleTitleMan: {
    color: '#A78BFA',
    marginBottom: 8,
    fontWeight: '800',
    letterSpacing: 3,
  },
  roleDesc: {
    textAlign: 'center',
    opacity: 0.7,
  },
  consentBlock: {
    marginBottom: 32,
    gap: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: GOLD + '40',
    backgroundColor: PLUM + '20',
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: GOLD,
    borderColor: GOLD,
  },
  checkmark: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: PLUM,
  },
  consentText: {
    fontSize: 12,
    opacity: 0.6,
    lineHeight: 18,
    flex: 1,
  },
  disabledButton: {
    opacity: 0.4,
  }
});
