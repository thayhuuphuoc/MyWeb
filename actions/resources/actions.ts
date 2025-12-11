"use server";

import prisma from "@/lib/prisma";
import { getErrorMessage } from "@/lib/handle-error";
import { ResourceSectionSchema, TResourceSection } from "./validations";
import { revalidatePath } from "next/cache";

export async function upsertResourceSection(
	input: TResourceSection
) {
	try {
		const validatedData = ResourceSectionSchema.parse(input);

		const section = await prisma.resourceSection.upsert({
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

		revalidatePath("/tai-nguyen");
		revalidatePath("/dashboard/resources");

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

export async function deleteResourceSection(sectionId: string) {
	try {
		await prisma.resourceSection.delete({
			where: {
				sectionId,
			},
		});

		revalidatePath("/tai-nguyen");
		revalidatePath("/dashboard/resources");

		return {
			error: null,
		};
	} catch (e) {
		return {
			error: getErrorMessage(e),
		};
	}
}


















