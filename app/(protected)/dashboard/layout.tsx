import { Navbar } from "@/components/dashboard/navbar";
import React from "react";
import {Metadata} from "next";
import siteMetadata from "@/config/siteMetadata";
import {UserRole} from "@prisma/client";
import {RoleGate} from "@/components/auth/role-gate";
import '@/styles/dashboard/index.css'

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || ''),
  title: {
    template: `%s | Dashboard`,
    default: `Dashboard`,
  },
  description: `${siteMetadata.description}`,
  openGraph: {
    title: {
      template: `%s`,
      default: `Dashboard`,
    },
    description: `${siteMetadata.description}`,
    images: `${siteMetadata.ogImage}`
  }
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className={`font-inter`}>
      <Navbar />
      <main className={'mb-20'}>
        <RoleGate allowedRole={UserRole.ADMIN}>
          {children}
        </RoleGate>
      </main>
    </div>
   );
}

export default ProtectedLayout;
