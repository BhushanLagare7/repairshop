import type { Metadata } from "next";

import { TicketSearch } from "@/app/(rs)/tickets/ticket-search";
import { getOpenTickets } from "@/lib/queries/get-open-tickets";
import { getTicketSearchResults } from "@/lib/queries/get-ticket-search-results";

export const metadata: Metadata = {
  title: "Tickets",
};

const TicketsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { searchText } = await searchParams;

  if (!searchText) {
    const openTickets = await getOpenTickets();
    return (
      <>
        <TicketSearch />
        <pre>{JSON.stringify(openTickets, null, 2)}</pre>
      </>
    );
  }

  const tickets = await getTicketSearchResults(searchText);

  return (
    <>
      <TicketSearch />
      <pre>{JSON.stringify(tickets, null, 2)}</pre>
    </>
  );
};

export default TicketsPage;
