import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Navbar from '../components/Navbar';

const setWidth = (w: number) => {
  Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: w });
  act(() => { window.dispatchEvent(new Event('resize')); });
};

beforeEach(() => setWidth(1280));

describe('Navbar', () => {
  // ── branding ─────────────────────────────────────────────────────────────

  it('renders the brand name AGENTIC', () => {
    render(<Navbar />);
    expect(screen.getByText('AGENTIC')).toBeInTheDocument();
  });

  it('renders the brand sub-label DEV STUDIO', () => {
    render(<Navbar />);
    expect(screen.getByText('DEV STUDIO')).toBeInTheDocument();
  });

  // ── desktop nav ───────────────────────────────────────────────────────────

  it('renders all nav links on desktop', () => {
    render(<Navbar />);
    ['Courses', 'Features', 'Community', 'About'].forEach((link) => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  it('renders the Get Started CTA button on desktop', () => {
    render(<Navbar />);
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  // ── mobile nav ────────────────────────────────────────────────────────────

  it('hides nav links on mobile', () => {
    setWidth(375);
    render(<Navbar />);
    expect(screen.queryByText('Courses')).not.toBeInTheDocument();
  });

  it('opens mobile menu when hamburger is pressed', () => {
    setWidth(375);
    render(<Navbar />);
    expect(screen.queryByText('Courses')).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('hamburger'));
    expect(screen.getByText('Courses')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
  });

  it('shows Get Started inside mobile menu after open', () => {
    setWidth(375);
    render(<Navbar />);
    fireEvent.click(screen.getByTestId('hamburger'));
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('toggles mobile menu closed on second press', () => {
    setWidth(375);
    render(<Navbar />);
    fireEvent.click(screen.getByTestId('hamburger'));
    expect(screen.getByText('Courses')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('hamburger'));
    expect(screen.queryByText('Courses')).not.toBeInTheDocument();
  });
});
