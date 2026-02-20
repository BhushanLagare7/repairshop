import * as Sentry from "@sentry/nextjs";

import { BackButton } from "@/components/back-button";
import { getCustomer } from "@/lib/queries/getCustomer";

const CustomerFormPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { customerId } = await searchParams;

  let customer = null;

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
  } else {
    // Put Customer Form component
  }

  return <div></div>;
};

export default CustomerFormPage;
