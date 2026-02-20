import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';

import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import FeaturesSection from '@/components/FeaturesSection';
import CoursesSection from '@/components/CoursesSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Index() {
  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <Navbar />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <CoursesSection />
        <CTASection />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  scroll: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  content: {
    flexGrow: 1,
  },
});
