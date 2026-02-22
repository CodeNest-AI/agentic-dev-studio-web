import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/constants/api';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true); setError('');
    try {
      await login(email, password);
      router.replace('/' as any);
    } catch (e) {
      setError(e instanceof ApiError ? 'Invalid email or password' : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#000" />
            : <Text style={styles.btnText}>Sign In</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/auth/register' as any)}>
          <Text style={styles.link}>Don't have an account? <Text style={styles.linkHighlight}>Sign up</Text></Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 8 }}>
          <Text style={styles.link}>← Back to home</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black, justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 420, backgroundColor: '#0d0d0d', borderRadius: 16, padding: 32, borderWidth: 1, borderColor: '#1a1a1a' },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#9CA3AF', fontSize: 15, marginBottom: 24 },
  input: { backgroundColor: '#111', borderWidth: 1, borderColor: '#222', borderRadius: 10, padding: 14, color: '#fff', fontSize: 15, marginBottom: 14 },
  btn: { backgroundColor: '#06D6F0', borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 4, marginBottom: 20 },
  btnText: { color: '#000', fontWeight: '700', fontSize: 16 },
  error: { color: '#ef4444', marginBottom: 14, fontSize: 14 },
  link: { color: '#9CA3AF', fontSize: 14, textAlign: 'center' },
  linkHighlight: { color: '#06D6F0' },
});
