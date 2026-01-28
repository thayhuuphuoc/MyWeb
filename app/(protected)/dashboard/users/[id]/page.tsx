import PageHeading from "@/components/dashboard/page-heading";
import {Metadata} from "next";
import {getUser} from "@/actions/users/users";
import EditUser from "@/app/(protected)/dashboard/users/[id]/edit-user";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ChevronLeft} from "lucide-react";

export const metadata: Metadata = {
	title: 'Edit Người Dùng',
}

export default async function Page(props:{
	params: {id: string}
}) {
	const user = await getUser(props.params.id)

	return (
		<>
			<EditUser user={user}/>
		</>
	)
}
