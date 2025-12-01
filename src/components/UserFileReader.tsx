import { Show } from "solid-js";
import { VehicleComponent } from "~/types/VehicleComponent";
import { convertRawToVehicleComponent } from "~/utils/vehicle-component";
import ComponentTable from "./ComponentTable";
import { createStore } from "solid-js/store";

export default function UserFileReader() {
  const [vehicleComponents, setVehicleComponents] = createStore<
    VehicleComponent[]
  >([]);

  const readFile = async (file: File | null) => {
    if (!file) {
      setVehicleComponents([]);
      return;
    }
    const content = await file.text();
    try {
      const jsonContent = JSON.parse(content);
      const components = convertRawToVehicleComponent(
        jsonContent["vehicle_component_with_user_info"],
      );
      setVehicleComponents(components);
    } catch {
      setVehicleComponents([]);
    }
  };

  return (
    <div>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Input user_info.json</legend>
        <input
          type="file"
          class="file-input"
          onChange={async (event) => {
            readFile(event.target.files ? event.target.files[0] : null);
          }}
        />
        <label class="label">user_info.json from GFAlarm</label>
      </fieldset>
      <Show when={vehicleComponents.length > 0}>
        <ComponentTable data={vehicleComponents} />
      </Show>
    </div>
  );
}
