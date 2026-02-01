// __tests__/StartInterview.test.jsx

import React from 'react'
import { render, waitFor, fireEvent, screen, act } from '@testing-library/react'
import StartInterview from '@/app/interview/[interview_id]/start/page'
import { InterviewDataContext } from '@/context/interviewDataContext'
import { useRouter } from 'next/navigation'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useParams: () => ({ interview_id: 'test-id' }),
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
        return Promise.resolve()
      }),
      on: (event, cb) => { handlers[event] = cb },
      off: (event, cb) => { if (handlers[event] === cb) delete handlers[event] },
      stop: jest.fn(),
      emit: (event, payload) => { if (handlers[event]) handlers[event](payload) }
    }
    vapiInstance = inst
    return inst
  })
})

jest.mock('sonner', () => {
  const mock = jest.fn();
  mock.success = jest.fn();
  mock.error = jest.fn();
  return {
    toast: mock
  }
})

describe('StartInterview', () => {
  const mockPush = jest.fn()
  const mockReplace = jest.fn()
  const setInterviewInfo = jest.fn()
  const interviewInfo = {
    userName: 'Alice',
    userEmail: 'alice@test.com',
    interviewData: {
      jobPosition: 'Frontend Engineer',
      questionList: [{ question: 'What is React?' }],
    },
  }

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockPush, replace: mockReplace })
    jest.clearAllMocks()
    process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY = 'test-key'
  })

  it('starts the interview call when Start button is clicked', async () => {
    render(
      <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
        <StartInterview />
      </InterviewDataContext.Provider>
    )

    // Wait for the button to be enabled (media stream loaded)
    const startBtn = await waitFor(() => {
      const btn = screen.getByRole('button', { name: /start interview/i })
      if (btn.disabled) throw new Error("Button still disabled")
      return btn
    })
    
    fireEvent.click(startBtn)

    await waitFor(() => {
      expect(vapiInstance.start).toHaveBeenCalled()
    })
  })

  it('redirects to completed page instantly when End Interview is clicked', async () => {
    render(
      <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
        <StartInterview />
      </InterviewDataContext.Provider>
    )

    const startBtn = await waitFor(() => {
        const btn = screen.getByRole('button', { name: /start interview/i })
        if (btn.disabled) throw new Error("Button still disabled")
        return btn
    })
    fireEvent.click(startBtn)
    
    // Trigger the "End Interview" button
    const endBtn = await screen.findByRole('button', { name: /end interview/i })
    fireEvent.click(endBtn)

    // Click Continue in the alert dialog
    const continueBtn = await screen.findByText('Continue')
    fireEvent.click(continueBtn)

    // Verify immediate redirect
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/interview/test-id/completed')
    }, { timeout: 3000 })
    
    // Verify context hand-off
    expect(setInterviewInfo).toHaveBeenCalledWith(expect.any(Function))
  })

  it('handles Vapi call-ended event by redirecting', async () => {
    render(
      <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
        <StartInterview />
      </InterviewDataContext.Provider>
    )

    const startBtn = await waitFor(() => {
        const btn = screen.getByRole('button', { name: /start interview/i })
        if (btn.disabled) throw new Error("Button still disabled")
        return btn
    })
    fireEvent.click(startBtn)
    
    // Manually emit the event from the mock
    await act(async () => {
      vapiInstance.emit('call-ended')
    })

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/interview/test-id/completed')
    })
  })
})
