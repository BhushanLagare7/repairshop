import Link from "next/link";
import { FileIcon, HomeIcon, LogOutIcon, UsersRoundIcon } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

import { ModeToggle } from "@/components/mode-toggle";
import { NavButton } from "@/components/nav-button";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="sticky top-0 z-20 p-2 h-12 border-b animate-slide bg-background">
      <div className="flex justify-between items-center w-full h-8">
        <div className="flex gap-2 items-center">
          <NavButton href="/home" icon={HomeIcon} label="Home" />
          <Link
            className="flex gap-2 justify-center items-center m-0"
            href="/home"
          >
            <h1 className="hidden text-xl font-bold sm:block">
              Computer Repair Shop
            </h1>
          </Link>
        </div>
        <div className="flex items-center">
          <NavButton href="/tickets" icon={FileIcon} label="Tickets" />
          <NavButton
            href="/customers"
            icon={UsersRoundIcon}
            label="Customers"
          />
          <ModeToggle />
          <Button
            aria-label="Logout"
            asChild
            className="rounded-full"
            size="icon"
            title="Logout"
            variant="ghost"
          >
            <LogoutLink>
              <LogOutIcon />
            </LogoutLink>
          </Button>
        </div>
      </div>
    </header>
  );
};
