// __tests__/AlertConfirmation.test.jsx

import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import AlertConfirmation from '@/app/interview/[interview_id]/start/_components/AlertConfirmation'

describe('AlertConfirmation', () => {
  it('calls stopInterview when Continue is clicked', async () => {
    const stopInterview = jest.fn()

    const { getByText } = render(
      <AlertConfirmation stopInterview={stopInterview}>
        <button>Open</button>
      </AlertConfirmation>
    )

    // Open the dialog
    // Suppress the Radix ref warning in this test environment
    const originalConsoleError = console.error
    console.error = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('Function components cannot be given refs')) {
        return
      }
      originalConsoleError(...args)
    }

    fireEvent.click(getByText('Open'))

    // Click Continue action
    const continueBtn = getByText('Continue')
    fireEvent.click(continueBtn)

    await waitFor(() => {
      expect(stopInterview).toHaveBeenCalled()
    })

    // restore
    console.error = originalConsoleError
  })
})
