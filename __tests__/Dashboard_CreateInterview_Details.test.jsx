import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InterviewDetailsPage from '@/app/(main)/dashboard/create-interview/[interview_id]/details/page';
import { supabase } from '@/services/supabaseClient';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: () => ({ interview_id: '123' }),
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock Supabase
jest.mock('@/services/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              jobPosition: 'Senior Frontend Developer - Q3',
              jobDescription: 'Expert in React and testing',
              type: 'Technical',
              duration: '30m',
              questionList: [
                { id: 1, type: 'Technical', question: 'Explain React hooks' }
              ]
            },
            error: null
          })
        })
      }),
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null })
      })
    }))
  }
}));

// Mock shadcn components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, className, disabled }) => (
    <button onClick={onClick} className={className} data-variant={variant} disabled={disabled}>
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

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }) => (open ? <div data-testid="dialog">{children}</div> : null),
  DialogContent: ({ children }) => <div>{children}</div>,
  DialogHeader: ({ children }) => <div>{children}</div>,
  DialogTitle: ({ children }) => <div>{children}</div>,
  DialogDescription: ({ children }) => <div>{children}</div>,
}));

describe('InterviewDetailsPage', () => {
  it('renders interview details form after loading', async () => {
    render(<InterviewDetailsPage />);
    
    // Check for loading spinner first if possible, or just wait for load
    await waitFor(() => {
      expect(screen.getByText('Edit Interview')).toBeInTheDocument();
    });
    
    expect(screen.getByText('General Information')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Senior Frontend Developer - Q3')).toBeInTheDocument();
  });

  it('updates form fields in edit mode', async () => {
    render(<InterviewDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    // Enter edit mode
    fireEvent.click(screen.getByText('Edit'));
    
    const nameInput = screen.getByDisplayValue('Senior Frontend Developer - Q3');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    expect(nameInput.value).toBe('New Name');
  });

  it('shows success modal on save', async () => {
    render(<InterviewDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit'));
    
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Changes saved successfully!')).toBeInTheDocument();
    });
  });
});
