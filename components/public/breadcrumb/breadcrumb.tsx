import Link from "next/link";
import {CaretRightIcon, HomeIcon} from "@radix-ui/react-icons";

export type TBreadItem = {
	title?: string,
	href?: string,
}
export default function BreadCrumb(props:{
	data: TBreadItem[]
}){

	return (
		<ul className={'flex flex-wrap gap-2 font-medium py-4'}>
			<li>
				<Link
					title={'Home'}
					className={'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors'}
					href={'/'}
				>
					<HomeIcon className={'size-5 inline'}/> <CaretRightIcon className={'size-5 inline'}/>
				</Link>
			</li>
			{props.data.map(link => {
				if(link.href){
					return (
						<li key={link.title}>
							<Link
								className={'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors'}
								href={link.href}
							>
								{link.title} <CaretRightIcon className={'size-5 inline'}/>
							</Link>
						</li>
					)
				}
				return (
					<li key={link.title} className={'text-navyGray dark:text-gray-300'}>{link.title}</li>
				)
			})}
		</ul>
	)
}
