import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Save,
  Camera,
} from 'lucide-react-native';
import { pick, types } from '@react-native-documents/picker';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, fetchProfile } from '../../redux/slices/authSlice';

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user, loading, profileLoading } = useSelector((state) => state.auth);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handlePickImage = async () => {
    try {
      const results = await pick({ type: [types.images], allowMultiSelection: false });
      if (results && results[0]) {
        setProfileImage(results[0]);
      }
    } catch (err) {
      // user cancelled — do nothing
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }
    if (phone && phone.trim() && !/^[\d\s\+\-\(\)]+$/.test(phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      await dispatch(updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim() || null,
        profileImage: profileImage || null,
      })).unwrap();

      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert(
        'Update Failed',
        typeof error === 'string' ? error : 'Failed to update profile. Please try again.'
      );
    }
  };

  if (profileLoading || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#005A9C" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const avatarSource = profileImage?.uri || user?.profile_icon_url;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
            disabled={loading}
          >
            <ArrowLeft color="#005A9C" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity 
            onPress={handleSave}
            style={styles.saveButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#005A9C" />
            ) : (
              <Save color="#005A9C" size={24} />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Picture Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                {avatarSource ? (
                  <Image
                    source={{ uri: avatarSource }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <User color="#FFFFFF" size={48} />
                )}
              </View>
              <TouchableOpacity 
                style={styles.cameraButton}
                onPress={handlePickImage}
                disabled={loading}
              >
                <Camera color="#FFFFFF" size={18} />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarHint}>Tap to change profile picture</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Full Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <View style={[styles.inputWrapper, errors.fullName && styles.inputError]}>
                <User color="#64748B" size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#94A3B8"
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    setErrors({ ...errors, fullName: null });
                  }}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>
              {errors.fullName && (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              )}
            </View>

            {/* Email Input (Read-only) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[styles.inputWrapper, styles.inputDisabled]}>
                <Mail color="#94A3B8" size={20} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.disabledText]}
                  value={email}
                  editable={false}
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <Text style={styles.helperText}>Email cannot be changed</Text>
            </View>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={[styles.inputWrapper, errors.phone && styles.inputError]}>
                <Phone color="#64748B" size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="+94 XXX XXX XXX"
                  placeholderTextColor="#94A3B8"
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    setErrors({ ...errors, phone: null });
                  }}
                  keyboardType="phone-pad"
                  editable={!loading}
                />
              </View>
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
              {!errors.phone && (
                <Text style={styles.helperText}>Optional - for account recovery</Text>
              )}
            </View>

            {/* Account Information */}
            <View style={styles.infoSection}>
              <Text style={styles.infoSectionTitle}>Account Information</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Account Type</Text>
                  <Text style={styles.infoValue}>
                    {user?.subscription_tier
                      ? user.subscription_tier.charAt(0).toUpperCase() + user.subscription_tier.slice(1)
                      : 'Free'}
                  </Text>
                </View>
                <View style={styles.infoDivider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Member Since</Text>
                  <Text style={styles.infoValue}>
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                      : 'N/A'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <>
                  <ActivityIndicator color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Saving...</Text>
                </>
              ) : (
                <>
                  <Save color="#FFFFFF" size={20} />
                  <Text style={styles.submitButtonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  keyboardView: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1E293B' },
  saveButton: { padding: 8 },
  loadingText: { marginTop: 12, fontSize: 14, color: '#64748B' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#005A9C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarImage: { width: 120, height: 120, borderRadius: 60 },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#005A9C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#005A9C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarHint: { fontSize: 14, color: '#64748B' },
  form: { flex: 1 },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
  },
  inputError: { borderColor: '#EF4444' },
  inputDisabled: { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, height: 52, fontSize: 16, color: '#1E293B' },
  disabledText: { color: '#94A3B8' },
  errorText: { fontSize: 12, color: '#EF4444', marginTop: 4, marginLeft: 4 },
  helperText: { fontSize: 12, color: '#64748B', marginTop: 4, marginLeft: 4 },
  infoSection: { marginBottom: 24 },
  infoSectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 12 },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoDivider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 8 },
  infoLabel: { fontSize: 14, color: '#64748B' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#005A9C',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
    shadowColor: '#005A9C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  cancelButton: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#64748B' },
});

export default EditProfileScreen;