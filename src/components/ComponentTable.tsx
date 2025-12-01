import { ColumnDef, createSolidTable, flexRender, getCoreRowModel, RowModel, Table } from "@tanstack/solid-table";
import { For } from "solid-js";
import { VehicleComponent } from "~/types/VehicleComponent";

interface ComponentTableProps {
    data: VehicleComponent[];
}

const COLUMNS: ColumnDef<VehicleComponent>[] = [
    {
        accessorKey: 'name',
        header: () => "Name",
    },
    {
        accessorKey: 'level',
        header: () => "Level"
    },
    {
        accessorKey: 'roll_1',
        header: () => 'Skill 1'
    },
    {
        accessorKey: 'roll_2',
        header: () => 'Skill 2'
    },
    {
        accessorKey: 'roll_3',
        header: () => 'Skill 3'
    }
]

export default function ComponentTable({ data }: ComponentTableProps) {
    const table = createSolidTable({
        columns: COLUMNS,
        data: data,
        getCoreRowModel: getCoreRowModel(),
    })
    return (
        <div class="m-2 rounded-box border border-base-content/5 bg-base-100">
            <table class="table table-pin-rows">
                <thead>
                    <For each={table.getHeaderGroups()}>
                        {headerGroup => (
                            <tr>
                                <For each={headerGroup.headers}>
                                    {header => (
                                        <th>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
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
                        {row => (
                            <tr>
                                <For each={row.getVisibleCells()}>
                                    {cell => (
                                        <td>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    )}
                                </For>
                            </tr>
                        )}
                    </For>
                </tbody>
                <tfoot>
                    <For each={table.getFooterGroups()}>
                        {footerGroup => (
                            <tr>
                                <For each={footerGroup.headers}>
                                    {header => (
                                        <th>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.footer,
                                                    header.getContext()
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