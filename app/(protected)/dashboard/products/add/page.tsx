import {Metadata} from "next";
import AddProduct from "@/app/(protected)/dashboard/products/_components/add-product";
import {getProductConstants} from "@/actions/products/queries";

export const metadata: Metadata = {
	title: 'Thêm Sản phẩm',
}

export default async function AddPage(){
	const contants = await getProductConstants()

	return (
		<>
			<AddProduct {...contants} />
		</>
	)
}
