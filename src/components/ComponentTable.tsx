import {
  ColumnDef,
  ColumnFiltersState,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/solid-table";
import { createSignal, For } from "solid-js";
import { VehicleComponent } from "~/types/VehicleComponent";
import { isIdealComponent, isLowValueComponent } from "~/utils/vehicle-component";
import { componentsToCsv, downloadCsv } from "~/utils/csv";

interface ComponentTableProps {
  data: VehicleComponent[];
}

const COLUMNS: ColumnDef<VehicleComponent>[] = [
  {
    accessorKey: "name",
    header: () => "Name",
    sortingFn: "text",
    filterFn: "equals",
  },
  {
    accessorKey: "rarity",
    header: () => "Rarity",
    cell: ({ getValue }) => {
      const rarity = getValue() as number;
      return "★".repeat(rarity);
    },
    filterFn: "equals",
  },
  {
    accessorKey: "type",
    header: () => "Type",
    filterFn: "equals",
  },
  {
    accessorKey: "level",
    header: () => "Level",
    sortingFn: "basic",
    filterFn: "equals",
  },
  {
    accessorKey: "roll_1",
    header: () => "Skill 1",
    filterFn: "equals",
  },
  {
    accessorKey: "roll_2",
    header: () => "Skill 2",
    filterFn: "equals",
  },
  {
    accessorKey: "roll_3",
    header: () => "Skill 3",
    filterFn: "equals",
  },
  {
    accessorKey: "hash",
  },
];

// Numeric columns need their filter value parsed back to a number, since
// <select> values are always strings but the underlying cell value isn't.
const NUMERIC_COLUMNS = new Set(["rarity", "level"]);

function parseFilterValue(columnId: string, raw: string): string | number {
  return NUMERIC_COLUMNS.has(columnId) ? Number(raw) : raw;
}

function formatFilterOption(columnId: string, value: unknown): string {
  if (columnId === "rarity") {
    return "★".repeat(Number(value));
  }
  return String(value);
}

function uniqueColumnValues(data: VehicleComponent[], columnId: string): unknown[] {
  const seen = new Map<string, unknown>();
  data.forEach((row) => {
    const value = row[columnId as keyof VehicleComponent];
    if (value === undefined || value === null || value === "") {
      return;
    }
    seen.set(String(value), value);
  });
  return [...seen.values()].sort((a, b) =>
    String(a).localeCompare(String(b), undefined, { numeric: true }),
  );
}

export default function ComponentTable(props: ComponentTableProps) {
  const [sorting, setSorting] = createSignal<SortingState>([{ id: "hash", desc: false }]);
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>([]);
  const table = createSolidTable({
    columns: COLUMNS,
    get data() {
      return props.data;
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      get sorting() {
        return sorting();
      },
      get columnFilters() {
        return columnFilters();
      },
      columnVisibility: {
        hash: false,
      },
    },
  });
  return (
    <div class="m-2 rounded-box border border-base-content/5 bg-base-100">
      <div class="flex flex-wrap items-center justify-between gap-4 p-2 text-sm">
        <div class="flex flex-wrap gap-4">
          <div class="flex items-center gap-2">
            <span class="h-4 w-4 rounded bg-green-100" />
            Locked
          </div>
          <div class="flex items-center gap-2">
            <span class="h-4 w-4 rounded bg-yellow-200" />
            Ideal talent rolled
          </div>
          <div class="flex items-center gap-2">
            <span class="h-4 w-4 rounded bg-red-700" />
            Low value (Reload + Accuracy, safe to delete)
          </div>
          <div class="flex items-center gap-2">
            <span class="h-4 w-4 rounded bg-red-200" />
            Duplicate (more than 2 copies)
          </div>
        </div>
        <button
          class="btn btn-sm"
          onClick={() => downloadCsv("vehicle_components.csv", componentsToCsv(props.data))}
        >
          Export CSV
        </button>
      </div>
      <table class="table table-pin-rows">
        <thead>
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th class="bg-base-200">
                      {header.isPlaceholder ? null : (
                        <div
                          class={
                            header.column.getCanSort() ? "cursor-pointer select-none" : undefined
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      )}
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th class="bg-base-200">
                      {header.isPlaceholder ? null : (
                        <select
                          class="select select-xs w-full"
                          value={
                            (
                              header.column.getFilterValue() as string | number | undefined
                            )?.toString() ?? ""
                          }
                          onChange={(event) => {
                            const raw = event.currentTarget.value;
                            header.column.setFilterValue(
                              raw === "" ? undefined : parseFilterValue(header.column.id, raw),
                            );
                          }}
                        >
                          <option value="">All</option>
                          <For each={uniqueColumnValues(props.data, header.column.id)}>
                            {(value) => (
                              <option value={String(value)}>
                                {formatFilterOption(header.column.id, value)}
                              </option>
                            )}
                          </For>
                        </select>
                      )}
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody>
          <For each={table.getRowModel().rows}>
            {(row) => {
              const { is_locked, duplicateCount } = row.original;
              const ideal = !is_locked && isIdealComponent(row.original);
              const lowValue = !is_locked && !ideal && isLowValueComponent(row.original);
              const duplicate = !is_locked && !ideal && !lowValue && duplicateCount > 2;
              const trClass = is_locked
                ? "bg-green-100"
                : ideal
                  ? "bg-yellow-200"
                  : lowValue
                    ? "bg-red-700 text-white"
                    : duplicate
                      ? "bg-red-200"
                      : "";
              return (
                <tr class={trClass}>
                  <For each={row.getVisibleCells()}>
                    {(cell) => <td>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>}
                  </For>
                </tr>
              );
            }}
          </For>
        </tbody>
        <tfoot>
          <For each={table.getFooterGroups()}>
            {(footerGroup) => (
              <tr>
                <For each={footerGroup.headers}>
                  {(header) => (
                    <th>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.footer, header.getContext())}
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tfoot>
      </table>
    </div>
  );
}
