// app/auth.jsx

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function AuthScreen() {
  const router = useRouter();

  useEffect(() => {
    // Automatically navigate to AuthAccountScreen inside (tabs)
    router.push('/(tabs)/AuthAccountScreen');
  }, []);

  return (
    <View>
      <Text>Redirecting to AuthAccountScreen...</Text>
    </View>
  );
}
