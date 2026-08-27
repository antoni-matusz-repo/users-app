import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { UserForm } from "@/components/UserForm";

describe("UserForm", () => {
  it("renderuje pola email, imię, nazwisko oraz przycisk z etykietą", () => {
    const action = vi.fn().mockResolvedValue({});

    render(<UserForm action={action} submitLabel="Dodaj" />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Imię")).toBeInTheDocument();
    expect(screen.getByLabelText("Nazwisko")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dodaj" })).toBeInTheDocument();
  });

  it("wypełnia pola wartościami domyślnymi, gdy podane", () => {
    const action = vi.fn().mockResolvedValue({});

    render(
      <UserForm
        action={action}
        defaultValues={{ email: "alice@example.com", firstName: "Alice", lastName: "Kowalska" }}
        submitLabel="Zapisz"
      />,
    );

    expect(screen.getByLabelText("Email")).toHaveValue("alice@example.com");
    expect(screen.getByLabelText("Imię")).toHaveValue("Alice");
    expect(screen.getByLabelText("Nazwisko")).toHaveValue("Kowalska");
  });
});
