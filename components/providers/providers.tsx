"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as ToasterSonner } from "@/components/ui/sonner";

interface ProvidersProps {
	children: React.ReactNode;
	session?: any;
}

export function Providers({ children, session }: ProvidersProps) {
	return (
		<SessionProvider session={session}>
			<ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
				<TooltipProvider>
					{children}
					<Toaster />
					<ToasterSonner />
					<div className={'clear-both'}></div>
				</TooltipProvider>
			</ThemeProvider>
		</SessionProvider>
	);
}



