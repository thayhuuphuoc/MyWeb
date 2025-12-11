"use server";

import prisma from "@/lib/prisma";
import { getErrorMessage } from "@/lib/handle-error";
import { DocumentationSectionSchema, TDocumentationSection } from "./validations";
import { revalidatePath } from "next/cache";

export async function upsertDocumentationSection(
	input: TDocumentationSection
) {
	try {
		const validatedData = DocumentationSectionSchema.parse(input);

		const section = await prisma.documentationSection.upsert({
			where: {
				sectionId: validatedData.sectionId,
			},
			update: {
				title: validatedData.title,
				content: validatedData.content,
				order: validatedData.order,
				isActive: validatedData.isActive,
				updatedAt: new Date(),
			},
			create: {
				sectionId: validatedData.sectionId,
				title: validatedData.title,
				content: validatedData.content,
				order: validatedData.order,
				isActive: validatedData.isActive,
			},
		});

		revalidatePath("/tai-lieu");
		revalidatePath("/dashboard/documentation");

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

export async function deleteDocumentationSection(sectionId: string) {
	try {
		await prisma.documentationSection.delete({
			where: {
				sectionId,
			},
		});

		revalidatePath("/tai-lieu");
		revalidatePath("/dashboard/documentation");

		return {
			error: null,
		};
	} catch (e) {
		return {
			error: getErrorMessage(e),
		};
	}
}


















