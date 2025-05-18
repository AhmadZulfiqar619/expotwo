import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

const ProductScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://fakestoreapi.com/products');
      setProducts(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text style={styles.text}>Loading products...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/products/[productId]',
          params: { productId: item.id, data: JSON.stringify(item) },
        })
      }
      style={[styles.card, { backgroundColor: theme === 'light' ? '#fff' : '#1e1e1e' }]}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={[styles.title]} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.price}>${item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme === 'light' ? '#fff' : '#121212' }]}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  image: {
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    color: '#000', // Always black
    fontWeight: '600',
  },
  price: {
    color: '#007AFF',
    fontSize: 16,
    marginTop: 4,
  },
  error: {
    color: 'red',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default ProductScreen;
