
import React from "react";
import { render, screen } from "@testing-library/react";
import UseCasesSection from "@/components/landing/UseCasesSection";

describe("UseCasesSection Component", () => {
  test("renders use cases section", () => {
    render(<UseCasesSection />);
    
    expect(screen.getByText(/Who is AI Recruiter For\?/i)).toBeInTheDocument();
    
    // Check for use cases
    expect(screen.getByText(/Startups/i)).toBeInTheDocument();
    expect(screen.getByText(/Remote Teams/i)).toBeInTheDocument();
    expect(screen.getByText(/High-Volume/i)).toBeInTheDocument();
  });
});
