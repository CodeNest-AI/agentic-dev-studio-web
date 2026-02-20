import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Colors, Fonts, Layout, Spacing } from '@/constants/theme';

export default function HeroSection() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [primaryHover, setPrimaryHover] = useState(false);
  const [secondaryHover, setSecondaryHover] = useState(false);

  return (
    <View style={styles.wrapper}>
      {/* Background grid */}
      <View style={styles.grid} pointerEvents="none" />
      {/* Cyan glow */}
      <View style={styles.glow} pointerEvents="none" />

      <View style={[styles.inner, { maxWidth: Layout.maxWidth }]}>
        {/* Badge */}
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>Now enrolling — Cohort 04</Text>
        </View>

        {/* Headline */}
        <Text style={[styles.headline, isMobile && styles.headlineMobile]}>
          Build the Future{'\n'}
          <Text style={styles.headlineCyan}>with AI Agents</Text>
        </Text>

        {/* Subheading */}
        <Text style={[styles.subheading, isMobile && styles.subheadingMobile]}>
          AGENTIC DEV STUDIO is the world's first EdTech platform built
          entirely around agentic AI. Learn to design, build, and deploy
          autonomous AI systems — from foundations to production.
        </Text>

        {/* CTA Buttons */}
        <View style={[styles.ctaRow, isMobile && styles.ctaRowMobile]}>
          <Pressable
            style={[styles.primaryBtn, primaryHover && styles.primaryBtnHover]}
            onHoverIn={() => setPrimaryHover(true)}
            onHoverOut={() => setPrimaryHover(false)}
          >
            <Text style={styles.primaryBtnText}>Start Learning Free</Text>
          </Pressable>

          <Pressable
            style={[styles.secondaryBtn, secondaryHover && styles.secondaryBtnHover]}
            onHoverIn={() => setSecondaryHover(true)}
            onHoverOut={() => setSecondaryHover(false)}
          >
            <Text style={styles.secondaryBtnText}>View Courses →</Text>
          </Pressable>
        </View>

        {/* Social proof */}
        <View style={styles.proofRow}>
          <View style={styles.avatarStack}>
            {['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'].map((color, i) => (
              <View
                key={i}
                style={[
                  styles.avatar,
                  { backgroundColor: color, marginLeft: i === 0 ? 0 : -8 },
                ]}
              />
            ))}
          </View>
          <Text style={styles.proofText}>
            <Text style={styles.proofHighlight}>2,400+ developers</Text>
            {' '}already building with agents
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    minHeight: '100vh' as any,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Layout.navHeight + Spacing['3xl'],
    paddingBottom: Spacing['3xl'],
    paddingHorizontal: Spacing.lg,
    overflow: 'hidden',
  },
  grid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
    ` as any,
    backgroundSize: '60px 60px' as any,
  },
  glow: {
    position: 'absolute',
    top: '20%' as any,
    left: '50%' as any,
    width: 800,
    height: 800,
    borderRadius: 400,
    backgroundColor: 'transparent',
    transform: [{ translateX: -400 }, { translateY: -400 }],
    boxShadow: '0 0 400px 100px rgba(6, 214, 240, 0.06)' as any,
  },
  inner: {
    alignSelf: 'center',
    alignItems: 'center',
    width: '100%',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cyanGlow,
    borderWidth: 1,
    borderColor: 'rgba(6, 214, 240, 0.3)',
    borderRadius: 100,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    marginBottom: Spacing.xl,
    gap: 8,
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.cyan,
  },
  badgeText: {
    color: Colors.cyan,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.medium,
    letterSpacing: 0.5,
  },
  headline: {
    color: Colors.white,
    fontSize: Fonts.sizes['5xl'],
    fontWeight: Fonts.weights.black,
    textAlign: 'center',
    lineHeight: 72,
    letterSpacing: -1.5,
    marginBottom: Spacing.lg,
  },
  headlineMobile: {
    fontSize: Fonts.sizes['3xl'],
    lineHeight: 46,
    letterSpacing: -1,
  },
  headlineCyan: {
    color: Colors.cyan,
  },
  subheading: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.lg,
    textAlign: 'center',
    lineHeight: 30,
    maxWidth: 600,
    marginBottom: Spacing['2xl'],
  },
  subheadingMobile: {
    fontSize: Fonts.sizes.base,
    lineHeight: 24,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing['2xl'],
  },
  ctaRowMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    width: '100%',
  },
  primaryBtn: {
    backgroundColor: Colors.cyan,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryBtnHover: {
    backgroundColor: Colors.cyanBright,
    transform: [{ translateY: -1 }],
  },
  primaryBtnText: {
    color: Colors.black,
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.bold,
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
  },
  secondaryBtnHover: {
    borderColor: Colors.cyan,
  },
  secondaryBtnText: {
    color: Colors.white,
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.medium,
  },
  proofRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.black,
  },
  proofText: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
  },
  proofHighlight: {
    color: Colors.white,
    fontWeight: Fonts.weights.semibold,
  },
});
