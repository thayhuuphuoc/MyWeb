"use server";

import prisma from "@/lib/prisma";
import { getErrorMessage } from "@/lib/handle-error";

export async function getDocumentationSections() {
	try {
		const sections = await prisma.documentationSection.findMany({
			orderBy: {
				order: "asc",
			},
		});

		return {
			data: sections,
			error: null,
		};
	} catch (e) {
		return {
			data: null,
			error: getErrorMessage(e),
		};
	}
}

export async function getDocumentationSection(sectionId: string) {
	try {
		const section = await prisma.documentationSection.findUnique({
			where: {
				sectionId,
			},
		});

		return {
			data: section,
			error: null,
		};
	} catch (e) {
		return {
			data: null,
			error: getErrorMessage(e),
		};
	}
}


















