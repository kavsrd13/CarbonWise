import { Challenge } from "../types";

export const WEEKLY_CHALLENGES: Challenge[] = [
  // Travel
  {
    id: "t1",
    title: "Use public transport twice this week",
    category: "travel",
    difficulty: "Medium",
    estimatedSaving: 4.5,
    duration: "7 days",
    description: "Leave the car at home and opt for the bus or train for your daily commute or errands."
  },
  {
    id: "t2",
    title: "Walk or cycle for trips under 2 km",
    category: "travel",
    difficulty: "Easy",
    estimatedSaving: 2.0,
    duration: "7 days",
    description: "For short errands or commutes, choose active transport over fuel-based vehicles."
  },
  {
    id: "t3",
    title: "Combine errands into one trip",
    category: "travel",
    difficulty: "Medium",
    estimatedSaving: 3.5,
    duration: "7 days",
    description: "Plan your outings to tick off multiple errands in a single round trip."
  },

  // Electricity
  {
    id: "e1",
    title: "Reduce AC usage by 1 hour daily",
    category: "electricity",
    difficulty: "Medium",
    estimatedSaving: 5.0,
    duration: "7 days",
    description: "Turn off the AC an hour early or rely on fans to cool down."
  },
  {
    id: "e2",
    title: "Switch off unused appliances",
    category: "electricity",
    difficulty: "Easy",
    estimatedSaving: 1.8,
    duration: "7 days",
    description: "Disconnect chargers, TVs, and appliances not in active use to stop standby power drain."
  },
  {
    id: "e3",
    title: "Use natural light for part of the day",
    category: "electricity",
    difficulty: "Easy",
    estimatedSaving: 1.5,
    duration: "7 days",
    description: "Keep artificial lights off during daylight hours."
  },

  // Food
  {
    id: "f1",
    title: "Eat two low-carbon meals this week",
    category: "food",
    difficulty: "Medium",
    estimatedSaving: 3.0,
    duration: "7 days",
    description: "Swap high-impact meals (like mutton or chicken) for plant-based alternatives."
  },
  {
    id: "f2",
    title: "Avoid food delivery packaging for two meals",
    category: "food",
    difficulty: "Easy",
    estimatedSaving: 1.5,
    duration: "7 days",
    description: "Cook at home or dine in to prevent single-use packaging waste."
  },
  {
    id: "f3",
    title: "Try one plant-based meal day",
    category: "food",
    difficulty: "Hard",
    estimatedSaving: 5.0,
    duration: "1 day",
    description: "Commit to eating entirely plant-based meals for an entire day."
  },

  // Shopping
  {
    id: "s1",
    title: "Avoid one non-essential purchase this week",
    category: "shopping",
    difficulty: "Medium",
    estimatedSaving: 4.0,
    duration: "7 days",
    description: "Delay an impulse buy or unnecessary clothing purchase."
  },
  {
    id: "s2",
    title: "Repair or reuse one item",
    category: "shopping",
    difficulty: "Medium",
    estimatedSaving: 5.0,
    duration: "7 days",
    description: "Fix a broken item or find a new use for something you were going to throw away."
  },
  {
    id: "s3",
    title: "Choose a reusable product",
    category: "shopping",
    difficulty: "Easy",
    estimatedSaving: 2.0,
    duration: "7 days",
    description: "Swap a single-use item (like a plastic bag or cup) for a durable reusable version."
  },

  // Waste
  {
    id: "w1",
    title: "Recycle for three days",
    category: "waste",
    difficulty: "Easy",
    estimatedSaving: 1.5,
    duration: "7 days",
    description: "Properly sort and recycle paper, plastic, and glass instead of tossing them."
  },
  {
    id: "w2",
    title: "Compost food waste once",
    category: "waste",
    difficulty: "Medium",
    estimatedSaving: 2.0,
    duration: "1 day",
    description: "Start a small compost bin or drop off organics at a local center."
  },
  {
    id: "w3",
    title: "Avoid single-use plastic for three days",
    category: "waste",
    difficulty: "Hard",
    estimatedSaving: 3.5,
    duration: "7 days",
    description: "Refuse plastic bags, straws, and bottles for three days."
  }
];
