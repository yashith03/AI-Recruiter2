// __tests__/feedback_api.test.jsx

// Mock Next.js Server BEFORE require
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((data, init) => {
      return {
        status: init?.status || 200,
        json: async () => data,
      };
    }),
  },
}));

// Mock Supabase Server BEFORE require
jest.mock('@/services/supabaseServer', () => ({
  getSupabaseServer: jest.fn(),
}));

const { getSupabaseServer } = require('@/services/supabaseServer');
const { GET } = require('@/app/api/interviews/[interview_id]/feedback/route');

describe('Feedback API Route', () => {
  const interview_id = 'test-id';
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getSupabaseServer.mockReturnValue(mockSupabase);
  });

  test('successfully fetches the latest feedback record', async () => {
    const mockData = [{ id: 2, interview_id: 'test-id', feedback: 'new' }];
    mockSupabase.limit.mockResolvedValueOnce({ data: mockData, error: null });

    const req = {}; // Mock request
    const res = await GET(req, { params: Promise.resolve({ interview_id }) });
    const data = await res.json();

    expect(mockSupabase.from).toHaveBeenCalledWith('interview-feedback');
    expect(data.feedback).toBe('new');
    expect(res.status).toBe(200);
  });

  test('returns null when no feedback is found', async () => {
    mockSupabase.limit.mockResolvedValueOnce({ data: [], error: null });

    const req = {}; // Mock request
    const res = await GET(req, { params: Promise.resolve({ interview_id }) });
    const data = await res.json();

    expect(data).toBeNull();
    expect(res.status).toBe(200);
  });

  test('handles database errors gracefully', async () => {
    mockSupabase.limit.mockResolvedValueOnce({ data: null, error: { message: 'DB Error' } });

    const req = {}; // Mock request
    const res = await GET(req, { params: Promise.resolve({ interview_id }) });
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe('Error fetching feedback');
  });
});
