import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

const SignUp = () => {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  const handleSignUp = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err) {
      Alert.alert('Sign up error', err.errors?.[0]?.message || err.message);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });

      router.push('/account-info');
    } catch (err) {
      Alert.alert('Verification error', err.errors?.[0]?.message || err.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' }}>
      {!pendingVerification ? (
        <>
          <Text style={{ fontSize: 24, marginBottom: 20 }}>Sign Up</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={{ borderWidth: 1, marginBottom: 10, padding: 10, backgroundColor: '#fff' }}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ borderWidth: 1, marginBottom: 10, padding: 10, backgroundColor: '#fff' }}
          />
          <Button title="Sign Up" onPress={handleSignUp} />
          <TouchableOpacity onPress={() => router.push('/sign-in')} style={{ marginTop: 20 }}>
            <Text style={{ color: 'blue', textAlign: 'center' }}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={{ fontSize: 24, marginBottom: 20 }}>Verify Your Email</Text>
          <TextInput
            placeholder="Verification Code"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            style={{ borderWidth: 1, marginBottom: 10, padding: 10, backgroundColor: '#fff' }}
          />
          <Button title="Verify Code" onPress={handleVerifyCode} />
        </>
      )}
    </View>
  );
};

export default SignUp;
