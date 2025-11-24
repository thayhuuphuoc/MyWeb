import PageHeading from "@/components/dashboard/page-heading";
import {Metadata} from "next";
import {getUsers} from "@/actions/users/users";
import {DataTable} from "@/app/(protected)/dashboard/users/data-table";
import {columns} from "@/app/(protected)/dashboard/users/columns";

export const metadata: Metadata = {
	title: 'Người dùng ',
}

export default async function UsersPage(){
	const users = await getUsers({})

	return (
		<>
			<PageHeading title={'Người Dùng'} />
			<div className="container space-y-5">
				<DataTable data={users?.fields || []} columns={columns}/>
			</div>
		</>
	)
}
