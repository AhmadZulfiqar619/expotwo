import React from "react";
import { FlatList, Image, StatusBar, Text, View } from "react-native";
import styles from "../../components/tabsStyles"; // Importing styles from components folder

const introData = [
  {
    id: "1",
    title: "Welcome to ShopEase",
    description: "Your one-stop solution for effortless and enjoyable shopping.",
    image: { uri: "https://plus.unsplash.com/premium_photo-1681488262364-8aeb1b6aac56?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGUlMjBjb21tZXJjZXxlbnwwfHwwfHx8MA%3D%3D" }
  },
  {
    id: "2",
    title: "Explore Diverse Products",
    description: "Find everything you need from electronics to fashion.",
    image: { uri: "https://plus.unsplash.com/premium_photo-1683798464819-d1376249293e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGUlMjBjb21tZXJjZXxlbnwwfHwwfHx8MA%3D%3D" }
  },
  {
    id: "3",
    title: "Fast & Secure Checkout",
    description: "Shop confidently with our smooth and secure checkout system.",
    image: { uri: "https://plus.unsplash.com/premium_photo-1723662303063-13ea4ba7e648?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHByb2R1Y3QlMjBkZWxpdmVyeXxlbnwwfHwwfHx8MA%3D%3D" }
  }
];

const IntroItem = ({ item }) => (
  <View style={styles.card}>
    <Image source={item.image} style={styles.image} />
    <Text style={styles.title}>{item.title}</Text>
    <Text style={styles.description}>{item.description}</Text>
  </View>
);

const index = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <FlatList
        contentContainerStyle={styles.listContent}
        data={introData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <IntroItem item={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default index;
