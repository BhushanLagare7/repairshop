import { Metadata } from "next";
import { init as kindeInit, Users } from "@kinde/management-api-js";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import * as Sentry from "@sentry/nextjs";

import { TicketForm } from "@/app/(rs)/tickets/form/ticket-form";
import { BackButton } from "@/components/back-button";
import { getCustomer } from "@/lib/queries/getCustomer";
import { getTicket } from "@/lib/queries/getTicket";

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}): Promise<Metadata> => {
  const { customerId, ticketId } = await searchParams;

  if (customerId) {
    const id = parseInt(customerId, 10);
    if (Number.isNaN(id)) throw new Error("Invalid customerId");

    const customer = await getCustomer(id);

    if (!customer) {
      return {
        title: "Customer not found",
      };
    }

    return {
      title: `New Ticket for Customer #${customer.id}`,
    };
  }

  if (ticketId) {
    const id = parseInt(ticketId, 10);
    if (Number.isNaN(id)) throw new Error("Invalid ticketId");

    const ticket = await getTicket(id);

    if (!ticket) {
      return {
        title: "Ticket not found",
      };
    }

    return {
      title: `Edit Ticket #${ticket.id}`,
    };
  }

  return {
    title: "Missing Ticket ID or Customer ID",
  };
};

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

  const { getPermission, getUser } = getKindeServerSession();
  const [managerPermission, user] = await Promise.all([
    getPermission("manager"),
    getUser(),
  ]);
  const isManager = managerPermission?.isGranted;

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

      if (isManager) {
        kindeInit(); // Initializes Kinde Management API
        const { users } = await Users.getUsers();

        const techs = users
          ? users
              .filter((u) => u.email)
              .map((u) => ({ id: u.email!, description: u.email! }))
          : [];

        return <TicketForm customer={customer} techs={techs} />;
      } else {
        return <TicketForm customer={customer} />;
      }
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

      if (isManager) {
        kindeInit(); // Initializes Kinde Management API
        const { users } = await Users.getUsers();

        const techs = users
          ? users.map((u) => ({ id: u.email!, description: u.email! }))
          : [];

        return <TicketForm customer={customer} techs={techs} ticket={ticket} />;
      } else {
        const isEditable =
          user?.email?.toLowerCase() === ticket.tech?.toLowerCase();

        return (
          <TicketForm
            customer={customer}
            isEditable={isEditable}
            ticket={ticket}
          />
        );
      }
    }
  } catch (error) {
    Sentry.captureException(
      error instanceof Error ? error : new Error(String(error)),
    );
    throw error;
  }
};

export default TicketFormPage;
