import type { Metadata } from "next";

import { TicketSearch } from "@/app/(rs)/tickets/ticket-search";
import { TicketTable } from "@/app/(rs)/tickets/ticket-table";
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
        {openTickets.length > 0 ? (
          <TicketTable data={openTickets} />
        ) : (
          <p className="mt-6 text-center text-muted-foreground">
            No open tickets found
          </p>
        )}
      </>
    );
  }

  const tickets = await getTicketSearchResults(searchText);

  return (
    <>
      <TicketSearch />
      {tickets.length > 0 ? (
        <TicketTable data={tickets} />
      ) : (
        <p className="mt-6 text-center text-muted-foreground">
          No tickets found
        </p>
      )}
    </>
  );
};

export default TicketsPage;
