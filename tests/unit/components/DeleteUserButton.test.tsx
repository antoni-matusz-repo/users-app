import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteUserButton } from "@/components/DeleteUserButton";

vi.mock("@/server/users", () => ({
  deleteUser: vi.fn().mockResolvedValue({}),
}));

const confirmationText = /Usunąć użytkownika/;

describe("DeleteUserButton", () => {
  it("nie pokazuje dialogu potwierdzenia od razu po renderze", () => {
    render(<DeleteUserButton id="1" name="Alice" />);

    expect(screen.getByRole("button", { name: "Usuń" })).toBeInTheDocument();
    expect(screen.queryByText(confirmationText)).not.toBeInTheDocument();
  });

  it("otwiera dialog z potwierdzeniem po kliknięciu Usuń", async () => {
    const user = userEvent.setup();
    render(<DeleteUserButton id="1" name="Alice" />);

    await user.click(screen.getByRole("button", { name: "Usuń" }));

    expect(await screen.findByText(confirmationText)).toBeVisible();
    expect(screen.getByRole("button", { name: "Anuluj" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Tak, usuń" })).toBeVisible();
  });

  it("zamyka dialog po kliknięciu Anuluj, bez wywołania usunięcia", async () => {
    const { deleteUser } = await import("@/server/users");
    const user = userEvent.setup();
    render(<DeleteUserButton id="1" name="Alice" />);

    await user.click(screen.getByRole("button", { name: "Usuń" }));
    await screen.findByText(confirmationText);
    await user.click(screen.getByRole("button", { name: "Anuluj" }));

    expect(screen.queryByText(confirmationText)).not.toBeInTheDocument();
    expect(deleteUser).not.toHaveBeenCalled();
  });
});
