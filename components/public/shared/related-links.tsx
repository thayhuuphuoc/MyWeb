import Link from "next/link";
import {TRelatedLink} from "@/actions/common/ralated-link-schema";

export default function RelatedLinks(props: {
	data: TRelatedLink[]
}){
	const {data} = props

	if(data.length === 0) return <></>
	return (
		<div className={'max-w-3xl mx-auto w-full px-6 py-5 border border-blue-500 border-dashed rounded-2xl'}>
			<div className="font-bold text-xl mb-3">Liên quan:</div>
			<ul className={'list-disc pl-6 space-y-2'}>
				{data.map(link => (
					<li key={link.index}>
						<Link href={link.url} className={'text-indigo-600 hover:text-indigo-400 transition-colors'}>{link.name}</Link>
					</li>
				))}
			</ul>
		</div>
	)
}












