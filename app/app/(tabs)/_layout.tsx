import React from 'react';
import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/src/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.plum,
        tabBarInactiveTintColor: Colors.grayMuted,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.cardBorder,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerTitleStyle: {
          color: Colors.charcoal,
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'RITORA',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'house.fill', android: 'home', web: 'home' }} tintColor={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="cycle"
        options={{
          title: 'Cycle',
          headerTitle: 'Cycle Calendar',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'calendar', android: 'date_range', web: 'date_range' }} tintColor={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: 'Track',
          headerTitle: 'Daily Log',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'plus.circle.fill', android: 'add', web: 'add' }} tintColor={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          headerTitle: 'RITORA Health Insights',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'sparkles', android: 'star', web: 'star' }} tintColor={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'User Profile',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'person.fill', android: 'person', web: 'person' }} tintColor={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
