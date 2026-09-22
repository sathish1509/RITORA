import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native';
import { Colors } from '@/src/constants/theme';
import { mobileHealthService } from '@/src/services';

export default function CycleScreen() {
  const [cycles, setCycles] = useState<any[]>([]);
  const [currentCycle, setCurrentCycle] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadCycles = async () => {
    try {
      const [fetchedCycles, activeCycle, currentUser] = await Promise.all([
        mobileHealthService.getCycles(),
        mobileHealthService.getCurrentCycle(),
        mobileHealthService.getCurrentUser(),
      ]);
      if (fetchedCycles) setCycles(fetchedCycles);
      if (activeCycle) setCurrentCycle(activeCycle);
      if (currentUser) setUser(currentUser);
    } catch (err) {
      console.warn('Failed to load mobile cycle data', err);
    }
  };

  useEffect(() => {
    loadCycles();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCycles();
    setRefreshing(false);
  };

  const currentCycleDayNumber = (() => {
    if (!currentCycle?.startDate) return 1;
    const start = new Date(currentCycle.startDate);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 86400000) + 1;
    return Math.max(1, diff);
  })();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.plum} />}
    >
      {/* Overview Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Cycle Overview</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{currentCycleDayNumber}</Text>
            <Text style={styles.statLabel}>Current Day</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user?.averageCycleLength || 28}d</Text>
            <Text style={styles.statLabel}>Avg Length</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user?.averagePeriodLength || user?.averagePeriodDuration || 5}d</Text>
            <Text style={styles.statLabel}>Avg Period</Text>
          </View>
        </View>
      </View>

      {/* Cycle History Header */}
      <Text style={styles.sectionHeader}>Cycle History</Text>

      {/* Cycle Items */}
      {cycles.map((cycle) => (
        <View key={cycle.id} style={styles.historyCard}>
          <View style={styles.historyCardHeader}>
            <Text style={styles.historyDate}>Started {new Date(cycle.startDate).toLocaleDateString()}</Text>
            <View style={[styles.statusTag, cycle.cycleLength && Math.abs(cycle.cycleLength - (user?.averageCycleLength || 28)) <= 3 ? styles.regularTag : styles.irregularTag]}>
              <Text style={[styles.statusTagText, cycle.cycleLength && Math.abs(cycle.cycleLength - (user?.averageCycleLength || 28)) <= 3 ? styles.regularTagText : styles.irregularTagText]}>
                {cycle.isActive ? 'Active Cycle' : cycle.cycleLength && Math.abs(cycle.cycleLength - (user?.averageCycleLength || 28)) <= 3 ? 'Regular' : 'Variation Detected'}
              </Text>
            </View>
          </View>

          <View style={styles.historyDetailsRow}>
            <Text style={styles.historyMetric}>
              Length: <Text style={styles.historyMetricVal}>{cycle.cycleLength ? `${cycle.cycleLength} days` : `Day ${currentCycleDayNumber}`}</Text>
            </Text>
            {cycle.periodLength && (
              <Text style={styles.historyMetric}>
                Period: <Text style={styles.historyMetricVal}>{cycle.periodLength} days</Text>
              </Text>
            )}
          </View>

          {cycle.notes && <Text style={styles.historyNotes}>Note: {cycle.notes}</Text>}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  content: { padding: 20 },
  summaryCard: {
    backgroundColor: Colors.plum,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  cardTitle: { color: Colors.white, fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statBox: { alignItems: 'center' },
  statNumber: { color: Colors.white, fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: Colors.lavender, fontSize: 12, marginTop: 4 },
  divider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)' },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: Colors.charcoal, marginBottom: 14 },
  historyCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  historyCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  historyDate: { fontSize: 15, fontWeight: 'bold', color: Colors.charcoal },
  statusTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  regularTag: { backgroundColor: Colors.lavenderLight },
  regularTagText: { color: Colors.plum, fontSize: 11, fontWeight: '600' },
  irregularTag: { backgroundColor: Colors.amberLight },
  irregularTagText: { color: Colors.amber, fontSize: 11, fontWeight: '600' },
  statusTagText: { fontSize: 11, fontWeight: '600' },
  historyDetailsRow: { flexDirection: 'row', gap: 16, marginTop: 4 },
  historyMetric: { fontSize: 13, color: Colors.grayMuted },
  historyMetricVal: { color: Colors.charcoal, fontWeight: '600' },
  historyNotes: { fontSize: 12, fontStyle: 'italic', color: Colors.grayMuted, marginTop: 8 },
});
