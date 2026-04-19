import React, { useEffect, useState } from 'react';
import { 
  View, StyleSheet, SafeAreaView, ScrollView, 
  TouchableOpacity, StatusBar, ActivityIndicator, Dimensions
} from 'react-native';
import { 
  CheckCircle, FileText, Users, Zap, MessageSquare, 
  Coins, Lock, Unlock, ArrowRight 
} from 'lucide-react-native';
import { Modal, Image, Alert } from 'react-native';
import { NotificationService } from '../services/notificationService';
import { useUserStore } from '../store/userStore';
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

interface DashboardScreenProps {
  onBack: () => void;
  onVerify: () => void;
}

/**
 * DashboardScreen: The ranking dashboard for men.
 */
export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onBack, onVerify }) => {
  const { 
    auraTokens, hasUsedFreeMatch, unlockedMatchIds, 
    addTokens, useTokens, useFreeMatch, unlockMatch 
  } = useUserStore();

  const [rank, setRank] = useState<any>({ score: 0, tier: '...', completeness: 0, verified: false });
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStore, setShowStore] = useState(false);
  const [unlockingId, setUnlockingId] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
    NotificationService.simulateMatchNotification();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [rankData, matchData] = await Promise.all([
        api.getRankStatus('male_demo'),
        api.getMatches()
      ]);
      setRank(rankData || { score: 37.25, tier: 'Mid', completeness: 65, verified: false });
      setMatches(matchData || []);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
      setRank({ score: 37.25, tier: 'Mid', completeness: 65, verified: false });
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (matchId: string) => {
    // If already unlocked
    if (unlockedMatchIds.includes(matchId)) return;

    // Check if first match is free
    if (!hasUsedFreeMatch) {
      try {
        setUnlockingId(matchId);
        await api.unlockMatch(matchId);
        useFreeMatch();
        unlockMatch(matchId);
        Alert.alert('♛ SELECTION UNLOCKED', 'Your first match is on us. Good luck!');
      } finally {
        setUnlockingId(null);
      }
      return;
    }

    // Check tokens (199 for 1 match)
    if (auraTokens < 199) {
      setShowStore(true);
      return;
    }

    try {
      setUnlockingId(matchId);
      await api.unlockMatch(matchId);
      useTokens(199);
      unlockMatch(matchId);
      Alert.alert('♛ SELECTION UNLOCKED', '199 Aura tokens deducted. Connection active.');
    } finally {
      setUnlockingId(null);
    }
  };

  const handlePurchase = async (pkg: { id: string, label: string, price: number, amount: number }) => {
    try {
      setLoading(true);
      await api.purchaseTokens(pkg.id);
      addTokens(pkg.amount);
      setShowStore(false);
      Alert.alert('STORE SUCCESS', `${pkg.label} added to your balance.`);
    } catch (error) {
      Alert.alert('PURCHASE FAILED', 'Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const tierColor = rank.tier === 'Elite' ? GOLD : rank.tier === 'High' ? '#A78BFA' : SILVER;

  return (
    <View style={styles.container}>
      <PlasmaBackground />
      <StatusBar barStyle="light-content" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MatriarchText variant="caption">← Back</MatriarchText>
          </TouchableOpacity>
          <MatriarchText variant="h3" gold style={styles.title}>MATRIARCH</MatriarchText>
          <TouchableOpacity onPress={() => setShowStore(true)} style={styles.auraBalance}>
            <Coins size={14} color={GOLD} style={{ marginRight: 6 }} />
            <MatriarchText variant="label" style={{ color: GOLD }}>{auraTokens}</MatriarchText>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {loading ? (
            <ActivityIndicator color={GOLD} style={{ marginTop: 60 }} />
          ) : (
            <>
              {/* Rank Card */}
              <GlassCard style={styles.rankCard} intensity={30}>
                <MatriarchText variant="caption" style={styles.sectionLabelInternal}>
                  Your Rank Status
                </MatriarchText>
                
                <View style={styles.rankMain}>
                  <View style={[styles.scoreCircle, { borderColor: tierColor + '80' }]}>
                    <MatriarchText style={[styles.scoreText, { color: tierColor }]}>
                      {rank.score}
                    </MatriarchText>
                    <MatriarchText variant="caption" style={{ color: tierColor }}>SCORE</MatriarchText>
                  </View>
                  
                  <View style={styles.rankInfo}>
                    <MatriarchText variant="h2" style={{ color: tierColor }}>
                      {rank.tier} TIER
                    </MatriarchText>
                    <MatriarchText variant="body" style={styles.dailyUpdate}>
                      Position updated daily
                    </MatriarchText>
                    
                    <View style={styles.statusBadgeRow}>
                      {rank.verified ? (
                        <View style={styles.verifiedBadge}>
                          <MatriarchText variant="caption" style={styles.verifiedText}>✓ VERIFIED</MatriarchText>
                        </View>
                      ) : (
                        <View style={styles.unverifiedBadge}>
                          <MatriarchText variant="caption" style={styles.unverifiedText}>⚠ UNVERIFIED</MatriarchText>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {/* Progress */}
                <View style={styles.progressSection}>
                  <View style={styles.progressLabelRow}>
                    <MatriarchText variant="body">Profile Completeness</MatriarchText>
                    <MatriarchText variant="body" gold style={{ fontWeight: '700' }}>
                      {rank.completeness}%
                    </MatriarchText>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${rank.completeness}%` }]} />
                  </View>
                </View>
              </GlassCard>

              {/* Action Tips */}
              <MatriarchText variant="caption" style={styles.sectionLabel}>
                Improve Your Visibility
              </MatriarchText>

              {[
                { icon: <CheckCircle size={24} color={GOLD} />, text: 'Identity Verification', points: '+20 pts', action: 'Verify', onPress: onVerify },
                { icon: <FileText size={24} color={GOLD} />, text: 'Bio & Interests', points: '+15 pts', action: 'Edit' },
                { icon: <Users size={24} color={GOLD} />, text: 'Refer 3 Friends', points: '+15 pts', action: 'Share' },
                { icon: <Zap size={24} color={GOLD} />, text: 'Visibility Boost', points: '+40 pts', action: 'Boost' },
              ].map((tip, i) => (
                <TouchableOpacity key={i} onPress={tip.onPress}>
                  <GlassCard style={styles.tipCard} intensity={15}>
                    <View style={styles.tipIconContainer}>{tip.icon}</View>
                    <View style={styles.tipContent}>
                      <MatriarchText variant="h3" style={styles.tipText}>{tip.text}</MatriarchText>
                      <MatriarchText variant="body" style={styles.tipPoints}>{tip.points}</MatriarchText>
                    </View>
                    <View style={styles.tipAction}>
                      <MatriarchText variant="label" gold>{tip.action}</MatriarchText>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              ))}

              {/* Matches Placeholder */}
              {/* Matches List */}
              <MatriarchText variant="caption" style={styles.sectionLabel}>
                Selection Status
              </MatriarchText>

              {matches.length === 0 ? (
                <GlassCard style={styles.matchesCard} intensity={10}>
                  <MessageSquare size={32} color={GOLD} style={{ marginBottom: 12 }} />
                  <PretextText 
                    text={`No match requests yet.\nElite rank profiles get 12x more visibility.`}
                    fontSize={14}
                    lineHeight={20}
                    maxWidth={Dimensions.get('window').width - 104}
                    style={styles.emptyText}
                  />
                </GlassCard>
              ) : (
                matches.map((m) => {
                  const isUnlocked = unlockedMatchIds.includes(m.id);
                  return (
                    <GlassCard key={m.id} style={styles.matchItemCard} intensity={20}>
                      <View style={styles.matchMain}>
                        <View style={styles.matchPhotoContainer}>
                          <Skeleton height="100%" width="100%" borderRadius={30} style={{ position: 'absolute' }} />
                          <Image source={{ uri: m.image }} style={[styles.matchPhoto, !isUnlocked && styles.blurredPhoto]} blurRadius={isUnlocked ? 0 : 20} />
                          {!isUnlocked && (
                            <View style={styles.lockOverlay}>
                              <Lock size={20} color="#fff" />
                            </View>
                          )}
                        </View>
                        
                        <View style={styles.matchInfo}>
                          <MatriarchText variant="h3">
                            {isUnlocked ? `${m.name}, ${m.age}` : "Elite Selection"}
                          </MatriarchText>
                          <MatriarchText variant="body" style={styles.matchLocation}>
                            {isUnlocked ? m.location : "Location Locked"}
                          </MatriarchText>
                          {isUnlocked && (
                            <MatriarchText variant="caption" style={styles.matchBio} numberOfLines={1}>
                              {m.bio}
                            </MatriarchText>
                          )}
                        </View>

                        <TouchableOpacity 
                          style={[styles.matchActionButton, isUnlocked && styles.unlockedActionButton]}
                          onPress={() => isUnlocked ? null : handleUnlock(m.id)}
                          disabled={unlockingId === m.id}
                        >
                          {unlockingId === m.id ? (
                            <ActivityIndicator size="small" color={GOLD} />
                          ) : isUnlocked ? (
                            <MessageSquare size={18} color="#fff" />
                          ) : (
                            <Unlock size={18} color={GOLD} />
                          )}
                        </TouchableOpacity>
                      </View>
                    </GlassCard>
                  );
                })
              )}
            </>
          )}
        </ScrollView>

        {/* Aura Store Modal */}
        <Modal visible={showStore} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <GlassCard style={styles.storeModal} intensity={40} borderColor={GOLD}>
              <View style={styles.storeHeader}>
                <Coins size={32} color={GOLD} />
                <MatriarchText variant="h2" gold style={styles.storeTitle}>AURA STORE</MatriarchText>
                <MatriarchText variant="body" style={styles.storeSubtitle}>
                  Unlock connections with selected Elite members.
                </MatriarchText>
              </View>

              <View style={styles.packageList}>
                {[
                  { id: 'p1', label: '1 Match', amount: 1, tokens: 199, price: '₹199' },
                  { id: 'p3', label: '3 Matches', amount: 3, tokens: 299, price: '₹299', popular: true },
                  { id: 'p10', label: '10 Matches', amount: 10, tokens: 699, price: '₹699' },
                ].map((pkg) => (
                  <TouchableOpacity 
                    key={pkg.id} 
                    style={[styles.packageCard, pkg.popular && styles.packageCardPopular]}
                    onPress={() => handlePurchase({ id: pkg.id, label: pkg.label, price: pkg.tokens, amount: pkg.amount })}
                  >
                    <View style={styles.packageMain}>
                      <MatriarchText variant="h3" style={{ color: pkg.popular ? GOLD : '#fff' }}>{pkg.label}</MatriarchText>
                      <MatriarchText variant="body" style={styles.packageTokens}>{pkg.tokens} Aura Tokens</MatriarchText>
                    </View>
                    <View style={styles.packageAction}>
                      <MatriarchText variant="label" gold>{pkg.price}</MatriarchText>
                      <ArrowRight size={14} color={GOLD} style={{ marginLeft: 4 }} />
                    </View>
                    {pkg.popular && (
                      <View style={styles.popularBadge}>
                        <MatriarchText variant="caption" style={styles.popularText}>BEST VALUE</MatriarchText>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity onPress={() => setShowStore(false)} style={styles.closeStore}>
                <MatriarchText variant="label">Dismiss</MatriarchText>
              </TouchableOpacity>
            </GlassCard>
          </View>
        </Modal>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  sectionLabel: {
    marginBottom: 12,
    marginTop: 20,
    opacity: 0.5,
  },
  sectionLabelInternal: {
    marginBottom: 12,
    opacity: 0.5,
  },
  rankCard: {
    marginBottom: 10,
    padding: 24,
  },
  rankMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 24,
  },
  scoreCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: PLUM + '30',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: '900',
  },
  rankInfo: {
    flex: 1,
  },
  dailyUpdate: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  verifiedBadge: {
    backgroundColor: '#10B98130',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    color: '#10B981',
    fontWeight: '800',
  },
  unverifiedBadge: {
    backgroundColor: '#EF444430',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  unverifiedText: {
    color: '#EF4444',
    fontWeight: '800',
  },
  progressSection: {
    marginTop: 8,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#2A2A3A',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: GOLD,
    borderRadius: 5,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 18,
  },
  tipIconContainer: {
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipText: {
    fontSize: 15,
  },
  tipPoints: {
    color: '#10B981',
    fontSize: 12,
    marginTop: 2,
  },
  tipAction: {
    backgroundColor: PLUM + '40',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GOLD + '30',
  },
  matchesCard: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: GRAPHITE + '40',
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 20,
  },
  auraBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PLUM + '60',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GOLD + '30',
  },
  matchItemCard: {
    marginBottom: 12,
    padding: 12,
  },
  matchMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchPhotoContainer: {
    width: 60,
    aspectRatio: 1, // Enhancement #6
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: GRAPHITE,
  },
  matchPhoto: {
    width: '100%',
    height: '100%',
  },
  blurredPhoto: {
    opacity: 0.5,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchInfo: {
    flex: 1,
  },
  matchLocation: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  matchBio: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.4,
  },
  matchActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PLUM + '40',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: GOLD + '30',
  },
  unlockedActionButton: {
    backgroundColor: '#10B98160',
    borderColor: '#10B98140',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 24,
  },
  storeModal: {
    padding: 32,
    alignItems: 'center',
  },
  storeHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  storeTitle: {
    letterSpacing: 4,
    marginTop: 12,
    marginBottom: 8,
  },
  storeSubtitle: {
    textAlign: 'center',
    opacity: 0.6,
    fontSize: 14,
  },
  packageList: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  packageCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: GRAPHITE + '60',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  packageCardPopular: {
    borderColor: GOLD + '60',
    backgroundColor: PLUM + '20',
  },
  packageMain: {
    flex: 1,
  },
  packageTokens: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  packageAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PLUM + '40',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GOLD + '30',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: GOLD,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  popularText: {
    color: PLUM,
    fontSize: 10,
    fontWeight: '900',
  },
  closeStore: {
    padding: 12,
    opacity: 0.5,
  }
});
