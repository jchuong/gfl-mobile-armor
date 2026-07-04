import { VehicleComponent } from "~/types/VehicleComponent";
import { LoadoutSlotDefinition } from "~/data/vehicle-loadout-slots";
import { isIdealComponent } from "~/utils/vehicle-component";

// Stat rolls are translated to "<label> +<value>" (see translateRoll), talent
// rolls are translated to a bare name with no "+", so this is enough to tell
// them apart without needing the raw "skill:"/"stat:" prefix.
export function getTalents(component: VehicleComponent): string[] {
  const rolls = [
    component.roll_1,
    component.roll_2,
    component.roll_3,
    component.roll_4,
    component.roll_5,
  ];
  return rolls.filter((roll) => roll && !roll.includes("+"));
}

export interface LoadoutSlotResult {
  slot: string;
  allowedNames: string[];
  component: VehicleComponent | null;
  talents: string[];
}

export interface LoadoutResult {
  slots: LoadoutSlotResult[];
  talentCoverage: string[];
}

function talentSignature(component: VehicleComponent): string {
  return getTalents(component).slice().sort().join(",");
}

// Dedupe same-name candidates that offer an identical set of talents (owning
// 5 Cannons with the same 2 rolls is the same choice 5 times over), keeping
// the highest-level copy of each unique signature.
function dedupeCandidates(candidates: VehicleComponent[]): VehicleComponent[] {
  const bySignature = new Map<string, VehicleComponent>();
  for (const candidate of candidates) {
    const key = talentSignature(candidate);
    const existing = bySignature.get(key);
    if (!existing || candidate.level > existing.level) {
      bySignature.set(key, candidate);
    }
  }
  return [...bySignature.values()];
}

function unionTalents(assignment: (VehicleComponent | null)[]): Set<string> {
  const talents = new Set<string>();
  for (const component of assignment) {
    if (component) {
      getTalents(component).forEach((talent) => talents.add(talent));
    }
  }
  return talents;
}

const MAX_SEARCH_SPACE = 50_000;

// Picks one candidate per slot maximizing the number of distinct talents
// covered across the whole loadout (i.e. favors variety, penalizes two slots
// rolling the same talent). Brute-forces all combinations when the search
// space is small enough, otherwise falls back to a greedy pass ordered by
// most-constrained slot first.
export function generateLoadout(
  components: VehicleComponent[],
  slotDefs: LoadoutSlotDefinition[],
): LoadoutResult {
  const pool = components.filter((component) => component.is_locked || isIdealComponent(component));

  const slotCandidates = slotDefs.map((def) =>
    dedupeCandidates(pool.filter((component) => def.allowedNames.includes(component.name))),
  );

  const searchSpaceSize = slotCandidates.reduce(
    (acc, candidates) => acc * Math.max(candidates.length, 1),
    1,
  );

  let bestAssignment: (VehicleComponent | null)[];

  if (searchSpaceSize <= MAX_SEARCH_SPACE) {
    let best: { assignment: (VehicleComponent | null)[]; score: number } | null = null;
    const assignment: (VehicleComponent | null)[] = Array.from(
      { length: slotDefs.length },
      () => null,
    );

    const recurse = (i: number) => {
      if (i === slotDefs.length) {
        const score = unionTalents(assignment).size;
        if (!best || score > best.score) {
          best = { assignment: [...assignment], score };
        }
        return;
      }
      const candidates = slotCandidates[i];
      if (candidates.length === 0) {
        assignment[i] = null;
        recurse(i + 1);
        return;
      }
      for (const candidate of candidates) {
        assignment[i] = candidate;
        recurse(i + 1);
      }
    };
    recurse(0);
    bestAssignment = best!.assignment;
  } else {
    // Greedy fallback: fill the most-constrained slots first, each time
    // picking the candidate that adds the most previously-uncovered talents.
    const order = slotCandidates
      .map((_, i) => i)
      .sort((a, b) => slotCandidates[a].length - slotCandidates[b].length);
    const assignment: (VehicleComponent | null)[] = Array.from(
      { length: slotDefs.length },
      () => null,
    );
    const usedTalents = new Set<string>();
    for (const i of order) {
      const candidates = slotCandidates[i];
      if (candidates.length === 0) {
        continue;
      }
      let bestCandidate = candidates[0];
      let bestNewTalents = -1;
      for (const candidate of candidates) {
        const newTalents = getTalents(candidate).filter(
          (talent) => !usedTalents.has(talent),
        ).length;
        if (newTalents > bestNewTalents) {
          bestNewTalents = newTalents;
          bestCandidate = candidate;
        }
      }
      assignment[i] = bestCandidate;
      getTalents(bestCandidate).forEach((talent) => usedTalents.add(talent));
    }
    bestAssignment = assignment;
  }

  const slots: LoadoutSlotResult[] = slotDefs.map((def, i) => ({
    slot: def.slot,
    allowedNames: def.allowedNames,
    component: bestAssignment[i],
    talents: bestAssignment[i] ? getTalents(bestAssignment[i]!) : [],
  }));

  return { slots, talentCoverage: [...unionTalents(bestAssignment)] };
}
