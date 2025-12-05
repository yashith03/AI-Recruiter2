// __tests__/InterviewLink.test.jsx


jest.mock('next/image', () => (props) => <img {...props} alt={props.alt || 'img'} />)
const toastMock = jest.fn();

jest.mock('sonner', () => {
  return { toast: (...args) => toastMock(...args) };
});



import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import InterviewLink from '@/app/(main)/dashboard/create-interview/_components/InterviewLink'

process.env.NEXT_PUBLIC_HOST_URL = 'https://example.com'

describe('InterviewLink component', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    global.navigator.clipboard = {
      writeText: jest.fn().mockResolvedValue(undefined),
    }
  })

  test('renders correctly and copies link when copy clicked', async () => {
    const interviewId = 'abc-123'
    const formData = { duration: '30 Min' }

    render(<InterviewLink interview_id={interviewId} formData={formData} />)

    const expectedUrl = `${process.env.NEXT_PUBLIC_HOST_URL}/${interviewId}`

    expect(screen.getByDisplayValue(expectedUrl)).toBeInTheDocument()

    const copyBtn = screen.getByRole('button', { name: /copy link/i })
    fireEvent.click(copyBtn)

    await waitFor(() =>
      expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith(expectedUrl)
    )

    await waitFor(() =>
      expect(toastMock).toHaveBeenCalledWith('Link Copied')
    )
  })
})
