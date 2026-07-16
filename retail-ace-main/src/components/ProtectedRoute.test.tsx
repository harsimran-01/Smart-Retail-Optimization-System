import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";

describe("ProtectedRoute", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("allows access when a stored auth token exists", async () => {
    window.localStorage.setItem("rp_token", btoa(JSON.stringify({ id: "u1" })));

    render(
      <MemoryRouter>
        <AuthProvider>
          <ProtectedRoute>
            <div>Protected content</div>
          </ProtectedRoute>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
  });
});
