import type { Metadata } from 'next'
import { auth } from '@/auth'
import './globals.css'
import {cn} from "@/lib/utils";
import React from "react";
import siteMetadata from "@/config/siteMetadata";
import {fontBody, inter, fontTypo} from "@/app/fonts";
import { Providers } from "@/components/providers/providers";
import AdSenseScript from "@/components/public/adsense/adsense-script";

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
    <html lang="vi" className={'scroll-smooth'} suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
        className={cn(
          "bg-background font-sans antialiased",
          fontBody.variable,
          fontTypo.variable,
          inter.variable
        )}
      >
        <Providers session={session}>
          {children}
        </Providers>
        {Boolean(process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID) && (
          <AdSenseScript />
        )}
      </body>
    </html>
  )
}
