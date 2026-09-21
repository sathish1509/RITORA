import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '@/src/constants/theme';
import {
  mockUser,
  currentCycleDay,
  mockInsights,
  mockRiskIndicators,
  mockPredictions,
} from '@/src/data/mockData';

export default function HomeScreen() {
  const insight = mockInsights[0];
  const risk = mockRiskIndicators[0];
  const prediction = mockPredictions[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Greeting */}
      <View style={styles.greetingHeader}>
        <Text style={styles.greetingSub}>Good morning,</Text>
        <Text style={styles.greetingTitle}>{mockUser.name} 👋</Text>
      </View>

      {/* Cycle Progress Card */}
      <View style={styles.cycleCard}>
        <View style={styles.cycleCardHeader}>
          <Text style={styles.cycleCardLabel}>CURRENT CYCLE</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Active</Text>
          </View>
        </View>

        <View style={styles.cycleProgressRow}>
          <View style={styles.cycleCircle}>
            <Text style={styles.cycleDayNumber}>{currentCycleDay}</Text>
            <Text style={styles.cycleDayLabel}>DAY</Text>
          </View>

          <View style={styles.cycleInfo}>
            <Text style={styles.cycleStatusText}>Cycle Delayed</Text>
            <Text style={styles.cycleDeviationText}>+6 days from 29-day avg</Text>
            <Text style={styles.cyclePredictionText}>
              Next period: ~{prediction.predictedDate} ({prediction.confidence}% confidence)
            </Text>
          </View>
        </View>
      </View>

      {/* RITORA Hero Insight Card */}
      <View style={styles.insightCard}>
        <View style={styles.insightTag}>
          <Text style={styles.insightTagText}>✨ RITORA INSIGHT</Text>
        </View>
        <Text style={styles.insightTitle}>{insight.title}</Text>
        <Text style={styles.insightDesc}>{insight.description}</Text>
        
        {insight.actionableStep && (
          <View style={styles.actionBox}>
            <Text style={styles.actionTitle}>Suggested Action:</Text>
            <Text style={styles.actionText}>{insight.actionableStep}</Text>
          </View>
        )}
      </View>

      {/* Quick Action Buttons */}
      <Text style={styles.sectionHeader}>Quick Actions</Text>
      <View style={styles.actionGrid}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonIcon}>🩸</Text>
          <Text style={styles.actionButtonText}>Log Period</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonIcon}>🤒</Text>
          <Text style={styles.actionButtonText}>Log Symptom</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonIcon}>💤</Text>
          <Text style={styles.actionButtonText}>Log Lifestyle</Text>
        </TouchableOpacity>
      </View>

      {/* Health Awareness Indicator */}
      <Text style={styles.sectionHeader}>Health Awareness</Text>
      <View style={styles.riskCard}>
        <View style={styles.riskHeader}>
          <Text style={styles.riskTitle}>{risk.type}</Text>
          <View style={styles.riskBadge}>
            <Text style={styles.riskBadgeText}>{risk.level.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.riskDesc}>{risk.explanation}</Text>
        <Text style={styles.disclaimerText}>{risk.disclaimer}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ivory,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  greetingHeader: {
    marginBottom: 20,
  },
  greetingSub: {
    fontSize: 14,
    color: Colors.grayMuted,
  },
  greetingTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.charcoal,
  },
  cycleCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cycleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cycleCardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.grayMuted,
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: Colors.amberLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.amber,
  },
  badgeText: {
    fontSize: 12,
    color: Colors.amber,
    fontWeight: '600',
  },
  cycleProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cycleCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.lavenderLight,
    borderWidth: 3,
    borderColor: Colors.plum,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cycleDayNumber: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.plum,
  },
  cycleDayLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.plum,
  },
  cycleInfo: {
    flex: 1,
  },
  cycleStatusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.charcoal,
  },
  cycleDeviationText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.amber,
    marginTop: 2,
  },
  cyclePredictionText: {
    fontSize: 12,
    color: Colors.grayMuted,
    marginTop: 4,
  },
  insightCard: {
    backgroundColor: Colors.plum,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  insightTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 10,
  },
  insightTagText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  insightTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
  },
  insightDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 20,
  },
  actionBox: {
    marginTop: 14,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
  },
  actionTitle: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  actionText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.charcoal,
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  actionButtonIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.charcoal,
  },
  riskCard: {
    backgroundColor: Colors.amberLight,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.amber,
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.charcoal,
    flex: 1,
  },
  riskBadge: {
    backgroundColor: Colors.amber,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  riskBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  riskDesc: {
    fontSize: 13,
    color: Colors.charcoal,
    lineHeight: 18,
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: Colors.grayMuted,
  },
});
