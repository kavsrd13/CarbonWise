/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import { DashboardPage } from "../features/dashboard/DashboardPage";

vi.mock("recharts", () => {
  return {
    ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => <div style={{ width: '100px', height: '100px' }}>{children}</div>,
    PieChart: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    Pie: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    Cell: () => <div></div>,
    BarChart: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    Bar: () => <div></div>,
    XAxis: () => <div></div>,
    YAxis: () => <div></div>,
    Tooltip: () => <div></div>,
    LineChart: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    Line: () => <div></div>,
  };
});

// Mock resize observer for Recharts
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

vi.mock("../../lib/storage", () => ({
  getUserProfile: vi.fn(() => ({ name: "Test User" })),
  getActivityLogs: vi.fn(() => []),
  getChallengesState: vi.fn(() => ({ completed: [], active: [] })),
}));

describe("DashboardPage", () => {
  it("renders with mock data", async () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );
    expect(await screen.findByText(/Hello, /i)).toBeDefined();
    expect(screen.getByText("EcoScore")).toBeDefined();
  });
});
