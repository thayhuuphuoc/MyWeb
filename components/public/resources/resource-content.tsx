"use client";
import { useEffect, useState, useRef } from "react";
import { getResourceSections } from "@/actions/resources/queries";
import '@/styles/quill/quill.css';

export const ResourceContent = () => {
	const [sections, setSections] = useState<any[]>([]);
	const [activeSection, setActiveSection] = useState("phan-mem");
	const [loading, setLoading] = useState(true);
	const contentRef = useRef<HTMLDivElement>(null);

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
			} finally {
				setLoading(false);
			}
		};
		fetchSections();
	}, []);

	// Listen for section changes from navigation
	useEffect(() => {
		const handleSectionChange = (event: Event) => {
			const customEvent = event as CustomEvent;
			setActiveSection(customEvent.detail);
		};

		window.addEventListener("resource-section-change", handleSectionChange);
		return () => {
			window.removeEventListener("resource-section-change", handleSectionChange);
		};
	}, []);

	// Force apply word-break styles after content renders
	// This must be before any early returns to follow React Hooks rules
	useEffect(() => {
		if (!contentRef.current || loading) return;
		
		const currentSectionData = sections.find((s) => s.sectionId === activeSection);
		if (!currentSectionData?.content) return;

		const applyWordBreakStyles = () => {
			const contentElement = contentRef.current;
			if (!contentElement) return;

			// Get all text elements
			const allElements = contentElement.querySelectorAll('*');
			allElements.forEach((el) => {
				if (el instanceof HTMLElement) {
					el.style.setProperty('word-break', 'normal', 'important');
					el.style.setProperty('overflow-wrap', 'break-word', 'important');
					el.style.setProperty('word-wrap', 'break-word', 'important');
					el.style.setProperty('white-space', 'normal', 'important');
					el.style.setProperty('hyphens', 'none', 'important');
				}
			});

			// Also apply to the content element itself
			if (contentElement instanceof HTMLElement) {
				contentElement.style.setProperty('word-break', 'normal', 'important');
				contentElement.style.setProperty('overflow-wrap', 'break-word', 'important');
				contentElement.style.setProperty('word-wrap', 'break-word', 'important');
			}
		};

		// Apply immediately
		applyWordBreakStyles();

		// Apply after a short delay to catch dynamically loaded content
		const timeout1 = setTimeout(applyWordBreakStyles, 100);
		const timeout2 = setTimeout(applyWordBreakStyles, 500);

		return () => {
			clearTimeout(timeout1);
			clearTimeout(timeout2);
		};
	}, [sections, activeSection, loading]);

	if (loading) {
		return (
			<div className="text-center py-10">
				<p className="text-navyGray dark:text-white">Đang tải...</p>
			</div>
		);
	}

	const currentSection = sections.find((s) => s.sectionId === activeSection);

	if (!currentSection) {
		return (
			<div className="text-center py-10">
				<p className="text-navyGray dark:text-white">Không tìm thấy nội dung</p>
			</div>
		);
	}

	return (
		<div id="resource-content" ref={contentRef} className="w-full min-w-0">
			<h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 text-black dark:text-white">
				{currentSection.title}
			</h2>
			{currentSection.content ? (
				<div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20 ql-snow w-full resource-prose-content">
					<div
						dangerouslySetInnerHTML={{ __html: String(currentSection.content).replace(/&nbsp;|\u00A0/g, ' ') }}
					/>
				</div>
			) : (
				<div className="p-6 md:p-8 rounded-md border border-gray-200 dark:border-white/20">
					<p className="text-sm md:text-base text-navyGray dark:text-white/80">
						Nội dung đang được cập nhật...
					</p>
				</div>
			)}
		</div>
	);
};

