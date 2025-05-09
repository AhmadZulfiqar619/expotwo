import { StyleSheet, StatusBar } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 40,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff"
  },
  listContent: {
    paddingBottom: 20
  },
  card: {
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 1
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover"
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    paddingHorizontal: 12,
    paddingTop: 10
  },
  description: {
    fontSize: 14,
    color: "#666",
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 4
  }
});

export default styles;
