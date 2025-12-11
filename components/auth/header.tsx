import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

interface HeaderProps {
  label: string;
};

export const Header = ({
  label,
}: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className={cn(
        "text-3xl font-semibold",
      )}>
        🔐 Tài khoản
      </h1>
      <p className="text-center text-muted-foreground text-sm">
        {label}
      </p>
    </div>
  );
};
