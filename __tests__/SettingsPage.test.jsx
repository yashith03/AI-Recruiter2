
import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import SettingsPage from "@/app/(main)/settings/page";
import "@testing-library/jest-dom";

// Mock the provider hook
const mockSetUser = jest.fn();
const mockUser = {
  name: "Test User",
  email: "test@example.com",
  picture: "/avatar.png",
  phone: "123-456-7890",
  job: "Developer",
  company: "Tech Corp"
};

jest.mock("@/app/provider", () => ({
  useUser: () => ({
    user: mockUser,
    setUser: mockSetUser,
  }),
}));

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: jest.fn(),
  }),
}));

// Mock next/image
jest.mock("next/image", () => (props) => <img {...props} />);

// Mock Supabase
const mockUpdate = jest.fn();
// We need a mock that allows us to inspect calls
jest.mock("@/services/supabaseClient", () => ({
  supabase: {
    from: jest.fn(() => ({
      update: jest.fn((data) => ({
        eq: jest.fn(() => ({
          select: jest.fn(async () => {
            mockUpdate(data);
            return { data: [mockUser], error: null };
          })
        }))
      }))
    }))
  },
}));

// Mock toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("SettingsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders user information correctly", async () => {
    render(<SettingsPage />);
    
    // Check for display values (read-only mode)
    // Use findBy to wait for useEffect to populate state
    const nameElements = await screen.findAllByText("Test User");
    expect(nameElements.length).toBeGreaterThan(0);
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("123-456-7890")).toBeInTheDocument();
    expect(screen.getAllByText("Developer").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Tech Corp").length).toBeGreaterThan(0);
  });

  test("toggles edit mode", async () => {
    render(<SettingsPage />);
    
    // Wait for data to load first
    await screen.findAllByText("Test User");

    const editButton = screen.getByText("Edit Details");
    fireEvent.click(editButton);
    
    // Check if inputs appear
    expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    expect(screen.queryByText("Edit Details")).not.toBeInTheDocument();
    expect(screen.getByText("Save Information")).toBeInTheDocument();
  });

  test("updates form state on input change", async () => {
    render(<SettingsPage />);
    
    // Wait for load
    await screen.findAllByText("Test User");

    fireEvent.click(screen.getByText("Edit Details"));
    
    const nameInput = screen.getByDisplayValue("Test User");
    fireEvent.change(nameInput, { target: { value: "New Name" } });
    
    expect(nameInput.value).toBe("New Name");
  });

  test("calls saves changes and updates user", async () => {
    render(<SettingsPage />);
    
    // Wait for load
    await screen.findAllByText("Test User");

    fireEvent.click(screen.getByText("Edit Details"));
    
    // Change some values
    fireEvent.change(screen.getByDisplayValue("Test User"), { target: { value: "Updated Name" } });
    fireEvent.change(screen.getByDisplayValue("Developer"), { target: { value: "Senior Dev" } });
    
    // Click save
    const saveButton = screen.getByText("Save Information");
    fireEvent.click(saveButton);

    // Verify Supabase update was called
    await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
          name: "Updated Name",
          job: "Senior Dev",
        }));
    });

    // Verify local context update
    await waitFor(() => {
        // Find the call where setUser was called with a function
        const call = mockSetUser.mock.calls.find(args => typeof args[0] === 'function');
        expect(call).toBeDefined();
        
        // Execute the function with original user to see the result
        const result = call[0](mockUser);
        expect(result).toEqual(expect.objectContaining({
          name: "Updated Name",
          job: "Senior Dev",
        }));
    });
  });
});
