# CarbonWise — Your AI Carbon Coach

**Live Demo:** [Placeholder Link](#)

## Vertical
Carbon Footprint Awareness Platform

## Problem Statement
Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

## Project Overview
CarbonWise is built as a highly responsive, modern React application serving as a personal carbon footprint coach. We focus on low-barrier entry (no backend required to start) by utilizing browser `localStorage` as our primary persistence layer. It empowers users to visualize their daily choices and make climate-positive changes effortlessly.

## Track → Understand → Reduce Approach
CarbonWise follows a proven, simple three-step process:
- **Track**: Log your daily habits and see your estimated footprint securely.
- **Understand**: Analyze simple charts and read personalized textual explanations to identify patterns.
- **Reduce**: Take recommended actions and complete personalized weekly challenges to lower your emissions.

## Smart EcoCoach Assistant Explanation
CarbonWise involves an intelligent assistant that guides the sustainability journey. The insights provided by the application are processed via our deterministic *Smart Insight Engine*.

**Rule-based decision-making logic:**
CarbonWise intentionally uses a rule-based EcoCoach in the MVP. This keeps the app secure, lightweight, and fully functional without exposing API keys in a frontend-only public repository. The assistant uses user context, activity history, top emission category, and challenge progress to generate personalized recommendations.

It automatically:
1. Aggregates weekly logs by category.
2. Identifies the primary emission source.
3. Matches the pattern against tailored, multi-day action plans.
4. Generates the 'Next Best Action' and quantifies potential CO₂e savings.

## Key Features
- **Intuitive Activity Logging:** Simple forms to categorize daily habits like travel, electricity, food, shopping, and waste.
- **Dynamic EcoScore:** A running score out of 100 that adapts immediately based on positive logging habits, footprint penalties, and challenges.
- **Smart Insight Engine:** Intelligent insights analyzing user data to suggest high-yield weekly actions.
- **Personalized Challenges:** Recommended challenges logically based on the top emission category, not random order.
- **Data Privacy:** 100% local operation—no API keys or remote backend needed.

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
Constants are mapped in `src/data/emissionFactors.ts`. Because exact data varies drastically by region, these stand as placeholders.

> **Disclaimer:** Carbon estimates are simplified values for awareness and education. They are not official carbon accounting results.

## EcoScore Explanation
The EcoScore is a dynamic value between 0 and 100. It starts at a base score and increases by completing challenges and maintaining lower footprints. Conversely, excessively high carbon activities deduct from the score. This provides an immediate gamified feedback loop for behavior change.

## Challenge Recommendation logic
Recommendations sort the weekly challenges to prioritize your specific highest-emission category (e.g., if travel emits the most, travel challenges are surfaced first and marked as 'Recommended'). The underlying engine aggregates this sorting logic locally without server-side processing.

## Security considerations
This application is completely self-contained. It operates with zero backend queries and no central database. User profiles and carbon logs interact strictly with their local browser storage container, satisfying the constraint to not expose API secrets.

## Accessibility considerations
Includes keyboard accessibility semantics (focus rings), WCAG-friendly minimum color contrast, standard textual alternatives, and does not obfuscate essential logic inside charts-only components (vital metrics are always textual).

## Testing strategy
The repository includes comprehensive unit testing built carefully around our deterministic carbon calculator, score engines, and UI rendering hooks. Vitest executes isolated component and logic evaluations to assure core integrity.

## How to run locally
1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. The application is natively hosted at: `http://localhost:3000`

## How to run tests
1. Execute tests via: `npx vitest run` or `npm run test`

## How to build
1. Run `npm run build`
2. Resulting assets are bundled into a `/dist` directory for standard static-web hosting deployables.

## Future improvements
- **Real-Time API Integrations:** Connecting APIs such as Google Maps for exact public transit route offsets.
- **Social Leaderboards:** Comparing EcoScores securely against friends using a hosted DB.
- **Barcode Scanning:** Using native device cameras to estimate footprint impact off product packages.
