"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  CircleCheckIcon,
  CircleXIcon,
} from "lucide-react";
import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Filter } from "@/components/react-table/filter";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TicketSearchResultType } from "@/lib/queries/get-ticket-search-results";

type Props = {
  data: TicketSearchResultType[];
};

type RowType = TicketSearchResultType;

export const TicketTable = ({ data }: Props) => {
  const router = useRouter();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "ticketDate",
      desc: false, // false for ascending
    },
  ]);

  const columnHeadersArray: Array<keyof RowType> = [
    "ticketDate",
    "title",
    "tech",
    "firstName",
    "lastName",
    "email",
    "completed",
  ];

  const columnHelper = createColumnHelper<RowType>();

  const columns = columnHeadersArray.map((columnName) => {
    return columnHelper.accessor(
      (row) => {
        // transformational
        const value = row[columnName];
        if (columnName === "ticketDate" && value instanceof Date) {
          return value.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        }
        if (columnName === "completed") {
          return value ? "COMPLETED" : "OPEN";
        }
        return value;
      },
      {
        id: columnName,
        header: ({ column }) => {
          return (
            <Button
              className="flex justify-between pl-1 w-full"
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {columnName
                // Convert camelCase to space separated words
                .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
                // Capitalize first letter
                .replace(/^./, (str) => str.toUpperCase())
                // Split by space and capitalize each word
                .split(" ")
                // Capitalize first letter of each word
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                // Join by space
                .join(" ")}

              {column.getIsSorted() === "asc" && (
                <ArrowUpIcon className="ml-2 size-4" />
              )}

              {column.getIsSorted() === "desc" && (
                <ArrowDownIcon className="ml-2 size-4" />
              )}

              {column.getIsSorted() !== "desc" &&
                column.getIsSorted() !== "asc" && (
                  <ArrowUpDownIcon className="ml-2 size-4" />
                )}
            </Button>
          );
        },
        cell: ({ getValue }) => {
          // presentational
          const value = getValue();
          if (columnName === "completed") {
            return (
              <div className="grid place-content-center">
                {value === "OPEN" ? (
                  <CircleXIcon className="opacity-25" />
                ) : (
                  <CircleCheckIcon className="text-green-600" />
                )}
              </div>
            );
          }
          return value;
        },
      },
    );
  });

  // eslint-disable-next-line react-hooks/incompatible-library -- As we do not use react compiler
  const table = useReactTable({
    columns,
    data,
    state: {
      columnFilters,
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
  });

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="overflow-hidden rounded-lg border border-border">
        <Table className="border">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="p-1 bg-secondary">
                    <div>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </div>
                    {header.column.getCanFilter() ? (
                      <div className="grid place-content-center">
                        <Filter column={header.column} />
                      </div>
                    ) : null}
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
                  router.push(`/tickets/form?ticketId=${row.original.id}`)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/tickets/form?ticketId=${row.original.id}`);
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
      <div className="flex justify-between items-center">
        <div className="flex items-center basis-1/3">
          <p className="font-bold whitespace-nowrap">
            {`Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()}`}
            &nbsp;&nbsp;
            {`[${table.getFilteredRowModel().rows.length} ${table.getFilteredRowModel().rows.length !== 1 ? "total results" : "result"}]`}
          </p>
        </div>
        <div className="space-x-1">
          <Button variant="outline" onClick={() => table.resetSorting()}>
            Reset Sorting
          </Button>
          <Button variant="outline" onClick={() => table.resetColumnFilters()}>
            Reset Filters
          </Button>
          <Button
            disabled={!table.getCanPreviousPage()}
            variant="outline"
            onClick={() => table.previousPage()}
          >
            Previous
          </Button>
          <Button
            disabled={!table.getCanNextPage()}
            variant="outline"
            onClick={() => table.nextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
