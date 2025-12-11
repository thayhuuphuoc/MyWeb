"use server";

import prisma from "@/lib/prisma";
import { getErrorMessage } from "@/lib/handle-error";

export async function getImageCarousels() {
	try {
		const images = await prisma.imageCarousel.findMany({
			where: {
				isActive: true,
			},
			orderBy: {
				order: "asc",
			},
		});

		return {
			data: images,
			error: null,
		};
	} catch (e) {
		return {
			data: null,
			error: getErrorMessage(e),
		};
	}
}

export async function getAllImageCarousels() {
	try {
		const images = await prisma.imageCarousel.findMany({
			orderBy: {
				order: "asc",
			},
		});

		return {
			data: images,
			error: null,
		};
	} catch (e) {
		return {
			data: null,
			error: getErrorMessage(e),
		};
	}
}

export async function getImageCarousel(id: string) {
	try {
		const image = await prisma.imageCarousel.findUnique({
			where: {
				id,
			},
		});

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


















