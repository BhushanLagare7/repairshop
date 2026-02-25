"use client";

import { useRouter } from "next/navigation";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { selectCustomerSchemaType } from "@/zod-schemas/customer";

type CustomerTableProps = {
  data: selectCustomerSchemaType[];
};

export const CustomerTable = ({ data }: CustomerTableProps) => {
  const router = useRouter();

  const columnHeadersArray: Array<keyof selectCustomerSchemaType> = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "city",
    "zip",
  ];

  const columnHelper = createColumnHelper<selectCustomerSchemaType>();

  const columns = columnHeadersArray.map((columnName) =>
    columnHelper.accessor(columnName, {
      id: columnName,
      header: columnName
        // Convert camelCase to space separated words
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        // Capitalize first letter
        .replace(/^./, (str) => str.toUpperCase())
        // Split by space and capitalize each word
        .split(" ")
        // Capitalize first letter of each word
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        // Join by space
        .join(" "),
    }),
  );

  // eslint-disable-next-line react-hooks/incompatible-library -- As we do not use react compiler
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden mt-6 rounded-lg border border-border">
      <Table className="border">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  <div>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="cursor-pointer hover:bg-border/25 dark:hover:bg-ring/40"
              tabIndex={0}
              onClick={() =>
                router.push(`/customers/form?customerId=${row.original.id}`)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(`/customers/form?customerId=${row.original.id}`);
                }
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="border">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
