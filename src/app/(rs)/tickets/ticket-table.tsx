"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { usePolling } from "@/hooks/use-polling";
import type { TicketSearchResultType } from "@/lib/queries/get-ticket-search-results";

type Props = {
  data: TicketSearchResultType[];
};

type RowType = TicketSearchResultType;

export const TicketTable = ({ data }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "ticketDate",
      desc: false, // false for ascending
    },
  ]);

  usePolling({
    searchParam: searchParams.get("searchText"),
    ms: 300_000,
  });

  const pageIndex = useMemo(() => {
    const parsed = Number(pageParam);
    return pageParam && Number.isInteger(parsed) && parsed > 0 ? parsed - 1 : 0;
  }, [pageParam]);

  const columnHeadersArray: Array<keyof RowType> = [
    "ticketDate",
    "title",
    "tech",
    "firstName",
    "lastName",
    "email",
    "completed",
  ];

  const columnWidth = {
    completed: 150,
    ticketDate: 150,
    title: 250,
    tech: 225,
    email: 225,
  };

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
        size: columnWidth[columnName as keyof typeof columnWidth] ?? undefined,
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

  const table = useReactTable({
    columns,
    data,
    state: {
      columnFilters,
      sorting,
      pagination: {
        pageIndex,
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

  const handlePageChange = (newPage: number) => {
    table.setPageIndex(newPage);
    const params = new URLSearchParams(searchParams?.toString());
    params.set("page", (newPage + 1).toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    // If the user filters out the last page, redirect to the last page
    const currentPageIndex = table.getState().pagination.pageIndex;
    const pageCount = table.getPageCount();
    // If the last page is filtered out, redirect to the last page
    if (pageCount <= currentPageIndex && currentPageIndex > 0) {
      const params = new URLSearchParams(searchParams?.toString());
      // Set page to 1
      params.set("page", "1");
      router.replace(`?${params.toString()}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().columnFilters]);

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="overflow-hidden rounded-lg border border-border">
        <Table className="border">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="p-1 bg-secondary"
                    style={{ width: header.getSize() }}
                  >
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
                        <Filter
                          column={header.column}
                          filteredRows={table
                            .getFilteredRowModel()
                            .rows.map((row) => row.getValue(header.column.id))}
                        />
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
      <div className="flex flex-wrap gap-1 justify-between items-center">
        <div>
          <p className="font-bold whitespace-nowrap">
            {`Page ${table.getState().pagination.pageIndex + 1} of ${Math.max(table.getPageCount(), 1)}`}
            &nbsp;&nbsp;
            {`[${table.getFilteredRowModel().rows.length} ${table.getFilteredRowModel().rows.length !== 1 ? "total results" : "result"}]`}
          </p>
        </div>
        <div className="flex flex-row gap-1">
          <div className="flex flex-row gap-1">
            <Button variant="outline" onClick={() => router.refresh()}>
              Refresh Data
            </Button>
            <Button variant="outline" onClick={() => table.resetSorting()}>
              Reset Sorting
            </Button>
            <Button
              variant="outline"
              onClick={() => table.resetColumnFilters()}
            >
              Reset Filters
            </Button>
          </div>
          <div className="flex flex-row gap-1">
            <Button
              disabled={!table.getCanPreviousPage()}
              variant="outline"
              onClick={() =>
                handlePageChange(table.getState().pagination.pageIndex - 1)
              }
            >
              Previous
            </Button>
            <Button
              disabled={!table.getCanNextPage()}
              variant="outline"
              onClick={() =>
                handlePageChange(table.getState().pagination.pageIndex + 1)
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
