"use client";

import { FaUser } from "react-icons/fa";
import {ExitIcon, GearIcon, LockClosedIcon, PersonIcon, ChevronDownIcon} from "@radix-ui/react-icons"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "@/components/auth/logout-button";
import Link from "next/link";

export const UserButton = () => {
  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-sky-500">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end">
        <div className={'text-sm px-2 py-1.5 border-b mb-2'}>
          <p>{user?.name}</p>
          <p className={'text-xs'} title={user?.email || ""}>{user?.email}</p>
        </div>
        <Link href={'/dashboard/settings'}>
          <DropdownMenuItem className={'cursor-pointer'}>
            <GearIcon className="h-4 w-4 mr-2" />
            Cài đặt Tài khoản
          </DropdownMenuItem>
        </Link>
        <LogoutButton>
          <DropdownMenuItem className={'cursor-pointer'}>
            <ExitIcon className="h-4 w-4 mr-2" />
            Đăng xuất
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
