// Ideal component/talent combos synthesized from gfl1_vehicle_loadouts.md
// (itself built from varz's Component Tierlist). A component only counts as
// "ideal" if its name matches AND it rolled one of the listed talents.
export const IDEAL_TALENTS_BY_COMPONENT: Record<string, string[]> = {
  Cannon: ["Heavy Weapon Shield", "Weak Point Targeting"],
  "Grenade Launcher": ["Heavy Weapon Shield"],
  "Lightweight Rapid-Fire Railgun": ["Mobbed Damage Reduction", "Melee Attack"],
  "Rotating Turret": ["Melee Attack", "Debuff Amplification"],
  "Anti-Armor Sniper Rifle": ["Melee Attack", "Debuff Amplification"],
  "Shield Generator": ["Shield Deflection"],
  "Automated Defense System": ["Shield Deflection"],
  "Signal Receiver": ["Charge Conversion", "Debuff Amplification"],
  "Laser Rangefinder": ["Charge Conversion", "Debuff Amplification"],
  Jammer: ["Charge Conversion", "Debuff Amplification"],
};
