# CarbonWise — Your AI Carbon Coach

## Vertical
Carbon Footprint Awareness Platform

## Problem Statement
Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

## Approach
CarbonWise is built as a highly responsive, modern React application simulating an AI carbon coach. We focus on low-barrier entry (no backend required to start playing with it) by utilizing browser `localStorage` as our primary persistence layer. This ensures the footprint tracker and eco-score logic works perfectly for a standalone hackathon demo, adhering to strict zero-infrastructure constraints. 

## Key Features
- **Intuitive Activity Logging:** Simple forms to categorize daily habits like travel, electricity, food, shopping, and waste.
- **Dynamic EcoScore:** A running score out of 100 that adapts immediately based on positive logging habits, high footprint penalties, and challenge competitions.
- **Smart Insight Engine:** Intelligent textual insights analyzing user data to identify their most impactful category and suggest high-yield weekly actions.
- **Weekly Eco Challenges:** Actionable commitments with estimated CO₂e savings.
- **Data Privacy:** 100% local operation—no API keys or remote backend needed. Perfect for demonstration.

## Smart Assistant Logic
The insights provided by the application are processed via our deterministic *Smart Insight Engine* (`src/lib/insightEngine.ts`):
1. Aggregates weekly logs by category.
2. Identifies the primary emission source (e.g., heavily reliant on petrol car commuting).
3. Matches the pattern against tailored, multi-day action plans (e.g., "Use natural light until sunset").
4. Generates a personalized 7-Day Plan and quantifies potential CO₂e savings.
*Note: All emission estimates are simplified averages intended purely for awareness and behavioral nudging, rather than scientific precision.*

## How App Works
1. **Onboarding Context:** Users complete a rapid 5-step quiz to baseline their habits.
2. **Dashboard Visuals:** Key metrics (daily/weekly totals, EcoScore, and charts) are visualized.
3. **Daily Tracking:** Users add activities and see instant changes to their summary.
4. **Insights:** The EcoCoach updates automatically when sufficient data is gathered.
5. **Challenges:** Users accept or complete curated eco challenges to earn score points.

## Tech Stack
- Frontend: **React** (v19)
- Routing: **React Router v7**
- Styling: **Tailwind CSS v4**
- Visualizations: **Recharts**
- Icons: **Lucide React**
- Build Tool: **Vite**
- State/Storage: Context/Hooks over **LocalStorage**
- Testing: **Vitest**

## Project Structure
```
/
├── public/
├── src/
│   ├── components/  # Core shared UI (Layout, Navbar)
│   ├── data/        # Hardcoded constraints (Emission factors, Challenges)
│   ├── features/    # Page-level route views
│   ├── lib/         # Core isolated logic (Calculators, Storage API)
│   ├── tests/       # Vitest unit test suites
│   ├── types/       # Global TypeScript interfaces
│   └── index.css    # Tailwind entry point
```

## Carbon Calculation Assumptions
Emissions are calculated formulaically based on standard general estimates: `Emission = Quantity × Emission Factor`.
- *Example:* Petrol Car (0.19 kg/km)
- *Example:* Standard mixed diet (2.5 kg/meal)
Constants are strictly mapped in `src/data/emissionFactors.ts`. Because exact data varies drastically by region, these stand as placeholders.

## Security
This application is completely self-contained. It operates with zero backend queries and no central database. User profiles and carbon logs interact strictly with their local browser storage container, satisfying the constraint to not hardcode API secrets.

## Accessibility
Includes keyboard accessibility semantics (focus rings), WCAG-friendly minimum color contrast, standard alt-labels, and does not obfuscate essential logic inside charts-only components (vital metrics are always textual).

## How to Run Locally
1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. The application is natively hosted at: `http://localhost:3000`

## How to Run Tests
The repository includes unit tests built carefully around our deterministic carbon and insight engines.
- Execute tests via: `npm run test`

## Future Improvements
- **Real-Time API Integrations:** Connecting APIs such as Google Maps for exact public transit route offsets.
- **Social Leaderboards:** Comparing EcoScores securely against friends using a hosted DB.
- **Barcode Scanning:** Using native device cameras to estimate footprint impact off product packages.
