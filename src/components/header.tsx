import Link from "next/link";
import {
  FileIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  UsersRoundIcon,
} from "lucide-react";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { ModeToggle } from "@/components/mode-toggle";
import { NavButton } from "@/components/nav-button";
import { Button } from "@/components/ui/button";

import { NavButtonMenu } from "./nav-button-menu";

export const Header = async () => {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  return (
    <header className="sticky top-0 z-20 p-2 h-12 border-b animate-slide bg-background">
      <div className="flex justify-between items-center w-full h-8">
        <div className="flex gap-2 items-center">
          <NavButton href="/tickets" icon={HomeIcon} label="Home" />
          <Link
            className="flex gap-2 justify-center items-center m-0"
            href="/tickets"
          >
            <h1 className="hidden text-xl font-bold sm:block">
              Computer Repair Shop
            </h1>
          </Link>
        </div>
        <div className="flex items-center">
          <Link
            aria-label="Tickets"
            className="flex gap-2 justify-center items-center m-0"
            href="/tickets"
            title="Tickets"
          >
            <FileIcon />
          </Link>
          <NavButtonMenu
            choices={[
              { title: "Search Customers", href: "/customers" },
              { title: "New Customer", href: "/customers/form" },
            ]}
            icon={UsersRoundIcon}
            label="Customers"
          />
          <ModeToggle />
          {isUserAuthenticated ? (
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
          ) : (
            <Button
              aria-label="Login"
              asChild
              className="rounded-full"
              size="icon"
              title="Login"
              variant="ghost"
            >
              <LoginLink>
                <LogInIcon />
              </LoginLink>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
