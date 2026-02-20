import * as Sentry from "@sentry/nextjs";

import { CustomerForm } from "@/app/(rs)/customers/form/customer-form";
import { BackButton } from "@/components/back-button";
import { getCustomer } from "@/lib/queries/getCustomer";

const CustomerFormPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  try {
    const { customerId } = await searchParams;

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

      return <CustomerForm customer={customer} />;
    } else {
      return <CustomerForm />;
    }
  } catch (error) {
    Sentry.captureException(
      error instanceof Error ? error : new Error(String(error)),
    );
    throw error;
  }
};

export default CustomerFormPage;
