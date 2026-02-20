import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Colors, Fonts, Layout, Spacing } from '@/constants/theme';

const STATS = [
  { value: '2,400+', label: 'Active Students', sub: 'across 60+ countries' },
  { value: '95%',    label: 'Completion Rate', sub: 'industry avg is 12%' },
  { value: '40+',    label: 'Courses & Modules', sub: 'updated every 6 weeks' },
  { value: '100%',   label: 'Project-Based', sub: 'no passive video watching' },
];

export default function StatsSection() {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  return (
    <View style={styles.wrapper}>
      <View style={styles.glowLine} pointerEvents="none" />
      <View style={[styles.inner, { maxWidth: Layout.maxWidth }]}>
        <View style={[styles.grid, isMobile && styles.gridMobile]}>
          {STATS.map((stat, i) => (
            <View
              key={i}
              style={[styles.stat, i < STATS.length - 1 && !isMobile && styles.statBorder]}
            >
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statSub}>{stat.sub}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing['3xl'],
    paddingHorizontal: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    position: 'relative',
    overflow: 'hidden',
  },
  glowLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    background: 'linear-gradient(90deg, transparent, rgba(6,214,240,0.5), transparent)' as any,
  },
  inner: {
    alignSelf: 'center',
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  gridMobile: {
    flexDirection: 'column',
    gap: Spacing.xl,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: Spacing.md,
  },
  statBorder: {
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  statValue: {
    color: Colors.cyan,
    fontSize: Fonts.sizes['4xl'],
    fontWeight: Fonts.weights.black,
    letterSpacing: -1,
    marginBottom: 4,
  },
  statLabel: {
    color: Colors.white,
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.semibold,
    marginBottom: 4,
  },
  statSub: {
    color: Colors.textDim,
    fontSize: Fonts.sizes.xs,
  },
});
