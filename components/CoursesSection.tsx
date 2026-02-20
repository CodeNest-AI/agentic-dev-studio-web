import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { Colors, Fonts, Layout, Spacing } from '@/constants/theme';

const COURSES = [
  {
    tag: 'FOUNDATIONS',
    tagColor: '#10B981',
    title: 'Foundations of Agentic AI',
    description:
      'Start from zero. Understand how LLMs reason, how agents plan and act, and build your first autonomous agent from scratch.',
    duration: '8 weeks',
    level: 'Beginner',
    topics: ['LLM fundamentals', 'Tool use & function calling', 'Memory systems', 'ReAct agents'],
    price: 'Free',
    priceNote: 'First module free',
    featured: false,
  },
  {
    tag: 'MOST POPULAR',
    tagColor: Colors.cyan,
    title: 'Multi-Agent Systems',
    description:
      'Design and orchestrate teams of specialized agents. Build systems that plan, delegate, collaborate, and self-correct.',
    duration: '12 weeks',
    level: 'Intermediate',
    topics: ['Agent orchestration', 'LangGraph & CrewAI', 'Evaluation & testing', 'Human-in-the-loop'],
    price: '$299',
    priceNote: 'per cohort',
    featured: true,
  },
  {
    tag: 'ADVANCED',
    tagColor: '#8B5CF6',
    title: 'Production AI Engineering',
    description:
      'Ship agents to production. Observability, evals, cost optimization, safety guardrails, and scaling to millions of users.',
    duration: '16 weeks',
    level: 'Advanced',
    topics: ['LLMOps & monitoring', 'Cost & latency optimization', 'Safety & guardrails', 'Enterprise patterns'],
    price: '$599',
    priceNote: 'per cohort',
    featured: false,
  },
];

export default function CoursesSection() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.inner, { maxWidth: Layout.maxWidth }]}>
        <Text style={styles.label}>CURRICULUM</Text>
        <Text style={[styles.title, isMobile && styles.titleMobile]}>
          Three tracks.{' '}
          <Text style={styles.titleCyan}>One clear path.</Text>
        </Text>
        <Text style={styles.subtitle}>
          From your first LLM call to running agents in production —
          our curriculum takes you the whole way.
        </Text>

        <View style={[styles.grid, isMobile && styles.gridMobile]}>
          {COURSES.map((course, i) => (
            <CourseCard key={i} course={course} isMobile={isMobile} />
          ))}
        </View>
      </View>
    </View>
  );
}

function CourseCard({
  course,
  isMobile,
}: {
  course: (typeof COURSES)[0];
  isMobile: boolean;
}) {
  const [btnHover, setBtnHover] = useState(false);

  return (
    <View
      style={[
        styles.card,
        course.featured && styles.cardFeatured,
        isMobile && styles.cardMobile,
      ]}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={[styles.tag, { backgroundColor: course.tagColor + '20', borderColor: course.tagColor + '50' }]}>
          <Text style={[styles.tagText, { color: course.tagColor }]}>{course.tag}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{course.duration}</Text>
          <Text style={styles.metaDivider}>·</Text>
          <Text style={styles.metaText}>{course.level}</Text>
        </View>
      </View>

      <Text style={styles.cardTitle}>{course.title}</Text>
      <Text style={styles.cardDesc}>{course.description}</Text>

      {/* Topics */}
      <View style={styles.topicsGrid}>
        {course.topics.map((t, i) => (
          <View key={i} style={styles.topic}>
            <Text style={styles.topicBullet}>▸</Text>
            <Text style={styles.topicText}>{t}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <View>
          <Text style={[styles.price, course.featured && styles.priceFeatured]}>
            {course.price}
          </Text>
          <Text style={styles.priceNote}>{course.priceNote}</Text>
        </View>
        <Pressable
          style={[
            styles.enrollBtn,
            course.featured && styles.enrollBtnFeatured,
            btnHover && styles.enrollBtnHover,
          ]}
          onHoverIn={() => setBtnHover(true)}
          onHoverOut={() => setBtnHover(false)}
        >
          <Text style={[styles.enrollText, !course.featured && styles.enrollTextOutline]}>
            Enroll Now
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.black,
    paddingVertical: Spacing['4xl'],
    paddingHorizontal: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inner: {
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
  },
  label: {
    color: Colors.cyan,
    fontSize: Fonts.sizes.xs,
    fontWeight: Fonts.weights.bold,
    letterSpacing: 3,
    marginBottom: Spacing.md,
  },
  title: {
    color: Colors.white,
    fontSize: Fonts.sizes['4xl'],
    fontWeight: Fonts.weights.black,
    textAlign: 'center',
    letterSpacing: -1,
    marginBottom: Spacing.lg,
  },
  titleMobile: {
    fontSize: Fonts.sizes['2xl'],
  },
  titleCyan: {
    color: Colors.cyan,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.lg,
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 520,
    marginBottom: Spacing['3xl'],
  },
  grid: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
    justifyContent: 'center',
    flexWrap: 'wrap' as any,
    alignItems: 'stretch',
  },
  gridMobile: {
    flexDirection: 'column',
  },
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: Spacing.xl,
    flex: 1,
    minWidth: 280,
    maxWidth: 380,
  },
  cardFeatured: {
    borderColor: 'rgba(6, 214, 240, 0.5)',
    backgroundColor: '#0D1A1C',
  },
  cardMobile: {
    maxWidth: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: Fonts.sizes.xs,
    fontWeight: Fonts.weights.bold,
    letterSpacing: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: Colors.textDim,
    fontSize: Fonts.sizes.xs,
  },
  metaDivider: {
    color: Colors.textDim,
  },
  cardTitle: {
    color: Colors.white,
    fontSize: Fonts.sizes.xl,
    fontWeight: Fonts.weights.bold,
    marginBottom: Spacing.sm,
    lineHeight: 28,
  },
  cardDesc: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  topicsGrid: {
    gap: 8,
    marginBottom: Spacing.lg,
  },
  topic: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  topicBullet: {
    color: Colors.cyan,
    fontSize: Fonts.sizes.xs,
    marginTop: 2,
  },
  topicText: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto' as any,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  price: {
    color: Colors.white,
    fontSize: Fonts.sizes['2xl'],
    fontWeight: Fonts.weights.black,
    letterSpacing: -0.5,
  },
  priceFeatured: {
    color: Colors.cyan,
  },
  priceNote: {
    color: Colors.textDim,
    fontSize: Fonts.sizes.xs,
  },
  enrollBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  enrollBtnFeatured: {
    backgroundColor: Colors.cyan,
    borderColor: Colors.cyan,
  },
  enrollBtnHover: {
    borderColor: Colors.cyan,
  },
  enrollText: {
    color: Colors.black,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.bold,
  },
  enrollTextOutline: {
    color: Colors.white,
  },
});
