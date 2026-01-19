import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  test("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText(/Click me/i)).toBeInTheDocument();
  });

  test("renders button with default variant", () => {
    render(<Button>Default</Button>);
    const button = screen.getByText(/Default/i);
    expect(button).toBeInTheDocument();
  });

  test("renders button with primary variant", () => {
    render(<Button variant="default">Primary</Button>);
    const button = screen.getByText(/Primary/i);
    expect(button).toBeInTheDocument();
  });

  test("renders disabled button", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText(/Disabled/i);
    expect(button).toBeDisabled();
  });
});
