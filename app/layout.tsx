import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as ToasterSonner } from "@/components/ui/sonner"
import {cn} from "@/lib/utils";
import React from "react";
import siteMetadata from "@/config/siteMetadata";
import {TooltipProvider} from "@/components/ui/tooltip";
import {fontBody, inter, fontTypo} from "@/app/fonts";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || ''),
  title: {
    template: `%s | ${siteMetadata.logoTitle}`,
    default: `${siteMetadata.logoTitle} - ${siteMetadata.slogan}`,
  },
  description: `${siteMetadata.description}`,
  openGraph: {
    title: {
      template: `%s | ${siteMetadata.logoTitle}`,
      default: `${siteMetadata.logoTitle} - ${siteMetadata.slogan}`,
    },
    description: `${siteMetadata.description}`,
    images: `${siteMetadata.ogImage}`
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="vi" className={'scroll-smooth'}>
        <body
          suppressHydrationWarning={true}
          className={cn(
            "bg-background font-sans antialiased",
            fontBody.variable,
            fontTypo.variable,
            inter.variable
          )}
        >
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
          <ToasterSonner/>
          <div className={'clear-both'}></div>
        </body>
      </html>
    </SessionProvider>
  )
}
