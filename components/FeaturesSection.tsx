import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Colors, Fonts, Layout, Spacing } from '@/constants/theme';

const FEATURES = [
  {
    icon: '⬡',
    title: 'Agent-First Curriculum',
    description:
      'Every course is designed around real agentic architectures. No outdated tutorials — only production patterns used by top AI teams today.',
    highlight: 'ReAct, Plan-and-Execute, Multi-agent',
  },
  {
    icon: '◈',
    title: 'Ship Real Projects',
    description:
      'Graduate with a portfolio of autonomous agents, not just certificates. Each module ends with a deployable project you own.',
    highlight: 'Deploy to prod, not a sandbox',
  },
  {
    icon: '◉',
    title: 'Expert Instructors',
    description:
      'Learn from engineers who built AI products at scale — not academics. Live sessions, code reviews, and direct mentorship included.',
    highlight: '1-on-1 mentorship available',
  },
  {
    icon: '◐',
    title: 'Active Community',
    description:
      'Join a cohort of driven developers. Weekly agent showcases, pair programming, job referrals, and a Discord full of builders.',
    highlight: '2,400+ active members',
  },
  {
    icon: '◑',
    title: 'Always Up-to-Date',
    description:
      'AI moves fast. Our curriculum is updated every 6 weeks — new models, new frameworks, new patterns. Your subscription keeps pace.',
    highlight: 'New content every 6 weeks',
  },
  {
    icon: '◒',
    title: 'Flexible Pace',
    description:
      'Self-paced modules with live cohort options. Study on your schedule, graduate on yours. Lifetime access on all courses.',
    highlight: 'Self-paced + live cohorts',
  },
];

export default function FeaturesSection() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const cols = width >= 1024 ? 3 : width >= 640 ? 2 : 1;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.inner, { maxWidth: Layout.maxWidth }]}>
        {/* Section label */}
        <Text style={styles.label}>WHY AGENTIC DEV STUDIO</Text>

        <Text style={[styles.title, isMobile && styles.titleMobile]}>
          Everything you need to{'\n'}
          <Text style={styles.titleCyan}>master agentic AI</Text>
        </Text>

        <Text style={styles.subtitle}>
          We built the platform we wished existed when we started. No fluff,
          no filler — just the fastest path to building autonomous AI systems.
        </Text>

        {/* Cards grid */}
        <View style={[styles.grid, { flexDirection: 'row', flexWrap: 'wrap' }]}>
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} feature={f} cols={cols} />
          ))}
        </View>
      </View>
    </View>
  );
}

function FeatureCard({
  feature,
  cols,
}: {
  feature: (typeof FEATURES)[0];
  cols: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <View
      style={[
        styles.card,
        hovered && styles.cardHover,
        {
          width: cols === 1 ? '100%' : cols === 2 ? '48%' : '31%',
        },
      ]}
      // @ts-ignore web only
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Text style={styles.cardIcon}>{feature.icon}</Text>
      <Text style={styles.cardTitle}>{feature.title}</Text>
      <Text style={styles.cardDesc}>{feature.description}</Text>
      <View style={styles.cardBadge}>
        <Text style={styles.cardBadgeText}>{feature.highlight}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.nearBlack,
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
    lineHeight: 56,
    letterSpacing: -1,
    marginBottom: Spacing.lg,
  },
  titleMobile: {
    fontSize: Fonts.sizes['2xl'],
    lineHeight: 38,
  },
  titleCyan: {
    color: Colors.cyan,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.lg,
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 560,
    marginBottom: Spacing['3xl'],
  },
  grid: {
    width: '100%',
    gap: Spacing.md,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: Spacing.xl,
    marginBottom: Spacing.md,
    flexGrow: 0,
    flexShrink: 0,
  },
  cardHover: {
    borderColor: 'rgba(6, 214, 240, 0.4)',
    backgroundColor: '#131313',
  },
  cardIcon: {
    fontSize: 26,
    color: Colors.cyan,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    color: Colors.white,
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
    marginBottom: Spacing.sm,
  },
  cardDesc: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  cardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.cyanGlowMd,
    borderWidth: 1,
    borderColor: 'rgba(6, 214, 240, 0.2)',
    borderRadius: 100,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  cardBadgeText: {
    color: Colors.cyan,
    fontSize: Fonts.sizes.xs,
    fontWeight: Fonts.weights.medium,
  },
});
