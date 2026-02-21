"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CheckboxWithLabel } from "@/components/inputs/checkbox-with-label";
import { InputWithLabel } from "@/components/inputs/input-with-label";
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
};

export const TicketForm = ({ customer, ticket }: TicketFormProps) => {
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

  const onSubmit = (values: insertTicketSchemaType) => {
    console.log(values);
  };

  return (
    <div className="flex flex-col gap-1 sm:px-8">
      <div>
        <h2 className="text-2xl font-bold">
          {ticket?.id ? `Edit Ticket #${ticket.id}` : "New Ticket Form"}
        </h2>
      </div>
      <Form {...form}>
        <form
          className="flex flex-col gap-4 md:flex-row md:gap-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <InputWithLabel<insertTicketSchemaType>
              fieldTitle="Title"
              nameInSchema="title"
            />
            <InputWithLabel<insertTicketSchemaType>
              disabled
              fieldTitle="Tech"
              nameInSchema="tech"
            />
            <CheckboxWithLabel<insertTicketSchemaType>
              fieldTitle="Completed"
              message="Yes"
              nameInSchema="completed"
            />
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
              fieldTitle="Description"
              nameInSchema="description"
            />
            <div className="flex gap-2">
              <Button className="w-3/4" title="Save" type="submit">
                Save
              </Button>
              <Button
                title="Reset"
                type="button"
                variant="destructive"
                onClick={() => form.reset(defaultValues)}
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
