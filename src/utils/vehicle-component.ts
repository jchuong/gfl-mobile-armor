import {
  ComponentType,
  Rarity,
  RawVehicleComponent,
  VehicleComponent,
  VehicleComponentWithUserInfo,
} from "~/types/VehicleComponent";
import t from "~/data/en.json";

interface Translation {
  [key: string]: string;
}

const translation = t as Translation;

export function getNameOfComponent(componentId: number | string) {
  const key = `vehicle_component-1000${componentId}`;
  return translation[key] ?? key;
}

export function componentIdToRarity(componentId: number | string): Rarity {
  const exp = Math.floor(Number(componentId) / 1000);
  switch (exp) {
    case 1:
      return 5;
    case 2:
      return 4;
    case 3:
      return 3;
    default:
      return 5;
  }
}

export function getComponentType(componentId: number | string): ComponentType {
  const baseId = Number(componentId) % 1000;
  if (baseId < 13) {
    return "Unversal Component";
  }
  const lightWeapons = [101, 102, 103, 104, 106, 107, 122, 126, 128, 130];
  if (lightWeapons.includes(baseId)) {
    return "Light Weapon";
  }
  const heavyWeapons = [108, 109, 110, 111, 112, 113, 118, 119, 120, 131];
  if (heavyWeapons.includes(baseId)) {
    return "Heavy Weapon";
  }
  const functionComponents = [105, 114, 115, 116, 117, 123, 125, 129, 132];
  if (functionComponents.includes(baseId)) {
    return "Function Component";
  }
  // const defenseComponents = [121, 124, 126, 133, 134];
  return "Defense Component";
}

function hashComponent(component: RawVehicleComponent): string {
  const keys = [
    getNameOfComponent(component.component_id),
    component.roll_1,
    component.roll_2,
    component.roll_3,
  ];
  return keys.join("|");
}

function getUniqueCounts(components: RawVehicleComponent[]) {
  const counts = new Map();
  components.forEach((comp) => {
    const hash = hashComponent(comp);
    const count = counts.get(hash) ?? 0;
    counts.set(hash, count + 1);
  });
  return counts;
}

export function convertRawToVehicleComponent(
  input: VehicleComponentWithUserInfo,
) {
  const componentList = Object.values(input)
  const countUniqueComponents = getUniqueCounts(componentList);
  return componentList.map(
    (component: RawVehicleComponent): VehicleComponent => {
      const hash = hashComponent(component);
      return {
        id: Number(component.id),
        component_id: Number(component.component_id),
        name: getNameOfComponent(component.component_id),
        rarity: componentIdToRarity(component.component_id),
        level: Number(component.level),
        type: getComponentType(component.component_id),
        hash: hash,
        duplicateCount: countUniqueComponents.get(hash) ?? 1,
        skin: component.skin,
        is_locked: component.is_locked === "1",
        roll_1: component.roll_1,
        roll_2: component.roll_2,
        roll_3: component.roll_3,
        roll_4: component.roll_4,
        roll_5: component.roll_5,
        unlocked_att: component.unlocked_att,
        heavy_damage: Number(component.heavy_damage),
        light_damage: Number(component.light_damage),
        reload: Number(component.light_damage),
        precision: Number(component.precision),
        atk_speed: Number(component.atk_speed),
        hit: Number(component.hit),
        armor: Number(component.armor),
        dodge: Number(component.dodge),
        crit_rate: Number(component.crit_rate),
        crit_damage: Number(component.crit_damage),
        L_armor_piercing: Number(component.L_armor_piercing),
        H_armor_piercing: Number(component.H_armor_piercing),
        def_break: Number(component.def_break),
        skill: component.skill,
      };
    },
  );
}
