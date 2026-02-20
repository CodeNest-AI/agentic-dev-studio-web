import React from 'react';
import { render, screen } from '@testing-library/react';
import CoursesSection from '../components/CoursesSection';

const mockUseWindowDimensions = jest.fn();
jest.mock('react-native-web', () => ({
  ...jest.requireActual('react-native-web'),
  useWindowDimensions: () => mockUseWindowDimensions(),
}));

const mockDims = (width: number) =>
  mockUseWindowDimensions.mockReturnValue({ width, height: 900, scale: 1, fontScale: 1 });

describe('CoursesSection', () => {
  // ── section header ────────────────────────────────────────────────────────

  it('renders the CURRICULUM section label', () => {
    mockDims(1280);
    render(<CoursesSection />);
    expect(screen.getByText('CURRICULUM')).toBeInTheDocument();
  });

  it('renders the section headline', () => {
    mockDims(1280);
    render(<CoursesSection />);
    expect(screen.getByText(/Three tracks/i)).toBeInTheDocument();
    expect(screen.getByText(/One clear path/i)).toBeInTheDocument();
  });

  // ── course cards ──────────────────────────────────────────────────────────

  it('renders Foundations of Agentic AI course', () => {
    mockDims(1280);
    render(<CoursesSection />);
    expect(screen.getByText('Foundations of Agentic AI')).toBeInTheDocument();
  });

  it('renders Multi-Agent Systems course', () => {
    mockDims(1280);
    render(<CoursesSection />);
    expect(screen.getByText('Multi-Agent Systems')).toBeInTheDocument();
  });

  it('renders Production AI Engineering course', () => {
    mockDims(1280);
    render(<CoursesSection />);
    expect(screen.getByText('Production AI Engineering')).toBeInTheDocument();
  });

  // ── course metadata ───────────────────────────────────────────────────────

  it('shows correct durations for all courses', () => {
    mockDims(1280);
    render(<CoursesSection />);
    expect(screen.getByText('8 weeks')).toBeInTheDocument();
    expect(screen.getByText('12 weeks')).toBeInTheDocument();
    expect(screen.getByText('16 weeks')).toBeInTheDocument();
  });

  it('shows correct levels for all courses', () => {
    mockDims(1280);
    render(<CoursesSection />);
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  // ── pricing ───────────────────────────────────────────────────────────────

  it('shows Free pricing for the Foundations course', () => {
    mockDims(1280);
    render(<CoursesSection />);
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('shows $299 pricing for Multi-Agent Systems', () => {
    mockDims(1280);
    render(<CoursesSection />);
    expect(screen.getByText('$299')).toBeInTheDocument();
  });

  it('shows $599 pricing for Production AI Engineering', () => {
    mockDims(1280);
    render(<CoursesSection />);
    expect(screen.getByText('$599')).toBeInTheDocument();
  });

  // ── CTA buttons ───────────────────────────────────────────────────────────

  it('renders 3 Enroll Now buttons (one per course)', () => {
    mockDims(1280);
    render(<CoursesSection />);
    const enrollButtons = screen.getAllByText('Enroll Now');
    expect(enrollButtons).toHaveLength(3);
  });

  // ── course topics ─────────────────────────────────────────────────────────

  it('renders course topics for Foundations', () => {
    mockDims(1280);
    render(<CoursesSection />);
    expect(screen.getByText('LLM fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Memory systems')).toBeInTheDocument();
  });

  it('renders course topics for Multi-Agent Systems', () => {
    mockDims(1280);
    render(<CoursesSection />);
    expect(screen.getByText('Agent orchestration')).toBeInTheDocument();
    expect(screen.getByText('LangGraph & CrewAI')).toBeInTheDocument();
  });

  it('renders MOST POPULAR badge on the featured course', () => {
    mockDims(1280);
    render(<CoursesSection />);
    expect(screen.getByText('MOST POPULAR')).toBeInTheDocument();
  });

  // ── responsive ───────────────────────────────────────────────────────────

  it('renders without crash on mobile', () => {
    mockDims(375);
    expect(() => render(<CoursesSection />)).not.toThrow();
    expect(screen.getByText('Foundations of Agentic AI')).toBeInTheDocument();
  });
});
