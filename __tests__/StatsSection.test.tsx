import React from 'react';
import { render, screen } from '@testing-library/react';
import StatsSection from '../components/StatsSection';

const mockUseWindowDimensions = jest.fn();
jest.mock('react-native-web', () => ({
  ...jest.requireActual('react-native-web'),
  useWindowDimensions: () => mockUseWindowDimensions(),
}));

const mockDims = (width: number) =>
  mockUseWindowDimensions.mockReturnValue({ width, height: 900, scale: 1, fontScale: 1 });

describe('StatsSection', () => {
  it('renders the student count stat', () => {
    mockDims(1280);
    render(<StatsSection />);
    expect(screen.getByText('2,400+')).toBeInTheDocument();
    expect(screen.getByText('Active Students')).toBeInTheDocument();
    expect(screen.getByText('across 60+ countries')).toBeInTheDocument();
  });

  it('renders the completion rate stat', () => {
    mockDims(1280);
    render(<StatsSection />);
    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
    expect(screen.getByText('industry avg is 12%')).toBeInTheDocument();
  });

  it('renders the courses stat', () => {
    mockDims(1280);
    render(<StatsSection />);
    expect(screen.getByText('40+')).toBeInTheDocument();
    expect(screen.getByText('Courses & Modules')).toBeInTheDocument();
    expect(screen.getByText('updated every 6 weeks')).toBeInTheDocument();
  });

  it('renders the project-based stat', () => {
    mockDims(1280);
    render(<StatsSection />);
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Project-Based')).toBeInTheDocument();
    expect(screen.getByText('no passive video watching')).toBeInTheDocument();
  });

  it('renders all 4 stats', () => {
    mockDims(1280);
    render(<StatsSection />);
    expect(screen.getAllByText(/Active Students|Completion Rate|Courses & Modules|Project-Based/)).toHaveLength(4);
  });

  it('renders correctly on mobile', () => {
    mockDims(375);
    expect(() => render(<StatsSection />)).not.toThrow();
    expect(screen.getByText('2,400+')).toBeInTheDocument();
  });
});
