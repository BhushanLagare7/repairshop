"use client";

import { useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type CheckboxWithLabelProps<T> = {
  fieldTitle: string;
  nameInSchema: keyof T & string;
  message: string;
};

export const CheckboxWithLabel = <T,>({
  fieldTitle,
  nameInSchema,
  message,
}: CheckboxWithLabelProps<T>) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem className="flex gap-2 items-center w-full">
          <FormLabel className="w-1/3 text-base" htmlFor={nameInSchema}>
            {fieldTitle}
          </FormLabel>
          <div className="flex gap-2 items-center">
            <FormControl>
              <Checkbox
                ref={field.ref}
                checked={field.value}
                id={nameInSchema}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            {message}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
