import {Button} from "@/components/ui/button";
import {ArrowLeftIcon} from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";

const AuthLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="min-h-screen pt-12 pb-4 px-2 flex items-center justify-center bg-blue-50">
      <Button asChild variant={'outline'} className={'flex gap-2 absolute top-2 left-2'}>
        <Link href={'/'}>
          <ArrowLeftIcon/> Trang chủ
        </Link>
      </Button>
      {children}
    </div>
   );
}

export default AuthLayout;
