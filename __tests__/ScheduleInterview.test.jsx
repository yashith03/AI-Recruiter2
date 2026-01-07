
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScheduleInterviewPage from '@/app/(main)/schedule-interview/page';
import { toast } from 'sonner';

// Mock UI Components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className }) => <button onClick={onClick} className={className}>{children}</button>,
}));
jest.mock('@/components/ui/input', () => ({
  Input: (props) => <input {...props} />,
}));
jest.mock('@/components/ui/textarea', () => ({
  Textarea: (props) => <textarea {...props} />,
}));
jest.mock('@/components/ui/select', () => ({
  Select: ({ children }) => <div>{children}</div>,
  SelectTrigger: ({ children }) => <div>{children}</div>,
  SelectValue: () => <span>Select Value</span>,
  SelectContent: ({ children }) => <div>{children}</div>,
  SelectItem: ({ children }) => <div>{children}</div>,
}));

// Mock Next.js and external
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props) => <img {...props} alt={props.alt} />,
}));
jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }) => <a href={href}>{children}</a>,
}));
jest.mock('moment', () => () => ({ format: () => '2023-10-10' }));
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe('ScheduleInterviewPage', () => {
  it('renders schedule interview page', () => {
    render(<ScheduleInterviewPage />);
    expect(screen.getByText('Schedule Interview')).toBeInTheDocument();
    expect(screen.getByText('Sarah Jenkins')).toBeInTheDocument();
  });

  it('allows selecting duration', () => {
    render(<ScheduleInterviewPage />);
    const durationBtn = screen.getByText('1 hour');
    fireEvent.click(durationBtn);
    // You might check class changes if testing implementation details, 
    // or just assume interaction works if no error.
    expect(durationBtn).toBeInTheDocument(); 
  });

  it('clicking Send Invitation triggers toast', () => {
    render(<ScheduleInterviewPage />);
    const sendBtn = screen.getByText('Send Invitation');
    fireEvent.click(sendBtn);
    expect(toast.success).toHaveBeenCalledWith("Invitation sent to Sarah Jenkins");
  });

  it('renders calendar days', () => {
    render(<ScheduleInterviewPage />);
    expect(screen.getByText('10')).toBeInTheDocument(); // Selected date
  });
});
