"use server";

import prisma from "@/lib/prisma";
import { getErrorMessage } from "@/lib/handle-error";
import { ImageCarouselSchema, TImageCarousel } from "./validations";
import { revalidatePath } from "next/cache";

export async function createImageCarousel(input: TImageCarousel) {
	try {
		const validatedData = ImageCarouselSchema.parse(input);

		const image = await prisma.imageCarousel.create({
			data: validatedData,
		});

		revalidatePath("/");
		revalidatePath("/dashboard/images");

		return {
			data: image,
			error: null,
		};
	} catch (e) {
		return {
			data: null,
			error: getErrorMessage(e),
		};
	}
}

export async function updateImageCarousel(id: string, input: TImageCarousel) {
	try {
		const validatedData = ImageCarouselSchema.parse(input);

		const image = await prisma.imageCarousel.update({
			where: { id },
			data: validatedData,
		});

		revalidatePath("/");
		revalidatePath("/dashboard/images");

		return {
			data: image,
			error: null,
		};
	} catch (e) {
		return {
			data: null,
			error: getErrorMessage(e),
		};
	}
}

export async function deleteImageCarousel(id: string) {
	try {
		await prisma.imageCarousel.delete({
			where: { id },
		});

		revalidatePath("/");
		revalidatePath("/dashboard/images");

		return {
			error: null,
		};
	} catch (e) {
		return {
			error: getErrorMessage(e),
		};
	}
}


















