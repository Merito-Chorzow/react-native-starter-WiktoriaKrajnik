import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: '#000',    
        tabBarInactiveTintColor: '#000',  
    }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="file-plus" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          title: 'Files',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="file" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
