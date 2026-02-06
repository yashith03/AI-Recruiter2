//__tests_/Provider.test.jsx

import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import Provider, { useUser, UserDetailContext } from "@/app/provider";

const { supabase } = require("@/services/supabaseClient");

// ✅ Helper component to consume context
function TestConsumer() {
  const { user } = useUser();
  return <div data-testid="user-name">{user ? user.name : "No user"}</div>;
}

describe("Provider Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders children correctly", () => {
    render(
      <Provider>
        <p>Child Component</p>
      </Provider>
    );
    expect(screen.getByText("Child Component")).toBeInTheDocument();
  });

  test("calls supabase.auth.getSession on mount", async () => {
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: null },
    });

    render(
      <Provider>
        <p>Check</p>
      </Provider>
    );

    await waitFor(() => {
      expect(supabase.auth.getSession).toHaveBeenCalledTimes(1);
    });
  });

  test("sets and formats user correctly when Supabase returns data", async () => {
    supabase.auth.getSession.mockResolvedValueOnce({
      data: {
        session: {
          user: {
            email: "test@example.com",
            user_metadata: { name: "john doe", picture: "profile.png" },
          },
        },
      },
    });

    // Mock DB fetch for user details
    supabase.from.mockImplementation(() => ({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
             data: { phone: "123", job: "Dev", company: "TestCo" }
          }),
        }),
      }),
      upsert: jest.fn().mockResolvedValue({ error: null }),
    }));

    render(
      <Provider>
        <TestConsumer />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user-name")).toHaveTextContent("john doe");
    }, { timeout: 3000 });
  });

  test("does not set user if Supabase returns null", async () => {
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: null },
    });

    render(
      <Provider>
        <TestConsumer />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user-name")).toHaveTextContent("No user");
    });
  });

  test("provides context with user and setUser", async () => {
    const mockUser = {
      email: "user@test.com",
      user_metadata: { name: "alice cooper", picture: "pic.jpg" },
    };

    // Mock both getSession and onAuthStateChange to return the same user
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: mockUser } },
    });
    
    // Mock DB fetch
    supabase.from.mockImplementation(() => ({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
             data: { phone: "999", job: "Manager", company: "AliceCo" }
          }),
        }),
      }),
      upsert: jest.fn().mockResolvedValue({ error: null }),
    }));

    supabase.auth.onAuthStateChange.mockImplementationOnce((callback) => {
      // Call the callback with the mock user
      callback(null, { user: mockUser });
      return {
        data: {
          subscription: {
            unsubscribe: jest.fn(),
          },
        },
      };
    });

    render(
      <Provider>
        <TestConsumer />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user-name")).toHaveTextContent("alice cooper");
    });
  });

  test("covers success branch of saveUserToDB", async () => {
    const mockUser = {
      email: "success@test.com",
      user_metadata: { name: "john smith", picture: "pic.png" },
    };

    // Mock getSession
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: mockUser } }
    });

    // Mock DB fetch AND upsert success
    supabase.from.mockImplementation(() => ({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
             data: { phone: "000", job: "Tester", company: "SmithCo" }
          }),
        }),
      }),
      upsert: jest.fn().mockResolvedValue({ error: null }),
    }));

    render(
      <Provider>
        <TestConsumer />
      </Provider>
    );

    // User should be set after async loadUser completes
    await waitFor(() => {
      expect(screen.getByTestId("user-name")).toHaveTextContent("john smith");
    });
  });

  test("handles auth loading state correctly", async () => {
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: null },
    });

    render(
      <Provider>
        <TestConsumer />
      </Provider>
    );

    // Initially loading
    expect(screen.getByTestId("user-name")).toHaveTextContent("No user");
  });

  test("updates user data on auth state change (login)", async () => {
    let authCallback;
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      authCallback = callback;
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });

    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    render(
      <Provider>
        <TestConsumer />
      </Provider>
    );

    const mockSessionUser = {
      email: "new@test.com",
      user_metadata: { name: "new user", picture: "new.png" },
    };

    // Mock DB response for the background fetch
    supabase.from.mockImplementation(() => ({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { credits: 50, phone: "555" }
          }),
        }),
      }),
      upsert: jest.fn().mockResolvedValue({ error: null }),
    }));

    // Wait for the mock to be called (it happens in useEffect after render)
    await waitFor(() => expect(authCallback).toBeDefined());

    // Trigger auth change
    await act(async () => {
      authCallback("SIGNED_IN", { user: mockSessionUser });
    });

    await waitFor(() => {
      expect(screen.getByTestId("user-name")).toHaveTextContent("new user");
    }, { timeout: 3000 });
  });

  test("handles null session in onAuthStateChange (logout)", async () => {
    let authCallback;
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      authCallback = callback;
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });

    supabase.auth.getSession.mockResolvedValue({ 
      data: { session: { user: { email: "test@test.com" } } } 
    });

    render(
      <Provider>
        <TestConsumer />
      </Provider>
    );

    // Wait for the mock to be called
    await waitFor(() => expect(authCallback).toBeDefined());

    // Trigger logout
    await act(async () => {
      authCallback("SIGNED_OUT", null);
    });

    await waitFor(() => {
      expect(screen.getByTestId("user-name")).toHaveTextContent("No user");
    });
  });
});
