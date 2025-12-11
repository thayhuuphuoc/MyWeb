"use client";
import { useState, useEffect } from "react";
import { getResourceSections } from "@/actions/resources/queries";
import { cn } from "@/lib/utils";

export const ResourceNavigation = () => {
	const [activeSection, setActiveSection] = useState("phan-mem");
	const [sections, setSections] = useState<any[]>([]);

	useEffect(() => {
		const fetchSections = async () => {
			try {
				const result = await getResourceSections();
				if (result.data && Array.isArray(result.data)) {
					const activeSections = result.data
						.filter((s: any) => s && s.isActive)
						.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
					setSections(activeSections);
					if (activeSections.length > 0 && activeSections[0].sectionId) {
						setActiveSection(activeSections[0].sectionId);
					}
				}
			} catch (error) {
				console.error("Error fetching resource sections:", error);
			}
		};
		fetchSections();
	}, []);

	const handleSectionClick = (sectionId: string) => {
		setActiveSection(sectionId);
		// Dispatch custom event to update content
		window.dispatchEvent(
			new CustomEvent("resource-section-change", { detail: sectionId })
		);
		// Scroll to top of content
		const contentElement = document.getElementById("resource-content");
		if (contentElement) {
			contentElement.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	if (sections.length === 0) {
		return (
			<div className="text-center py-4">
				<p className="text-sm text-navyGray dark:text-white/60">Đang tải...</p>
			</div>
		);
	}

	return (
		<>
			{/* Mobile Navigation - Horizontal Scroll */}
			<div className="lg:hidden overflow-x-auto scrollbar-hide pb-2">
				<div className="flex gap-2 min-w-max">
					{sections.map((section) => (
						<button
							key={section.id}
							onClick={() => handleSectionClick(section.sectionId)}
							className={cn(
								"py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
								activeSection === section.sectionId
									? "bg-primary text-white dark:text-white"
									: "bg-gray-100 dark:bg-gray-800 text-navyGray dark:text-white/60 hover:bg-primary/20 dark:hover:text-primary"
							)}
						>
							{section.title}
						</button>
					))}
				</div>
			</div>

			{/* Desktop Navigation - Vertical Sidebar */}
			<div className="hidden lg:flex flex-col gap-0.5 items-start sticky top-[120px]">
				{sections.map((section) => (
					<button
						key={section.id}
						onClick={() => handleSectionClick(section.sectionId)}
						className={cn(
							"py-2.5 hover:bg-primary/20 dark:hover:text-primary xl:min-w-60 lg:min-w-52 w-full px-4 rounded-md text-base font-medium transition-colors text-left",
							activeSection === section.sectionId
								? "bg-primary text-white dark:text-white"
								: "text-navyGray dark:text-white/60"
						)}
					>
						{section.title}
					</button>
				))}
			</div>
		</>
	);
};

