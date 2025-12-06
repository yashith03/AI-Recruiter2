// __tests__/StartInterview.test.jsx

import React from 'react'
import { render, waitFor, fireEvent, screen } from '@testing-library/react'
import StartInterview from '@/app/interview/[interview_id]/start/page'
import { InterviewDataContext } from '@/context/interviewDataContext'

// Mock vapi web SDK
let vapiInstance = null
jest.mock('@vapi-ai/web', () => {
  return jest.fn().mockImplementation(() => {
    const handlers = {}
    let started = false
    const inst = {
      start: jest.fn(() => { started = true }),
      on: (event, cb) => {
        handlers[event] = cb
        if (event === 'call-started' && started) {
          try { cb() } catch (e) {}
        }
      },
      off: (event, cb) => {
        // remove handler only if matches
        if (handlers[event] === cb) delete handlers[event]
      },
      stop: jest.fn(),
      emit: (event, payload) => {
        if (handlers[event]) {
          try { handlers[event](payload) } catch (e) {}
        }
      }
    }

    // maintain list of instances so tests can broadcast events when effect re-runs
    if (!global.__vapi_instances) global.__vapi_instances = []
    global.__vapi_instances.push(inst)
    vapiInstance = {
      last: inst,
      emit: inst.emit,
      emitAll: (event, payload) => global.__vapi_instances.forEach(i => i.emit(event, payload))
    }

    return inst
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

    // Click the Start Interview button to trigger startCall, then wait for toast
    fireEvent.click(container.querySelector('button'))
    // simulate the Vapi speech-start which triggers the 'Interview Started' toast
    vapiInstance.emitAll('speech-start')
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('Interview Started')
    })

    // Simulate events: message and speech-end to mark user active
    const convo = { messages: ['hi'] }
    vapiInstance.emitAll('message', { conversation: convo })
    vapiInstance.emitAll('speech-end')

    // Wait for DOM update indicating activeUser became true
    await waitFor(() => {
      const greenPing = container.querySelector('.bg-green-500')
      expect(greenPing).toBeTruthy()
    })

    // Now end the call; component shows an 'Interview Ended' toast
    vapiInstance.emitAll('call-ended')

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('Interview Ended')
    })

    expect(container).toBeTruthy()
  })

  it('does not start call when interviewInfo is missing', async () => {
    // clear instances
    global.__vapi_instances = []

    const { container } = render(
      <InterviewDataContext.Provider value={{ interviewInfo: null }}>
        <StartInterview />
      </InterviewDataContext.Provider>
    )

    // ensure any created vapi instances did not call start
    const instances = global.__vapi_instances || []
    instances.forEach((i) => {
      expect(i.start).not.toHaveBeenCalled()
    })

    expect(container).toBeTruthy()
  })

  it('handles GenerateFeedback failure without throwing', async () => {
    axios.post.mockRejectedValueOnce(new Error('network'))

    const interviewInfo = {
      userName: 'Bob',
      interviewData: {
        jobPosition: 'Backend',
        questionList: [{ question: 'Q?' }],
      },
    }

    const { container } = render(
      <InterviewDataContext.Provider value={{ interviewInfo }}>
        <StartInterview />
      </InterviewDataContext.Provider>
    )

    // Click start, then open the stop confirmation and confirm to trigger stopInterview
    fireEvent.click(container.querySelector('button'))
    // ensure handlers registered
    vapiInstance.emitAll('speech-start')

    // open AlertConfirmation dialog by clicking the trigger
    const trigger = container.querySelector('[data-slot="alert-dialog-trigger"]')
    fireEvent.click(trigger)

    // click the Continue action inside the dialog to call stopInterview
    const continueBtn = screen.getByText('Continue')
    fireEvent.click(continueBtn)

    await waitFor(() => {
      // axios.post was called but rejected
      expect(axios.post).toHaveBeenCalled()
    })

    expect(container).toBeTruthy()
  })
})
