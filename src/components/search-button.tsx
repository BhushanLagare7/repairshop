"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export const SearchButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button className="w-20" disabled={pending} type="submit">
      {pending ? <LoaderCircleIcon className="animate-spin" /> : "Search"}
    </Button>
  );
};
