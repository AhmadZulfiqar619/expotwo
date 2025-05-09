import React from 'react';
import { View, Text, Image, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice'; // 👈 Adjust path based on redux folder
import styles from './ProductCardStyles';

const ProductCard = ({ item }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(item));
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>${item.price}</Text>
      <Button title="Add to Cart" onPress={handleAddToCart} />
    </View>
  );
};

export default ProductCard;

