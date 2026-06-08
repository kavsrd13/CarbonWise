/**
 * Carbon estimate assumptions:
 * These emission factors represent reasonable global or regional average estimates 
 * for educational purposes in a prototype application. 
 * Real-world accounting varies by precise location, grid mix, and time of day.
 * Units are mostly in kg CO2e per unit of activity (e.g. per km, per kWh, per meal).
 */
export const emissionFactors: Record<string, Record<string, number>> = {
  travel: {
    walk: 0,
    cycle: 0,
    bus: 0.05,
    train: 0.04,
    bike_petrol: 0.11,
    car_petrol: 0.19,
    car_diesel: 0.21,
    electric_vehicle: 0.08,
  },
  electricity: {
    grid: 0.7,
  },
  food: {
    vegan: 0.8,
    vegetarian: 1.2,
    mixed: 2.5,
    chicken: 3.0,
    mutton: 7.0,
    packaged: 2.0,
  },
  shopping: {
    clothes: 5.0,
    electronics: 20.0,
    household: 8.0,
    other: 3.0,
  },
  waste: {
    general: 0.5,
    recycled: 0.1,
    compost: 0.05,
  },
};
