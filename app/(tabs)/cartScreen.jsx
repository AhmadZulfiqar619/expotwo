import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from '../../redux/cartSlice';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import styles from '../../components/cartScreenStyles';
import { useTheme } from '@/context/ThemeContext'; // Import theme hook

const CartScreen = () => {
  const { theme } = useTheme(); // Get current theme
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => total + item.price * (item.quantity || 1), 0)
      .toFixed(2);
  };

  const renderRightActions = (item) => (
    <TouchableOpacity
      onPress={() => {
        Alert.alert('Remove Item', 'Are you sure?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', onPress: () => dispatch(removeFromCart(item.id)) },
        ]);
      }}
      style={styles.removeButton}
    >
      <Text style={[styles.removeButtonText, { color: '#000' }]}>Remove</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <TouchableOpacity activeOpacity={0.9}>
        <View style={styles.cartItem}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.details}>
            {/* All text black */}
            <Text style={[styles.title, { color: '#000' }]} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={[styles.price, { color: '#000' }]}>${item.price}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => dispatch(decreaseQuantity(item.id))} style={styles.quantityBtn}>
                <Text style={[styles.quantityText, { color: '#000' }]}>-</Text>
              </TouchableOpacity>
              <Text style={[styles.quantityValue, { color: '#000' }]}>{item.quantity || 1}</Text>
              <TouchableOpacity onPress={() => dispatch(increaseQuantity(item.id))} style={styles.quantityBtn}>
                <Text style={[styles.quantityText, { color: '#000' }]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme === 'light' ? '#fff' : '#121212' }, // toggle screen bg
      ]}
    >
      <StatusBar style={theme === 'light' ? 'dark' : 'light'} />

      {cartItems.length === 0 ? (
        <Text style={[styles.emptyText, { color: '#000' }]}>
          Your cart is empty.
        </Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
          <View style={styles.footer}>
            <Text style={[styles.totalText, { color: '#000' }]}>
              Total: ${getTotalPrice()}
            </Text>
            <TouchableOpacity style={styles.clearButton} onPress={() => dispatch(clearCart())}>
              <Text style={[styles.clearButtonText, { color: '#000' }]}>
                Clear Cart
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;
