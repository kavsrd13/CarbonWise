/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { OnboardingPage } from "../features/onboarding/OnboardingPage";

describe("OnboardingPage", () => {
  it("renders the first step properly", () => {
    render(
      <BrowserRouter>
        <OnboardingPage />
      </BrowserRouter>
    );
    expect(screen.getByText("Basic Profile")).toBeDefined();
    expect(screen.getByText("Let's establish your environmental baseline.")).toBeDefined();
  });

  it("validates fields before proceeding", () => {
    render(
      <BrowserRouter>
        <OnboardingPage />
      </BrowserRouter>
    );
    // Proceed without filling name
    fireEvent.click(screen.getByText("Next Step"));
    expect(screen.getByText("Name is required.")).toBeDefined();
  });
});
