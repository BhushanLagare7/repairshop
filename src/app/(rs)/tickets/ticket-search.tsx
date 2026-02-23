import Form from "next/form";

import { SearchButton } from "@/components/search-button";
import { Input } from "@/components/ui/input";

export const TicketSearch = () => {
  return (
    <Form action="/tickets" className="flex gap-2 items-center">
      <Input
        className="w-full"
        name="searchText"
        placeholder="Search tickets..."
        type="text"
      />
      <SearchButton />
    </Form>
  );
};
