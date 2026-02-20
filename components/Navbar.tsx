import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Colors, Fonts, Layout, Spacing } from '@/constants/theme';

const NAV_LINKS = ['Courses', 'Features', 'Community', 'About'];

export default function Navbar() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [menuOpen, setMenuOpen] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.inner, { maxWidth: Layout.maxWidth }]}>
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={styles.logoMark} />
          <Text style={styles.logoText}>AGENTIC</Text>
          <Text style={styles.logoDot}>·</Text>
          <Text style={styles.logoSub}>DEV STUDIO</Text>
        </View>

        {/* Desktop Nav */}
        {!isMobile && (
          <View style={styles.navLinks}>
            {NAV_LINKS.map((link) => (
              <NavLink key={link} label={link} />
            ))}
          </View>
        )}

        {/* CTA */}
        <View style={styles.ctaRow}>
          {!isMobile && (
            <Pressable
              style={[styles.ctaButton, ctaHover && styles.ctaButtonHover]}
              onHoverIn={() => setCtaHover(true)}
              onHoverOut={() => setCtaHover(false)}
            >
              <Text style={styles.ctaText}>Get Started</Text>
            </Pressable>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <Pressable
              onPress={() => setMenuOpen((o) => !o)}
              style={styles.hamburger}
            >
              <View style={styles.bar} />
              <View style={styles.bar} />
              <View style={styles.bar} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Mobile menu */}
      {isMobile && menuOpen && (
        <View style={styles.mobileMenu}>
          {NAV_LINKS.map((link) => (
            <Text key={link} style={styles.mobileLink}>
              {link}
            </Text>
          ))}
          <Pressable style={styles.ctaButton}>
            <Text style={styles.ctaText}>Get Started</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function NavLink({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Pressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
    >
      <Text style={[styles.navLink, hovered && styles.navLinkHover]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'fixed' as any,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backdropFilter: 'blur(12px)' as any,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '100%',
    height: Layout.navHeight,
    paddingHorizontal: Spacing.lg,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoMark: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: Colors.cyan,
    marginRight: 2,
  },
  logoText: {
    color: Colors.white,
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.black,
    letterSpacing: 3,
  },
  logoDot: {
    color: Colors.cyan,
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
  },
  logoSub: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.medium,
    letterSpacing: 2,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  navLink: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.medium,
    letterSpacing: 0.5,
  },
  navLinkHover: {
    color: Colors.white,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaButton: {
    backgroundColor: Colors.cyan,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 6,
  },
  ctaButtonHover: {
    backgroundColor: Colors.cyanBright,
  },
  ctaText: {
    color: Colors.black,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.bold,
    letterSpacing: 0.5,
  },
  hamburger: {
    gap: 5,
    padding: Spacing.sm,
  },
  bar: {
    width: 22,
    height: 2,
    backgroundColor: Colors.white,
    borderRadius: 1,
  },
  mobileMenu: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  mobileLink: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.medium,
    paddingVertical: Spacing.sm,
  },
});
