"use server";

import {getErrorMessage} from "@/lib/handle-error";
import prisma from "@/lib/prisma";

type DashboardPost = {
	id: string;
	title: string;
	image: string | null;
	slug: string;
	keywords: string | null;
	createdAt: Date;
	status: string;
};

type DashboardProduct = {
	id: string;
	title: string;
	image: string | null;
	slug: string;
	keywords: string | null;
	createdAt: Date;
	status: string;
};

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
			return { posts, products, totalPosts, totalProducts, totalUsers } as const
		})
		return {
			data: {
				posts: res.posts as DashboardPost[],
				products: res.products as DashboardProduct[],
				totalPosts: res.totalPosts,
				totalProducts: res.totalProducts,
				totalUsers: res.totalUsers,
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
