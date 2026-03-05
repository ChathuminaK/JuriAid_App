import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../redux/slices/authSlice';
import { log } from '../../api/index';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  // Clear error on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Navigate when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      log.info('[LoginScreen] isAuthenticated=true → navigating to Main');
      navigation.replace('Main');
    }
  }, [isAuthenticated, navigation]);

  // Show Redux error as alert
  useEffect(() => {
    if (error) {
      log.warn('[LoginScreen] auth error:', error);
      Alert.alert('Login Failed', typeof error === 'string' ? error : 'Invalid credentials.');
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleLogin = async () => {
    log.info('[LoginScreen] handleLogin called', { email });

    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation', 'Please enter both email and password.');
      log.warn('[LoginScreen] validation failed – empty fields');
      return;
    }

    log.info('[LoginScreen] dispatching loginUser…');
    dispatch(loginUser({ email: email.trim(), password }));
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
          <Text style={styles.formTitle}>Welcome Back</Text>
          <Text style={styles.formSubtitle}>Sign in to your account</Text>

          <Text style={styles.label}>Email</Text>
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

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.loginButtonText}>Sign In</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupLink}
            onPress={() => {
              log.info('[LoginScreen] navigating to Signup');
              navigation.navigate('Signup');
            }}
            disabled={loading}
          >
            <Text style={styles.signupLinkText}>
              Don't have an account? <Text style={styles.signupLinkBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#F8FAFC' },
  content:          { flexGrow: 1, justifyContent: 'center', padding: 24 },

  header:           { alignItems: 'center', marginBottom: 40 },
  logo:             { fontSize: 36, fontWeight: 'bold', color: '#005A9C' },
  tagline:          { fontSize: 14, color: '#64748B', marginTop: 4 },

  form:             { backgroundColor: '#fff', borderRadius: 16, padding: 24, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  formTitle:        { fontSize: 22, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  formSubtitle:     { fontSize: 14, color: '#64748B', marginBottom: 24 },

  label:            { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#D1D5DB',
    borderRadius: 10, padding: 12, fontSize: 15, color: '#1E293B', marginBottom: 16,
  },

  loginButton: {
    backgroundColor: '#005A9C', borderRadius: 10,
    padding: 14, alignItems: 'center', marginTop: 4, marginBottom: 16,
  },
  loginButtonText:  { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  buttonDisabled:   { opacity: 0.6 },

  signupLink:       { alignItems: 'center' },
  signupLinkText:   { fontSize: 14, color: '#64748B' },
  signupLinkBold:   { color: '#005A9C', fontWeight: '700' },
});

export default LoginScreen;