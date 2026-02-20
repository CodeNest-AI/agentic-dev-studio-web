import React from 'react';
import { render, screen } from '@testing-library/react';
import FeaturesSection from '../components/FeaturesSection';

const mockUseWindowDimensions = jest.fn();
jest.mock('react-native-web', () => ({
  ...jest.requireActual('react-native-web'),
  useWindowDimensions: () => mockUseWindowDimensions(),
}));

const mockDims = (width: number) =>
  mockUseWindowDimensions.mockReturnValue({ width, height: 900, scale: 1, fontScale: 1 });

describe('FeaturesSection', () => {
  // ── section header ────────────────────────────────────────────────────────

  it('renders the section label', () => {
    mockDims(1280);
    render(<FeaturesSection />);
    expect(screen.getByText('WHY AGENTIC DEV STUDIO')).toBeInTheDocument();
  });

  it('renders the section headline', () => {
    mockDims(1280);
    render(<FeaturesSection />);
    expect(screen.getByText(/Everything you need/i)).toBeInTheDocument();
    expect(screen.getByText(/master agentic AI/i)).toBeInTheDocument();
  });

  it('renders the section subtitle', () => {
    mockDims(1280);
    render(<FeaturesSection />);
    expect(screen.getByText(/fastest path/i)).toBeInTheDocument();
  });

  // ── all 6 feature cards ───────────────────────────────────────────────────

  it('renders Agent-First Curriculum card', () => {
    mockDims(1280);
    render(<FeaturesSection />);
    expect(screen.getByText('Agent-First Curriculum')).toBeInTheDocument();
  });

  it('renders Ship Real Projects card', () => {
    mockDims(1280);
    render(<FeaturesSection />);
    expect(screen.getByText('Ship Real Projects')).toBeInTheDocument();
  });

  it('renders Expert Instructors card', () => {
    mockDims(1280);
    render(<FeaturesSection />);
    expect(screen.getByText('Expert Instructors')).toBeInTheDocument();
  });

  it('renders Active Community card', () => {
    mockDims(1280);
    render(<FeaturesSection />);
    expect(screen.getByText('Active Community')).toBeInTheDocument();
  });

  it('renders Always Up-to-Date card', () => {
    mockDims(1280);
    render(<FeaturesSection />);
    expect(screen.getByText('Always Up-to-Date')).toBeInTheDocument();
  });

  it('renders Flexible Pace card', () => {
    mockDims(1280);
    render(<FeaturesSection />);
    expect(screen.getByText('Flexible Pace')).toBeInTheDocument();
  });

  // ── card badges ───────────────────────────────────────────────────────────

  it('renders badge text for Agent-First card', () => {
    mockDims(1280);
    render(<FeaturesSection />);
    expect(screen.getByText('ReAct, Plan-and-Execute, Multi-agent')).toBeInTheDocument();
  });

  it('renders badge text for community card', () => {
    mockDims(1280);
    render(<FeaturesSection />);
    expect(screen.getByText('2,400+ active members')).toBeInTheDocument();
  });

  // ── responsive ───────────────────────────────────────────────────────────

  it('renders all 6 cards on mobile without crashing', () => {
    mockDims(375);
    render(<FeaturesSection />);
    expect(screen.getByText('Flexible Pace')).toBeInTheDocument();
  });

  it('renders correctly at tablet width', () => {
    mockDims(768);
    expect(() => render(<FeaturesSection />)).not.toThrow();
  });
});
