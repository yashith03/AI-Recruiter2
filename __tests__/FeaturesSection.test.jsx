
import React from "react";
import { render, screen } from "@testing-library/react";
import FeaturesSection from "@/components/landing/FeaturesSection";

describe("FeaturesSection Component", () => {
  test("renders features title and feature cards", () => {
    render(<FeaturesSection />);
    
    expect(screen.getByText(/Everything You Need to Hire Smarter/i)).toBeInTheDocument();
    
    // Check for some feature titles
    expect(screen.getByText(/AI Voice Interviews/i)).toBeInTheDocument();
    expect(screen.getByText(/Custom Interview Creation/i)).toBeInTheDocument();
    expect(screen.getByText(/Deep Analytics/i)).toBeInTheDocument();
  });
});
