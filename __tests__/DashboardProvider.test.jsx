//__tests__/DashboardProvider.test.jsx

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DashboardProvider from "@/app/(main)/provider";

// ✅ Mock dependencies
jest.mock("@/components/ui/sidebar", () => ({
  SidebarProvider: ({ children }) => (
    <div data-testid="sidebar-provider">{children}</div>
  ),
  SidebarTrigger: () => <div data-testid="sidebar-trigger">SidebarTrigger</div>,
}));

jest.mock("@/app/(main)/_components/AppSidebar", () => () => (
  <div data-testid="app-sidebar">AppSidebar</div>
));

describe("DashboardProvider", () => {
  test("renders SidebarProvider and AppSidebar", () => {
    render(
      <DashboardProvider>
        <div data-testid="child">ChildContent</div>
      </DashboardProvider>
    );

    // ✅ SidebarProvider should be rendered
    expect(screen.getByTestId("sidebar-provider")).toBeInTheDocument();

    // ✅ AppSidebar should appear
    expect(screen.getByTestId("app-sidebar")).toBeInTheDocument();

    // ✅ Children should appear inside provider
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  test("wraps children inside a div with correct structure", () => {
    render(
      <DashboardProvider>
        <p data-testid="nested-child">Nested</p>
      </DashboardProvider>
    );

    const containerDiv = screen.getByTestId("sidebar-provider").querySelector("div.w-full");
    expect(containerDiv).toBeInTheDocument();
    expect(containerDiv).toContainElement(screen.getByTestId("nested-child"));
  });
});
