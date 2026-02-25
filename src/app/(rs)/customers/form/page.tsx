import type { Metadata } from "next";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import * as Sentry from "@sentry/nextjs";

import { CustomerForm } from "@/app/(rs)/customers/form/customer-form";
import { BackButton } from "@/components/back-button";
import { getCustomer } from "@/lib/queries/get-customer";

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}): Promise<Metadata> => {
  const { customerId } = await searchParams;

  if (!customerId) return { title: "New Customer" };

  const id = parseInt(customerId, 10);
  if (Number.isNaN(id)) throw new Error("Invalid customerId");

  const customer = await getCustomer(id);

  if (!customer) return { title: "Customer Not Found" };

  return { title: `Edit Customer #${customerId}` };
};

const CustomerFormPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  try {
    const { getPermission } = getKindeServerSession();
    const managerPermission = await getPermission("manager");
    const isManager = managerPermission?.isGranted;

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

      return (
        <CustomerForm
          key={customerId}
          customer={customer}
          isManager={isManager}
        />
      );
    } else {
      return <CustomerForm key={customerId} isManager={isManager} />;
    }
  } catch (error) {
    Sentry.captureException(
      error instanceof Error ? error : new Error(String(error)),
    );
    throw error;
  }
};

export default CustomerFormPage;
