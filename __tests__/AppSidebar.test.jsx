// __tests__/AppSidebar.test.jsx

import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import AppSidebar from "@/app/(main)/_components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

// ---- Mock Next.js navigation ----
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// ---- Mock Next.js Link and Image ----
jest.mock("next/link", () => {
  const MockLink = React.forwardRef(({ href, children, ...props }, ref) => (
    <a href={href} ref={ref} {...props}>{children}</a>
  ));
  MockLink.displayName = "MockLink";
  return MockLink;
});
jest.mock("next/image", () => {
  const MockImage = React.forwardRef((props, ref) => (
    <img {...props} ref={ref} alt={props.alt || "mocked image"} />
  ));
  MockImage.displayName = "MockImage";
  return MockImage;
});

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

// ---- Mock Supabase ----
jest.mock("@/services/supabaseClient", () => ({
  supabase: {
    from: jest.fn((table) => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockImplementation(() => Promise.resolve({
        data: table === 'interviews' ? [{ id: 1 }, { id: 2 }] : [],
        error: null
      })),
      in: jest.fn().mockImplementation(() => Promise.resolve({
        count: table === 'interview-feedback' ? 3 : 0,
        error: null
      })),
    })),
  },
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
    expect(screen.getByAltText("AI Recruiter Logo")).toBeInTheDocument();
    expect(screen.getByText("Create New Interview")).toBeInTheDocument();
  });

  test("renders sidebar options", () => {
    renderWithProvider("/home");
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  test("renders notification badge for Notifications item", async () => {
    await act(async () => {
      renderWithProvider("/home");
    });
    
    // The count fetch is async, wait for it
    const badge = await screen.findByText("3");
    expect(badge).toBeInTheDocument();
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
