import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { api, Course } from '@/constants/api';
import Navbar from '@/components/Navbar';

const LEVELS = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;
type LevelFilter = typeof LEVELS[number];

export default function CoursesScreen() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState<LevelFilter>('ALL');

  const load = async (selectedLevel: LevelFilter) => {
    setLoading(true);
    try {
      const res = await api.courses.list(0, 20, selectedLevel === 'ALL' ? undefined : selectedLevel);
      setCourses(res.content);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(level); }, [level]);

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.header}>
        <Text style={styles.heading}>Courses</Text>
        <Text style={styles.sub}>Level up your agentic dev skills</Text>
        <View style={styles.filters}>
          {LEVELS.map(l => (
            <TouchableOpacity
              key={l}
              style={[styles.chip, level === l && styles.chipActive]}
              onPress={() => setLevel(l)}>
              <Text style={[styles.chipText, level === l && styles.chipTextActive]}>
                {l.charAt(0) + l.slice(1).toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading
        ? <ActivityIndicator color="#06D6F0" style={{ marginTop: 40 }} />
        : (
          <FlatList
            data={courses}
            keyExtractor={c => c.id}
            contentContainerStyle={styles.list}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => router.push(`/courses/${item.slug}` as any)}>
                {item.thumbnailUrl
                  ? <Image source={{ uri: item.thumbnailUrl }} style={styles.thumb} />
                  : <View style={[styles.thumb, styles.thumbPlaceholder]}><Text style={styles.thumbEmoji}>📚</Text></View>}
                <View style={styles.cardBody}>
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{item.level}</Text>
                  </View>
                  <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.cardSub} numberOfLines={2}>{item.shortDescription}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.price}>{item.price === 0 ? 'Free' : `€${item.price}`}</Text>
                    <Text style={styles.lessons}>{item.totalLessons} lessons</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.empty}>No courses found</Text>}
          />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  header: { padding: 32, paddingBottom: 16 },
  heading: { color: '#fff', fontSize: 32, fontWeight: '800', marginBottom: 6 },
  sub: { color: '#9CA3AF', fontSize: 16, marginBottom: 20 },
  filters: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#111', borderWidth: 1, borderColor: '#222' },
  chipActive: { backgroundColor: '#06D6F0', borderColor: '#06D6F0' },
  chipText: { color: '#9CA3AF', fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#000' },
  list: { padding: 24, gap: 20 },
  card: { flex: 1, margin: 8, backgroundColor: '#0d0d0d', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#1a1a1a', minWidth: 260 },
  thumb: { width: '100%', height: 160 },
  thumbPlaceholder: { backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  thumbEmoji: { fontSize: 40 },
  cardBody: { padding: 16 },
  levelBadge: { alignSelf: 'flex-start', backgroundColor: '#06D6F011', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 8 },
  levelText: { color: '#06D6F0', fontSize: 11, fontWeight: '700' },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 6 },
  cardSub: { color: '#9CA3AF', fontSize: 13, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { color: '#06D6F0', fontSize: 16, fontWeight: '700' },
  lessons: { color: '#666', fontSize: 12 },
  empty: { color: '#666', textAlign: 'center', marginTop: 60, fontSize: 16 },
});
