import React from "react";
import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";

// Mock next/font/google (Geist and Geist_Mono)
jest.mock("next/font/google", () => ({
  Geist: jest.fn(() => ({ variable: "--font-geist-sans" })),
  Geist_Mono: jest.fn(() => ({ variable: "--font-geist-mono" })),
}));

// Mock Provider and Toaster
jest.mock("@/app/provider", () => ({
  __esModule: true,
  default: ({ children }) => (
    <div data-testid="mock-provider">{children}</div>
  ),
}));

jest.mock("sonner", () => ({
  Toaster: () => <div data-testid="mock-toaster" />,
}));

describe("RootLayout", () => {
  test("renders HTML structure with Provider and Toaster", () => {
    render(
      <RootLayout>
        <p>Test Content</p>
      </RootLayout>
    );

    // Check if html and body are present
    const html = document.querySelector("html");
    const body = document.querySelector("body");
    expect(html).toHaveAttribute("lang", "en");
    expect(body).toHaveClass("antialiased");

    // Provider should render children
    expect(screen.getByTestId("mock-provider")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();

    // Toaster should render
    expect(screen.getByTestId("mock-toaster")).toBeInTheDocument();
  });

  test("applies font variables from Geist and Geist_Mono", () => {
    render(
      <RootLayout>
        <p>Fonts Test</p>
      </RootLayout>
    );

    const body = document.querySelector("body");
    expect(body.className).toContain("--font-geist-sans");
    expect(body.className).toContain("--font-geist-mono");
  });
});
