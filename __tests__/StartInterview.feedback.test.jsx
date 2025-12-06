// __tests__/StartInterview.feedback.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StartInterview from '@/app/interview/[interview_id]/start/page';
import { InterviewDataContext } from '@/context/interviewDataContext';

// Mock navigation
const mockReplace = jest.fn();
const mockUseParams = jest.fn(() => ({ interview_id: 'test-id' }));
jest.mock('next/navigation', () => ({
  useParams: () => ({ interview_id: 'test-id' }),
  useRouter: () => ({ replace: mockReplace }),
}));

// Mock Vapi class
jest.mock('@vapi-ai/web', () => {
  return jest.fn().mockImplementation(() => {
    const handlers = {};
    return {
      on: (ev, fn) => {
        handlers[ev] = handlers[ev] || [];
        handlers[ev].push(fn);
      },
      off: (ev, fn) => {
        handlers[ev] = (handlers[ev] || []).filter(f => f !== fn);
      },
      start: jest.fn(() => Promise.resolve()),
      stop: jest.fn(() => Promise.resolve()),
      __emit: (ev, payload) => {
        (handlers[ev] || []).forEach(fn => fn(payload));
      }
    };
  });
});


// Mock axios
jest.mock('axios');
import axios from 'axios';

// Mock supabase
jest.mock('@/services/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({ error: null })),
      select: () => ({ eq: () => Promise.resolve({ data: [{}] }) }),
    })),
  },
}));

// Silence toast
jest.mock('sonner', () => ({ toast: jest.fn(), toastFn: {} }));

describe('StartInterview - feedback paths', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const ctxValue = {
    interviewInfo: {
      userName: 'Jane Tester',
      userEmail: 'jane@test.com',
      interviewData: { jobPosition: 'Dev', questionList: [] },
    },
    setInterviewInfo: jest.fn(),
  };

  test('GenerateFeedback no content - logs and does not navigate', async () => {
    // axios returns empty content
    axios.post.mockResolvedValueOnce({ data: { content: '' } });

    render(
      <InterviewDataContext.Provider value={ctxValue}>
        <StartInterview />
      </InterviewDataContext.Provider>
    );

    // start the call to set up state that allows stopping
    const startBtn = await screen.findByRole('button', { name: /start interview/i });
    fireEvent.click(startBtn);

    // wait for StartInterview to call vapi.start and show call started text
    await waitFor(() => screen.getByText(/Interview in Progress.../i));

    // open stop dialog (AlertConfirmation uses a trigger around the Phone icon)
    const originalConsoleError = console.error
    console.error = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('Function components cannot be given refs')) {
        return
      }
      originalConsoleError(...args)
    }

    const trigger = document.querySelector('[data-slot="alert-dialog-trigger"]') || startBtn
    fireEvent.click(trigger)

    // click Continue in the dialog (find by visible text)
    const continueBtn = await screen.findByText(/continue/i)
    fireEvent.click(continueBtn)

    // restore console
    console.error = originalConsoleError

    // ensure axios.post was called and router.replace was NOT called
    await waitFor(() => expect(axios.post).toHaveBeenCalledWith('/api/ai-feedback', { conversation: '' }));
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('GenerateFeedback parse error - logs and does not navigate', async () => {
    // axios returns invalid JSON
    axios.post.mockResolvedValueOnce({ data: { content: '```json invalid' } });

    render(
      <InterviewDataContext.Provider value={ctxValue}>
        <StartInterview />
      </InterviewDataContext.Provider>
    );

    const startBtn = await screen.findByRole('button', { name: /start interview/i });
    fireEvent.click(startBtn);

    await waitFor(() => screen.getByText(/Interview in Progress.../i));

    const originalConsoleError = console.error
    console.error = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('Function components cannot be given refs')) {
        return
      }
      originalConsoleError(...args)
    }

    const trigger = document.querySelector('[data-slot="alert-dialog-trigger"]') || startBtn
    fireEvent.click(trigger)

    const continueBtn = await screen.findByText(/continue/i)
    fireEvent.click(continueBtn)

    console.error = originalConsoleError

    // axios called
    await waitFor(() => expect(axios.post).toHaveBeenCalled());

    // router.replace should not be called because JSON.parse will fail and be caught
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
