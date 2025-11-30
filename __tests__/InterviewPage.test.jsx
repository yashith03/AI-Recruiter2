import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
// Avoid loading heavy server-only modules from QuestionList during testing
jest.mock('@/app/(main)/dashboard/create-interview/_components/QuestionList', () => ({
  __esModule: true,
  default: () => <div data-testid="question-list-placeholder">QuestionList</div>,
}))

import Interview from '@/app/interview/[interview_id]/page'

jest.mock('next/navigation', () => ({
  useParams: () => ({ interview_id: 'test-id' }),
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock supabase response for Interviews select
jest.mock('@/services/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: () => ({
        eq: () => Promise.resolve({
          data: [
            {
              jobPosition: 'Frontend Engineer',
              jobDescription: 'React & testing',
              duration: '30 Min',
              type: ['Video Interview'],
            },
          ],
          error: null,
        }),
      }),
    })),
  },
}))

// Create a minimal context provider to satisfy the component
import { InterviewDataContext } from '@/context/interviewDataContext'

describe('Interview page', () => {
  test('typing in the name input and joining interview works without crashing', async () => {
    const setInterviewInfo = jest.fn()

    render(
      <InterviewDataContext.Provider value={{ interviewInfo: null, setInterviewInfo }}>
        <Interview />
      </InterviewDataContext.Provider>
    )

    // Wait for job title to render (set by GetInterviewDetails)
    await waitFor(() => expect(screen.getByText('Frontend Engineer')).toBeInTheDocument())

    const nameInput = screen.getByPlaceholderText('e.g. John Doe')
    fireEvent.change(nameInput, { target: { value: 'Jane Tester' } })

    // Click join button
    const joinButton = screen.getByRole('button', { name: /join interview/i })
    expect(joinButton).toBeEnabled()

    fireEvent.click(joinButton)

    // setInterviewInfo should have been called as part of onJoinInterview
    await waitFor(() => expect(setInterviewInfo).toHaveBeenCalled())
  })
})
