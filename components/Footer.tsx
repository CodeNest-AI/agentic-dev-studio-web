import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Colors, Fonts, Layout, Spacing } from '@/constants/theme';

const LINKS = {
  Courses:   ['Foundations', 'Multi-Agent Systems', 'Production AI', 'All Courses'],
  Company:   ['About Us', 'Blog', 'Careers', 'Press'],
  Community: ['Discord', 'Newsletter', 'Events', 'Showcase'],
  Legal:     ['Privacy Policy', 'Terms of Service', 'Cookies'],
};

export default function Footer() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.inner, { maxWidth: Layout.maxWidth }]}>
        {/* Top row */}
        <View style={[styles.topRow, isMobile && styles.topRowMobile]}>
          {/* Brand */}
          <View style={styles.brand}>
            <View style={styles.logoRow}>
              <View style={styles.logoMark} />
              <Text style={styles.logoText}>AGENTIC</Text>
              <Text style={styles.logoDot}>·</Text>
              <Text style={styles.logoSub}>DEV STUDIO</Text>
            </View>
            <Text style={styles.brandTagline}>
              The world's first EdTech platform{'\n'}built entirely for agentic AI.
            </Text>
            <View style={styles.socialRow}>
              {['X', 'GH', 'LI', 'YT'].map((s) => (
                <View key={s} style={styles.socialBtn}>
                  <Text style={styles.socialText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Links */}
          {!isMobile && (
            <View style={styles.linksGrid}>
              {Object.entries(LINKS).map(([section, links]) => (
                <View key={section} style={styles.linkCol}>
                  <Text style={styles.linkColTitle}>{section}</Text>
                  {links.map((link) => (
                    <Text key={link} style={styles.link}>{link}</Text>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Bottom row */}
        <View style={[styles.bottomRow, isMobile && styles.bottomRowMobile]}>
          <Text style={styles.copyright}>
            © 2026 AGENTIC DEV STUDIO. All rights reserved.
          </Text>
          <View style={styles.bottomBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>All systems operational</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.nearBlack,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  inner: {
    alignSelf: 'center',
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing['3xl'],
    marginBottom: Spacing['3xl'],
  },
  topRowMobile: {
    flexDirection: 'column',
  },
  brand: {
    maxWidth: 280,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.md,
  },
  logoMark: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: Colors.cyan,
  },
  logoText: {
    color: Colors.white,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.black,
    letterSpacing: 3,
  },
  logoDot: {
    color: Colors.cyan,
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.bold,
  },
  logoSub: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.xs,
    fontWeight: Fonts.weights.medium,
    letterSpacing: 2,
  },
  brandTagline: {
    color: Colors.textDim,
    fontSize: Fonts.sizes.sm,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  socialRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  socialBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.xs,
    fontWeight: Fonts.weights.bold,
  },
  linksGrid: {
    flexDirection: 'row',
    gap: Spacing['3xl'],
    flex: 1,
    justifyContent: 'flex-end',
  },
  linkCol: {
    gap: Spacing.sm,
    minWidth: 100,
  },
  linkColTitle: {
    color: Colors.white,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.semibold,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  link: {
    color: Colors.textDim,
    fontSize: Fonts.sizes.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomRowMobile: {
    flexDirection: 'column',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  copyright: {
    color: Colors.textDim,
    fontSize: Fonts.sizes.xs,
  },
  bottomBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 100,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusText: {
    color: Colors.textDim,
    fontSize: Fonts.sizes.xs,
  },
});
