import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '@/src/constants/theme';
import { mockUser } from '@/src/data/mockData';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{mockUser.name[0]}</Text>
        </View>
        <Text style={styles.name}>{mockUser.name}</Text>
        <Text style={styles.email}>{mockUser.email}</Text>
      </View>

      {/* Cycle Settings */}
      <Text style={styles.sectionHeader}>Cycle Defaults</Text>
      <View style={styles.settingCard}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Average Cycle Length</Text>
          <Text style={styles.settingVal}>{mockUser.averageCycleLength} days</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Average Period Duration</Text>
          <Text style={styles.settingVal}>{mockUser.averagePeriodLength} days</Text>
        </View>
      </View>

      {/* Preferences */}
      <Text style={styles.sectionHeader}>Preferences & Privacy</Text>
      <View style={styles.settingCard}>
        <TouchableOpacity style={styles.settingRow}>
          <Text style={styles.settingLabel}>Cycle Notifications</Text>
          <Text style={styles.settingVal}>On ›</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.settingRow}>
          <Text style={styles.settingLabel}>Data Privacy & Health Disclaimers</Text>
          <Text style={styles.settingVal}>View ›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  content: { padding: 20 },
  profileHeader: { alignItems: 'center', marginBottom: 24 },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.plum,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: { color: Colors.white, fontSize: 28, fontWeight: 'bold' },
  name: { fontSize: 20, fontWeight: 'bold', color: Colors.charcoal },
  email: { fontSize: 13, color: Colors.grayMuted, marginTop: 2 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: Colors.charcoal, marginBottom: 10 },
  settingCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14 },
  settingLabel: { fontSize: 14, color: Colors.charcoal },
  settingVal: { fontSize: 14, fontWeight: '600', color: Colors.plum },
  divider: { height: 1, backgroundColor: Colors.cardBorder },
  logoutButton: { marginTop: 10, paddingVertical: 14, alignItems: 'center' },
  logoutText: { color: 'red', fontWeight: 'bold', fontSize: 15 },
});
