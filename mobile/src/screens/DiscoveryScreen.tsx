import React, { useEffect, useState } from 'react';
import { 
  View, StyleSheet, SafeAreaView, ScrollView, 
  TouchableOpacity, Dimensions, StatusBar,
  ActivityIndicator, Image
} from 'react-native';
import { User, MapPin } from 'lucide-react-native';
import { PlasmaBackground } from '../components/PlasmaBackground';
import { MatriarchText } from '../components/MatriarchText';
import { GlassCard } from '../components/GlassCard';
import { PretextText } from '../components/PretextText';
import { Skeleton } from '../components/Skeleton';
import api from '../services/api';

const GOLD = '#D4AF37';
const PLUM = '#4B0082';
const GRAPHITE = '#1C1C1C';
const SILVER = '#C0C0C0';

interface DiscoveryScreenProps {
  onBack: () => void;
}

/**
 * DiscoveryScreen: The elite discovery feed for women.
 * Features ranked profiles, Aadhaar verification badges, and selective actions.
 */
export const DiscoveryScreen: React.FC<DiscoveryScreenProps> = ({ onBack }) => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectingId, setSelectingId] = useState<string | null>(null);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const data = await api.getDiscoveryFeed();
      setProfiles(data || []);
    } catch (error) {
      console.error('Failed to load discovery feed', error);
      // Mock data if API fails
      setProfiles([
        { id: '1', name: 'Arjun S.', age: 28, city: 'Mumbai', rank: 'Elite', score: 88, verified: true, bio: 'Tech founder, loves mountains and good coffee.' },
        { id: '2', name: 'Rohan M.', age: 31, city: 'Bangalore', rank: 'High', score: 72, verified: true, bio: 'Product manager at a unicorn. Avid reader.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (id: string) => {
    try {
      setSelectingId(id);
      await api.selectProfile(id);
      // Refresh feed or remove selected
      setProfiles(profiles.filter(p => p.id !== id));
    } catch (error) {
      console.error('Selection failed', error);
    } finally {
      setSelectingId(null);
    }
  };

  const tierColor = (tier: string) =>
    tier === 'Elite' ? GOLD : tier === 'High' ? '#A78BFA' : SILVER;

  return (
    <View style={styles.container}>
      <PlasmaBackground />
      <StatusBar barStyle="light-content" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header Area */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
            <MatriarchText variant="caption">← Back</MatriarchText>
          </TouchableOpacity>
          <MatriarchText variant="h3" gold style={styles.title}>MATRIARCH</MatriarchText>
          <View style={{ width: 60 }} /> {/* Spacer */}
        </View>

        {/* Tab Bar Animation Mock */}
        <View style={styles.tabContainer}>
          {['Discover', 'Saved', 'Matched'].map((tab, i) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabItem,
                i === 0 ? styles.tabItemActive : styles.tabItemInactive
              ]}
            >
              <MatriarchText 
                variant="label" 
                style={{ color: i === 0 ? GOLD : SILVER }}
              >
                {tab}
              </MatriarchText>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <MatriarchText variant="caption" style={styles.sectionLabel}>
            Ranked discoveries for you
          </MatriarchText>

          {loading ? (
            <ActivityIndicator color={GOLD} style={{ marginTop: 40 }} />
          ) : profiles.length === 0 ? (
            <MatriarchText variant="body" style={{ textAlign: 'center', marginTop: 40, opacity: 0.5 }}>
              No profiles available at the moment.
            </MatriarchText>
          ) : (
            profiles.map((p) => (
              <GlassCard key={p.id} style={styles.profileCard} intensity={25}>
                {/* Photo Area with Aspect Ratio (Enhancement #6) */}
                <View style={styles.photoPlaceholder}>
                  <Skeleton height="100%" width="100%" style={{ position: 'absolute' }} />
                  <User size={80} color={GOLD + '40'} />
                  
                  {/* Rank Badge */}
                  <View style={[styles.rankBadge, { borderColor: tierColor(p.rank || p.tier) + '80' }]}>
                    <MatriarchText variant="caption" style={{ color: tierColor(p.rank || p.tier) }}>
                      {p.rank || p.tier}
                    </MatriarchText>
                  </View>

                  {/* Verified Badge */}
                  {(p.verified || p.is_verified) && (
                    <View style={styles.verifiedBadge}>
                      <MatriarchText variant="caption" style={styles.verifiedText}>
                        ✓ AADHAAR
                      </MatriarchText>
                    </View>
                  )}
                </View>

                {/* Info Area */}
                <View style={styles.infoArea}>
                  <View style={styles.nameRow}>
                    <MatriarchText variant="h3">{p.name || p.full_name}, {p.age}</MatriarchText>
                    <View style={styles.locationContainer}>
                      <MapPin size={12} color={GOLD} style={{ marginRight: 4 }} />
                      <MatriarchText variant="body" style={styles.location}>{p.city || 'Secret'}</MatriarchText>
                    </View>
                  </View>
                  
                  <PretextText 
                    text={p.bio || 'This member prefers to keep their bio private until a connection is made.'}
                    fontSize={14}
                    lineHeight={22}
                    maxWidth={Dimensions.get('window').width - 80} // Approx width within card
                    style={styles.bio}
                  />

                  {/* Selective Actions */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.skipButton} onPress={() => handleSelect(p.id)}>
                      <MatriarchText variant="label">Skip</MatriarchText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton}>
                      <MatriarchText variant="label" style={{ color: '#A78BFA' }}>Save</MatriarchText>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.selectButton, selectingId === p.id && styles.disabled]} 
                      onPress={() => handleSelect(p.id)}
                      disabled={!!selectingId}
                    >
                      <View style={styles.selectContent}>
                        {selectingId === p.id ? (
                          <ActivityIndicator color={GOLD} size="small" />
                        ) : (
                          <>
                            <MatriarchText variant="label" style={{ color: GOLD, marginRight: 8 }}>SELECT</MatriarchText>
                            <Image 
                              source={require('../assets/crown.png')} 
                              style={styles.selectCrown}
                              resizeMode="contain"
                            />
                          </>
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </GlassCard>
            ))
          )}
        </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A1A4A',
  },
  backButton: {
    padding: 8,
  },
  title: {
    letterSpacing: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  tabItemActive: {
    backgroundColor: PLUM + '60',
    borderColor: GOLD + '40',
  },
  tabItemInactive: {
    backgroundColor: GRAPHITE + '60',
    borderColor: '#2A2A2A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionLabel: {
    marginBottom: 16,
    opacity: 0.5,
  },
  profileCard: {
    marginBottom: 20,
    padding: 0, // Override GlassCard default padding
  },
  photoPlaceholder: {
    width: '100%',
    aspectRatio: 4 / 5, // Enhancement #6
    backgroundColor: PLUM + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectCrown: {
    width: 20,
    height: 20,
  },
  rankBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#10B981CC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  verifiedText: {
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 1,
  },
  infoArea: {
    padding: 20,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  location: {
    opacity: 0.6,
    fontSize: 12,
  },
  bio: {
    marginBottom: 24,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  skipButton: {
    flex: 1,
    backgroundColor: '#1C1C2E',
    borderRadius: 12,
    paddingVertical: 18, // Enhancement #3
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A3A5A',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#1C1C2E',
    borderRadius: 12,
    paddingVertical: 18, // Enhancement #3
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A3A5A',
  },
  selectButton: {
    flex: 2,
    backgroundColor: PLUM,
    borderRadius: 12,
    paddingVertical: 18, // Enhancement #3
    alignItems: 'center',
    borderWidth: 1,
    borderColor: GOLD + '50',
  },
  disabled: {
    opacity: 0.6,
  }
});
