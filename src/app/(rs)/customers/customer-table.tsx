"use client";

import Link from "next/link";
import { MoreHorizontalIcon, TableOfContentsIcon } from "lucide-react";
import {
  CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { selectCustomerSchemaType } from "@/zod-schemas/customer";

type CustomerTableProps = {
  data: selectCustomerSchemaType[];
};

export const CustomerTable = ({ data }: CustomerTableProps) => {
  const columnHeadersArray: Array<keyof selectCustomerSchemaType> = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "city",
    "zip",
  ];

  const columnHelper = createColumnHelper<selectCustomerSchemaType>();

  const ActionsCell = ({
    row,
  }: CellContext<selectCustomerSchemaType, unknown>) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0" variant="ghost">
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              className="w-full"
              href={`/tickets/form?customerId=${row.original.id}`}
              prefetch
            >
              New Ticket
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              className="w-full"
              href={`/customers/form?customerId=${row.original.id}`}
              prefetch
            >
              Edit Customer
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  ActionsCell.displayName = "ActionsCell";

  const columns = [
    columnHelper.display({
      id: "actions",
      header: () => <TableOfContentsIcon />,
      cell: ActionsCell,
    }),
    ...columnHeadersArray.map((columnName) =>
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
    ),
  ];

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
                <TableHead
                  key={header.id}
                  className={cn(
                    "bg-secondary",
                    header.id === "actions" && "w-12",
                  )}
                >
                  <div
                    className={cn(
                      header.id === "actions"
                        ? "flex items-center justify-center"
                        : "",
                    )}
                  >
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
