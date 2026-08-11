import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { UsersTable } from "@/components/UsersTable";

describe("UsersTable", () => {
  it("renderuje wiersze z przykładowymi danymi", () => {
    render(
      <UsersTable
        users={[
          {
            id: "1",
            email: "alice@example.com",
            name: "Alice Kowalska",
            createdAt: new Date("2026-01-01T10:00:00Z"),
          },
          {
            id: "2",
            email: "bob@example.com",
            name: "Bob Nowak",
            createdAt: new Date("2026-02-01T10:00:00Z"),
          },
        ]}
      />,
    );

    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });

  it("pokazuje komunikat, gdy lista użytkowników jest pusta", () => {
    render(<UsersTable users={[]} />);

    expect(screen.getByText("Brak użytkowników.")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
