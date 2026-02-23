"use client";

import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

import { saveCustomerAction } from "@/app/actions/save-customer-action";
import { DisplayServerActionResponse } from "@/components/display-server-action-response";
import { CheckboxWithLabel } from "@/components/inputs/checkbox-with-label";
import { InputWithLabel } from "@/components/inputs/input-with-label";
import { SelectWithLabel } from "@/components/inputs/select-with-label";
import { TextareaWithLabel } from "@/components/inputs/textarea-with-label";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { StatesArray } from "@/constants/states-array";
import {
  insertCustomerSchema,
  type insertCustomerSchemaType,
  type selectCustomerSchemaType,
} from "@/zod-schemas/customer";

type CustomerFormProps = {
  customer?: selectCustomerSchemaType;
};

export const CustomerForm = ({ customer }: CustomerFormProps) => {
  const { getPermission, isLoading } = useKindeBrowserClient();

  const isManager = !isLoading && getPermission("manager")?.isGranted;

  const defaultValues: insertCustomerSchemaType = {
    id: customer?.id ?? 0,
    firstName: customer?.firstName ?? "",
    lastName: customer?.lastName ?? "",
    email: customer?.email ?? "",
    phone: customer?.phone ?? "",
    address1: customer?.address1 ?? "",
    address2: customer?.address2 ?? "",
    city: customer?.city ?? "",
    state: customer?.state ?? "",
    zip: customer?.zip ?? "",
    notes: customer?.notes ?? "",
    active: customer?.active ?? true,
  };

  const form = useForm<insertCustomerSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(insertCustomerSchema),
    defaultValues,
  });

  const {
    execute: executeSave,
    reset: resetSave,
    result: resultSave,
    isPending: isSaving,
  } = useAction(saveCustomerAction, {
    onSuccess: ({ data }) => {
      if (data?.message) {
        toast.success("Success! 🎉", {
          description: data.message,
        });
      }
    },
    onError: () => {
      toast.error("Error! 🚨", {
        description: "Something went wrong. Please try again.",
      });
    },
  });

  const onSubmit = (values: insertCustomerSchemaType) => {
    executeSave(values);
  };

  return (
    <div className="flex flex-col gap-1 sm:px-8">
      <DisplayServerActionResponse result={resultSave} />
      <div>
        <h2 className="text-2xl font-bold">
          {customer?.id ? `Edit Customer #${customer.id}` : "New Customer Form"}
        </h2>
      </div>
      <Form {...form}>
        <form
          className="flex flex-col gap-4 md:flex-row md:gap-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="First Name"
              nameInSchema="firstName"
            />
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="Last Name"
              nameInSchema="lastName"
            />
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="Address 1"
              nameInSchema="address1"
            />
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="Address 2"
              nameInSchema="address2"
            />
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="City"
              nameInSchema="city"
            />
            <SelectWithLabel<insertCustomerSchemaType>
              data={StatesArray}
              fieldTitle="State"
              nameInSchema="state"
            />
          </div>
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="Zip Code"
              nameInSchema="zip"
            />
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="Email"
              nameInSchema="email"
            />
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="Phone"
              nameInSchema="phone"
            />
            <TextareaWithLabel<insertCustomerSchemaType>
              className="h-40"
              fieldTitle="Notes"
              nameInSchema="notes"
            />
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              isManager &&
              customer?.id && (
                <CheckboxWithLabel<insertCustomerSchemaType>
                  fieldTitle="Active"
                  message="Yes"
                  nameInSchema="active"
                />
              )
            )}
            <div className="flex gap-2">
              <Button
                className="w-3/4"
                disabled={isSaving}
                title="Save"
                type="submit"
              >
                {isSaving ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                disabled={isSaving}
                title="Reset"
                type="button"
                variant="destructive"
                onClick={() => {
                  form.reset(defaultValues);
                  resetSave();
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
