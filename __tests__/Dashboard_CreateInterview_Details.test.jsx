
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InterviewDetailsPage from '@/app/(main)/dashboard/create-interview/[interview_id]/details/page';

// Mock mocks
jest.mock('next/navigation', () => ({
  useParams: () => ({ interview_id: '123' }),
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, className }) => (
    <button onClick={onClick} className={className} data-variant={variant}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props) => <input {...props} role="textbox" />,
}));

jest.mock('@/components/ui/textarea', () => ({
  Textarea: (props) => <textarea {...props} />,
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, defaultValue }) => <div data-testid="select" data-default={defaultValue}>{children}</div>,
  SelectTrigger: ({ children }) => <div>{children}</div>,
  SelectValue: () => <span>Select Value</span>,
  SelectContent: ({ children }) => <div>{children}</div>,
  SelectItem: ({ children, value }) => <option value={value}>{children}</option>,
}));

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }) => (open ? <div data-testid="dialog">{children}</div> : null),
  DialogContent: ({ children }) => <div>{children}</div>,
}));

describe('InterviewDetailsPage', () => {
  it('renders interview details form', () => {
    render(<InterviewDetailsPage />);
    
    expect(screen.getByText('Edit Interview')).toBeInTheDocument();
    expect(screen.getByText('General Information')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Senior Frontend Developer - Q3')).toBeInTheDocument();
  });

  it('updates form fields', () => {
    render(<InterviewDetailsPage />);
    
    const nameInput = screen.getByDisplayValue('Senior Frontend Developer - Q3');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    expect(nameInput.value).toBe('New Name');
  });

  it('shows success modal on save', async () => {
    render(<InterviewDetailsPage />);
    
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Changes saved successfully!')).toBeInTheDocument();
    });
  });
});
