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
import styles from '../../components/cartScreenStyles';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const CartScreen = () => {
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
      <Text style={styles.removeButtonText}>Remove</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <TouchableOpacity activeOpacity={0.9}>
        <View style={styles.cartItem}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.details}>
            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.price}>${item.price}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => dispatch(decreaseQuantity(item.id))}
                style={styles.quantityBtn}
              >
                <Text style={styles.quantityText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{item.quantity || 1}</Text>
              <TouchableOpacity
                onPress={() => dispatch(increaseQuantity(item.id))}
                style={styles.quantityBtn}
              >
                <Text style={styles.quantityText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <SafeAreaView style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
          <View style={styles.footer}>
            <Text style={styles.totalText}>Total: ${getTotalPrice()}</Text>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => dispatch(clearCart())}
            >
              <Text style={styles.clearButtonText}>Clear Cart</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;
