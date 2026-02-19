import Link from "next/link";
import { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type NavButtonProps = {
  icon: LucideIcon;
  label: string;
  href?: string;
};

export const NavButton = ({ icon: Icon, label, href }: NavButtonProps) => {
  return (
    <Button
      aria-label={label}
      asChild
      className="rounded-full"
      size="icon"
      title={label}
      variant="ghost"
    >
      {href ? (
        <Link href={href}>
          <Icon />
        </Link>
      ) : (
        <Icon />
      )}
    </Button>
  );
};
