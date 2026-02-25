import { Column } from "@tanstack/react-table";

import { DebouncedInput } from "@/components/react-table/debounced-input";

type FilterProps<T> = {
  column: Column<T, unknown>;
};

export const Filter = <T,>({ column }: FilterProps<T>) => {
  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = Array.from(
    column.getFacetedUniqueValues().keys(),
  ).sort();

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
        placeholder={`Search... (${[...column.getFacetedUniqueValues()].filter((arr) => arr[0]).length})`}
        type="text"
        value={columnFilterValue != null ? String(columnFilterValue) : ""}
        onChange={(value) => column.setFilterValue(value)}
      />
    </>
  );
};
