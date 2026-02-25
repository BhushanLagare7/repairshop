import { asc, eq, ilike, or, sql } from "drizzle-orm";

import { db } from "@/db";
import { customers, tickets } from "@/db/schema";

export const getTicketSearchResults = async (searchText: string) => {
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
    .where(
      or(
        ilike(tickets.title, `%${searchText}%`),
        ilike(tickets.tech, `%${searchText}%`),
        ilike(customers.email, `%${searchText}%`),
        ilike(customers.phone, `%${searchText}%`),
        ilike(customers.city, `%${searchText}%`),
        ilike(customers.zip, `%${searchText}%`),
        sql`lower(concat(${customers.firstName}, ' ', ${customers.lastName})) LIKE ${`%${searchText.toLowerCase().replaceAll(" ", "%")}%`}`,
      ),
    )
    .orderBy(asc(tickets.createdAt));
};

export type TicketSearchResultType = Awaited<
  ReturnType<typeof getTicketSearchResults>
>[0];
