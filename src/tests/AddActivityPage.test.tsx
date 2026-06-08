/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AddActivityPage } from "../features/activities/AddActivityPage";

describe("AddActivityPage", () => {
  it("renders title and tabs", () => {
    render(
      <BrowserRouter>
        <AddActivityPage />
      </BrowserRouter>
    );
    expect(screen.getByText("Log New Activity")).toBeDefined();
    expect(screen.getByText("Travel")).toBeDefined();
    expect(screen.getByText("Food")).toBeDefined();
  });

  it("can switch tabs", () => {
    render(
      <BrowserRouter>
        <AddActivityPage />
      </BrowserRouter>
    );
    
    // Initially travel form is visible (Transport Mode)
    expect(screen.getByText("Transport Mode")).toBeDefined();
    
    // Switch to Food
    fireEvent.click(screen.getAllByText("Food")[0]);
    expect(screen.getByText("Meal Type")).toBeDefined();
  });
});
