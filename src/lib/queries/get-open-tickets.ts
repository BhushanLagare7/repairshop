import { asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { customers, tickets } from "@/db/schema";

export const getOpenTickets = async () => {
  return await db
    .select({
      id: tickets.id,
      ticketDate: tickets.createdAt,
      title: tickets.title,
      completed: tickets.completed,
      firstName: customers.firstName,
      lastName: customers.lastName,
      email: customers.email,
      tech: tickets.tech,
    })
    .from(tickets)
    .leftJoin(customers, eq(tickets.customerId, customers.id))
    .where(eq(tickets.completed, false))
    .orderBy(asc(tickets.createdAt));
};
