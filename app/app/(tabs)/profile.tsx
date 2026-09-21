import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '@/src/constants/theme';
import { mobileHealthService } from '@/src/services';
import { mockUser } from '@/src/data/mockData';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(mockUser);

  const loadUser = async () => {
    try {
      const u = await mobileHealthService.getCurrentUser();
      if (u) setUser(u);
    } catch (err) {
      console.warn('Failed to load user in mobile', err);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleLogout = () => {
    Alert.alert('Signed Out', 'You have been logged out of your session.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{(user.name || 'S')[0]}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Cycle Settings */}
      <Text style={styles.sectionHeader}>Cycle Defaults</Text>
      <View style={styles.settingCard}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Average Cycle Length</Text>
          <Text style={styles.settingVal}>{user.averageCycleLength || 28} days</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Average Period Duration</Text>
          <Text style={styles.settingVal}>{user.averagePeriodLength || user.averagePeriodDuration || 5} days</Text>
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

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
