"use client";

import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { saveTicketAction } from "@/app/actions/save-ticket-action";
import { DisplayServerActionResponse } from "@/components/display-server-action-response";
import { CheckboxWithLabel } from "@/components/inputs/checkbox-with-label";
import { InputWithLabel } from "@/components/inputs/input-with-label";
import { SelectWithLabel } from "@/components/inputs/select-with-label";
import { TextareaWithLabel } from "@/components/inputs/textarea-with-label";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { type selectCustomerSchemaType } from "@/zod-schemas/customer";
import {
  insertTicketSchema,
  type insertTicketSchemaType,
  type selectTicketSchemaType,
} from "@/zod-schemas/ticket";

type TicketFormProps = {
  customer: selectCustomerSchemaType;
  ticket?: selectTicketSchemaType;
  techs?: { id: string; description: string }[];
  isEditable?: boolean;
};

export const TicketForm = ({
  customer,
  ticket,
  techs,
  isEditable = true,
}: TicketFormProps) => {
  const isManager = Array.isArray(techs);

  const defaultValues: insertTicketSchemaType = {
    id: ticket?.id ?? "(New)",
    customerId: ticket?.customerId ?? customer.id,
    title: ticket?.title ?? "",
    description: ticket?.description ?? "",
    completed: ticket?.completed ?? false,
    tech: ticket?.tech ?? "new-ticket@example.com",
  };

  const form = useForm<insertTicketSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(insertTicketSchema),
    defaultValues,
  });

  const {
    execute: executeSave,
    reset: resetSave,
    result: resultSave,
    isPending: isSaving,
  } = useAction(saveTicketAction, {
    onSuccess: ({ data }) => {
      toast.success("Success! 🎉", {
        description: data?.message,
      });
    },
    onError: () => {
      toast.error("Error! 🚨", {
        description: "Something went wrong. Please try again.",
      });
    },
  });

  const onSubmit = (values: insertTicketSchemaType) => {
    executeSave(values);
  };

  return (
    <div className="flex flex-col gap-1 sm:px-8">
      <DisplayServerActionResponse result={resultSave} />
      <div>
        <h2 className="text-2xl font-bold">
          {ticket?.id && isEditable
            ? `Edit Ticket #${ticket.id}`
            : ticket?.id
              ? `View Ticket #${ticket.id}`
              : "New Ticket Form"}
        </h2>
      </div>
      <Form {...form}>
        <form
          className="flex flex-col gap-4 md:flex-row md:gap-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <InputWithLabel<insertTicketSchemaType>
              disabled={!isEditable}
              fieldTitle="Title"
              nameInSchema="title"
            />
            {isManager ? (
              <SelectWithLabel<insertTicketSchemaType>
                data={[
                  {
                    id: "new-ticket@example.com",
                    description: "new-ticket@example.com",
                  },
                  ...techs,
                ]}
                fieldTitle="Tech ID"
                nameInSchema="tech"
              />
            ) : (
              <InputWithLabel<insertTicketSchemaType>
                disabled
                fieldTitle="Tech"
                nameInSchema="tech"
              />
            )}
            {!!ticket?.id && (
              <CheckboxWithLabel<insertTicketSchemaType>
                disabled={!isEditable}
                fieldTitle="Completed"
                message="Yes"
                nameInSchema="completed"
              />
            )}
            <div className="mt-4 space-y-2">
              <h3 className="text-lg">Customer Info</h3>
              <hr className="w-4/5" />
              <p>
                {customer.firstName} {customer.lastName}
              </p>
              <p>{customer.address1}</p>
              {customer.address2 && <p>{customer.address2}</p>}
              <p>
                {customer.city}, {customer.state} {customer.zip}
              </p>
              <hr className="w-4/5" />
              <p>{customer.email}</p>
              <p>Phone: {customer.phone}</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <TextareaWithLabel<insertTicketSchemaType>
              className="h-96"
              disabled={!isEditable}
              fieldTitle="Description"
              nameInSchema="description"
            />
            {isEditable && (
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
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
