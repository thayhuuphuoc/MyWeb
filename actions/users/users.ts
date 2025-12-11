"use server";

import {PAGINATION} from "@/enum/enums";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {TEditUserSchema} from "@/schemas/user.schema";
import {Prisma} from "@prisma/client";

export type TUserPayload = Prisma.UserGetPayload<{
	select: {
		id: true,
		name: true,
		email: true,
		emailVerified: true,
		image: true,
		address: true,
		phoneNum: true,
		role: true,
		status: true,
		
		createdAt: true,
		updatedAt: true,
	}
}>
export type TUserPayloadFull = Prisma.UserGetPayload<any>
export async function getUsers (
	props: {
		term?: string,
		per_page?: number,
		page?: number
	}
)  {
	const {
		term,
		per_page,
		page
	} = props
	
	const take = per_page || PAGINATION.PER_PAGE
	const skip = page ? (page-1) * take : 0
	try {
		const res = await prisma.$transaction([
			prisma.user.count({
				where: {
					OR: [
						{
							name: {contains: term || '', mode: 'insensitive'},
						},
						{
							email: {contains: term || '', mode: 'insensitive'},
						},
					],
				},
			}),
			prisma.user.findMany({
				take: take,
				skip: skip,
				where: {
					OR: [
						{
							name: {contains: term || '', mode: 'insensitive'},
						},
						{
							email: {contains: term || '', mode: 'insensitive'},
						},
					],
				},
				select: {
					id: true,
					name: true,
					email: true,
					emailVerified: true,
					image: true,
					address: true,
					phoneNum: true,
					role: true,
					status: true,
					
					createdAt: true,
					updatedAt: true,
				},
				orderBy: {
					createdAt: 'desc'
				},
			})
		])
		
		const fields = res[1]
		const count = res[0]
		
		return {
			fields,
			meta: {
				page: page ? Number(page) : 1,
				per_page: take,
				total_page: Math.ceil(count/take),
				length: fields.length,
				total: count,
			},
			filter: {
				term,
			}
		}
	} catch (e) {
		if (process.env.NODE_ENV === 'development') {
			console.error("Error in getUsers:", e);
		}
		throw new Error(String(e) || 'Đã có lỗi xảy ra')
	}
}

export async function getUser(id: string){
	try {
		const data = await prisma.user.findUnique({where: {id}});
		if(!data){
			throw 'Không tìm thấy dữ liệu'
		}
		data.password = null
		return data
	} catch (e) {
		if (process.env.NODE_ENV === 'development') {
			console.error("Error in getUser:", e);
		}
		if(JSON.stringify(e).includes('12 bytes')){
			throw new Error('ID không tồn tại ')
		}
		throw new Error(String(e) || 'Đã có lỗi xảy ra')
	}
}

export const updateUser = async (
	values: TEditUserSchema,
	id: string,
) => {
	try {
		if(values.password){
			values.password = await bcrypt.hash(
				values.password,
				10,
			);
		}
		const user = await prisma.user.update({
			where: {id: id},
			data: {
				...values,
				updatedAt: new Date(),
			}
		})
		return { success: `Cập nhật "${user.email}" thành công !`, user}
	} catch(e) {
		if (process.env.NODE_ENV === 'development') {
			console.error("Error in updateUser:", e);
		}
		return {error: 'Đã có lỗi xảy ra'}
	}
}
export async function deleteUser(id: string){
	try {
		return await prisma.user.delete({where: {id}});
	} catch (e) {
		if (process.env.NODE_ENV === 'development') {
			console.error("Error in deleteUser:", e);
		}
		throw new Error(String(e) || 'Đã có lỗi xảy ra')
	}
}
