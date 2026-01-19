import React from "react";
import { render, screen } from "@testing-library/react";
import { Progress } from "@/components/ui/progress";

describe("Progress Component", () => {
  test("renders progress element", () => {
    const { container } = render(<Progress value={50} />);
    const progress = container.querySelector('[data-slot="progress"]');
    expect(progress).toBeInTheDocument();
  });

  test("displays correct progress value", () => {
    const { container } = render(<Progress value={75} />);
    const indicator = container.querySelector('[data-slot="progress-indicator"]');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveStyle({ transform: 'translateX(-25%)' });
  });

  test("handles 0% progress", () => {
    const { container } = render(<Progress value={0} />);
    const indicator = container.querySelector('[data-slot="progress-indicator"]');
    expect(indicator).toHaveStyle({ transform: 'translateX(-100%)' });
  });

  test("handles 100% progress", () => {
    const { container } = render(<Progress value={100} />);
    const indicator = container.querySelector('[data-slot="progress-indicator"]');
    expect(indicator).toHaveStyle({ transform: 'translateX(-0%)' });
  });
});
