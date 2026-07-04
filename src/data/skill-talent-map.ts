// Maps the numeric `skill:<id>` values found in real user_info.json roll_1-5
// fields to their talent name (as named in en.json's vehicle_component_roll_type-*
// entries).
//
// UNVERIFIED / REVERSE-ENGINEERED: en.json has no entries at all for these
// specific skill IDs (only 43 category names like "Melee Attack" or "Heavy
// Weapon Shield" - no ID -> name table). This map was inferred by:
//   1. Grouping the 43 unique skill IDs seen in a real save file by which
//      component types (Heavy/Light/Function/Defense) they exclusively
//      appear on. This produced groups of exactly 10 Heavy-only, 10
//      Light-only, 9 Function-only, 2 Defense-only, and 12 shared IDs -
//      which matches the exact sizes of en.json's talent categories, so the
//      *grouping* is well-evidenced.
//   2. Within each group, assigning specific names using frequency and
//      component-type breadth as a proxy for how universally good/common a
//      talent is (e.g. the one Light-only ID that appears on every single
//      Light Weapon type, at the highest frequency, was assigned "Melee
//      Attack" - the flagship Light talent per the loadout guide).
//   3. Remaining IDs (not needed by ideal-components.ts) were assigned by
//      simple positional pairing and are lower-confidence than 1-2.
//
// If you can confirm any of these in-game (or via GFAlarm), please correct
// them here.
export const SKILL_ID_TO_TALENT: Record<string, string> = {
  // Heavy Weapon-exclusive
  "220167": "Anti-Armor Specialization",
  "220173": "Heavy Weapon Shield",
  "220175": "Anti-Mechanical Unit Specialization",
  "220180": "Anti-Dummy-Linked Unit Specialization",
  "220181": "Weak Point Targeting",
  "220185": "Elite Attack",
  "770045": "Heavy Weapon Support",
  "770081": "Heavy Weapon Weakening",
  "770091": "Heavy Weapon Detonation",
  "770093": "Heavy Weapon Charge",
  // Light Weapon-exclusive
  "220187": "Rapid Enhancement",
  "770036": "Anti-Unarmored Unit Specialization",
  "770038": "Anti-Doll Specialization",
  "770046": "Light Weapon Detonation",
  "770082": "Light Weapon Charge",
  "770090": "Light Weapon Shield",
  "770092": "Light Weapon Weakening",
  "770106": "Melee Attack",
  "770113": "Light Weapon Support",
  "770125": "Single-Target Specialization",
  // Shared / universal
  "220182": "Pre-emptive Shield",
  "220183": "Shielded Damage Boost",
  "770014": "Cleansing Shield",
  "770016": "Melee Threat",
  "770019": "Emergency Shield",
  "770024": "Elite Amplification",
  "770026": "Debuff Amplification",
  "770028": "Charge Conversion",
  "770030": "Paradeus Amplification",
  "770032": "Military Amplification",
  "770034": "Sangvis Ferri Amplification",
  "770037": "Marker Amplification",
  "770039": "Emergency Amplification",
  "770040": "Random Weakening",
  "770041": "Malfunction Stun",
  "770047": "Stun Attack",
  "770084": "Stun Penalty",
  "770096": "Stunned and Exposed",
  "770100": "Mobbed Damage Reduction",
  "770104": "Stunned Self-Destruct",
  "770107": "Shield Deflection",
  "770109": "Pre-emptive Suppression",
  "770114": "Marker Detonation",
};

// Stat rolls are stored as "<field>:<value>" (e.g. "dodge:5") rather than
// "skill:<id>", so they need no ID lookup - just a display label per field.
// These are taken directly from en.json's vehicle_component_roll_type-10001*
// entries, which line up 1:1 with VehicleComponent's numeric stat fields.
export const STAT_ROLL_LABELS: Record<string, string> = {
  heavy_damage: "Heavy Weapon Damage",
  reload: "Reload Speed",
  precision: "Precision",
  H_armor_piercing: "Heavy Weapon AP",
  light_damage: "Light Weapon Damage",
  atk_speed: "ROF",
  hit: "Accuracy",
  L_armor_piercing: "Light Weapon AP",
  crit_rate: "Critical Rate",
  crit_damage: "Critical Damage",
  armor: "Armor",
  dodge: "Evasion",
  def_break: "Pierce",
};
