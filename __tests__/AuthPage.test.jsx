// __tests__/AuthPage.test.jsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Provider from "@/app/provider";
import Login from "@/app/auth/page";

// ---- Mock Next.js Link and Image ----
jest.mock("next/link", () => {
  const MockLink = React.forwardRef(({ href, children, ...props }, ref) => (
    <a href={href} ref={ref} {...props}>{children}</a>
  ));
  MockLink.displayName = "MockLink";
  return MockLink;
});
jest.mock("next/image", () => {
  const MockImage = React.forwardRef((props, ref) => (
    <img {...props} ref={ref} />
  ));
  MockImage.displayName = "MockImage";
  return MockImage;
});

// Mock Supabase client (already mocked in jest.setup.js)

describe("Login Page", () => {
  const { supabase } = require("@/services/supabaseClient");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders logo icon, header, texts, and button", async () => {
    render(
      <Provider>
        <Login />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByAltText("AI Recruiter")).toBeInTheDocument();
      expect(screen.getByText("Welcome to AI Recruiter")).toBeInTheDocument();
      expect(screen.getByText(/Continue with Google/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument();
    });
  });

  test("calls supabase.auth.signInWithOAuth when login button is clicked", async () => {
    supabase.auth.signInWithOAuth.mockResolvedValueOnce({ error: null });

    render(
      <Provider>
        <Login />
      </Provider>
    );

    const loginButton = await screen.findByRole("button", { name: /continue with google/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: "google",
        options: {
          redirectTo: expect.stringContaining("/auth/callback"),
          queryParams: {
            prompt: "select_account",
          },
        },
      });
    });
  });

  test("logs error message when sign-in fails", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    supabase.auth.signInWithOAuth.mockResolvedValueOnce({
      error: { message: "Network error" },
    });

    render(
      <Provider>
        <Login />
      </Provider>
    );

    const loginButton = await screen.findByRole("button", { name: /continue with google/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error: ", "Network error");
    });

    consoleSpy.mockRestore();
  });
});
