import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { api, ForumThread } from '@/constants/api';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export default function ForumCategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.forum.threads(slug)
      .then(res => setThreads(res.content))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleCreate = async () => {
    if (!title || !body || !slug) return;
    setCreating(true);
    try {
      const thread = await api.forum.createThread(slug, title, body);
      setThreads(t => [thread, ...t]);
      setShowCreate(false); setTitle(''); setBody('');
    } catch (e) { console.error(e); }
    finally { setCreating(false); }
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/forum' as any)} style={styles.back}>
          <Text style={styles.backText}>← Forum</Text>
        </TouchableOpacity>
        <View style={styles.titleRow}>
          <Text style={styles.heading}>/{slug}</Text>
          <TouchableOpacity style={styles.newBtn} onPress={() => isAuthenticated ? setShowCreate(true) : router.push('/auth/login' as any)}>
            <Text style={styles.newBtnText}>+ New Thread</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading
        ? <ActivityIndicator color="#06D6F0" style={{ marginTop: 40 }} />
        : (
          <FlatList
            data={threads}
            keyExtractor={t => t.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => router.push(`/forum/${slug}/${item.id}` as any)}>
                <View style={styles.cardTop}>
                  {item.isPinned && <Text style={styles.pinned}>📌 Pinned</Text>}
                  {item.isLocked && <Text style={styles.locked}>🔒</Text>}
                </View>
                <Text style={styles.threadTitle}>{item.title}</Text>
                <Text style={styles.threadBody} numberOfLines={2}>{item.body}</Text>
                <View style={styles.cardMeta}>
                  <Text style={styles.metaText}>👤 {item.author.firstName} {item.author.lastName}</Text>
                  <Text style={styles.metaText}>💬 {item.replyCount} replies</Text>
                  <Text style={styles.metaText}>👁 {item.viewCount} views</Text>
                  <Text style={styles.metaText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.empty}>No threads yet — start one!</Text>}
          />
        )}

      <Modal visible={showCreate} animationType="fade" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>New Thread</Text>
            <TextInput style={styles.input} placeholder="Title" placeholderTextColor="#666" value={title} onChangeText={setTitle} />
            <TextInput style={[styles.input, styles.textarea]} placeholder="Describe your question or topic..." placeholderTextColor="#666" value={body} onChangeText={setBody} multiline numberOfLines={6} textAlignVertical="top" />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowCreate(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleCreate} disabled={creating}>
                {creating ? <ActivityIndicator color="#000" /> : <Text style={styles.submitText}>Post Thread</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  header: { padding: 32, paddingBottom: 16 },
  back: { marginBottom: 8 },
  backText: { color: '#06D6F0', fontSize: 14 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heading: { color: '#fff', fontSize: 28, fontWeight: '800' },
  newBtn: { backgroundColor: '#06D6F0', paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20 },
  newBtnText: { color: '#000', fontWeight: '700', fontSize: 14 },
  list: { padding: 24, gap: 12 },
  card: { backgroundColor: '#0d0d0d', borderRadius: 14, padding: 20, borderWidth: 1, borderColor: '#1a1a1a' },
  cardTop: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  pinned: { color: '#06D6F0', fontSize: 12, fontWeight: '600' },
  locked: { fontSize: 12 },
  threadTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  threadBody: { color: '#9CA3AF', fontSize: 14, marginBottom: 12 },
  cardMeta: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  metaText: { color: '#555', fontSize: 12 },
  empty: { color: '#666', textAlign: 'center', marginTop: 60, fontSize: 16 },
  modalBg: { flex: 1, backgroundColor: '#000000cc', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modal: { width: '100%', maxWidth: 600, backgroundColor: '#0d0d0d', borderRadius: 16, padding: 28, borderWidth: 1, borderColor: '#222' },
  modalTitle: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 16 },
  input: { backgroundColor: '#111', borderWidth: 1, borderColor: '#222', borderRadius: 10, padding: 14, color: '#fff', fontSize: 15, marginBottom: 14 },
  textarea: { height: 140 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 4 },
  cancelBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, backgroundColor: '#1a1a1a' },
  cancelText: { color: '#9CA3AF', fontWeight: '600' },
  submitBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10, backgroundColor: '#06D6F0', minWidth: 100, alignItems: 'center' },
  submitText: { color: '#000', fontWeight: '700' },
});
