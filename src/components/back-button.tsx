"use client";

import { ButtonHTMLAttributes } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type BackButtonProps = {
  title: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const BackButton = ({
  title,
  className,
  variant,
  ...props
}: BackButtonProps) => {
  const router = useRouter();

  return (
    <Button
      className={className}
      title={title}
      variant={variant}
      onClick={() => router.back()}
      {...props}
    >
      {title}
    </Button>
  );
};
