export type UnitCategory = "length" | "weight" | "temperature" | "volume" | "speed" | "area";

export interface Unit {
  id: string;
  label: string; // shown in the menu
  symbol: string;
  factor: number; // size of one unit in the category's base unit
}

// Base units: metre, kilogram, litre, metre per second, square metre.
// Temperature is handled separately because it is not a simple multiple.
export const UNITS: Record<Exclude<UnitCategory, "temperature">, Unit[]> = {
  length: [
    { id: "m", label: "Metres", symbol: "m", factor: 1 },
    { id: "km", label: "Kilometres", symbol: "km", factor: 1000 },
    { id: "cm", label: "Centimetres", symbol: "cm", factor: 0.01 },
    { id: "mm", label: "Millimetres", symbol: "mm", factor: 0.001 },
    { id: "mi", label: "Miles", symbol: "mi", factor: 1609.344 },
    { id: "yd", label: "Yards", symbol: "yd", factor: 0.9144 },
    { id: "ft", label: "Feet", symbol: "ft", factor: 0.3048 },
    { id: "in", label: "Inches", symbol: "in", factor: 0.0254 },
  ],
  weight: [
    { id: "kg", label: "Kilograms", symbol: "kg", factor: 1 },
    { id: "g", label: "Grams", symbol: "g", factor: 0.001 },
    { id: "mg", label: "Milligrams", symbol: "mg", factor: 0.000001 },
    { id: "t", label: "Metric tonnes", symbol: "t", factor: 1000 },
    { id: "lb", label: "Pounds", symbol: "lb", factor: 0.45359237 },
    { id: "oz", label: "Ounces", symbol: "oz", factor: 0.028349523125 },
    { id: "st", label: "Stone", symbol: "st", factor: 6.35029318 },
  ],
  volume: [
    { id: "l", label: "Litres", symbol: "L", factor: 1 },
    { id: "ml", label: "Millilitres", symbol: "mL", factor: 0.001 },
    { id: "gal-us", label: "US gallons", symbol: "US gal", factor: 3.785411784 },
    { id: "gal-uk", label: "UK gallons", symbol: "UK gal", factor: 4.54609 },
    { id: "qt-us", label: "US quarts", symbol: "US qt", factor: 0.946352946 },
    { id: "pt-us", label: "US pints", symbol: "US pt", factor: 0.473176473 },
    { id: "cup-us", label: "US cups", symbol: "cup", factor: 0.2365882365 },
    { id: "floz-us", label: "US fluid ounces", symbol: "US fl oz", factor: 0.0295735295625 },
    { id: "tbsp-us", label: "US tablespoons", symbol: "tbsp", factor: 0.01478676478125 },
    { id: "tsp-us", label: "US teaspoons", symbol: "tsp", factor: 0.00492892159375 },
  ],
  speed: [
    { id: "ms", label: "Metres per second", symbol: "m/s", factor: 1 },
    { id: "kmh", label: "Kilometres per hour", symbol: "km/h", factor: 1 / 3.6 },
    { id: "mph", label: "Miles per hour", symbol: "mph", factor: 0.44704 },
    { id: "kn", label: "Knots", symbol: "kn", factor: 1852 / 3600 },
    { id: "fts", label: "Feet per second", symbol: "ft/s", factor: 0.3048 },
  ],
  area: [
    { id: "m2", label: "Square metres", symbol: "m²", factor: 1 },
    { id: "km2", label: "Square kilometres", symbol: "km²", factor: 1e6 },
    { id: "cm2", label: "Square centimetres", symbol: "cm²", factor: 0.0001 },
    { id: "ha", label: "Hectares", symbol: "ha", factor: 10000 },
    { id: "acre", label: "Acres", symbol: "ac", factor: 4046.8564224 },
    { id: "ft2", label: "Square feet", symbol: "ft²", factor: 0.09290304 },
    { id: "yd2", label: "Square yards", symbol: "yd²", factor: 0.83612736 },
    { id: "in2", label: "Square inches", symbol: "in²", factor: 0.00064516 },
    { id: "mi2", label: "Square miles", symbol: "mi²", factor: 2589988.110336 },
  ],
};

export const TEMPERATURE_UNITS: Unit[] = [
  { id: "c", label: "Celsius", symbol: "°C", factor: 1 },
  { id: "f", label: "Fahrenheit", symbol: "°F", factor: 1 },
  { id: "k", label: "Kelvin", symbol: "K", factor: 1 },
];

export const CATEGORY_LABELS: Record<UnitCategory, string> = {
  length: "Length",
  weight: "Weight",
  temperature: "Temperature",
  volume: "Volume",
  speed: "Speed",
  area: "Area",
};

export function unitsFor(category: UnitCategory): Unit[] {
  return category === "temperature" ? TEMPERATURE_UNITS : UNITS[category];
}
