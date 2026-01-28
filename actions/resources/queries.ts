"use server";

import prisma from "@/lib/prisma";
import { getErrorMessage } from "@/lib/handle-error";

export async function getResourceSections() {
	try {
		const sections = await prisma.resourceSection.findMany({
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

export async function getResourceSection(sectionId: string) {
	try {
		const section = await prisma.resourceSection.findUnique({
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


















