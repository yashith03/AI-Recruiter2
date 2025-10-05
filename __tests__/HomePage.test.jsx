import React from "react";
import { render, screen } from "@testing-library/react";
import Page from "@/app/page";

// Mock next/image to avoid Next.js optimization issues
jest.mock("next/image", () => (props) => (
  <img {...props} alt={props.alt || "mocked image"} />
));

// Mock next/link for testing
jest.mock("next/link", () => {
  return ({ href, children }) => <a href={href}>{children}</a>;
});

describe("Home Page", () => {
  test("renders without crashing", () => {
    render(<Page />);
    expect(screen.getByText(/subscribe to yashith/i)).toBeInTheDocument();
  });

  test("matches basic structure", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("div")).toBeInTheDocument();
    expect(container.querySelector("h2")).toHaveTextContent("Subscribe to yashith");
  });
});
