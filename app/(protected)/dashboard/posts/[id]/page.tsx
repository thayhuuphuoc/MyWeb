import {Metadata} from "next";
import AddPost from "@/app/(protected)/dashboard/posts/_components/add-post";
import {findPost} from "@/actions/posts/queries";
import {getPostConstants} from "@/actions/posts/queries";

export const metadata: Metadata = {
	title: 'Edit Bài viết',
}

export default async function EditPage(props:{
	params: {id: string}
}) {
	const constants = await getPostConstants()
	const res = await findPost(props.params.id)
	return (
		<>
			<AddPost {...constants} post={res.data} />
		</>
	)
}
