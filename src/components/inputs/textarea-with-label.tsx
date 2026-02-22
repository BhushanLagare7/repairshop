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
import { cn } from "@/lib/utils";

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
              className={cn(
                "disabled:text-blue-500 dark:disabled:text-yellow-300 disabled:opacity-75",
                className,
              )}
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
