"use client";

import { TextareaHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

type TextareaWithLabelProps<T> = {
  fieldTitle: string;
  nameInSchema: keyof T & string;
  className?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextareaWithLabel = <T,>({
  fieldTitle,
  nameInSchema,
  className,
  ...props
}: TextareaWithLabelProps<T>) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="mb-2 text-base" htmlFor={nameInSchema}>
            {fieldTitle}
          </FormLabel>
          <FormControl>
            <Textarea
              className={className}
              id={nameInSchema}
              {...props}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
