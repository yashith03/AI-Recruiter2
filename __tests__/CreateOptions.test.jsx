// __tests__/CreateOptions.test.jsx

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateOptions from "@/app/(main)/dashboard/_components/CreateOptions";
import React from "react";

// Mock Next.js Link component
jest.mock("next/link", () => {
  return ({ href, children, ...rest }) => <a href={href} {...rest}>{children}</a>;
});

// Mock user provider
jest.mock("@/app/provider", () => ({
  useUser: () => ({ user: { email: "test@example.com" } }),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Video: (props) => <svg data-testid="video-icon" {...props} />,
  Phone: (props) => <svg data-testid="phone-icon" {...props} />,
  Plus: (props) => <svg data-testid="plus-icon" {...props} />,
  LineChart: (props) => <svg data-testid="line-chart-icon" {...props} />,
  ArrowRight: (props) => <svg data-testid="arrow-right-icon" {...props} />,
}));

describe("CreateOptions Component", () => {
  test("renders both create options", () => {
    render(<CreateOptions />);

    // Titles
    expect(screen.getByText("Create New Interview")).toBeInTheDocument();

    // Descriptions
    expect(
      screen.getByText(/Set up a new AI-driven interview session/i)
    ).toBeInTheDocument();
  });

  test("renders icons", () => {
    render(<CreateOptions />);
    expect(screen.getByTestId("video-icon")).toBeInTheDocument();
  });

  test("link navigates to create interview page", () => {
    render(<CreateOptions />);
    const link = screen.getByRole("link", { name: /Get Started/i });
    expect(link).toHaveAttribute("href", "/dashboard/create-interview");
  });
});
