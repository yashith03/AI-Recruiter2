import React from "react";
import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";
import "@testing-library/jest-dom";

// Mocks
jest.mock("@/app/provider", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="provider">{children}</div>,
}));
jest.mock("sonner", () => ({
  Toaster: () => <div data-testid="toaster" />,
}));
jest.mock("next/font/google", () => ({
  Geist: jest.fn(() => ({ variable: "--font-geist-sans" })),
  Geist_Mono: jest.fn(() => ({ variable: "--font-geist-mono" })),
}));

describe("RootLayout", () => {
  test("renders layout structure with correct classes", () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="child" />
      </RootLayout>
    );

    // ✅ Instead of querying <html>, select root container
    const root = container.firstChild;
    const body = root.querySelector("body");

    expect(root.nodeName.toLowerCase()).toBe("html"); // Ensure it is the <html> element
    expect(root.getAttribute("lang")).toBe("en");

    expect(body).toHaveClass("antialiased");
    expect(body.className).toContain("--font-geist-sans");
    expect(body.className).toContain("--font-geist-mono");
  });

  test("wraps children inside Provider and includes Toaster", () => {
    render(
      <RootLayout>
        <div data-testid="content" />
      </RootLayout>
    );

    expect(screen.getByTestId("provider")).toBeInTheDocument();
    expect(screen.getByTestId("toaster")).toBeInTheDocument();
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });
});
