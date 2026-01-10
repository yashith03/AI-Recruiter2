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

// Mock Supabase globally for testing only
jest.mock("@/services/supabaseClient", () => ({
  supabase: {
    auth: {
      // ✅ Return null by default (not logged in) for tests
      getUser: jest.fn().mockResolvedValue({
        data: { user: null },
      }),
      getSession: jest.fn().mockResolvedValue({
        data: { session: null },
      }),
      onAuthStateChange: jest.fn((callback) => {
        // Simulate no active session
        callback(null, null);
        return {
          data: {
            subscription: {
              unsubscribe: jest.fn(),
            },
          },
        };
      }),
      signInWithOAuth: jest.fn().mockResolvedValue({ error: null }),
    },
    from: jest.fn(() => ({
      upsert: jest.fn().mockResolvedValue({ error: null }),
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}));

// Mock fetch globally
global.fetch = jest.fn();

// Mock next/font/google
jest.mock("next/font/google", () => ({
  Outfit: () => ({
    variable: "--font-outfit",
    className: "font-outfit",
  }),
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

// Mock sonner toast
jest.mock("sonner", () => {
  const mockToast = jest.fn();
  mockToast.error = jest.fn();
  mockToast.success = jest.fn();
  mockToast.loading = jest.fn();
  return {
    toast: mockToast,
    Toaster: () => null,
  };
});

jest.mock("uuid", () => ({
  v4: () => "test-uuid", // ✅ stable ID for tests
}));
