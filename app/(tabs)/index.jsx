import React from "react";
import { FlatList, Image, StatusBar, Text, View, TouchableOpacity } from "react-native";
import styles from "../../components/tabsStyles";
import { useTheme } from "@/context/ThemeContext";

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
  <View style={[styles.card, { backgroundColor: "#fff" }]}>
    <Image source={item.image} style={styles.image} />
    <Text style={[styles.title, { color: "#000" }]}>{item.title}</Text>
    <Text style={[styles.description, { color: "#000" }]}>{item.description}</Text>
  </View>
);

const Index = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme === "light" ? "#fff" : "#121212" }}>
      <StatusBar barStyle={theme === "light" ? "dark-content" : "light-content"} />
      
      <FlatList
        contentContainerStyle={styles.listContent}
        data={introData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <IntroItem item={item} />}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      />

      <View
        style={{
          padding: 16,
          backgroundColor: theme === "light" ? "#fff" : "#121212",
          borderTopWidth: 1,
          borderTopColor: theme === "light" ? "#ccc" : "#333",
        }}
      >
        <TouchableOpacity
          onPress={toggleTheme}
          style={{
            padding: 12,
            backgroundColor: theme === "light" ? "#000" : "#fff",
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: theme === "light" ? "#fff" : "#000", fontWeight: "bold" }}>
            Switch to {theme === "light" ? "Dark" : "Light"} Mode
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Index;
