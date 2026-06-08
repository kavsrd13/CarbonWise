/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./features/landing/LandingPage";
import { OnboardingPage } from "./features/onboarding/OnboardingPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { AddActivityPage } from "./features/activities/AddActivityPage";
import { EcoCoachPage } from "./features/coach/EcoCoachPage";
import { ChallengesPage } from "./features/challenges/ChallengesPage";
import { SettingsPage } from "./features/profile/SettingsPage";
import { isOnboardingCompleted } from "./lib/storage";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isDone = isOnboardingCompleted();
  return isDone ? children : <Navigate to="/onboarding" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/add" element={<PrivateRoute><AddActivityPage /></PrivateRoute>} />
        <Route path="/coach" element={<PrivateRoute><EcoCoachPage /></PrivateRoute>} />
        <Route path="/challenges" element={<PrivateRoute><ChallengesPage /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}
