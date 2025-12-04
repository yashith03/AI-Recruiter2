import React from 'react'
import { render, waitFor } from '@testing-library/react'
import StartInterview from '@/app/interview/[interview_id]/start/page'
import { InterviewDataContext } from '@/context/interviewDataContext'

// Mock vapi web SDK
jest.mock('@vapi-ai/web', () => {
  return jest.fn().mockImplementation(() => {
    let handlers = {}
    let started = false
    return {
      start: jest.fn(() => {
        // mark that start was called; event handlers may be attached after start()
        started = true
      }),
      on: (event, cb) => {
        handlers[event] = cb
        // If start was already called before the handler was registered,
        // immediately invoke call-started to simulate the SDK behavior.
        if (event === 'call-started' && started) {
          try { cb() } catch (e) { /* swallow in test env */ }
        }
      },
      stop: jest.fn(),
    }
  })
})

// Mock axios
import axios from 'axios'
jest.mock('axios')

// Mock sonner toast
jest.mock('sonner', () => ({ toast: jest.fn() }))
import { toast } from 'sonner'

describe('StartInterview', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('starts the Vapi call and triggers toast on call-started', async () => {
    axios.post.mockResolvedValue({ data: { content: '```json{"feedback":"ok"}```' } })

    const interviewInfo = {
      userName: 'Alice',
      interviewData: {
        jobPosition: 'Frontend Engineer',
        questionList: [
          { question: 'What is React?' },
          { question: 'Explain hooks.' },
        ],
      },
    }

    const { container } = render(
      <InterviewDataContext.Provider value={{ interviewInfo }}>
        <StartInterview />
      </InterviewDataContext.Provider>
    )

    // Wait for the mocked vapi.start to cause the toast call
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('Call Connected...')
    })

    expect(container).toBeTruthy()
  })
})
