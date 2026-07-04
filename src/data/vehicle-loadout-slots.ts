// Slot layout for the General-Purpose Tank and Mech builds from
// gfl1_vehicle_loadouts.md (sections 1 & 2). Each slot lists the component
// names that are an acceptable fit for that slot.
export interface LoadoutSlotDefinition {
  slot: string;
  allowedNames: string[];
}

export const TANK_SLOTS: LoadoutSlotDefinition[] = [
  { slot: "Flex (Heavy)", allowedNames: ["Cannon"] },
  { slot: "Heavy", allowedNames: ["Grenade Launcher"] },
  { slot: "Light", allowedNames: ["Lightweight Rapid-Fire Railgun"] },
  { slot: "Defensive", allowedNames: ["Shield Generator", "Automated Defense System"] },
  { slot: "Function", allowedNames: ["Signal Receiver", "Laser Rangefinder", "Jammer"] },
];

export const MECH_SLOTS: LoadoutSlotDefinition[] = [
  { slot: "Flex (Heavy)", allowedNames: ["Cannon", "Grenade Launcher"] },
  { slot: "Light", allowedNames: ["Lightweight Rapid-Fire Railgun"] },
  { slot: "Light", allowedNames: ["Rotating Turret", "Anti-Armor Sniper Rifle"] },
  { slot: "Defensive", allowedNames: ["Shield Generator", "Automated Defense System"] },
  { slot: "Function", allowedNames: ["Signal Receiver", "Jammer"] },
];
