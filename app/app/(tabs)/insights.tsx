import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Colors } from '@/src/constants/theme';
import { mockInsights, mockRiskIndicators } from '@/src/data/mockData';

export default function InsightsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionHeader}>Pattern Analysis</Text>
      
      {mockInsights.map((insight) => (
        <View key={insight.id} style={styles.card}>
          <View style={styles.cardTag}>
            <Text style={styles.cardTagText}>ANOMALY DETECTED</Text>
          </View>
          <Text style={styles.cardTitle}>{insight.title}</Text>
          <Text style={styles.cardDesc}>{insight.description}</Text>
          {insight.actionableStep && (
            <View style={styles.recBox}>
              <Text style={styles.recTitle}>Recommendation:</Text>
              <Text style={styles.recDesc}>{insight.actionableStep}</Text>
            </View>
          )}
        </View>
      ))}

      <Text style={styles.sectionHeader}>Health Awareness</Text>
      {mockRiskIndicators.map((risk) => (
        <View key={risk.id} style={styles.riskCard}>
          <Text style={styles.riskTitle}>{risk.type}</Text>
          <Text style={styles.riskDesc}>{risk.explanation}</Text>
          <Text style={styles.disclaimer}>{risk.disclaimer}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  content: { padding: 20 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: Colors.charcoal, marginBottom: 14 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cardTag: {
    backgroundColor: Colors.lavenderLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTagText: { color: Colors.plum, fontSize: 10, fontWeight: 'bold' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.charcoal, marginBottom: 6 },
  cardDesc: { fontSize: 13, color: Colors.grayMuted, lineHeight: 18 },
  recBox: { marginTop: 12, padding: 12, backgroundColor: Colors.ivory, borderRadius: 10 },
  recTitle: { fontSize: 12, fontWeight: 'bold', color: Colors.plum },
  recDesc: { fontSize: 12, color: Colors.charcoal, marginTop: 2 },
  riskCard: {
    backgroundColor: Colors.amberLight,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.amber,
    marginBottom: 16,
  },
  riskTitle: { fontSize: 15, fontWeight: 'bold', color: Colors.charcoal, marginBottom: 6 },
  riskDesc: { fontSize: 13, color: Colors.charcoal, lineHeight: 18 },
  disclaimer: { fontSize: 11, fontStyle: 'italic', color: Colors.grayMuted, marginTop: 8 },
});
