//__tests_/Provider.test.jsx

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Provider, { useUser } from "@/app/provider";
import { UserDetailContext } from "@/context/UserDetailContext";

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

  test("calls supabase.auth.getUser on mount", async () => {
    supabase.auth.getUser.mockResolvedValueOnce({
      data: { user: null },
    });

    render(
      <Provider>
        <p>Check</p>
      </Provider>
    );

    await waitFor(() => {
      expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);
    });
  });

  test("sets and formats user correctly when Supabase returns data", async () => {
    supabase.auth.getUser.mockResolvedValueOnce({
      data: {
        user: {
          email: "test@example.com",
          user_metadata: { name: "john doe", picture: "profile.png" },
        },
      },
    });

    render(
      <Provider>
        <TestConsumer />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user-name")).toHaveTextContent("John Doe");
    });
  });

  test("does not set user if Supabase returns null", async () => {
    supabase.auth.getUser.mockResolvedValueOnce({
      data: { user: null },
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

    // Mock both getUser and onAuthStateChange to return the same user
    supabase.auth.getUser.mockResolvedValueOnce({
      data: { user: mockUser },
    });

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
      expect(screen.getByTestId("user-name")).toHaveTextContent("Alice Cooper");
    });
  });
  test("covers success branch of saveUserToDB", async () => {
  const mockUser = {
    email: "success@test.com",
    user_metadata: { name: "john smith", picture: "pic.png" },
  };

  // Mock getUser
  supabase.auth.getUser.mockResolvedValueOnce({
    data: { user: mockUser }
  });

  // Mock upsert success
  supabase.from.mockReturnValue({
    upsert: jest.fn().mockResolvedValue({ error: null }),
  });

  const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  render(
    <Provider>
      <div>child</div>
    </Provider>
  );

  await waitFor(() => {
    expect(logSpy).toHaveBeenCalledWith("✅ User saved to DB");
  });

  logSpy.mockRestore();
});


  test("logs error when saving user to DB returns error", async () => {
    const mockUser = {
      email: "saveerr@test.com",
      user_metadata: { name: "save error", picture: "pic.jpg" },
    };

    // getUser returns user
    supabase.auth.getUser.mockResolvedValueOnce({ data: { user: mockUser } });

    // Make upsert return an error object to exercise the error branch
    supabase.from.mockImplementationOnce(() => ({
      upsert: jest.fn().mockResolvedValue({ error: { message: "DB error" } }),
    }));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      <Provider>
        <TestConsumer />
      </Provider>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error saving user:", "DB error");
    });

    consoleSpy.mockRestore();
  });

  test("logs error when supabase.auth.getUser throws", async () => {
    supabase.auth.getUser.mockRejectedValueOnce(new Error("boom"));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      <Provider>
        <TestConsumer />
      </Provider>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
