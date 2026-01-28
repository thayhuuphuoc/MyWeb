import {Metadata} from "next";
import AddPost from "@/app/(protected)/dashboard/posts/_components/add-post";
import {getPostConstants} from "@/actions/posts/queries";

export const metadata: Metadata = {
	title: 'Thêm Bài viết',
}

export default async function AddPage(){
	const contants = await getPostConstants()

	return (
		<>
			<AddPost {...contants} />
		</>
	)
}
