
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ManageSubscription from '@/app/(main)/manage-subscription/page';

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, className }) => <button className={className}>{children}</button>,
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Check: () => <span>Check</span>,
  X: () => <span>X</span>,
  ChevronDown: () => <span>ChevronDown</span>,
  ChevronUp: () => <span>ChevronUp</span>,
  MessageCircle: () => <span>MessageCircle</span>,
  BookOpen: () => <span>BookOpen</span>,
  Zap: () => <span>Zap</span>,
  ShieldCheck: () => <span>ShieldCheck</span>,
  Building2: () => <span>Building2</span>,
  Clock: () => <span>Clock</span>,
  ArrowRight: () => <span>ArrowRight</span>,
}));

// Mock Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} alt={props.alt} />,
}));

describe('ManageSubscription', () => {
  it('renders the subscription page', () => {
    render(<ManageSubscription />);
    expect(screen.getByText('Manage Subscription')).toBeInTheDocument();
  });

  it('renders plan options', () => {
    render(<ManageSubscription />);
    expect(screen.getByText('Starter')).toBeInTheDocument();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('Yearly')).toBeInTheDocument();
  });

  it('shows SAVE 20% badge on Yearly plan', () => {
    render(<ManageSubscription />);
    expect(screen.getByText('SAVE 20%')).toBeInTheDocument();
  });
});
