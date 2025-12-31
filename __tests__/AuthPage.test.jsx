// __tests__/AuthPage.test.jsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "@/app/auth/page";

// Mock next/image to avoid Next.js optimization issues
jest.mock("next/image", () => (props) => (
  <img {...props} alt={props.alt || "mocked image"} />
));

// Mock Supabase client (already mocked in jest.setup.js)

describe("Login Page", () => {
  const { supabase } = require("@/services/supabaseClient");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders logo icon, header, texts, and button", () => {
    render(<Login />);

    expect(screen.getByText("AI Recruiter")).toBeInTheDocument();
    expect(
      screen.getByText("Welcome to AICruiter")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Sign In With Google/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continue with google/i })
    ).toBeInTheDocument();
  });

  test("calls supabase.auth.signInWithOAuth when login button is clicked", async () => {
    supabase.auth.signInWithOAuth.mockResolvedValueOnce({ error: null });

    render(<Login />);

    const loginButton = screen.getByRole("button", { name: /continue with google/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: "google",
        options: {
          redirectTo: expect.stringContaining("/auth/callback"),
        },
      });
    });
  });

  test("logs error message when sign-in fails", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    supabase.auth.signInWithOAuth.mockResolvedValueOnce({
      error: { message: "Network error" },
    });

    render(<Login />);

    const loginButton = screen.getByRole("button", { name: /continue with google/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error: ", "Network error");
    });

    consoleSpy.mockRestore();
  });
});
