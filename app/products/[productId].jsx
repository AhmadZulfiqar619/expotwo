import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function ProductDetailScreen() {
  const { data } = useLocalSearchParams();
  const { theme } = useTheme();

  const product = JSON.parse(data);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme === 'light' ? '#fff' : '#121212' }]}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000', // Always black
  },
  price: {
    fontSize: 20,
    color: '#007AFF',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#000', // Always black
  },
});
