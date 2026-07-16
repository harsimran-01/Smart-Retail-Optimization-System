import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Index from "./Index";

describe("Index landing page", () => {
  it("shows the hero content for RetailPulse", () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /retailpulse/i })).toBeInTheDocument();
    expect(screen.getByText(/ai-powered smart retail management/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
  });
});
