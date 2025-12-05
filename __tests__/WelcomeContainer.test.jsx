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

  test("renders welcome message with user name and avatar", () => {
    useUser.mockReturnValue({
      user: { name: "Inupama", picture: "/avatar.jpg" },
    });

    render(<WelcomeContainer />);

    expect(screen.getByText("Welcome Back Inupama")).toBeInTheDocument();
    expect(screen.getByText("AI-Driven Interviews, Hassel-Free Hiring")).toBeInTheDocument();
    expect(screen.getByTestId("mocked-image")).toHaveAttribute("src", "/avatar.jpg");
  });

  test("renders fallback message when no user exists", () => {
    useUser.mockReturnValue({ user: null });

    render(<WelcomeContainer />);

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.queryByTestId("mocked-image")).not.toBeInTheDocument();
  });
});
