import { Column } from "@tanstack/react-table";

import { DebouncedInput } from "@/components/react-table/debounced-input";

type FilterProps<T> = {
  column: Column<T, unknown>;
  filteredRows: string[];
};

export const Filter = <T,>({ column, filteredRows }: FilterProps<T>) => {
  const columnFilterValue = column.getFilterValue();

  const uniqueFilteredValues = new Set(filteredRows);
  const sortedUniqueValues = Array.from(uniqueFilteredValues).sort();

  return (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.map((value, i) => (
          <option key={`${i}-${column.id}`} value={value} />
        ))}
      </datalist>
      <DebouncedInput
        className="w-full rounded border shadow bg-card"
        list={column.id + "list"}
        placeholder={`Search... (${uniqueFilteredValues.size})`}
        type="text"
        value={columnFilterValue != null ? String(columnFilterValue) : ""}
        onChange={(value) => column.setFilterValue(value)}
      />
    </>
  );
};
