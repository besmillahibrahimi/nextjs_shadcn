import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { RegisterForm } from "../register-form";

// Mock the FormBuilder component
jest.mock("@/components/form/form-builder", () => ({
  FormBuilder: jest.fn(({ onSubmit }) => (
    <form
      data-testid="register-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          name: "John Doe",
          email: "test@example.com",
          password: "password123",
          confirmPassword: "password123",
        });
      }}
    >
      <button type="submit">Create Account</button>
    </form>
  )),
}));

// Mock the Icons component
jest.mock("../../icons", () => ({
  Icons: {
    gitHub: () => <span data-testid="github-icon">GitHub</span>,
    google: () => <span data-testid="google-icon">Google</span>,
  },
}));

describe("RegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders registration form with all elements", () => {
    render(<RegisterForm />);

    // Check if form is rendered
    expect(screen.getByTestId("register-form")).toBeInTheDocument();

    // Check if social login buttons are rendered
    expect(screen.getByText("Github")).toBeInTheDocument();
    expect(screen.getByText("Google")).toBeInTheDocument();

    // Check if sign in link is rendered
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("handles form submission", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    render(<RegisterForm />);

    // Submit the form
    fireEvent.click(screen.getByText("Create Account"));

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith({
        name: "John Doe",
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      });
    });

    consoleSpy.mockRestore();
  });

  it("disables social login buttons during form submission", async () => {
    render(<RegisterForm />);

    const githubButton = screen.getByText("Github").closest("button");
    const googleButton = screen.getByText("Google").closest("button");

    // Submit the form
    fireEvent.click(screen.getByText("Create Account"));

    // Check if buttons are disabled during submission
    await waitFor(() => {
      expect(githubButton).toBeDisabled();
      expect(googleButton).toBeDisabled();
    });
  });
});
