// __tests__/StartInterview.feedback.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import StartInterview from '@/app/interview/[interview_id]/start/page';
import { InterviewDataContext } from '@/context/interviewDataContext';

// --------------------
// Mock navigation
// --------------------
const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useParams: () => ({ interview_id: 'test-id' }),
  useRouter: () => ({ replace: mockReplace }),
}));

// --------------------
// Mock Vapi
// --------------------
let vapiInstance;

jest.mock('@vapi-ai/web', () => {
  return jest.fn().mockImplementation(() => {
    const handlers = {};

    vapiInstance = {
      on: (event, cb) => {
        handlers[event] = handlers[event] || [];
        handlers[event].push(cb);
      },
      off: jest.fn(),
      start: jest.fn(() => Promise.resolve()),
      stop: jest.fn(() => Promise.resolve()),
      __emit: (event, payload) => {
        (handlers[event] || []).forEach(cb => cb(payload));
      },
    };

    return vapiInstance;
  });
});

// --------------------
// Mock axios
// --------------------
jest.mock('axios');
import axios from 'axios';

// --------------------
// Mock supabase
// --------------------
jest.mock('@/services/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({ error: null })),
    })),
  },
}));

// --------------------
// Silence toast
// --------------------
jest.mock('sonner', () => ({
  toast: jest.fn(),
}));

describe('StartInterview - feedback paths', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY = 'test-key';
  });

  const ctxValue = {
    interviewInfo: {
      userName: 'Jane Tester',
      userEmail: 'jane@test.com',
      interviewData: {
        jobPosition: 'Dev',
        questionList: [],
      },
    },
    setInterviewInfo: jest.fn(),
  };

  test('GenerateFeedback no content - redirects to dashboard', async () => {
    // axios returns empty content
    axios.post.mockResolvedValueOnce({
      data: { content: '' },
    });

    render(
      <InterviewDataContext.Provider value={ctxValue}>
        <StartInterview />
      </InterviewDataContext.Provider>
    );

    // --------------------
    // Start interview
    // --------------------
    const startBtn = await screen.findByRole('button', {
      name: /start interview/i,
    });

    await act(async () => {
      fireEvent.click(startBtn);
    });

    await screen.findByText(/interview in progress/i);

    // --------------------
    // End interview via alert dialog
    // --------------------
    const trigger = document.querySelector('[data-slot="alert-dialog-trigger"]');
    expect(trigger).toBeTruthy();

    await act(async () => {
      fireEvent.click(trigger);
    });

    const continueBtn = await screen.findByText(/continue/i);

    await act(async () => {
      fireEvent.click(continueBtn);
    });

    // --------------------
    // Emit Vapi call-ended event
    // --------------------
    await act(async () => {
      vapiInstance.__emit('call-ended');
    });

    // --------------------
    // Assertions
    // --------------------

    // axios should NOT be called
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });

    // Redirect must happen
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/interview/test-id/completed');
    });
  });
});
