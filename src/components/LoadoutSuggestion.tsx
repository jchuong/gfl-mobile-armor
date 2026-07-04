import { createMemo, createSignal, For, Show } from "solid-js";
import { VehicleComponent } from "~/types/VehicleComponent";
import { generateLoadout } from "~/utils/loadout";
import { MECH_SLOTS, TANK_SLOTS } from "~/data/vehicle-loadout-slots";

interface LoadoutSuggestionProps {
  data: VehicleComponent[];
}

type VehicleKind = "Tank" | "Mech";

export default function LoadoutSuggestion(props: LoadoutSuggestionProps) {
  const [vehicle, setVehicle] = createSignal<VehicleKind>("Tank");
  const loadout = createMemo(() =>
    generateLoadout(props.data, vehicle() === "Tank" ? TANK_SLOTS : MECH_SLOTS),
  );

  return (
    <div class="m-2 rounded-box border border-base-content/5 bg-base-100 p-4">
      <div class="mb-3 flex items-center gap-2">
        <span class="font-semibold">Suggested loadout (from locked + ideal components)</span>
        <div class="join">
          <button
            class={`btn btn-sm join-item ${vehicle() === "Tank" ? "btn-active" : ""}`}
            onClick={() => setVehicle("Tank")}
          >
            Tank
          </button>
          <button
            class={`btn btn-sm join-item ${vehicle() === "Mech" ? "btn-active" : ""}`}
            onClick={() => setVehicle("Mech")}
          >
            Mech
          </button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Slot</th>
            <th>Component</th>
            <th>Talents</th>
          </tr>
        </thead>
        <tbody>
          <For each={loadout().slots}>
            {(slot) => (
              <tr>
                <td>{slot.slot}</td>
                <td>
                  <Show
                    when={slot.component}
                    fallback={
                      <span class="text-error">none owned ({slot.allowedNames.join(" / ")})</span>
                    }
                  >
                    {slot.component!.name} (★{slot.component!.rarity} Lv{slot.component!.level})
                  </Show>
                </td>
                <td>{slot.talents.join(", ") || "—"}</td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
      <p class="mt-2 text-sm">
        Distinct talents covered: {loadout().talentCoverage.join(", ") || "none"}
      </p>
    </div>
  );
}
