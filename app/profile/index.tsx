import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Image, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { api } from '@/constants/api';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export default function ProfileScreen() {
  const { user, setAuth, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [bio,       setBio]       = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState('');

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/' as any); return; }
    if (user) {
      setFirstName(user.firstName ?? '');
      setLastName(user.lastName ?? '');
      setBio(user.bio ?? '');
      setAvatarUrl(user.avatarUrl ?? '');
    }
  }, [user, isAuthenticated]);

  const handleSave = async () => {
    setSaving(true); setError(''); setSaved(false);
    try {
      const updated = await api.users.update({ firstName, lastName, bio, avatarUrl });
      // Refresh auth context with updated user (preserve tokens)
      const accessToken  = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken')  ?? '' : '';
      const refreshToken = typeof localStorage !== 'undefined' ? localStorage.getItem('refreshToken') ?? '' : '';
      setAuth({ accessToken, refreshToken, user: updated } as any);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError('Failed to save — please try again');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace('/' as any);
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.inner}>

          {/* Avatar */}
          <View style={styles.avatarSection}>
            {avatarUrl
              ? <Image source={{ uri: avatarUrl }} style={styles.avatar} />
              : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitials}>
                    {(firstName[0] ?? '?').toUpperCase()}{(lastName[0] ?? '').toUpperCase()}
                  </Text>
                </View>
              )
            }
            <Text style={styles.role}>{user?.role}</Text>
          </View>

          <Text style={styles.heading}>My Profile</Text>
          <Text style={styles.sub}>Update your public information</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {saved  ? <Text style={styles.success}>✓ Profile saved</Text> : null}

          {/* Form */}
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>First name</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor="#666"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Last name</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor="#666"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={user?.email ?? ''}
              editable={false}
              placeholderTextColor="#444"
            />
            <Text style={styles.hint}>Email cannot be changed</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell the community a bit about yourself…"
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.hint}>{bio.length}/500</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Avatar URL</Text>
            <TextInput
              style={styles.input}
              value={avatarUrl}
              onChangeText={setAvatarUrl}
              placeholder="https://example.com/avatar.jpg"
              placeholderTextColor="#666"
              autoCapitalize="none"
              keyboardType="url"
            />
            <Text style={styles.hint}>Link to a publicly accessible image</Text>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
            {saving
              ? <ActivityIndicator color="#000" />
              : <Text style={styles.saveBtnText}>Save Changes</Text>}
          </TouchableOpacity>

          {/* Danger zone */}
          <View style={styles.divider} />
          <Text style={styles.dangerTitle}>Account</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  scroll: { flexGrow: 1, paddingBottom: 60 },
  inner: { maxWidth: 640, alignSelf: 'center', width: '100%', padding: 32 },

  avatarSection: { alignItems: 'center', marginBottom: 28 },
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 10, borderWidth: 2, borderColor: '#06D6F0' },
  avatarPlaceholder: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: '#06D6F022',
    borderWidth: 2, borderColor: '#06D6F0', alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  avatarInitials: { color: '#06D6F0', fontSize: 28, fontWeight: '800' },
  role: { color: '#06D6F0', fontSize: 12, fontWeight: '700', letterSpacing: 1 },

  heading: { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 4 },
  sub: { color: '#9CA3AF', fontSize: 15, marginBottom: 24 },

  error: { color: '#ef4444', marginBottom: 12, fontSize: 14 },
  success: { color: '#0f0', marginBottom: 12, fontSize: 14, fontWeight: '600' },

  row: { flexDirection: 'row', gap: 14, marginBottom: 0 },
  field: { flex: 1, marginBottom: 18 },
  label: { color: '#9CA3AF', fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: '#111', borderWidth: 1, borderColor: '#222',
    borderRadius: 10, padding: 13, color: '#fff', fontSize: 15,
  },
  inputDisabled: { opacity: 0.5 },
  textarea: { height: 110 },
  hint: { color: '#444', fontSize: 12, marginTop: 5 },

  saveBtn: {
    backgroundColor: '#06D6F0', borderRadius: 10, padding: 15,
    alignItems: 'center', marginTop: 8,
  },
  saveBtnText: { color: '#000', fontWeight: '700', fontSize: 16 },

  divider: { height: 1, backgroundColor: '#1a1a1a', marginVertical: 32 },
  dangerTitle: { color: '#9CA3AF', fontSize: 14, fontWeight: '700', marginBottom: 14, letterSpacing: 1 },
  logoutBtn: {
    borderWidth: 1, borderColor: '#ef4444', borderRadius: 10,
    padding: 14, alignItems: 'center',
  },
  logoutText: { color: '#ef4444', fontWeight: '700', fontSize: 15 },
});
