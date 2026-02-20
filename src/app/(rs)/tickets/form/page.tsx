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
    try {
      customer = await getCustomer(parseInt(customerId));
    } catch (error) {
      if (error instanceof Error) {
        Sentry.captureException(error);
        throw new Error(error.message);
      }
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
    console.log(customer);
  }

  if (ticketId) {
    try {
      ticket = await getTicket(parseInt(ticketId));
    } catch (error) {
      Sentry.captureException(error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
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
      if (error instanceof Error) {
        Sentry.captureException(error);
        throw new Error(error.message);
      }
    }

    // Put Ticket Form component
    console.log("ticket:", ticket);
    console.log("ticketCustomer:", ticketCustomer);
  }

  return <div></div>;
};

export default TicketFormPage;
