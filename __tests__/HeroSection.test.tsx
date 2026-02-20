import React from 'react';
import { render, screen } from '@testing-library/react';
import HeroSection from '../components/HeroSection';

const mockUseWindowDimensions = jest.fn();
jest.mock('react-native-web', () => ({
  ...jest.requireActual('react-native-web'),
  useWindowDimensions: () => mockUseWindowDimensions(),
}));

const mockDims = (width: number) =>
  mockUseWindowDimensions.mockReturnValue({ width, height: 900, scale: 1, fontScale: 1 });

describe('HeroSection', () => {
  // ── core content ──────────────────────────────────────────────────────────

  it('renders the enrolment badge text', () => {
    mockDims(1280);
    render(<HeroSection />);
    expect(screen.getByText(/Now enrolling/i)).toBeInTheDocument();
  });

  it('renders the headline with Build the Future', () => {
    mockDims(1280);
    render(<HeroSection />);
    expect(screen.getByText(/Build the Future/i)).toBeInTheDocument();
  });

  it('renders the cyan headline segment with AI Agents', () => {
    mockDims(1280);
    render(<HeroSection />);
    expect(screen.getByText(/with AI Agents/i)).toBeInTheDocument();
  });

  it('renders the subheading describing the platform', () => {
    mockDims(1280);
    render(<HeroSection />);
    expect(screen.getByText(/AGENTIC DEV STUDIO/)).toBeInTheDocument();
  });

  // ── CTA buttons ───────────────────────────────────────────────────────────

  it('renders the primary CTA — Start Learning Free', () => {
    mockDims(1280);
    render(<HeroSection />);
    expect(screen.getByText('Start Learning Free')).toBeInTheDocument();
  });

  it('renders the secondary CTA — View Courses', () => {
    mockDims(1280);
    render(<HeroSection />);
    expect(screen.getByText(/View Courses/)).toBeInTheDocument();
  });

  // ── social proof ──────────────────────────────────────────────────────────

  it('renders the social proof developer count', () => {
    mockDims(1280);
    render(<HeroSection />);
    expect(screen.getByText(/2,400\+ developers/)).toBeInTheDocument();
  });

  it('renders the social proof supporting copy', () => {
    mockDims(1280);
    render(<HeroSection />);
    expect(screen.getByText(/already building with agents/)).toBeInTheDocument();
  });

  // ── responsive ───────────────────────────────────────────────────────────

  it('renders correctly on mobile without crashing', () => {
    mockDims(375);
    expect(() => render(<HeroSection />)).not.toThrow();
  });

  it('renders all key elements on tablet', () => {
    mockDims(768);
    render(<HeroSection />);
    expect(screen.getByText('Start Learning Free')).toBeInTheDocument();
    expect(screen.getByText(/Build the Future/i)).toBeInTheDocument();
  });
});
