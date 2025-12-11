import { getResourceSections } from "@/actions/resources/queries";
import { ResourceTable } from "./_components/resource-table";
import { CreateResourceDialog } from "./_components/create-resource-dialog";

export default async function ResourcesPage() {
	const result = await getResourceSections();
	const sections = result.data || [];

	return (
		<div className="container">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Quản lý Tài nguyên</h1>
				<CreateResourceDialog />
			</div>
			<ResourceTable sections={sections} />
		</div>
	);
}

