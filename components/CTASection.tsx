import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { Colors, Fonts, Layout, Spacing } from '@/constants/theme';

export default function CTASection() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [primaryHover, setPrimaryHover] = useState(false);

  return (
    <View style={styles.wrapper}>
      {/* Background glow */}
      <View style={styles.glow} pointerEvents="none" />

      <View style={[styles.inner, { maxWidth: Layout.maxWidth }]}>
        <View style={styles.card}>
          <Text style={styles.preTitle}>READY TO BUILD?</Text>

          <Text style={[styles.title, isMobile && styles.titleMobile]}>
            Start your agentic{'\n'}
            <Text style={styles.titleCyan}>journey today</Text>
          </Text>

          <Text style={styles.subtitle}>
            Join 2,400+ developers building the next generation of AI systems.
            First module is completely free — no credit card required.
          </Text>

          <View style={[styles.inputRow, isMobile && styles.inputRowMobile]}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputPlaceholder}>your@email.com</Text>
            </View>
            <Pressable
              style={[styles.btn, primaryHover && styles.btnHover]}
              onHoverIn={() => setPrimaryHover(true)}
              onHoverOut={() => setPrimaryHover(false)}
            >
              <Text style={styles.btnText}>Get Free Access →</Text>
            </Pressable>
          </View>

          <Text style={styles.finePrint}>
            Free forever on Foundations track · No credit card · Cancel anytime
          </Text>
        </View>
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
    overflow: 'hidden',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    bottom: -200,
    left: '50%' as any,
    width: 600,
    height: 600,
    borderRadius: 300,
    transform: [{ translateX: -300 }],
    boxShadow: '0 0 300px 80px rgba(6, 214, 240, 0.08)' as any,
  },
  inner: {
    alignSelf: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(6, 214, 240, 0.2)',
    borderRadius: 24,
    padding: Spacing['3xl'],
    alignItems: 'center',
  },
  preTitle: {
    color: Colors.cyan,
    fontSize: Fonts.sizes.xs,
    fontWeight: Fonts.weights.bold,
    letterSpacing: 4,
    marginBottom: Spacing.lg,
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
    maxWidth: 480,
    marginBottom: Spacing.xl,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
    maxWidth: 480,
    marginBottom: Spacing.md,
  },
  inputRowMobile: {
    flexDirection: 'column',
  },
  inputWrapper: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.surfaceHigh,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  inputPlaceholder: {
    color: Colors.textDim,
    fontSize: Fonts.sizes.sm,
  },
  btn: {
    backgroundColor: Colors.cyan,
    height: 48,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnHover: {
    backgroundColor: Colors.cyanBright,
  },
  btnText: {
    color: Colors.black,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.bold,
    whiteSpace: 'nowrap' as any,
  },
  finePrint: {
    color: Colors.textDim,
    fontSize: Fonts.sizes.xs,
    textAlign: 'center',
  },
});
