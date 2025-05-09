
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import styles from "../../components/authAccountStyles";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
//import { auth, db } from "../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthAccountScreen = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uid, setUid] = useState(null);

  const emptyUser = {
    username: "",
    email: "",
    mobile: "",
    password: "",
    address: "",
  };

  const [user, setUser] = useState(emptyUser);

  const ASYNC_STORAGE_USER_KEY = "@user_profile";

  const saveUserToStorage = async (data) => {
    try {
      await AsyncStorage.setItem(ASYNC_STORAGE_USER_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save user to storage", e);
    }
  };

  const getUserFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem(ASYNC_STORAGE_USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error("Failed to load user from storage", e);
      return null;
    }
  };

  const clearUserFromStorage = async () => {
    try {
      await AsyncStorage.removeItem(ASYNC_STORAGE_USER_KEY);
    } catch (e) {
      console.error("Failed to clear user from storage", e);
    }
  };

  // On Auth State Changed (Persistent Login)
  useEffect(() => {
    const init = async () => {
      const cachedUser = await getUserFromStorage();
      if (cachedUser) {
        setUser((prev) => ({ ...prev, ...cachedUser }));
      }

      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          const uid = currentUser.uid;
          setUid(uid);
          const userDoc = await getDoc(doc(db, "users", uid));
          if (userDoc.exists()) {
            const userData = {
              ...user,
              ...userDoc.data(),
              email: currentUser.email,
              password: "",
            };
            setUser(userData);
            await saveUserToStorage(userData);
          }
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setUid(null);
          await clearUserFromStorage();
        }
      });

      return unsubscribe;
    };

    init();
  }, []);

  // Handle input change
  const handleInputChange = (field, value) => {
    setUser((prevUser) => ({ ...prevUser, [field]: value }));
  };

  // Create Account
  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      const uid = userCredential.user.uid;
      setUid(uid);

      await setDoc(doc(db, "users", uid), {
        username: user.username,
        mobile: user.mobile,
        address: user.address,
      });

      await saveUserToStorage({
        username: user.username,
        mobile: user.mobile,
        address: user.address,
        email: user.email,
        password: "",
      });

      setIsLoggedIn(true);
      alert("Account created successfully");
    } catch (error) {
      console.error("Signup Error:", error.message);
      alert("Signup Failed: " + error.message);
    }
  };

  // Login
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      const uid = userCredential.user.uid;
      setUid(uid);

      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const updatedUser = {
          ...user,
          ...userDoc.data(),
          email: user.email,
          password: "",
        };
        setUser(updatedUser);
        await saveUserToStorage(updatedUser);
      }

      setIsLoggedIn(true);
      alert("Login successful");
    } catch (error) {
      console.error("Login Error:", error.message);
      alert("Login Failed: " + error.message);
    }
  };

  // Update Account
  const handleUpdate = async () => {
    try {
      if (!uid) return alert("User not found");

      await updateDoc(doc(db, "users", uid), {
        username: user.username,
        mobile: user.mobile,
        address: user.address,
      });

      const updatedUser = {
        ...user,
        password: "",
      };

      await saveUserToStorage(updatedUser);
      setIsEditing(false);
      alert("Account updated successfully");
    } catch (error) {
      console.error("Update Error:", error.message);
      alert("Update Failed: " + error.message);
    }
  };

  // Delete Account
  const handleDelete = async () => {
    try {
      if (!uid) return;

      await deleteDoc(doc(db, "users", uid));
      await deleteUser(auth.currentUser);

      setUser(emptyUser);
      setIsLoggedIn(false);
      setUid(null);
      await clearUserFromStorage();
      alert("Account deleted successfully");
    } catch (error) {
      console.error("Delete Error:", error.message);
      alert("Delete Failed: " + error.message);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(emptyUser);
      setIsSignup(false);
      setUid(null);
      await clearUserFromStorage();
      alert("Logged out");
    } catch (error) {
      console.error("Logout Error:", error.message);
      alert("Logout Failed: " + error.message);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.centeredContainer}>
          {!isLoggedIn && (
            <View style={styles.card}>
              <Text style={styles.heading}>
                {isSignup ? "Sign Up" : "Login"}
              </Text>

              {isSignup && (
                <>
                  <TextInput
                    placeholder="Username"
                    value={user.username}
                    onChangeText={(text) => handleInputChange("username", text)}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Mobile Number"
                    value={user.mobile}
                    onChangeText={(text) => handleInputChange("mobile", text)}
                    style={styles.input}
                    keyboardType="phone-pad"
                  />
                  <TextInput
                    placeholder="Shipping Address"
                    value={user.address}
                    onChangeText={(text) => handleInputChange("address", text)}
                    style={styles.input}
                  />
                </>
              )}

              <TextInput
                placeholder="Email"
                value={user.email}
                onChangeText={(text) => handleInputChange("email", text)}
                style={styles.input}
                keyboardType="email-address"
              />
              <TextInput
                placeholder="Password"
                value={user.password}
                onChangeText={(text) => handleInputChange("password", text)}
                style={styles.input}
                secureTextEntry
              />

              <TouchableOpacity
                onPress={isSignup ? handleSignup : handleLogin}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>
                  {isSignup ? "Create Account" : "Login"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
                <Text style={styles.toggleText}>
                  {isSignup
                    ? "Already have an account? Login"
                    : "Don't have an account? Sign Up"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {isLoggedIn && (
            <View style={styles.card}>
              <Text style={styles.infoHeading}>Account Info</Text>

              <TextInput
                editable={isEditing}
                style={styles.input}
                value={user.username}
                onChangeText={(text) => handleInputChange("username", text)}
                placeholder="Username"
              />
              <TextInput
                editable={isEditing}
                style={styles.input}
                value={user.email}
                onChangeText={(text) => handleInputChange("email", text)}
                placeholder="Email"
              />
              <TextInput
                editable={isEditing}
                style={styles.input}
                value={user.mobile}
                onChangeText={(text) => handleInputChange("mobile", text)}
                placeholder="Mobile"
                keyboardType="phone-pad"
              />
              <TextInput
                editable={isEditing}
                style={styles.input}
                value={user.address}
                onChangeText={(text) => handleInputChange("address", text)}
                placeholder="Address"
              />

              <View style={{ marginTop: 16 }}>
                {!isEditing ? (
                  <TouchableOpacity
                    onPress={() => setIsEditing(true)}
                    style={styles.updateButton}
                  >
                    <Text style={styles.buttonText}>Edit Account</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handleUpdate}
                    style={styles.updateButton}
                  >
                    <Text style={styles.buttonText}>Save Changes</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={handleDelete}
                  style={styles.deleteButton}
                >
                  <Text style={styles.buttonText}>Delete Account</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleLogout}
                  style={styles.logoutButton}
                >
                  <Text style={styles.buttonText}>
                    Log in with Another Account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default AuthAccountScreen;
