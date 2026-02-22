import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { api, ForumThread, ForumReply } from '@/constants/api';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export default function ThreadDetailScreen() {
  const { slug, threadId } = useLocalSearchParams<{ slug: string; threadId: string }>();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [thread, setThread] = useState<ForumThread | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyBody, setReplyBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!threadId) return;
    (async () => {
      try {
        const [t, r] = await Promise.all([
          api.forum.thread(threadId),
          api.forum.replies(threadId),
        ]);
        setThread(t);
        setReplies(r.content);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [threadId]);

  const handleReply = async () => {
    if (!replyBody.trim() || !threadId) return;
    setSubmitting(true);
    try {
      const r = await api.forum.reply(threadId, replyBody.trim());
      setReplies(prev => [...prev, r]);
      setReplyBody('');
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  const handleAccept = async (replyId: string) => {
    try {
      const updated = await api.forum.accept(replyId);
      setReplies(prev => prev.map(r => r.id === replyId ? updated : r));
    } catch (e) { console.error(e); }
  };

  const handleDeleteReply = async (replyId: string) => {
    try {
      await api.forum.deleteReply(replyId);
      setReplies(prev => prev.filter(r => r.id !== replyId));
    } catch (e) { console.error(e); }
  };

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator color="#06D6F0" size="large" />
    </View>
  );

  if (!thread) return (
    <View style={styles.centered}>
      <Text style={styles.notFound}>Thread not found</Text>
    </View>
  );

  const isAuthor = user?.id === thread.author.id;

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Breadcrumb */}
        <View style={styles.breadcrumb}>
          <TouchableOpacity onPress={() => router.push('/forum' as any)}>
            <Text style={styles.breadLink}>Forum</Text>
          </TouchableOpacity>
          <Text style={styles.breadSep}> › </Text>
          <TouchableOpacity onPress={() => router.push(`/forum/${slug}` as any)}>
            <Text style={styles.breadLink}>/{slug}</Text>
          </TouchableOpacity>
          <Text style={styles.breadSep}> › </Text>
          <Text style={styles.breadCurrent} numberOfLines={1}>{thread.title}</Text>
        </View>

        {/* Thread body */}
        <View style={styles.threadCard}>
          <View style={styles.threadMeta}>
            <Text style={styles.author}>
              {thread.author.firstName} {thread.author.lastName}
            </Text>
            <Text style={styles.metaText}>
              {new Date(thread.createdAt).toLocaleString()}
            </Text>
            {thread.isPinned && <Text style={styles.pin}>📌 Pinned</Text>}
            {thread.isLocked && <Text style={styles.lock}>🔒 Locked</Text>}
          </View>
          <Text style={styles.threadTitle}>{thread.title}</Text>
          <Text style={styles.threadBody}>{thread.body}</Text>
          <View style={styles.threadStats}>
            <Text style={styles.statText}>💬 {thread.replyCount} replies</Text>
            <Text style={styles.statText}>👁 {thread.viewCount} views</Text>
          </View>
        </View>

        {/* Replies */}
        <Text style={styles.repliesHeading}>
          {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
        </Text>

        {replies.map((reply, i) => {
          const isReplyAuthor = user?.id === reply.author.id;
          const canAccept = isAuthor && !reply.isAccepted && !thread.isLocked;
          return (
            <View key={reply.id} style={[styles.replyCard, reply.isAccepted && styles.replyAccepted]}>
              <View style={styles.replyHeader}>
                <Text style={styles.replyNum}>#{i + 1}</Text>
                <Text style={styles.replyAuthor}>
                  {reply.author.firstName} {reply.author.lastName}
                </Text>
                <Text style={styles.replyDate}>
                  {new Date(reply.createdAt).toLocaleString()}
                </Text>
                {reply.isAccepted && (
                  <View style={styles.acceptedBadge}>
                    <Text style={styles.acceptedText}>✓ Accepted</Text>
                  </View>
                )}
              </View>

              <Text style={styles.replyContent}>{reply.content}</Text>

              <View style={styles.replyActions}>
                <Text style={styles.likeCount}>♥ {reply.likeCount}</Text>
                {canAccept && (
                  <TouchableOpacity onPress={() => handleAccept(reply.id)}>
                    <Text style={styles.acceptBtn}>✓ Accept answer</Text>
                  </TouchableOpacity>
                )}
                {isReplyAuthor && (
                  <TouchableOpacity onPress={() => handleDeleteReply(reply.id)}>
                    <Text style={styles.deleteBtn}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}

        {/* Reply form */}
        {!thread.isLocked && (
          <View style={styles.replyForm}>
            <Text style={styles.replyFormTitle}>
              {isAuthenticated ? 'Add a reply' : 'Sign in to reply'}
            </Text>
            {isAuthenticated ? (
              <>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  placeholder="Write your reply..."
                  placeholderTextColor="#666"
                  value={replyBody}
                  onChangeText={setReplyBody}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  style={[styles.submitBtn, !replyBody.trim() && styles.submitBtnDisabled]}
                  onPress={handleReply}
                  disabled={submitting || !replyBody.trim()}>
                  {submitting
                    ? <ActivityIndicator color="#000" />
                    : <Text style={styles.submitText}>Post Reply</Text>}
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.signInBtn} onPress={() => router.push('/auth/login' as any)}>
                <Text style={styles.signInText}>Sign In to Reply</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {thread.isLocked && (
          <View style={styles.lockedNotice}>
            <Text style={styles.lockedText}>🔒 This thread is locked — no new replies</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  centered: { flex: 1, backgroundColor: Colors.black, alignItems: 'center', justifyContent: 'center' },
  notFound: { color: '#666', fontSize: 18 },
  scroll: { paddingBottom: 60 },

  breadcrumb: { flexDirection: 'row', alignItems: 'center', padding: 24, paddingBottom: 0, flexWrap: 'wrap' },
  breadLink: { color: '#06D6F0', fontSize: 14 },
  breadSep: { color: '#444', fontSize: 14 },
  breadCurrent: { color: '#9CA3AF', fontSize: 14, flex: 1 },

  threadCard: {
    margin: 24, backgroundColor: '#0d0d0d', borderRadius: 16,
    padding: 28, borderWidth: 1, borderColor: '#1a1a1a',
  },
  threadMeta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' },
  author: { color: '#06D6F0', fontSize: 14, fontWeight: '700' },
  metaText: { color: '#555', fontSize: 13 },
  pin: { color: '#06D6F0', fontSize: 12 },
  lock: { color: '#f59e0b', fontSize: 12 },
  threadTitle: { color: '#fff', fontSize: 26, fontWeight: '800', marginBottom: 16 },
  threadBody: { color: '#ccc', fontSize: 16, lineHeight: 28 },
  threadStats: { flexDirection: 'row', gap: 20, marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderColor: '#1a1a1a' },
  statText: { color: '#555', fontSize: 13 },

  repliesHeading: { color: '#fff', fontSize: 20, fontWeight: '700', paddingHorizontal: 24, marginBottom: 12 },

  replyCard: {
    marginHorizontal: 24, marginBottom: 12, backgroundColor: '#0d0d0d',
    borderRadius: 14, padding: 20, borderWidth: 1, borderColor: '#1a1a1a',
  },
  replyAccepted: { borderColor: '#0d3', borderWidth: 1.5 },
  replyHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' },
  replyNum: { color: '#444', fontSize: 12, fontWeight: '700' },
  replyAuthor: { color: '#06D6F0', fontSize: 13, fontWeight: '600', flex: 1 },
  replyDate: { color: '#555', fontSize: 12 },
  acceptedBadge: { backgroundColor: '#0d322a', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  acceptedText: { color: '#0f0', fontSize: 11, fontWeight: '700' },
  replyContent: { color: '#ccc', fontSize: 15, lineHeight: 26 },
  replyActions: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 14 },
  likeCount: { color: '#555', fontSize: 14 },
  acceptBtn: { color: '#0d6', fontSize: 13, fontWeight: '700' },
  deleteBtn: { color: '#ef4444', fontSize: 13 },

  replyForm: {
    margin: 24, backgroundColor: '#0d0d0d', borderRadius: 16,
    padding: 24, borderWidth: 1, borderColor: '#1a1a1a',
  },
  replyFormTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 14 },
  input: {
    backgroundColor: '#111', borderWidth: 1, borderColor: '#222',
    borderRadius: 10, padding: 14, color: '#fff', fontSize: 15, marginBottom: 14,
  },
  textarea: { height: 120 },
  submitBtn: { backgroundColor: '#06D6F0', borderRadius: 10, padding: 14, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.4 },
  submitText: { color: '#000', fontWeight: '700', fontSize: 15 },
  signInBtn: { backgroundColor: '#06D6F0', borderRadius: 10, padding: 14, alignItems: 'center' },
  signInText: { color: '#000', fontWeight: '700', fontSize: 15 },

  lockedNotice: {
    margin: 24, padding: 18, backgroundColor: '#1a1200', borderRadius: 12,
    borderWidth: 1, borderColor: '#332200', alignItems: 'center',
  },
  lockedText: { color: '#f59e0b', fontSize: 14, fontWeight: '600' },
});
