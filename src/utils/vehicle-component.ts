import { VehicleComponent, VehicleComponentWithUserInfo } from "~/types/VehicleComponent";

export function convertRawToVehicleComponent(input: VehicleComponentWithUserInfo) {
    console.log(input);
    return Object.values(input).map((component): VehicleComponent => {
        return {
            id: Number(component.id),
            component_id: Number(component.component_id),
            name: component.component_id,
            level: Number(component.level),
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
        } as VehicleComponent
    });
}