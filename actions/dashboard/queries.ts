"use server";

import {getErrorMessage} from "@/lib/handle-error";
import prisma from "@/lib/prisma";

export async function getDashboardData(){
	try{
		const res = await prisma.$transaction(async (tx) => {
			const posts = await tx.post.findMany({
				select: {
					id: true,
					title: true,
					image: true,
					slug: true,
					keywords: true,
					createdAt: true,
					status: true,
				},
				take: 5,
				orderBy: {
					createdAt: 'desc'
				}
			})
			const products = await tx.product.findMany({
				select: {
					id: true,
					title: true,
					image: true,
					slug: true,
					keywords: true,
					createdAt: true,
					status: true,
				},
				take: 5,
				orderBy: {
					createdAt: 'desc'
				}
			})
			const totalPosts = await tx.post.count()
			const totalProducts = await tx.product.count()
			const totalUsers = await tx.user.count()
			return [posts,products,totalPosts,totalProducts,totalUsers]
		})
		return {
			data: {
				posts: res[0] as any[],
				products: res[1] as any[],
				totalPosts: res[2] as number,
				totalProducts: res[3] as number,
				totalUsers: res[4] as number,
			},
			error: null
		}
	} catch (e) {
		if (process.env.NODE_ENV === 'development') {
			console.error("Error in getDashboardStats:", e);
		}
		return {
			data: null,
			error: getErrorMessage(e),
		}
	}
}
