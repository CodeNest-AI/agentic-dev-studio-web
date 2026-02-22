import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { api, Enrollment } from '@/constants/api';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

interface EnrollmentWithProgress extends Enrollment {
  completionPercent: number;
  completedLessons: string[];
}

export default function DashboardScreen() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const [enrollments, setEnrollments] = useState<EnrollmentWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const list = await api.enrollments.list();
      const withProgress = await Promise.all(
        list.map(async (e) => {
          try {
            const prog = await api.enrollments.progress(e.id);
            return { ...e, completionPercent: prog.completionPercent, completedLessons: prog.completedLessons };
          } catch {
            return { ...e, completionPercent: 0, completedLessons: [] };
          }
        })
      );
      setEnrollments(withProgress);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/' as any); return; }
    load();
  }, [isAuthenticated]);

  const onRefresh = () => { setRefreshing(true); load(); };

  const activeEnrollments   = enrollments.filter(e => e.status === 'ACTIVE');
  const completedEnrollments = enrollments.filter(e => e.status === 'COMPLETED');

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator color="#06D6F0" size="large" />
    </View>
  );

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#06D6F0" />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back, {user?.firstName} 👋</Text>
          <Text style={styles.subtitle}>Pick up where you left off</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatCard label="Enrolled" value={activeEnrollments.length} icon="📚" />
          <StatCard label="Completed" value={completedEnrollments.length} icon="🏆" />
          <StatCard
            label="Avg. Progress"
            value={`${activeEnrollments.length
              ? Math.round(activeEnrollments.reduce((s, e) => s + e.completionPercent, 0) / activeEnrollments.length)
              : 0}%`}
            icon="📈"
          />
        </View>

        {/* In progress */}
        {activeEnrollments.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Continue Learning</Text>
            {activeEnrollments.map(e => (
              <CourseCard
                key={e.id}
                enrollment={e}
                onPress={() => router.push(`/courses/${e.course.slug}` as any)}
              />
            ))}
          </>
        )}

        {/* Completed */}
        {completedEnrollments.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Completed</Text>
            {completedEnrollments.map(e => (
              <CourseCard
                key={e.id}
                enrollment={e}
                onPress={() => router.push(`/courses/${e.course.slug}` as any)}
                completed
              />
            ))}
          </>
        )}

        {/* Empty state */}
        {enrollments.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No courses yet</Text>
            <Text style={styles.emptySub}>Find a course that sparks your interest</Text>
            <TouchableOpacity style={styles.browseBtn} onPress={() => router.push('/courses' as any)}>
              <Text style={styles.browseBtnText}>Browse Courses</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <View style={statStyles.card}>
      <Text style={statStyles.icon}>{icon}</Text>
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

function CourseCard({
  enrollment, onPress, completed = false,
}: {
  enrollment: EnrollmentWithProgress;
  onPress: () => void;
  completed?: boolean;
}) {
  const course = enrollment.course;
  const pct = enrollment.completionPercent ?? 0;

  return (
    <TouchableOpacity style={cardStyles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={cardStyles.row}>
        <View style={cardStyles.iconBox}>
          <Text style={cardStyles.iconEmoji}>📖</Text>
        </View>
        <View style={cardStyles.info}>
          <Text style={cardStyles.title} numberOfLines={1}>{course.title}</Text>
          <Text style={cardStyles.meta}>
            {course.level} · {course.totalLessons} lessons
          </Text>
          {!completed && (
            <View style={cardStyles.progressRow}>
              <View style={cardStyles.progressTrack}>
                <View style={[cardStyles.progressFill, { width: `${pct}%` as any }]} />
              </View>
              <Text style={cardStyles.pct}>{pct}%</Text>
            </View>
          )}
          {completed && (
            <View style={cardStyles.completedBadge}>
              <Text style={cardStyles.completedText}>✓ Completed</Text>
            </View>
          )}
        </View>
        <Text style={cardStyles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  centered: { flex: 1, backgroundColor: Colors.black, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingBottom: 60 },
  header: { padding: 32, paddingBottom: 0 },
  greeting: { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: '#9CA3AF', fontSize: 16, marginBottom: 24 },
  statsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 32, marginBottom: 32 },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: '700', paddingHorizontal: 32, marginBottom: 12, marginTop: 8 },
  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  emptySub: { color: '#9CA3AF', fontSize: 15, textAlign: 'center', marginBottom: 24 },
  browseBtn: { backgroundColor: '#06D6F0', paddingHorizontal: 28, paddingVertical: 13, borderRadius: 10 },
  browseBtnText: { color: '#000', fontWeight: '700', fontSize: 15 },
});

const statStyles = StyleSheet.create({
  card: { flex: 1, backgroundColor: '#0d0d0d', borderRadius: 14, padding: 18, alignItems: 'center', borderWidth: 1, borderColor: '#1a1a1a' },
  icon: { fontSize: 24, marginBottom: 8 },
  value: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 2 },
  label: { color: '#9CA3AF', fontSize: 12 },
});

const cardStyles = StyleSheet.create({
  card: { marginHorizontal: 32, marginBottom: 12, backgroundColor: '#0d0d0d', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#1a1a1a' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBox: { width: 48, height: 48, backgroundColor: '#06D6F011', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  iconEmoji: { fontSize: 22 },
  info: { flex: 1 },
  title: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 3 },
  meta: { color: '#666', fontSize: 13, marginBottom: 8 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressTrack: { flex: 1, height: 4, backgroundColor: '#1a1a1a', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#06D6F0', borderRadius: 2 },
  pct: { color: '#06D6F0', fontSize: 12, fontWeight: '700', minWidth: 32 },
  completedBadge: { alignSelf: 'flex-start', backgroundColor: '#0d322a', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  completedText: { color: '#0f0', fontSize: 12, fontWeight: '700' },
  arrow: { color: '#444', fontSize: 22 },
});
