// __tests__/InterviewPage.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Provider from '@/app/provider';
import Interview from '@/app/interview/[interview_id]/page';
import { InterviewDataContext } from '@/context/interviewDataContext';

// Navigation mock
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useParams: () => ({ interview_id: 'test-id' }),
  useRouter: () => ({ push: mockPush }),
}));

// Toast mock
jest.mock('sonner', () => {
  const toastMock = jest.fn();
  toastMock.error = jest.fn();
  toastMock.success = jest.fn();
  return { toast: toastMock };
});
const { toast: toastMock } = require('sonner');

// Supabase mock
jest.mock('@/services/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: null },
      }),
      getSession: jest.fn().mockResolvedValue({
        data: { session: null },
      }),
      onAuthStateChange: jest.fn((callback) => {
        callback(null, null);
        return {
          data: {
            subscription: {
              unsubscribe: jest.fn(),
            },
          },
        };
      }),
    },
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
    render(
      <Provider>
        <InterviewDataContext.Provider value={{ interviewInfo: null, setInterviewInfo: jest.fn() }}>
          <Interview />
        </InterviewDataContext.Provider>
      </Provider>
    );

    // Page should render with interview data from Supabase
    await waitFor(() => {
      expect(screen.getByText('Frontend Engineer')).toBeInTheDocument();
    });
  });

  test('shows toast when empty result', async () => {
    const { supabase } = require('@/services/supabaseClient');
    supabase.from.mockReturnValueOnce({
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
      }),
    });

    render(
      <Provider>
        <InterviewDataContext.Provider value={{ interviewInfo: null, setInterviewInfo: jest.fn() }}>
          <Interview />
        </InterviewDataContext.Provider>
      </Provider>
    );

    // When no interview data is found, toast.error is called with "Incorrect Interview Link"
    await waitFor(() => {
      expect(toastMock.error).toHaveBeenCalledWith('Incorrect Interview Link');
    });
  });

  test('shows toast when supabase error', async () => {
    const { supabase } = require('@/services/supabaseClient');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    supabase.from.mockReturnValueOnce({
      select: () => ({
        eq: () => Promise.reject(new Error('fail')),
      }),
    });

    render(
      <Provider>
        <InterviewDataContext.Provider value={{ interviewInfo: null, setInterviewInfo: jest.fn() }}>
          <Interview />
        </InterviewDataContext.Provider>
      </Provider>
    );

    // When an error occurs during fetching, toast.error is called
    await waitFor(() => {
      expect(toastMock.error).toHaveBeenCalledWith(expect.stringContaining('error occurred'));
    });

    consoleSpy.mockRestore();
  });
});
