import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { api, Course, Lesson } from '@/constants/api';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export default function CourseDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const c = await api.courses.get(slug);
        setCourse(c);
        const ls = await api.courses.lessons(c.id);
        setLessons(ls);
        if (isAuthenticated) {
          const status = await api.enrollments.status(c.id);
          setIsEnrolled(status.enrolled);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [slug, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) { router.push('/auth/login' as any); return; }
    setEnrolling(true);
    try {
      await api.enrollments.enroll(course!.id);
      setIsEnrolled(true);
    } catch (e: any) { console.error(e); }
    finally { setEnrolling(false); }
  };

  if (loading) return <View style={styles.centered}><ActivityIndicator color="#06D6F0" size="large" /></View>;
  if (!course) return <View style={styles.centered}><Text style={styles.notFound}>Course not found</Text></View>;

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scroll}>
        {course.thumbnailUrl && <Image source={{ uri: course.thumbnailUrl }} style={styles.hero} />}

        <View style={styles.content}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{course.level}</Text>
          </View>

          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.desc}>{course.description}</Text>

          <View style={styles.meta}>
            <Text style={styles.metaItem}>👤 {course.instructor.firstName} {course.instructor.lastName}</Text>
            <Text style={styles.metaItem}>🎬 {course.totalLessons} lessons</Text>
            <Text style={styles.metaItem}>⏱ {course.durationMinutes} min</Text>
          </View>

          <View style={styles.enrollRow}>
            <Text style={styles.price}>{course.price === 0 ? 'Free' : `€${course.price}`}</Text>
            {isEnrolled
              ? <View style={styles.enrolledBadge}><Text style={styles.enrolledText}>✓ Enrolled</Text></View>
              : (
                <TouchableOpacity style={styles.enrollBtn} onPress={handleEnroll} disabled={enrolling}>
                  {enrolling
                    ? <ActivityIndicator color="#000" />
                    : <Text style={styles.enrollBtnText}>{isAuthenticated ? 'Enroll Now' : 'Sign in to Enroll'}</Text>}
                </TouchableOpacity>
              )}
          </View>

          <Text style={styles.sectionTitle}>Course Content</Text>
          {lessons.map((lesson, i) => (
            <View key={lesson.id} style={styles.lessonRow}>
              <Text style={styles.lessonNum}>{i + 1}</Text>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonMeta}>{lesson.durationMinutes} min{lesson.isFreePreview ? ' · Free preview' : ''}</Text>
              </View>
              {lesson.isFreePreview && <Text style={styles.freeTag}>FREE</Text>}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  centered: { flex: 1, backgroundColor: Colors.black, alignItems: 'center', justifyContent: 'center' },
  notFound: { color: '#666', fontSize: 18 },
  scroll: { paddingBottom: 60 },
  hero: { width: '100%', height: 320 },
  content: { padding: 32, maxWidth: 800, alignSelf: 'center', width: '100%' },
  levelBadge: { alignSelf: 'flex-start', backgroundColor: '#06D6F011', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 12 },
  levelText: { color: '#06D6F0', fontSize: 12, fontWeight: '700' },
  title: { color: '#fff', fontSize: 32, fontWeight: '800', marginBottom: 16 },
  desc: { color: '#9CA3AF', fontSize: 16, lineHeight: 26, marginBottom: 24 },
  meta: { flexDirection: 'row', gap: 20, marginBottom: 28, flexWrap: 'wrap' },
  metaItem: { color: '#666', fontSize: 14 },
  enrollRow: { flexDirection: 'row', alignItems: 'center', gap: 24, marginBottom: 40 },
  price: { color: '#fff', fontSize: 32, fontWeight: '800' },
  enrollBtn: { backgroundColor: '#06D6F0', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 10 },
  enrollBtnText: { color: '#000', fontWeight: '700', fontSize: 16 },
  enrolledBadge: { backgroundColor: '#0d3', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  enrolledText: { color: '#fff', fontWeight: '700' },
  sectionTitle: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 16 },
  lessonRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderColor: '#1a1a1a', gap: 14 },
  lessonNum: { color: '#444', width: 24, textAlign: 'center', fontWeight: '600' },
  lessonInfo: { flex: 1 },
  lessonTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
  lessonMeta: { color: '#666', fontSize: 13, marginTop: 2 },
  freeTag: { color: '#06D6F0', fontSize: 11, fontWeight: '700', backgroundColor: '#06D6F011', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
});
