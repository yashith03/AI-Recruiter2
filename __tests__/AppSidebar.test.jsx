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
    { name: "Settings", path: "/settings", icon: () => <svg data-testid="settings-icon" /> },
  ],
}));

describe("AppSidebar", () => {
  const { usePathname } = require("next/navigation");

  beforeEach(() => {
    jest.clearAllMocks();
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
    expect(screen.getByAltText("logo")).toBeInTheDocument();
    expect(screen.getByText("Create New Interview")).toBeInTheDocument();
  });

  test("renders sidebar options", () => {
    renderWithProvider("/home");
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  test("highlights the active path", () => {
    renderWithProvider("/settings");
    const activeLink = screen.getByText("Settings");
    expect(activeLink.closest("a")).toHaveAttribute("href", "/settings");
  });
});
