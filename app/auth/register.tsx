import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/constants/api';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) { setError('Please fill in all fields'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true); setError('');
    try {
      await register(email, password, firstName, lastName);
      router.replace('/' as any);
    } catch (e) {
      setError(e instanceof ApiError && e.status === 400 ? 'Email already registered' : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Join the Agentic Dev Studio community</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.row}>
            <TextInput style={[styles.input, styles.half]} placeholder="First name" placeholderTextColor="#666" value={firstName} onChangeText={setFirstName} />
            <TextInput style={[styles.input, styles.half]} placeholder="Last name"  placeholderTextColor="#666" value={lastName}  onChangeText={setLastName} />
          </View>
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#666" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <TextInput style={styles.input} placeholder="Password (min 8 chars)" placeholderTextColor="#666" value={password} onChangeText={setPassword} secureTextEntry />

          <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>Create Account</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/auth/login' as any)}>
            <Text style={styles.link}>Already have an account? <Text style={styles.linkHighlight}>Sign in</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 460, backgroundColor: '#0d0d0d', borderRadius: 16, padding: 32, borderWidth: 1, borderColor: '#1a1a1a' },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#9CA3AF', fontSize: 15, marginBottom: 24 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  input: { backgroundColor: '#111', borderWidth: 1, borderColor: '#222', borderRadius: 10, padding: 14, color: '#fff', fontSize: 15, marginBottom: 14 },
  btn: { backgroundColor: '#06D6F0', borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 4, marginBottom: 20 },
  btnText: { color: '#000', fontWeight: '700', fontSize: 16 },
  error: { color: '#ef4444', marginBottom: 14, fontSize: 14 },
  link: { color: '#9CA3AF', fontSize: 14, textAlign: 'center' },
  linkHighlight: { color: '#06D6F0' },
});
