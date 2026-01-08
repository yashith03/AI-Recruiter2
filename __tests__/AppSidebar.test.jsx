// __tests__/AppSidebar.test.jsx

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import AppSidebar from "@/app/(main)/_components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar"; // ✅ Your real provider

// ---- Mock Next.js navigation ----
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// ---- Mock Next.js Link and Image ----
jest.mock("next/link", () => ({ href, children }) => <a href={href}>{children}</a>);
jest.mock("next/image", () => (props) => <img {...props} />);

// ---- Mock Constants file ----
jest.mock("@/services/Constants", () => ({
  SideBarOptions: [
    { name: "Home", path: "/home", icon: () => <svg data-testid="home-icon" /> },
    { name: "Notifications", path: "/notifications", icon: () => <svg data-testid="notifications-icon" /> },
    { name: "Settings", path: "/settings", icon: () => <svg data-testid="settings-icon" /> },
  ],
}));

// ---- Mock provider ----
jest.mock("@/app/provider", () => ({
  useUser: jest.fn(),
}));

describe("AppSidebar", () => {
  const { usePathname } = require("next/navigation");
  const { useUser } = require("@/app/provider");

  beforeEach(() => {
    jest.clearAllMocks();
    useUser.mockReturnValue({
      user: { name: "Test User", email: "test@example.com", picture: "/avatar.png" },
    });
  });

  // ✅ Helper: render with SidebarProvider wrapper
  const renderWithProvider = (path) => {
    usePathname.mockReturnValue(path);
    return render(
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
    );
  };

  test("renders logo and create button", () => {
    renderWithProvider("/home");
    expect(screen.getByText("AI Recruiter")).toBeInTheDocument();
    expect(screen.getByText("Create New Interview")).toBeInTheDocument();
  });

  test("renders sidebar options", () => {
    renderWithProvider("/home");
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  test("renders notification badge for Notifications item", () => {
    renderWithProvider("/home");
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  test("highlights the active path", () => {
    renderWithProvider("/settings");
    const activeLink = screen.getByText("Settings");
    expect(activeLink.closest("a")).toHaveAttribute("href", "/settings");
  });

  test("renders user profile info", () => {
    renderWithProvider("/home");
    expect(screen.getByAltText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });
});
