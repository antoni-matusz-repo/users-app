import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { UserForm } from "@/components/UserForm";

describe("UserForm", () => {
  it("renderuje pola email i nazwa oraz przycisk z etykietą", () => {
    const action = vi.fn().mockResolvedValue({});

    render(<UserForm action={action} submitLabel="Dodaj" />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Nazwa")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dodaj" })).toBeInTheDocument();
  });

  it("wypełnia pola wartościami domyślnymi, gdy podane", () => {
    const action = vi.fn().mockResolvedValue({});

    render(
      <UserForm
        action={action}
        defaultValues={{ email: "alice@example.com", name: "Alice" }}
        submitLabel="Zapisz"
      />,
    );

    expect(screen.getByLabelText("Email")).toHaveValue("alice@example.com");
    expect(screen.getByLabelText("Nazwa")).toHaveValue("Alice");
  });
});
