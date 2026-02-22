import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Modal, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/theme';
import { api, Post } from '@/constants/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import Navbar from '@/components/Navbar';

const TYPES = ['ALL', 'DISCUSSION', 'QUESTION', 'SHOWCASE'] as const;

export default function CommunityScreen() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<Post['type']>('DISCUSSION');
  const [creating, setCreating] = useState(false);

  const load = async (type: string) => {
    setLoading(true);
    try {
      const res = await api.community.posts(0, 20, type === 'ALL' ? undefined : type);
      setPosts(res.content);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(filter); }, [filter]);

  const handleCreate = async () => {
    if (!newTitle || !newContent) return;
    setCreating(true);
    try {
      const post = await api.community.create(newTitle, newContent, newType);
      setPosts(p => [post, ...p]);
      setShowCreate(false);
      setNewTitle(''); setNewContent('');
    } catch (e) { console.error(e); }
    finally { setCreating(false); }
  };

  const handleLike = async (id: string) => {
    try {
      const updated = await api.community.like(id);
      setPosts(p => p.map(post => post.id === id ? updated : post));
    } catch (e) { console.error(e); }
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.header}>
        <Text style={styles.heading}>Community</Text>
        <View style={styles.topRow}>
          <View style={styles.filters}>
            {TYPES.map(t => (
              <TouchableOpacity key={t} style={[styles.chip, filter === t && styles.chipActive]} onPress={() => setFilter(t)}>
                <Text style={[styles.chipText, filter === t && styles.chipTextActive]}>{t.charAt(0) + t.slice(1).toLowerCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.newBtn} onPress={() => isAuthenticated ? setShowCreate(true) : router.push('/auth/login' as any)}>
            <Text style={styles.newBtnText}>+ New Post</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading
        ? <ActivityIndicator color="#06D6F0" style={{ marginTop: 40 }} />
        : (
          <FlatList
            data={posts}
            keyExtractor={p => p.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={[styles.typeBadge, { backgroundColor: typeColor(item.type) + '22' }]}>
                    <Text style={[styles.typeText, { color: typeColor(item.type) }]}>{item.type}</Text>
                  </View>
                  <Text style={styles.author}>{item.author.firstName} {item.author.lastName}</Text>
                  <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postContent} numberOfLines={3}>{item.content}</Text>
                <TouchableOpacity style={styles.likeBtn} onPress={() => handleLike(item.id)}>
                  <Text style={styles.likeText}>♥ {item.likeCount}</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.empty}>No posts yet — be the first!</Text>}
          />
        )}

      <Modal visible={showCreate} animationType="fade" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>New Post</Text>
            <View style={styles.typeRow}>
              {(['DISCUSSION', 'QUESTION', 'SHOWCASE'] as Post['type'][]).map(t => (
                <TouchableOpacity key={t} style={[styles.chip, newType === t && styles.chipActive]} onPress={() => setNewType(t)}>
                  <Text style={[styles.chipText, newType === t && styles.chipTextActive]}>{t.toLowerCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput style={styles.input} placeholder="Title" placeholderTextColor="#666" value={newTitle} onChangeText={setNewTitle} />
            <TextInput style={[styles.input, styles.textarea]} placeholder="What's on your mind?" placeholderTextColor="#666" value={newContent} onChangeText={setNewContent} multiline numberOfLines={5} textAlignVertical="top" />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowCreate(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleCreate} disabled={creating}>
                {creating ? <ActivityIndicator color="#000" /> : <Text style={styles.submitText}>Post</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const typeColor = (t: string) => ({ DISCUSSION: '#06D6F0', QUESTION: '#f59e0b', SHOWCASE: '#8b5cf6' }[t] ?? '#06D6F0');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  header: { padding: 32, paddingBottom: 16 },
  heading: { color: '#fff', fontSize: 32, fontWeight: '800', marginBottom: 16 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
  filters: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#111', borderWidth: 1, borderColor: '#222' },
  chipActive: { backgroundColor: '#06D6F0', borderColor: '#06D6F0' },
  chipText: { color: '#9CA3AF', fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#000' },
  newBtn: { backgroundColor: '#06D6F0', paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20 },
  newBtnText: { color: '#000', fontWeight: '700', fontSize: 14 },
  list: { padding: 24, gap: 16 },
  card: { backgroundColor: '#0d0d0d', borderRadius: 14, padding: 20, borderWidth: 1, borderColor: '#1a1a1a' },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  typeBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  typeText: { fontSize: 11, fontWeight: '700' },
  author: { color: '#666', fontSize: 13, flex: 1 },
  date: { color: '#444', fontSize: 12 },
  postTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  postContent: { color: '#9CA3AF', fontSize: 14, lineHeight: 22 },
  likeBtn: { marginTop: 14, alignSelf: 'flex-start' },
  likeText: { color: '#555', fontSize: 14 },
  empty: { color: '#666', textAlign: 'center', marginTop: 60, fontSize: 16 },
  modalBg: { flex: 1, backgroundColor: '#000000cc', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modal: { width: '100%', maxWidth: 560, backgroundColor: '#0d0d0d', borderRadius: 16, padding: 28, borderWidth: 1, borderColor: '#222' },
  modalTitle: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 16 },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  input: { backgroundColor: '#111', borderWidth: 1, borderColor: '#222', borderRadius: 10, padding: 14, color: '#fff', fontSize: 15, marginBottom: 14 },
  textarea: { height: 120 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 4 },
  cancelBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, backgroundColor: '#1a1a1a' },
  cancelText: { color: '#9CA3AF', fontWeight: '600' },
  submitBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10, backgroundColor: '#06D6F0', minWidth: 80, alignItems: 'center' },
  submitText: { color: '#000', fontWeight: '700' },
});
