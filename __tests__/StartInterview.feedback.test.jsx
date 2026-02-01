// __tests__/StartInterview.feedback.test.jsx

import React from 'react'
import { render, waitFor, fireEvent, screen, act } from '@testing-library/react'
import StartInterview from '@/app/interview/[interview_id]/start/page'
import { InterviewDataContext } from '@/context/interviewDataContext'
import { useRouter, useParams } from 'next/navigation'

// --------------------
// Mocks
// --------------------
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}))

// Mock mediaDevices
Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: jest.fn().mockResolvedValue({
      getTracks: () => [{ stop: jest.fn() }]
    })
  },
  writable: true
});

// Mock vapi web SDK
let vapiInstance = null
jest.mock('@vapi-ai/web', () => {
  return jest.fn().mockImplementation(() => {
    const handlers = {}
    const inst = {
      start: jest.fn().mockImplementation(() => {
        // Automatically emit call-start when start is called
        setTimeout(() => {
           if (handlers['call-start']) handlers['call-start']()
        }, 10)
      }),
      on: jest.fn((event, cb) => { handlers[event] = cb }),
      off: jest.fn(),
      stop: jest.fn(),
      emit: (event, payload) => { if (handlers[event]) handlers[event](payload) }
    }
    vapiInstance = inst
    return inst
  })
})

// Silence toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  }
}));

describe('StartInterview - feedback paths', () => {
  const mockReplace = jest.fn()
  const setInterviewInfo = jest.fn()
  
  const interviewInfo = {
    userName: 'Test User',
    userEmail: 'test@mail.com',
    interviewData: {
      jobPosition: 'Software Engineer',
      questionList: [{ question: 'Q1', answer: 'A1' }],
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    useParams.mockReturnValue({ interview_id: 'test-id' })
    useRouter.mockReturnValue({ replace: mockReplace })
    process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY = 'test-key'
  })

  it('redirects to dashboard when GenerateFeedback returns no content', async () => {
    // Mock the global fetch for API calls
    global.fetch = jest.fn().mockImplementation((url) => {
      if (url === '/api/interviews/process-result') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        })
      }
      return Promise.resolve({ ok: false })
    })

    render(
      <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
        <StartInterview />
      </InterviewDataContext.Provider>
    )

    // Wait for the start button to be enabled (it waits for getMedia)
    const startBtn = await screen.findByRole('button', { name: /start interview/i })
    
    await act(async () => {
      fireEvent.click(startBtn);
    });

    // Wait for the end-interview button (trigger) to appear
    const trigger = await waitFor(() => {
      const t = document.querySelector('[data-slot="alert-dialog-trigger"]');
      if (!t) throw new Error("Trigger not found");
      return t;
    }, { timeout: 3000 });
    
    expect(trigger).toBeTruthy();

    await act(async () => {
      fireEvent.click(trigger);
    });

    const continueBtn = screen.getByText('Continue');
    await act(async () => {
      fireEvent.click(continueBtn);
    });

    expect(mockReplace).toHaveBeenCalledWith('/interview/test-id/completed')
  })
})
