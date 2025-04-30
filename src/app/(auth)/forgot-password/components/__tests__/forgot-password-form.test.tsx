import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ForgotPasswordForm } from "../forgot-password-form";

// Mock the FormBuilder component
jest.mock("@/components/form/form-builder", () => ({
  FormBuilder: jest.fn(({ onSubmit }) => (
    <form
      data-testid="forgot-password-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ email: "test@example.com" });
      }}
    >
      <button type="submit">Send Reset Link</button>
    </form>
  )),
}));

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders forgot password form with all elements", () => {
    render(<ForgotPasswordForm />);

    // Check if form is rendered
    expect(screen.getByTestId("forgot-password-form")).toBeInTheDocument();

    // Check if sign in link is rendered
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("handles form submission", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    render(<ForgotPasswordForm />);

    // Submit the form
    fireEvent.click(screen.getByText("Send Reset Link"));

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith({
        email: "test@example.com",
      });
    });

    consoleSpy.mockRestore();
  });
});
