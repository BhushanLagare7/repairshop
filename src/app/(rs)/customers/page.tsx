import type { Metadata } from "next";

import { CustomerSearch } from "@/app/(rs)/customers/customer-search";
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

  const customers = await getCustomerSearchResults(searchText);

  return (
    <>
      <CustomerSearch />
      <pre>{JSON.stringify(customers, null, 2)}</pre>
    </>
  );
};

export default CustomersPage;
