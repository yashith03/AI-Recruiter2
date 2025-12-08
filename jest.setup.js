// jest.setup.js

import "@testing-library/jest-dom";

// Mock matchMedia for responsive components
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}

// Mock Next.js router hooks
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
  }),
  useParams: () => ({ interview_id: 'test-interview' }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Supabase globally
jest.mock("@/services/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: {
          user: {
            email: "mock@example.com",
            user_metadata: { name: "Mock User", picture: "mock.png" },
          },
        },
      }),
      onAuthStateChange: jest.fn((callback) => {
        // Immediately call the callback with null to simulate no active session
        callback(null, null);
        return {
          data: {
            subscription: {
              unsubscribe: jest.fn(),
            },
          },
        };
      }),
      signInWithOAuth: jest.fn(),
    },
    from: jest.fn(() => ({
      upsert: jest.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

// Suppress noisy React DOM nesting warnings
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("validateDOMNesting") ||
        args[0].includes("An update to") ||
        args[0].includes("wrapped in act"))
    ) {
      return;
    }
    originalError(...args);
  };
});
afterAll(() => {
  console.error = originalError;
});

jest.mock("@vercel/speed-insights/next", () => ({
  SpeedInsights: () => null,
}));
jest.mock("uuid", () => ({
  v4: () => "test-uuid", // ✅ stable ID for tests
}));
