"use server";

import {getUsers} from "@/actions/users/users";

export async function actionSearch(props: {
	term?: string, areaName?: string, per_page?: number, page?: number
}){
	const res = await getUsers(props)

	if(!res) {
		return { success: false, message: 'Không tìm thấy dữ liệu'}
	}

	return {
		success: true,
		message: 'Đã tìm thấy dữ liệu',
		...res
	}
}
