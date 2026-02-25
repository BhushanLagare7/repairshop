import Form from "next/form";

import { SearchButton } from "@/components/search-button";
import { Input } from "@/components/ui/input";

export const CustomerSearch = () => {
  return (
    <Form action="/customers" className="flex gap-2 items-center">
      <Input
        autoFocus
        className="w-full"
        name="searchText"
        placeholder="Search customers..."
        type="text"
      />
      <SearchButton />
    </Form>
  );
};
