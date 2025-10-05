import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateOptions from "@/app/(main)/dashboard/_components/CreateOptions";

// Mock Next.js Link component
jest.mock("next/link", () => {
  return ({ href, children, ...rest }) => <a href={href} {...rest}>{children}</a>;
});

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Video: (props) => <svg data-testid="video-icon" {...props} />,
  Phone: (props) => <svg data-testid="phone-icon" {...props} />,
}));

describe("CreateOptions Component", () => {
  test("renders both create options", () => {
    render(<CreateOptions />);

    // Titles
    expect(screen.getByText("Create New Interview")).toBeInTheDocument();
    expect(screen.getByText("Create Phone Screening Call")).toBeInTheDocument();

    // Descriptions
    expect(
      screen.getByText(/Create AI Interviews and schedule then with Candidates/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Schedule a Phone Screening Call with Candidates/i)
    ).toBeInTheDocument();
  });

  test("renders icons", () => {
    render(<CreateOptions />);
    expect(screen.getByTestId("video-icon")).toBeInTheDocument();
    expect(screen.getByTestId("phone-icon")).toBeInTheDocument();
  });

  test("link navigates to create interview page", () => {
    render(<CreateOptions />);
    const link = screen.getByRole("link", { name: /Create New Interview/i });
    expect(link).toHaveAttribute("href", "/dashboard/create-interview");
  });
});
