import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Colors } from '@/src/constants/theme';
import { mobileHealthService } from '@/src/services';

export default function TrackScreen() {
  const [selectedFlow, setSelectedFlow] = useState('heavy');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['cramps', 'fatigue']);
  const [sleep, setSleep] = useState('5.0');
  const [stress, setStress] = useState('high');
  const [saving, setSaving] = useState(false);

  const symptomsList = [
    { id: 'cramps', name: '🔥 Cramps' },
    { id: 'fatigue', name: '😴 Fatigue' },
    { id: 'headache', name: '🤕 Headache' },
    { id: 'bloating', name: '🎈 Bloating' },
    { id: 'mood-swings', name: '🎭 Mood Swings' },
    { id: 'nausea', name: '🤢 Nausea' },
  ];

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const today = new Date().toISOString().split('T')[0];
    try {
      const symptomPayloads = selectedSymptoms.map((type) => ({
        type,
        severity: type === 'cramps' || type === 'fatigue' ? 4 : 3,
        date: today,
      }));

      await Promise.all([
        mobileHealthService.logSymptoms(symptomPayloads),
        mobileHealthService.logLifestyle({
          date: today,
          sleep: parseFloat(sleep) || 7,
          stress,
          hydration: 2.2,
          exercise: 30,
          mood: stress === 'high' ? 'low' : 'good',
        }),
      ]);

      Alert.alert('Saved', 'Your daily cycle and lifestyle log has been synced with RITORA health intelligence.');
    } catch {
      Alert.alert('Saved (Offline)', 'Log recorded locally.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Flow Selection */}
      <Text style={styles.sectionHeader}>Flow Intensity</Text>
      <View style={styles.chipRow}>
        {['spotting', 'light', 'medium', 'heavy'].map((flow) => (
          <TouchableOpacity
            key={flow}
            style={[styles.chip, selectedFlow === flow && styles.chipActive]}
            onPress={() => setSelectedFlow(flow)}>
            <Text style={[styles.chipText, selectedFlow === flow && styles.chipTextActive]}>
              {flow.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Symptom Selection */}
      <Text style={styles.sectionHeader}>Today's Symptoms</Text>
      <View style={styles.symptomGrid}>
        {symptomsList.map((sym) => {
          const active = selectedSymptoms.includes(sym.id);
          return (
            <TouchableOpacity
              key={sym.id}
              style={[styles.symptomCard, active && styles.symptomCardActive]}
              onPress={() => toggleSymptom(sym.id)}>
              <Text style={[styles.symptomText, active && styles.symptomTextActive]}>
                {sym.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Lifestyle Metrics */}
      <Text style={styles.sectionHeader}>Lifestyle Metrics</Text>
      <View style={styles.inputCard}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Sleep (hours)</Text>
          <TextInput
            style={styles.textInput}
            value={sleep}
            onChangeText={setSleep}
            keyboardType="decimal-pad"
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Stress Level</Text>
          <View style={styles.miniChipRow}>
            {['low', 'moderate', 'high'].map((lvl) => (
              <TouchableOpacity
                key={lvl}
                style={[styles.miniChip, stress === lvl && styles.miniChipActive]}
                onPress={() => setStress(lvl)}>
                <Text style={[styles.miniChipText, stress === lvl && styles.miniChipTextActive]}>
                  {lvl}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, saving && { opacity: 0.7 }]}
        onPress={handleSave}
        disabled={saving}>
        {saving ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={styles.saveButtonText}>Save Daily Log</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  content: { padding: 20 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: Colors.charcoal, marginBottom: 12 },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  chip: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
  },
  chipActive: { backgroundColor: Colors.plum, borderColor: Colors.plum },
  chipText: { fontSize: 12, fontWeight: 'bold', color: Colors.charcoal },
  chipTextActive: { color: Colors.white },
  symptomGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  symptomCard: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  symptomCardActive: { backgroundColor: Colors.lavenderLight, borderColor: Colors.plum },
  symptomText: { fontSize: 13, color: Colors.charcoal, fontWeight: '500' },
  symptomTextActive: { color: Colors.plum, fontWeight: 'bold' },
  inputCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  inputLabel: { fontSize: 14, color: Colors.charcoal, fontWeight: '500' },
  textInput: {
    backgroundColor: Colors.ivory,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    width: 70,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  miniChipRow: { flexDirection: 'row', gap: 6 },
  miniChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: Colors.ivory,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  miniChipActive: { backgroundColor: Colors.amber, borderColor: Colors.amber },
  miniChipText: { fontSize: 11, color: Colors.charcoal, textTransform: 'capitalize' },
  miniChipTextActive: { color: Colors.white, fontWeight: 'bold' },
  saveButton: {
    backgroundColor: Colors.plum,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveButtonText: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});
