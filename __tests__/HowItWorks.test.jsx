
import React from "react";
import { render, screen } from "@testing-library/react";
import HowItWorks from "@/components/landing/HowItWorks";

describe("HowItWorks Component", () => {
  test("renders how it works title and steps", () => {
    render(<HowItWorks />);
    
    expect(screen.getByText(/How It Works/i)).toBeInTheDocument();
    
    // Check for steps
    expect(screen.getByText(/Create/i)).toBeInTheDocument();
    expect(screen.getByText(/Share/i)).toBeInTheDocument();
    expect(screen.getByText(/Interview/i)).toBeInTheDocument();
    expect(screen.getByText(/Review/i)).toBeInTheDocument();
  });
});
