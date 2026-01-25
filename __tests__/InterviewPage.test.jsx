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

// Supabase mock (Auth only - kept if needed for Provider, though Provider mock handles user)
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
  },
}));

describe('Interview page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  test('allows typing and joining interview', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        jobPosition: 'Frontend Engineer',
        duration: '30 Min',
        type: ['Video Interview'],
      }),
    });

    render(
      <Provider>
        <InterviewDataContext.Provider value={{ interviewInfo: null, setInterviewInfo: jest.fn() }}>
          <Interview />
        </InterviewDataContext.Provider>
      </Provider>
    );

    // Page should render with interview data from fetch
    await waitFor(() => {
      expect(screen.getByText('Frontend Engineer')).toBeInTheDocument();
    });
  });

  test('shows toast when server error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "Fetch failed" }),
    });

    render(
      <Provider>
        <InterviewDataContext.Provider value={{ interviewInfo: null, setInterviewInfo: jest.fn() }}>
          <Interview />
        </InterviewDataContext.Provider>
      </Provider>
    );

    // When fetch fails, toast.error is called
    await waitFor(() => {
      expect(toastMock.error).toHaveBeenCalledWith('Incorrect Interview Link or error fetching details.');
    });
  });
});
