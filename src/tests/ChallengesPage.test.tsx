/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ChallengesPage } from "../features/challenges/ChallengesPage";

vi.mock("../../lib/storage", () => ({
  getChallengesState: vi.fn(() => ({ completed: [], active: [] })),
  updateChallengeStatus: vi.fn(),
}));

describe("ChallengesPage", () => {
  it("renders challenges", () => {
    render(
      <BrowserRouter>
        <ChallengesPage />
      </BrowserRouter>
    );
    expect(screen.getByText("Weekly Eco Challenges")).toBeDefined();
    expect(screen.getAllByText("Start Challenge").length).toBeGreaterThan(0);
  });
});
