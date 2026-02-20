import React from 'react';
import { render, screen } from '@testing-library/react';
import CTASection from '../components/CTASection';

const mockUseWindowDimensions = jest.fn();
jest.mock('react-native-web', () => ({
  ...jest.requireActual('react-native-web'),
  useWindowDimensions: () => mockUseWindowDimensions(),
}));

const mockDims = (width: number) =>
  mockUseWindowDimensions.mockReturnValue({ width, height: 900, scale: 1, fontScale: 1 });

describe('CTASection', () => {
  it('renders the pre-title label', () => {
    mockDims(1280);
    render(<CTASection />);
    expect(screen.getByText('READY TO BUILD?')).toBeInTheDocument();
  });

  it('renders the section headline', () => {
    mockDims(1280);
    render(<CTASection />);
    expect(screen.getByText(/Start your agentic/i)).toBeInTheDocument();
    expect(screen.getByText(/journey today/i)).toBeInTheDocument();
  });

  it('renders the supporting subtitle text', () => {
    mockDims(1280);
    render(<CTASection />);
    expect(screen.getByText(/2,400\+ developers/)).toBeInTheDocument();
    expect(screen.getByText(/First module is completely free/i)).toBeInTheDocument();
  });

  it('renders the email input placeholder', () => {
    mockDims(1280);
    render(<CTASection />);
    expect(screen.getByText('your@email.com')).toBeInTheDocument();
  });

  it('renders the CTA button', () => {
    mockDims(1280);
    render(<CTASection />);
    expect(screen.getByText(/Get Free Access/)).toBeInTheDocument();
  });

  it('renders the fine print with no credit card message', () => {
    mockDims(1280);
    render(<CTASection />);
    // The full fine print is a single text node — query by partial text with getAllByText
    const finePrint = screen.getAllByText(/No credit card/i);
    expect(finePrint.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Cancel anytime/i).length).toBeGreaterThan(0);
  });

  it('renders without crash on mobile', () => {
    mockDims(375);
    expect(() => render(<CTASection />)).not.toThrow();
    expect(screen.getByText(/Get Free Access/)).toBeInTheDocument();
  });
});
