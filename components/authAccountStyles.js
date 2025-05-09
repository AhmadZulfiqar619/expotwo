import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 16,
    elevation: 4,
    marginBottom: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  infoHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  toggleText: {
    color: "#007AFF",
    textAlign: "center",
    marginTop: 10,
  },
  updateButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "#888",
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});

export default styles;
