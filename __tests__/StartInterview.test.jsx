// __tests__/StartInterview.test.jsx

import React from 'react'
import { render, waitFor } from '@testing-library/react'
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

    // Wait for the mocked vapi.start to cause the toast call
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('Call Connected...')
    })

    // Simulate call-ended to ensure GenerateFeedback is triggered
    // Emit a message event with conversation, then wait for state to update
    const convo = { messages: ['hi'] }
    // Broadcast message and speech events to all instances (effect may re-register)
    vapiInstance.emitAll('message', { conversation: convo })
    vapiInstance.emitAll('speech-start')
    vapiInstance.emitAll('speech-end')

    // Wait for DOM update indicating activeUser became true
    await waitFor(() => {
      const greenPing = container.querySelector('.bg-green-500')
      expect(greenPing).toBeTruthy()
    })

    // Now end the call; GenerateFeedback should be called (timing of conversation capture can vary)
    vapiInstance.emitAll('call-ended')

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled()
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

    // broadcast events and end call; axios will reject but should be handled
    vapiInstance.emitAll('message', { conversation: { messages: ['x'] } })
    vapiInstance.emitAll('call-ended')

    await waitFor(() => {
      // axios.post was called but rejected
      expect(axios.post).toHaveBeenCalled()
    })

    expect(container).toBeTruthy()
  })
})
