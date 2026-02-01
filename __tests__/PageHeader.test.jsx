import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PageHeader from "@/app/(main)/_components/PageHeader";
import { useRouter } from "next/navigation";
import "@testing-library/jest-dom";

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock Lucide icons
jest.mock("lucide-react", () => ({
  ChevronLeft: () => <div data-testid="back-icon" />,
}));

describe("PageHeader Component", () => {
  const mockBack = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ back: mockBack });
  });

  test("renders title and subtitle", () => {
    render(<PageHeader title="Interviews" subtitle="Manage your calls" />);
    expect(screen.getByText("Interviews")).toBeInTheDocument();
    expect(screen.getByText("Manage your calls")).toBeInTheDocument();
  });

  test("shows back button when showBack is true", () => {
    render(<PageHeader title="Details" showBack={true} />);
    const backBtn = screen.getByRole("button");
    expect(backBtn).toBeInTheDocument();
  });

  test("calls router.back when back button is clicked", () => {
    render(<PageHeader title="Details" showBack={true} />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockBack).toHaveBeenCalled();
  });

  test("renders action elements when provided", () => {
    render(
      <PageHeader 
        title="Page" 
        actions={<button>Action Button</button>} 
      />
    );
    expect(screen.getByText("Action Button")).toBeInTheDocument();
  });
});
