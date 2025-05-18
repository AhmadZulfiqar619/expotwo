import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { app } from '../../firebaseConfig'; // Adjust path if needed
import { useRouter } from 'expo-router';

import { Formik } from 'formik';
import * as Yup from 'yup';

// Validation schema
const validationSchema = Yup.object().shape({
  displayName: Yup.string()
    .min(2, 'Name is too short')
    .max(50, 'Name is too long')
    .required('Name is required'),
  streetAddress: Yup.string()
    .min(5, 'Too short')
    .max(100, 'Too long')
    .required('Street address is required'),
  mobileNumber: Yup.string()
    .matches(/^\+?\d{7,15}$/, 'Invalid phone number')
    .required('Mobile number is required'),
});

export default function AccountInfoScreen() {
  const { user, isLoaded: userLoaded } = useUser();
  const { signOut } = useAuth();
  const db = getFirestore(app);
  const storage = getStorage(app);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now()); // For Image reload

  // Clerk user role from publicMetadata, read-only here
  const role = user?.publicMetadata?.role || 'user';

  // Initial form values holder
  const [initialValues, setInitialValues] = useState({
    displayName: '',
    streetAddress: '',
    mobileNumber: '',
  });

  // Fetch user data from Firestore and set initial form values & profile pic
  const fetchUserData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.id);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setInitialValues({
          displayName: data.displayName || '',
          streetAddress: data.streetAddress || '',
          mobileNumber: data.mobileNumber || '',
        });
        setProfileImage(data.profileImageUrl || null);
      } else {
        // No Firestore data yet, use Clerk user info as fallback
        setInitialValues({
          displayName: user.fullName || '',
          streetAddress: '',
          mobileNumber: '',
        });
        setProfileImage(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userLoaded && user) {
      fetchUserData();
    }
  }, [user, userLoaded]);

  // Pick image from gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission denied', 'We need access to your photo library!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!pickerResult.cancelled) {
      setProfileImage(pickerResult.uri);
      setImageKey(Date.now()); // Force image reload with new key
    }
  };

  // Upload image to Firebase Storage and return download URL
  const uploadImageAsync = async (uri, userId) => {
    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const imageRef = ref(storage, `profilePictures/${userId}_${Date.now()}`);
      await uploadBytes(imageRef, blob);

      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error('Failed to upload image:', error);
      Alert.alert('Upload failed', 'Could not upload profile picture.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Save all profile info to Firestore (no Clerk updates)
  const onSavePress = async (values) => {
    if (!user) return;

    setLoading(true);
    try {
      let profileImageUrl = profileImage || null;

      // Upload if local URI (not https)
      if (profileImage && !profileImage.startsWith('https://')) {
        const uploadedUrl = await uploadImageAsync(profileImage, user.id);
        if (uploadedUrl) {
          profileImageUrl = uploadedUrl;
        }
      }

      const userDocRef = doc(db, 'users', user.id);
      await setDoc(
        userDocRef,
        {
          displayName: values.displayName,
          streetAddress: values.streetAddress,
          mobileNumber: values.mobileNumber,
          profileImageUrl,
        },
        { merge: true }
      );

      Alert.alert('Success', 'Profile updated successfully');

      // Refetch to update UI (especially for profileImage URL)
      await fetchUserData();
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile info');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/sign-in');
    } catch (err) {
      console.error('Sign out failed:', err);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  if (!userLoaded || loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSavePress}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <View style={styles.container}>
          <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
            {profileImage ? (
              <Image
                key={imageKey}
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.profileImage, styles.placeholder]}>
                <Text style={styles.placeholderText}>No Image</Text>
              </View>
            )}
            <Text style={styles.changePhotoText}>Change Profile Picture</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={handleChange('displayName')}
            onBlur={handleBlur('displayName')}
            value={values.displayName}
            placeholder="Your full name"
          />
          {touched.displayName && errors.displayName && (
            <Text style={styles.errorText}>{errors.displayName}</Text>
          )}

          <Text style={styles.label}>Street Address</Text>
          <TextInput
            style={styles.input}
            onChangeText={handleChange('streetAddress')}
            onBlur={handleBlur('streetAddress')}
            value={values.streetAddress}
            placeholder="Street address"
          />
          {touched.streetAddress && errors.streetAddress && (
            <Text style={styles.errorText}>{errors.streetAddress}</Text>
          )}

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            onChangeText={handleChange('mobileNumber')}
            onBlur={handleBlur('mobileNumber')}
            value={values.mobileNumber}
            placeholder="Mobile number"
            keyboardType="phone-pad"
          />
          {touched.mobileNumber && errors.mobileNumber && (
            <Text style={styles.errorText}>{errors.mobileNumber}</Text>
          )}

          <Text style={[styles.label, { marginTop: 16 }]}>
            Role: <Text style={{ fontWeight: 'bold' }}>{role}</Text>
          </Text>

          <TouchableOpacity
            style={[styles.button, (uploading || loading || isSubmitting) && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={uploading || loading || isSubmitting}
          >
            <Text style={styles.buttonText}>
              {(uploading || loading || isSubmitting) ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  center: { justifyContent: 'center', alignItems: 'center' },
  imageWrapper: { alignItems: 'center', marginBottom: 24 },
  profileImage: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#ddd' },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#888', fontSize: 16 },
  changePhotoText: { marginTop: 8, color: '#007AFF', fontWeight: '600' },
  label: { fontSize: 16, marginBottom: 6, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
    fontSize: 16,
  },
  errorText: { color: '#FF3B30', marginBottom: 12, marginLeft: 4 },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  signOutButton: { marginTop: 20, alignItems: 'center' },
  signOutText: { color: '#FF3B30', fontWeight: '600' },
});
