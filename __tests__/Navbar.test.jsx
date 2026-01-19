
import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "@/components/landing/Navbar";

// Mock Link since Navbar uses it
jest.mock("next/link", () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

describe("Navbar Component", () => {
  test("renders logo and navigation links", () => {
    render(<Navbar />);
    // Check for logo text
    expect(screen.getByText(/AI Recruiter/i)).toBeInTheDocument();
    // Check for nav links
    expect(screen.getByText(/Features/i)).toBeInTheDocument();
    expect(screen.getByText(/How it works/i)).toBeInTheDocument();
    expect(screen.getByText(/Use Cases/i)).toBeInTheDocument();
    // Check for buttons
    expect(screen.getByRole("button", { name: /Log in/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign up/i })).toBeInTheDocument();
  });
});
