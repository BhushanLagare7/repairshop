import * as Sentry from "@sentry/nextjs";

import { TicketForm } from "@/app/(rs)/tickets/form/ticket-form";
import { BackButton } from "@/components/back-button";
import { getCustomer } from "@/lib/queries/getCustomer";
import { getTicket } from "@/lib/queries/getTicket";

const TicketFormPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { customerId, ticketId } = await searchParams;

  if (!customerId && !ticketId) {
    return (
      <>
        <h2 className="mb-2 text-2xl">
          Ticket ID or Customer ID required to load ticket form
        </h2>
        <BackButton title="Go Back" variant="default" />
      </>
    );
  }

  try {
    if (customerId) {
      const id = parseInt(customerId, 10);
      if (Number.isNaN(id)) throw new Error("Invalid customerId");

      const customer = await getCustomer(id);

      if (!customer) {
        return (
          <>
            <h2 className="mb-2 text-2xl">
              Customer Id #{customerId} not found
            </h2>
            <BackButton title="Go Back" variant="default" />
          </>
        );
      }

      if (!customer.active) {
        return (
          <>
            <h2 className="mb-2 text-2xl">
              Customer Id #{customerId} is not active
            </h2>
            <BackButton title="Go Back" variant="default" />
          </>
        );
      }

      // return form for new ticket
      return <TicketForm customer={customer} />;
    }

    if (ticketId) {
      const id = parseInt(ticketId, 10);
      if (Number.isNaN(id)) throw new Error("Invalid ticketId");

      const ticket = await getTicket(id);

      if (!ticket) {
        return (
          <>
            <h2 className="mb-2 text-2xl">Ticket Id #{ticketId} not found</h2>
            <BackButton title="Go Back" variant="default" />
          </>
        );
      }

      const customer = await getCustomer(ticket.customerId);

      if (!customer) {
        return (
          <>
            <h2 className="mb-2 text-2xl">
              Customer for Ticket Id #{ticketId} not found
            </h2>
            <BackButton title="Go Back" variant="default" />
          </>
        );
      }

      // return form to edit ticket
      return <TicketForm customer={customer} ticket={ticket} />;
    }
  } catch (error) {
    Sentry.captureException(
      error instanceof Error ? error : new Error(String(error)),
    );
    throw error;
  }
};

export default TicketFormPage;
