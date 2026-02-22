import { Platform } from 'react-native';

export const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8081/api';

// ─── Token storage (localStorage on web, in-memory fallback elsewhere) ────────

const store: Record<string, string> = {};

export const tokenStorage = {
  get: (key: string): string | null => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return store[key] ?? null;
  },
  set: (key: string, value: string) => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    } else {
      store[key] = value;
    }
  },
  remove: (key: string) => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    } else {
      delete store[key];
    }
  },
};

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  withAuth = false
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (withAuth) {
    const token = tokenStorage.get('accessToken');
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401 && withAuth) {
    // Attempt token refresh
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers.set('Authorization', `Bearer ${tokenStorage.get('accessToken')}`);
      const retry = await fetch(`${API_BASE}${path}`, { ...options, headers });
      if (!retry.ok) throw new ApiError(retry.status, await retry.text());
      return retry.json();
    }
    throw new ApiError(401, 'Session expired');
  }

  if (!res.ok) {
    const body = await res.text();
    throw new ApiError(res.status, body);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

async function tryRefresh(): Promise<boolean> {
  try {
    const rt = tokenStorage.get('refreshToken');
    if (!rt) return false;
    const data = await api.auth.refresh(rt);
    tokenStorage.set('accessToken', data.accessToken);
    tokenStorage.set('refreshToken', data.refreshToken);
    return true;
  } catch {
    tokenStorage.remove('accessToken');
    tokenStorage.remove('refreshToken');
    return false;
  }
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const get  = <T>(path: string, auth = false) => request<T>(path, { method: 'GET' }, auth);
const post = <T>(path: string, body: unknown, auth = false) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) }, auth);
const put  = <T>(path: string, body: unknown, auth = false) =>
  request<T>(path, { method: 'PUT', body: JSON.stringify(body) }, auth);
const del  = <T>(path: string, auth = false) => request<T>(path, { method: 'DELETE' }, auth);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  bio: string | null;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnailUrl: string | null;
  price: number;
  currency: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  durationMinutes: number;
  totalLessons: number;
  instructor: User;
}

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  content: string;
  videoUrl: string | null;
  durationMinutes: number;
  orderIndex: number;
  isFreePreview: boolean;
}

export interface Enrollment {
  id: string;
  course: Course;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  enrolledAt: string;
  completedAt: string | null;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  type: 'DISCUSSION' | 'QUESTION' | 'SHOWCASE';
  likeCount: number;
  author: User;
  createdAt: string;
}

export interface PostComment {
  id: string;
  content: string;
  likeCount: number;
  author: User;
  createdAt: string;
}

export interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconUrl: string | null;
  orderIndex: number;
}

export interface ForumThread {
  id: string;
  title: string;
  body: string;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  replyCount: number;
  author: User;
  category: ForumCategory;
  createdAt: string;
  lastActivityAt: string;
}

export interface ForumReply {
  id: string;
  content: string;
  isAccepted: boolean;
  likeCount: number;
  author: User;
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}

// ─── API surface ──────────────────────────────────────────────────────────────

export const api = {
  auth: {
    register: (email: string, password: string, firstName: string, lastName: string) =>
      post<AuthResponse>('/auth/register', { email, password, firstName, lastName }),

    login: (email: string, password: string) =>
      post<AuthResponse>('/auth/login', { email, password }),

    google: (idToken: string) =>
      post<AuthResponse>('/auth/google', { idToken }),

    refresh: (refreshToken: string) =>
      post<AuthResponse>('/auth/refresh', { refreshToken }),

    me: () => get<User>('/auth/me', true),
  },

  courses: {
    list: (page = 0, size = 20, level?: string) =>
      get<Page<Course>>(`/courses?page=${page}&size=${size}${level ? `&level=${level}` : ''}`),

    get: (slug: string) => get<Course>(`/courses/${slug}`),

    lessons: (id: string) => get<Lesson[]>(`/courses/${id}/lessons`),
  },

  enrollments: {
    list: () => get<Enrollment[]>('/enrollments', true),

    enroll: (courseId: string, paymentIntentId?: string) =>
      post<Enrollment>(
        `/enrollments/${courseId}${paymentIntentId ? `?paymentIntentId=${paymentIntentId}` : ''}`,
        {}, true
      ),

    status: (courseId: string) =>
      get<{ enrolled: boolean }>(`/enrollments/${courseId}/status`, true),

    progress: (enrollmentId: string) =>
      get<{ completionPercent: number; completedLessons: string[]; status: string }>(
        `/enrollments/${enrollmentId}/progress`, true
      ),

    markComplete: (enrollmentId: string, lessonId: string) =>
      post<void>(`/enrollments/${enrollmentId}/lessons/${lessonId}/complete`, {}, true),
  },

  community: {
    posts: (page = 0, size = 20, type?: string) =>
      get<Page<Post>>(`/community/posts?page=${page}&size=${size}${type ? `&type=${type}` : ''}`),

    post: (id: string) => get<Post>(`/community/posts/${id}`),

    create: (title: string, content: string, type: Post['type']) =>
      post<Post>('/community/posts', { title, content, type }, true),

    like: (id: string) => post<Post>(`/community/posts/${id}/like`, {}),

    addComment: (postId: string, content: string) =>
      post<PostComment>(`/community/posts/${postId}/comments`, { content }, true),

    deletePost: (id: string) => del<void>(`/community/posts/${id}`, true),

    deleteComment: (id: string) => del<void>(`/community/comments/${id}`, true),
  },

  forum: {
    categories: () => get<ForumCategory[]>('/forum/categories'),

    threads: (slug: string, page = 0, size = 20) =>
      get<Page<ForumThread>>(`/forum/categories/${slug}/threads?page=${page}&size=${size}`),

    thread: (id: string) => get<ForumThread>(`/forum/threads/${id}`),

    createThread: (slug: string, title: string, body: string) =>
      post<ForumThread>(`/forum/categories/${slug}/threads`, { title, body }, true),

    replies: (threadId: string, page = 0, size = 50) =>
      get<Page<ForumReply>>(`/forum/threads/${threadId}/replies?page=${page}&size=${size}`),

    reply: (threadId: string, content: string) =>
      post<ForumReply>(`/forum/threads/${threadId}/replies`, { content }, true),

    accept: (replyId: string) =>
      post<ForumReply>(`/forum/replies/${replyId}/accept`, {}, true),

    deleteReply: (replyId: string) => del<void>(`/forum/replies/${replyId}`, true),
  },
};
