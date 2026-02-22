import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { api, ForumCategory } from '@/constants/api';
import Navbar from '@/components/Navbar';

export default function ForumScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.forum.categories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.header}>
        <Text style={styles.heading}>Forum</Text>
        <Text style={styles.sub}>Exchange ideas, get help, share your work</Text>
      </View>

      {loading
        ? <ActivityIndicator color="#06D6F0" style={{ marginTop: 40 }} />
        : (
          <FlatList
            data={categories}
            keyExtractor={c => c.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/forum/${item.slug}` as any)}>
                <View style={styles.icon}>
                  <Text style={styles.iconText}>{item.iconUrl ?? '💬'}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.empty}>No forum categories yet</Text>}
          />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  header: { padding: 32, paddingBottom: 16 },
  heading: { color: '#fff', fontSize: 32, fontWeight: '800', marginBottom: 6 },
  sub: { color: '#9CA3AF', fontSize: 16 },
  list: { padding: 24, gap: 12 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0d0d0d', borderRadius: 14, padding: 20, borderWidth: 1, borderColor: '#1a1a1a', gap: 16 },
  icon: { width: 48, height: 48, backgroundColor: '#06D6F011', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 22 },
  info: { flex: 1 },
  name: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  desc: { color: '#9CA3AF', fontSize: 14 },
  arrow: { color: '#444', fontSize: 24 },
  empty: { color: '#666', textAlign: 'center', marginTop: 60, fontSize: 16 },
});
