
import React from "react";
import { render, screen } from "@testing-library/react";
import ProblemSection from "@/components/landing/ProblemSection";

describe("ProblemSection Component", () => {
  test("renders problem section title and problem cards", () => {
    render(<ProblemSection />);
    
    expect(screen.getByText(/Why Traditional Hiring is Broken/i)).toBeInTheDocument();
    
    // Check for problem titles
    expect(screen.getByText(/Time-Consuming Scheduling/i)).toBeInTheDocument();
    expect(screen.getByText(/Inconsistent Evaluation/i)).toBeInTheDocument();
    expect(screen.getByText(/Manual Screening Fatigue/i)).toBeInTheDocument();
  });
});
