import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Footer from '../components/Footer';

const setWidth = (w: number) => {
  Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: w });
  act(() => { window.dispatchEvent(new Event('resize')); });
};

beforeEach(() => setWidth(1280));

describe('Footer', () => {
  // ── brand ─────────────────────────────────────────────────────────────────

  it('renders the brand name', () => {
    render(<Footer />);
    expect(screen.getByText('AGENTIC')).toBeInTheDocument();
    expect(screen.getByText('DEV STUDIO')).toBeInTheDocument();
  });

  it('renders the brand tagline', () => {
    render(<Footer />);
    expect(screen.getByText(/world's first EdTech platform/i)).toBeInTheDocument();
  });

  // ── link sections ─────────────────────────────────────────────────────────

  it('renders all link section headings on desktop', () => {
    render(<Footer />);
    ['Courses', 'Company', 'Community', 'Legal'].forEach((section) => {
      expect(screen.getAllByText(section).length).toBeGreaterThanOrEqual(1);
    });
  });

  it('renders course links', () => {
    render(<Footer />);
    expect(screen.getByText('Foundations')).toBeInTheDocument();
    expect(screen.getByText('Multi-Agent Systems')).toBeInTheDocument();
    expect(screen.getByText('Production AI')).toBeInTheDocument();
    expect(screen.getByText('All Courses')).toBeInTheDocument();
  });

  it('renders company links', () => {
    render(<Footer />);
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Careers')).toBeInTheDocument();
  });

  it('renders legal links', () => {
    render(<Footer />);
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
  });

  // ── social buttons ────────────────────────────────────────────────────────

  it('renders all social icon buttons', () => {
    render(<Footer />);
    ['X', 'GH', 'LI', 'YT'].forEach((s) => {
      expect(screen.getByText(s)).toBeInTheDocument();
    });
  });

  // ── bottom bar ────────────────────────────────────────────────────────────

  it('renders copyright notice', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2026 AGENTIC DEV STUDIO/)).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
  });

  it('renders the operational status badge', () => {
    render(<Footer />);
    expect(screen.getByText('All systems operational')).toBeInTheDocument();
  });

  // ── responsive ───────────────────────────────────────────────────────────

  it('renders without crash on mobile (hides link grid)', () => {
    setWidth(375);
    expect(() => render(<Footer />)).not.toThrow();
    expect(screen.getByText(/© 2026 AGENTIC DEV STUDIO/)).toBeInTheDocument();
  });

  it('renders brand elements on mobile', () => {
    setWidth(375);
    render(<Footer />);
    expect(screen.getByText('AGENTIC')).toBeInTheDocument();
  });
});
