// __tests__/WelcomeContainer.test.jsx

import React from "react";

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import WelcomeContainer from "@/app/(main)/dashboard/_components/WelcomeContainer";

// ✅ Mock the Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }) => <img src={src} alt={alt} data-testid="mocked-image" />,
}));

// ✅ Mock useUser() hook
jest.mock("@/app/provider", () => ({
  useUser: jest.fn(),
}));

import { useUser } from "@/app/provider";

describe("WelcomeContainer Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders welcome message with user name", () => {
    useUser.mockReturnValue({
      user: { name: "Inupama", picture: "/avatar.jpg" },
    });

    render(<WelcomeContainer />);

    expect(screen.getByText(/Welcome back, Inupama/i)).toBeInTheDocument();
  });

  test("renders fallback message when no user exists", () => {
    useUser.mockReturnValue({ user: null });

    render(<WelcomeContainer />);

    expect(screen.getByText(/Welcome back, User/i)).toBeInTheDocument();
  });
});
