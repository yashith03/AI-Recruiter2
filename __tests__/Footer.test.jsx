
import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/landing/Footer";

describe("Footer Component", () => {
  test("renders footer content and links", () => {
    render(<Footer />);
    
    // Check for links
    expect(screen.getByText(/Product/i)).toBeInTheDocument();
    expect(screen.getByText(/Company/i)).toBeInTheDocument();
    expect(screen.getByText(/Legal/i)).toBeInTheDocument();
    
    // Check for logo text or copyright
    expect(screen.getByText(/© 2024 AI Recruiter Inc. All rights reserved./i)).toBeInTheDocument();
  });
});
