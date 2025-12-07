// __tests__/InterviewPage.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import Interview from '@/app/interview/[interview_id]/page';
import { InterviewDataContext } from '@/context/interviewDataContext';

// Navigation mock
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useParams: () => ({ interview_id: 'test-id' }),
  useRouter: () => ({ push: mockPush }),
}));

// Toast mock
jest.mock('sonner', () => ({ toast: jest.fn() }));
const { toast: toastMock } = require('sonner');

// Supabase mock
jest.mock('@/services/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: () => ({
        eq: () =>
          Promise.resolve({
            data: [
              {
                jobPosition: 'Frontend Engineer',
                duration: '30 Min',
                type: ['Video Interview'],
              },
            ],
            error: null,
          }),
      }),
    })),
  },
}));

describe('Interview page', () => {
  beforeEach(() => jest.clearAllMocks());

  test('allows typing and joining interview', async () => {
    const setInterviewInfo = jest.fn();

    render(
      <InterviewDataContext.Provider value={{ interviewInfo: null, setInterviewInfo }}>
        <Interview />
      </InterviewDataContext.Provider>
    );

    await waitFor(() => screen.getByText('Frontend Engineer'));

    fireEvent.change(screen.getByPlaceholderText('e.g. John Doe'), {
      target: { value: 'Jane Tester' },
    });

    fireEvent.click(screen.getByRole('button', { name: /join interview/i }));

    await waitFor(() => expect(setInterviewInfo).toHaveBeenCalled());
  });

  test('shows toast when empty result', async () => {
    const { supabase } = require('@/services/supabaseClient');
    supabase.from.mockReturnValueOnce({
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
      }),
    });

    render(
      <InterviewDataContext.Provider value={{ interviewInfo: null, setInterviewInfo: jest.fn() }}>
        <Interview />
      </InterviewDataContext.Provider>
    );

    await waitFor(() => expect(toastMock).toHaveBeenCalledWith('Incorrect Interview Link'));
  });

  test('shows toast when supabase error', async () => {
    const { supabase } = require('@/services/supabaseClient');
    supabase.from.mockReturnValueOnce({
      select: () => ({
        eq: () => Promise.reject(new Error('fail')),
      }),
    });

    render(
      <InterviewDataContext.Provider value={{ interviewInfo: null, setInterviewInfo: jest.fn() }}>
        <Interview />
      </InterviewDataContext.Provider>
    );

    await waitFor(() => expect(toastMock).toHaveBeenCalledWith('Incorrect Interview Link'));
  });
});
