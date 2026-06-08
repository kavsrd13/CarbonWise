/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { Navbar } from "../components/Navbar";

describe("Navbar", () => {
  it("renders CarbonWise brand", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText("CarbonWise")).toBeDefined();
  });

  it("renders links when not on onboarding page", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText("Dashboard")).toBeDefined();
    expect(screen.getByText("Activities")).toBeDefined();
    expect(screen.getByText("EcoCoach")).toBeDefined();
  });

  it("does not render links on onboarding page", () => {
    render(
      <MemoryRouter initialEntries={["/onboarding"]}>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.queryByText("Dashboard")).toBeNull();
  });
});
