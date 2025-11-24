import '@/styles/quill/quill.css'
import {TProduct} from "@/actions/products/validations";

export default function ProductBody({data}: {
	data: TProduct
}){
	return (
		<div
			className={'prose max-w-none w-full font-serif break-words ql-snow'}
		>
			<div
				dangerouslySetInnerHTML={{__html: String(data.body)}}
			/>
		</div>
	)
}
