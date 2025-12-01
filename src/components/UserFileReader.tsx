import { createSignal, Show } from "solid-js";
import { VehicleComponentWithUserInfo } from "~/types/VehicleComponent";
import { convertRawToVehicleComponent } from "~/utils/vehicle-component";
import ComponentTable from "./ComponentTable";

export default function UserFileReader() {
  const [vehicleComponents, setVehicleComponents] =
    createSignal<VehicleComponentWithUserInfo | null>(null);

  const readFile = async (file: File | null) => {
    if (!file) {
      setVehicleComponents(null);
      return;
    }
    const content = await file.text();
    try {
      const jsonContent = JSON.parse(content);
      setVehicleComponents(jsonContent["vehicle_component_with_user_info"]);
    } catch {
      setVehicleComponents(null);
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
      <Show when={vehicleComponents()}>
        <ComponentTable
          data={convertRawToVehicleComponent(vehicleComponents()!)}
        />
        <pre class="rounded-lg p-4 text-left">
          <code>
            {JSON.stringify(
              convertRawToVehicleComponent(vehicleComponents()!),
              null,
              2,
            )}
          </code>
        </pre>
      </Show>
    </div>
  );
}
