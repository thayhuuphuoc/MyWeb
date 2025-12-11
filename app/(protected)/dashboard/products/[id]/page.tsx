import {Metadata} from "next";
import AddProduct from "@/app/(protected)/dashboard/products/_components/add-product";
import {findProduct, getProductConstants} from "@/actions/products/queries";

export const metadata: Metadata = {
	title: 'Edit Sản phẩm',
}

export default async function EditPage(props:{
	params: {id: string}
}) {
	const constants = await getProductConstants()
	const res = await findProduct(props.params.id)
	return (
		<>
			<AddProduct {...constants} product={res.data} />
		</>
	)
}
