import {parseProductImages, TProductWithRelation} from "@/actions/products/validations";
import Link from "next/link";
import Image from "next/image";
import {getDateVn} from "@/lib/date";
import {ArrowRight} from "lucide-react";
import {cn} from "@/lib/utils";
import {rgbDataURL} from "@/lib/rgbDataUrl";
import {Badge} from "@/components/ui/badge";

export default function ProductCard({product, size}: {
	product: TProductWithRelation,
	size?: 'sm' | 'md',
}){
	const isHot = product.tags.find((tag) => tag.slug === 'hot-trend')
	return (
		<div className={cn('product-item relative bg-vweb_bg dark:bg-surfaceDark flex-col justify-start items-start gap-1 p-3 rounded-lg inline-flex border border-indigo-200 dark:border-indigo-800 border-opacity-50 dark:border-opacity-30 gradient-border', {
			'border-yellow-600 dark:border-yellow-500': Boolean(isHot),
		})}>
			{parseProductImages(product.images)[0].url && (
				<div className={'w-full'}>
					<Link href={`/san-pham/${product.slug}`} className={'block'}>
						<span className="vweb-image">
							<picture className={'rounded-md block mb-0 w-full overflow-hidden aspect-square relative'}>
								<Image
									placeholder={'blur'}
									blurDataURL={rgbDataURL(191, 219, 255)}
									src={parseProductImages(product.images)[0].url} alt={`${product.title}`} fill className={'object-center object-cover'}
								/>
							</picture>
						</span>
					</Link>
					{Boolean(isHot) && (
						<div className={'absolute top-2 left-0'}>
							<Link href={'/san-pham/tags/hot-trend'}>
								<Badge className={'rounded-l-none'} variant={'destructive'}>Hot</Badge>
							</Link>
						</div>
					)}
				</div>
			)}

			<div className={'self-stretch flex-col justify-start items-start gap-5 flex mt-3 mb-1'}>
				<h3 title={product.title} className={cn("font-medium m-0 leading-snug line-clamp-2 text-gray-800 dark:text-white", {
					"text-sm md:text-base": size === 'sm',
					"xl:text-lg": size !== 'sm'
				})}>
					<Link href={`/san-pham/${product.slug}`} className={'transition-all duration-150 hover:text-blue-500 dark:hover:text-blue-400'}>
						{product.title}
					</Link>
				</h3>
			</div>
		</div>
	)
}
