import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ResetPasswordForm } from "../reset-password-form";

// Mock the FormBuilder component
jest.mock("@/components/form/form-builder", () => ({
  FormBuilder: jest.fn(({ onSubmit }) => (
    <form
      data-testid="reset-password-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          password: "newpassword123",
          confirmPassword: "newpassword123",
        });
      }}
    >
      <button type="submit">Reset Password</button>
    </form>
  )),
}));

describe("ResetPasswordForm", () => {
  const mockToken = "reset-token-123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders reset password form with all elements", () => {
    render(<ResetPasswordForm token={mockToken} />);

    // Check if form is rendered
    expect(screen.getByTestId("reset-password-form")).toBeInTheDocument();

    // Check if sign in link is rendered
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("handles form submission with token", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    render(<ResetPasswordForm token={mockToken} />);

    // Submit the form
    fireEvent.click(screen.getByText("Reset Password"));

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith({
        password: "newpassword123",
        confirmPassword: "newpassword123",
        token: mockToken,
      });
    });

    consoleSpy.mockRestore();
  });
});
