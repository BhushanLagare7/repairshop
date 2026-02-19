import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

import { Button } from "@/components/ui/button";

const LoginPage = () => {
  return (
    <main className="flex flex-col gap-6 items-center p-4 h-dvh">
      <h1 className="text-4xl">Computer Repair Shop</h1>
      <Button asChild>
        <LoginLink>Sign In</LoginLink>
      </Button>
    </main>
  );
};

export default LoginPage;
