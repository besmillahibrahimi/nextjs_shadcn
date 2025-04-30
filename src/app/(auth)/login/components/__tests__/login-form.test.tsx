import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LoginForm } from "../login-form";

// Mock the FormBuilder component
jest.mock("@/components/form/form-builder", () => ({
  FormBuilder: jest.fn(({ onSubmit }) => (
    <form
      data-testid="login-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ email: "test@example.com", password: "password123" });
      }}
    >
      <button type="submit">Sign In</button>
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

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form with all elements", () => {
    render(<LoginForm />);

    // Check if form is rendered
    expect(screen.getByTestId("login-form")).toBeInTheDocument();

    // Check if social login buttons are rendered
    expect(screen.getByText("Github")).toBeInTheDocument();
    expect(screen.getByText("Google")).toBeInTheDocument();

    // Check if links are rendered
    expect(screen.getByText("Forgot your password?")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });

  it("handles form submission", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    render(<LoginForm />);

    // Submit the form
    fireEvent.click(screen.getByText("Sign In"));

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    consoleSpy.mockRestore();
  });

  it("disables social login buttons during form submission", async () => {
    render(<LoginForm />);

    const githubButton = screen.getByText("Github").closest("button");
    const googleButton = screen.getByText("Google").closest("button");

    // Submit the form
    fireEvent.click(screen.getByText("Sign In"));

    // Check if buttons are disabled during submission
    await waitFor(() => {
      expect(githubButton).toBeDisabled();
      expect(googleButton).toBeDisabled();
    });
  });
});
