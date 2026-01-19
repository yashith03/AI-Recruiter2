
import React from "react";
import { render, screen } from "@testing-library/react";
import Hero from "@/components/landing/Hero";

// Mock Link
jest.mock("next/link", () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

describe("Hero Component", () => {
  test("renders hero title and subtitle", () => {
    render(<Hero />);
    
    // Check for main heading
    expect(screen.getByText(/Hire Faster with/i)).toBeInTheDocument();
    expect(screen.getByText(/AI-Powered/i)).toBeInTheDocument();
    
    // Check for subtitle
    expect(screen.getByText(/Streamline your recruitment process/i)).toBeInTheDocument();
  });

  test("renders CTA buttons", () => {
    render(<Hero />);
    
    const startButton = screen.getByRole("button", { name: /Start Hiring Now/i });
    const demoButton = screen.getByRole("button", { name: /View Demo/i });
    
    expect(startButton).toBeInTheDocument();
    expect(demoButton).toBeInTheDocument();
  });

  test("renders status cards", () => {
    render(<Hero />);
    expect(screen.getByText(/98%/i)).toBeInTheDocument();
    expect(screen.getByText(/4.2s/i)).toBeInTheDocument();
  });
});
