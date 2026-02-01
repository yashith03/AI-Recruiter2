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
    
    // Mock successful feedback fetch (initially null, then populated)
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ 
        ok: true, 
        json: () => Promise.resolve(null) 
      })
      .mockResolvedValue({ 
        ok: true, 
        json: () => Promise.resolve({ pdf_url: 'http://pdf-link', interview_date: '2026-02-02' }) 
      })
  })

  it('triggers background processing on mount if context has data', async () => {
    render(
      <InterviewDataContext.Provider value={{ interviewInfo: mockInterviewInfo }}>
        <InterviewComplete />
      </InterviewDataContext.Provider>
    )

    // Verify upload called
    await waitFor(() => {
      expect(supabase.storage.from).toHaveBeenCalledWith('interview-recordings')
    })

    // Verify process-result API called
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/interviews/process-result', expect.objectContaining({
        interview_id,
        userName: 'Jane Done',
      }))
    })

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
      expect(screen.getByText(/Summary ready/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Download Interview Summary/i })).not.toBeDisabled()
    }, { timeout: 5000 })
  })
})
