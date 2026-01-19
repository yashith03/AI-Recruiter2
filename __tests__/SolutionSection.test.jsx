
import React from "react";
import { render, screen } from "@testing-library/react";
import SolutionSection from "@/components/landing/SolutionSection";

describe("SolutionSection Component", () => {
  test("renders solution section title and description", () => {
    render(<SolutionSection />);
    
    expect(screen.getByText(/Meet Your New AI Recruiting Assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/The Solution/i)).toBeInTheDocument();
    
    expect(screen.getByText(/24\/7 Availability/i)).toBeInTheDocument();
    expect(screen.getByText(/Unbiased Scoring/i)).toBeInTheDocument();
    expect(screen.getByText(/Infinite Scalability/i)).toBeInTheDocument();
  });
});
