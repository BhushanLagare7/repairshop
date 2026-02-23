import type { Metadata } from "next";
import * as Sentry from "@sentry/nextjs";

import { CustomerSearch } from "@/app/(rs)/customers/customer-search";
import { CustomerTable } from "@/app/(rs)/customers/customer-table";
import { getCustomerSearchResults } from "@/lib/queries/get-customer-search-results";

export const metadata: Metadata = {
  title: "Customers Search",
};

const CustomersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { searchText } = await searchParams;

  if (!searchText) return <CustomerSearch />;

  const span = Sentry.startInactiveSpan({
    name: "get-customer-search-results",
  });
  const customers = await getCustomerSearchResults(searchText);
  span.end();

  return (
    <>
      <CustomerSearch />
      {customers.length ? (
        <CustomerTable data={customers} />
      ) : (
        <p className="mt-6 text-center text-muted-foreground">
          No customers found
        </p>
      )}
    </>
  );
};

export default CustomersPage;
