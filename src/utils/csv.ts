import { VehicleComponent } from "~/types/VehicleComponent";

const CSV_COLUMNS: (keyof VehicleComponent)[] = [
  "id",
  "component_id",
  "name",
  "rarity",
  "type",
  "level",
  "is_locked",
  "duplicateCount",
  "roll_1_raw",
  "roll_2_raw",
  "roll_3_raw",
  "roll_4_raw",
  "roll_5_raw",
  "roll_1",
  "roll_2",
  "roll_3",
  "roll_4",
  "roll_5",
];

function escapeCsvValue(value: unknown): string {
  const stringValue = String(value ?? "");
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export function componentsToCsv(components: VehicleComponent[]): string {
  const header = CSV_COLUMNS.join(",");
  const rows = components.map((component) =>
    CSV_COLUMNS.map((column) => escapeCsvValue(component[column])).join(","),
  );
  return [header, ...rows].join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
