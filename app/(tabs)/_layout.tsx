import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'; // ✅ Import Fixed
import AntDesign from '@expo/vector-icons/AntDesign';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: (props) => <HapticTab {...props} />,
        tabBarStyle: {
          backgroundColor: 'transparent',
          position: Platform.OS === 'ios' ? 'absolute' : 'relative',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="AuthAccountScreen"
        options={{
          title: 'Users',
          tabBarIcon: ({ color }) => <FontAwesome name="users" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ProductScreen"
        options={{
          title: 'Products',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="tag-text" size={24} color={color} />,
        }}
      />
<Tabs.Screen
        name="cartScreen"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => <AntDesign name="shoppingcart" size={24} color={color} />
        }}
      />
    </Tabs>
  );
}
