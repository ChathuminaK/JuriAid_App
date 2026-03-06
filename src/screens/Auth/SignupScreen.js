import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, clearError } from '../../redux/slices/authSlice';
import { log } from '../../api/index';

const SignupScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      log.warn('[SignupScreen] auth error:', error);
      Alert.alert('Signup Failed', typeof error === 'string' ? error : 'Registration failed.');
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSignup = async () => {
    log.info('[SignupScreen] handleSignup called', { email, fullName, phone });

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Validation', 'Please fill in all required fields.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Validation', 'Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Validation', 'Password must be at least 8 characters.');
      return;
    }

    log.info('[SignupScreen] dispatching signupUser…');
    const resultAction = await dispatch(
      signupUser({ email: email.trim(), password, full_name: fullName.trim(), phone: phone.trim() })
    );

    if (signupUser.fulfilled.match(resultAction)) {
      log.info('[SignupScreen] signup success – navigating to Login');
      Alert.alert('Success 🎉', 'Account created! Please sign in.', [
        { text: 'OK', onPress: () => navigation.replace('Login') },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>⚖️ JuriAid</Text>
          <Text style={styles.tagline}>Sri Lankan Legal Assistant</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Create Account</Text>
          <Text style={styles.formSubtitle}>Join JuriAid today</Text>

          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Kumari Silva"
            placeholderTextColor="#9CA3AF"
            editable={!loading}
          />

          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+94771234567"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            editable={!loading}
          />

          <Text style={styles.label}>Password *</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Min. 8 characters"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            editable={!loading}
          />

          <Text style={styles.label}>Confirm Password *</Text>
          <TextInput
            style={styles.input}
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Repeat password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.signupButton, loading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.signupButtonText}>Create Account</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => {
              log.info('[SignupScreen] navigating back to Login');
              navigation.navigate('Login');
            }}
            disabled={loading}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginLinkBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#F8FAFC' },
  content:         { flexGrow: 1, justifyContent: 'center', padding: 24 },

  header:          { alignItems: 'center', marginBottom: 32 },
  logo:            { fontSize: 36, fontWeight: 'bold', color: '#005A9C' },
  tagline:         { fontSize: 14, color: '#64748B', marginTop: 4 },

  form:            { backgroundColor: '#fff', borderRadius: 16, padding: 24, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  formTitle:       { fontSize: 22, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  formSubtitle:    { fontSize: 14, color: '#64748B', marginBottom: 24 },

  label:           { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#D1D5DB',
    borderRadius: 10, padding: 12, fontSize: 15, color: '#1E293B', marginBottom: 16,
  },

  signupButton: {
    backgroundColor: '#005A9C', borderRadius: 10,
    padding: 14, alignItems: 'center', marginTop: 4, marginBottom: 16,
  },
  signupButtonText:{ color: '#fff', fontSize: 16, fontWeight: 'bold' },
  buttonDisabled:  { opacity: 0.6 },

  loginLink:       { alignItems: 'center' },
  loginLinkText:   { fontSize: 14, color: '#64748B' },
  loginLinkBold:   { color: '#005A9C', fontWeight: '700' },
});

export default SignupScreen;