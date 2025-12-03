import {
  ColumnDef,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/solid-table";
import { createSignal, For } from "solid-js";
import { VehicleComponent } from "~/types/VehicleComponent";

interface ComponentTableProps {
  data: VehicleComponent[];
}

const COLUMNS: ColumnDef<VehicleComponent>[] = [
  {
    accessorKey: "name",
    header: () => "Name",
    sortingFn: "text",
  },
  {
    accessorKey: "rarity",
    header: () => "Rarity",
    cell: ({ getValue }) => {
      const rarity = getValue() as number;
      return "★".repeat(rarity);
    },
  },
  {
    accessorKey: "type",
    header: () => "Type",
  },
  {
    accessorKey: "level",
    header: () => "Level",
    sortingFn: "basic",
  },
  {
    accessorKey: "roll_1",
    header: () => "Skill 1",
  },
  {
    accessorKey: "roll_2",
    header: () => "Skill 2",
  },
  {
    accessorKey: "roll_3",
    header: () => "Skill 3",
  },
  {
    accessorKey: "hash",
  },

];

export default function ComponentTable(props: ComponentTableProps) {
  const [sorting, setSorting] = createSignal<SortingState>([
    { id: "hash", desc: false },
  ]);
  const table = createSolidTable({
    columns: COLUMNS,
    get data() {
      return props.data;
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      get sorting() {
        return sorting();
      },
      columnVisibility: {
        hash: false,
      }
    },
  });
  return (
    <div class="m-2 rounded-box border border-base-content/5 bg-base-100">
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
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : undefined
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </div>
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
              const { is_locked, duplicateCount} = row.original;
              const duplicate =
                !is_locked && duplicateCount > 2;
              const trClass = is_locked ? 'bg-green-100' : duplicate ? 'bg-red-200' : '';
              return (
                <tr class={trClass}>
                  <For each={row.getVisibleCells()}>
                    {(cell) => (
                      <td>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    )}
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
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext(),
                          )}
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
