import {TProductWithRelation} from "@/actions/products/validations";

import {Button} from "@/components/ui/button";
import {ArrowLeft, ShoppingBag} from "lucide-react";
import Link from "next/link";
import ProductBody from "@/components/public/products/product-body";
import ProductSlideImages from "@/components/public/products/product-slides-images";
import {getRandomPublishedProducts} from "@/actions/products/queries";
import RelatedProducts from "@/app/(public)/(products)/_components/related-products";
import OrderButton from "@/components/public/products/order-button";
import BreadCrumb from "@/components/public/breadcrumb/breadcrumb";
import {Badge} from "@/components/ui/badge";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image";
import siteMetadata from "@/config/siteMetadata";

export default async function Product({data}: {
	data: TProductWithRelation
}){
	const productsPromise = getRandomPublishedProducts(10)
	const hasDiscount = typeof data.price === 'number' && Number(data.fakePrice) > 0
	const discountPercent =  hasDiscount ? Math.round((data.fakePrice! - data.price!) / data.fakePrice! * 100) : 0

	return (
		<>
			{/*Breadcrumb*/}
			<div className="container max-w-5xl mx-auto px-5">
				<BreadCrumb data={[
					{
						title: 'Sản phẩm',
						href: '/san-pham'
					},
					{
						title: data.title
					}
				]} />
			</div>

			<div className="container max-w-5xl mx-auto px-5">
				<div className={'lg:flex gap-8'}>
					<div className={'w-full lg:max-w-[28rem] flex-shrink-0 mb-8'}>
						<ProductSlideImages data={data}/>
					</div>

					<div className={'space-y-5 my-3 lg:mt-5'}>
						<h1 className={'text-2xl md:text-4xl font-extrabold leading-tight md:leading-tight text-gray-800'}>{data.title}</h1>
						<div className="space-y-1">
							<div className="text-red-500 text-3xl font-black">{data.price?.toLocaleString('vi-VN')}đ</div>
							{hasDiscount && (
								<div className="flex items-center gap-3">
									<div className="text-lg font-bold line-through">{data.fakePrice?.toLocaleString('vi-VN')}đ</div>
									<Badge className={''} variant={'warning'}>
										-{discountPercent}%
									</Badge>
								</div>
							)}
						</div>
						<div className={'font-inter text-gray-700'}>
							{data.description}
						</div>
						<Dialog>
							<DialogTrigger>
								<Button size={'lg'} className={'flex gap-3 items-center w-52'}>
									<ShoppingBag className={'size-5'}/> <span>Mua ngay</span>
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Thanh toán chuyển khoản</DialogTitle>
									<DialogDescription>
										Thanh toán thông qua chuyển tiền ngân hàng. Sau đó liên hệ qua <Link className={'text-black bg-yellow-300 px-2 font-semibold hover:underline transition-colors'} href={siteMetadata.social.zalo} target={'_blank'}>zalo</Link> hoặc <Link className={'text-black bg-yellow-300 px-2 font-semibold hover:underline transition-colors'} href={siteMetadata.social.facebook} target={'_blank'}>facebook</Link> của mình để nhận source code nhé
									</DialogDescription>
								</DialogHeader>
								<Image src={'/bank/bidv.jpg'} alt={'momo'} width={500} height={500} className={'block mx-auto'} />
								<div className="border border-dashed border-blue-300 rounded-md p-3">
									<p className={'text-sm'}><span className="font-bold underline">Lưu ý:</span> Nội dung chuyển khoản kèm <span className="font-semibold">email</span> hoặc <span className="font-semibold">SĐT</span> của bạn</p>
								</div>
							</DialogContent>
						</Dialog>


					</div>
				</div>


				<div className={'max-w-3xl mx-auto mb-8'}>
					<div className="grid grid-cols-1 gap-5">
						<div className={'bg-white rounded-md p-5'}>
							<ProductBody data={data}/>
						</div>
						<div className={'max-w-3xl mx-auto w-full flex gap-4'}>
							<div className={'font-bold text-xl'}>Tags:</div>
							<div className="flex gap-2 flex-wrap">
								{data.tags.map(tag => (
									<Link href={`/san-pham/tags/${tag.slug}`} key={tag.id} className={'rounded-full p-1 px-2 text-sm font-bold bg-yellow-200 hover:bg-yellow-300 transition-colors'}>
										#{tag.name}
									</Link>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			<RelatedProducts productsPromise={productsPromise}/>

			<div className={'mt-20 text-center flex items-center justify-center px-5'}>
				<Button variant={'outline-front'} className={'rounded-full'} asChild>
					<Link href={'/san-pham'}>
						<ArrowLeft className={'size-4 mr-1'}/> Tất cả sản phẩm
					</Link>
				</Button>
			</div>
		</>
	)
}
