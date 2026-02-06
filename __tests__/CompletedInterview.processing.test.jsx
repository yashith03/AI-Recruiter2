// __tests__/CompletedInterview.processing.test.jsx

import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import InterviewComplete from '@/app/interview/[interview_id]/completed/page'
import { InterviewDataContext } from '@/context/interviewDataContext'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { supabase } from '@/services/supabaseClient'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}))

jest.mock('axios')
jest.mock('@/services/supabaseClient', () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn().mockResolvedValue({ error: null }),
      })),
    },
  },
}))

describe('InterviewComplete Background Processing', () => {
  const interview_id = 'test-id-completed'
  const mockInterviewInfo = {
    userName: 'Jane Done',
    userEmail: 'jane@done.com',
    conversation: [{ role: 'user', content: 'Final answer' }],
    videoBlob: new Blob(['test-video'], { type: 'video/webm' }),
  }

  beforeEach(() => {
    useParams.mockReturnValue({ interview_id })
    jest.clearAllMocks()
    
    // Mock fetch based on URL
    global.fetch = jest.fn((url) => {
      if (url.includes('/api/interviews/upload-recording')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ filePath: 'uploaded/path.webm' })
        })
      }
      
      if (url.includes('/feedback')) {
        const callCount = global.fetch.mock.calls.filter(c => c[0].includes('/feedback')).length;
        // Return data on the second call onwards to simulate polling delay
        const response = callCount > 1
          ? { pdf_url: 'http://pdf-link', interview_date: '2026-02-02' }
          : null;

        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(response)
        })
      }

      return Promise.reject(new Error(`Unhandled fetch URL: ${url}`));
    })
  })

  it('triggers background processing on mount if context has data', async () => {
    render(
      <InterviewDataContext.Provider value={{ interviewInfo: mockInterviewInfo }}>
        <InterviewComplete />
      </InterviewDataContext.Provider>
    )

    // Verify upload called via fetch (use stringContaining to be safe with localhost prefix)
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/interviews/upload-recording'),
        expect.any(Object)
      )
    }, { timeout: 3000 })

    // Verify process-result API called
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        '/api/interviews/process-result', 
        expect.objectContaining({
          interview_id,
          userName: 'Jane Done',
        })
      )
    }, { timeout: 3000 })

    // Verify status indicators show processing
    expect(screen.getByText(/Analyzing feedback/i)).toBeInTheDocument()
  })

  it('polls for status until PDF is ready', async () => {
    render(
      <InterviewDataContext.Provider value={{ interviewInfo: mockInterviewInfo }}>
        <InterviewComplete />
      </InterviewDataContext.Provider>
    )

    // Initially loading/waiting
    // Then after polling:
    await waitFor(() => {
      expect(screen.getByText(/Analysis complete/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Download Interview Summary/i })).not.toBeDisabled()
    }, { timeout: 8000 }) // Increase timeout to allow for multiple poll intervals
  })
})
