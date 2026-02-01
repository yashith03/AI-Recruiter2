import React from "react";
import { render, screen } from "@testing-library/react";
import CreditBadge from "@/app/(main)/_components/CreditBadge";
import { useUser } from "@/app/provider";
import "@testing-library/jest-dom";

// Mock useUser
jest.mock("@/app/provider", () => ({
  useUser: jest.fn(),
}));

// Mock Lucide icons to avoid SVGR issues in jest
jest.mock("lucide-react", () => ({
  Brain: () => <div data-testid="brain-icon" />,
}));

describe("CreditBadge Component", () => {
  test("renders zero credits when user is null", () => {
    useUser.mockReturnValue({ user: null });
    render(<CreditBadge />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  test("renders correct credit amount from user context", () => {
    useUser.mockReturnValue({ user: { credits: 25 } });
    render(<CreditBadge />);
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  test("contains the available credits label", () => {
    useUser.mockReturnValue({ user: { credits: 10 } });
    render(<CreditBadge />);
    expect(screen.getByText(/Available Credits/i)).toBeInTheDocument();
  });
});
