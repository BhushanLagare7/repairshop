import * as Sentry from "@sentry/nextjs";

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

  let customer = null;
  let ticket = null;

  if (customerId) {
    const id = parseInt(customerId, 10);
    if (Number.isNaN(id)) throw new Error("Invalid customerId");

    try {
      customer = await getCustomer(id);
    } catch (error) {
      Sentry.captureException(
        error instanceof Error ? error : new Error(String(error)),
      );
      throw error;
    }

    if (!customer) {
      return (
        <>
          <h2 className="mb-2 text-2xl">Customer Id #{customerId} not found</h2>
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

    // Put Ticket Form component
  }

  if (ticketId) {
    const id = parseInt(ticketId, 10);
    if (Number.isNaN(id)) throw new Error("Invalid ticketId");

    try {
      ticket = await getTicket(id);
    } catch (error) {
      Sentry.captureException(
        error instanceof Error ? error : new Error(String(error)),
      );
      throw error;
    }

    if (!ticket) {
      return (
        <>
          <h2 className="mb-2 text-2xl">Ticket Id #{ticketId} not found</h2>
          <BackButton title="Go Back" variant="default" />
        </>
      );
    }

    let ticketCustomer = null;
    try {
      ticketCustomer = await getCustomer(ticket.customerId);
    } catch (error) {
      Sentry.captureException(
        error instanceof Error ? error : new Error(String(error)),
      );
      throw error;
    }

    if (!ticketCustomer) {
      return (
        <>
          <h2 className="mb-2 text-2xl">
            Customer for Ticket Id #{ticketId} not found
          </h2>
          <BackButton title="Go Back" variant="default" />
        </>
      );
    }

    // Put Ticket Form component
  }

  return <div></div>;
};

export default TicketFormPage;
