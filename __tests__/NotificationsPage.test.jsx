import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NotificationsPage from "@/app/(main)/notifications/page";
import "@testing-library/jest-dom";

// Mock next/image
jest.mock("next/image", () => (props) => <img {...props} />);

describe("NotificationsPage", () => {
  test("renders notifications title and description", () => {
    render(<NotificationsPage />);
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("Stay updated on your hiring pipeline")).toBeInTheDocument();
  });

  test("renders all tabs", () => {
    render(<NotificationsPage />);
    expect(screen.getByText("All Notifications")).toBeInTheDocument();
    expect(screen.getByText("Unread")).toBeInTheDocument();
    expect(screen.getByText("Mentions")).toBeInTheDocument();
  });

  test("renders unread count badge in tabs", () => {
    render(<NotificationsPage />);
    const unreadTab = screen.getByText("Unread");
    const countBadge = unreadTab.nextSibling;
    // The count is 2 in our hardcoded data for unread
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("filters notifications when clicking 'Unread' tab", () => {
    render(<NotificationsPage />);
    
    // Initially shows Sarah Jenkins (unread) and Michael Scott (read)
    expect(screen.getByText("Interview Scheduled: Sarah Jenkins")).toBeInTheDocument();
    expect(screen.getByText("New Applicant: Michael Scott")).toBeInTheDocument();

    // Click Unread tab
    fireEvent.click(screen.getByText("Unread"));

    // Should still show Sarah Jenkins
    expect(screen.getByText("Interview Scheduled: Sarah Jenkins")).toBeInTheDocument();
    // Should NOT show Michael Scott
    expect(screen.queryByText("New Applicant: Michael Scott")).not.toBeInTheDocument();
  });

  test("renders notification groups", () => {
    render(<NotificationsPage />);
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Yesterday")).toBeInTheDocument();
    expect(screen.getByText("Earlier this week")).toBeInTheDocument();
  });

  test("renders action buttons correctly", () => {
    render(<NotificationsPage />);
    expect(screen.getByText("View Details")).toBeInTheDocument();
    expect(screen.getByText("Review Results")).toBeInTheDocument();
    expect(screen.getByText("Upgrade Plan")).toBeInTheDocument();
    expect(screen.getByText("View Feedback")).toBeInTheDocument();
  });
});
