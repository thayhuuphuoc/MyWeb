import {TProductWithRelation, parseProductImages} from "@/actions/products/validations";
import {getRandomPublishedProducts} from "@/actions/products/queries";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {ArrowLeft, ShoppingBag} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ProductBody from "@/components/public/products/product-body";
import ProductSlideImages from "@/components/public/products/product-slides-images";
import ProductShareButtons from "@/components/public/products/product-share-buttons";
import RelatedProducts from "@/app/(public)/(products)/_components/related-products";
import BreadCrumb from "@/components/public/breadcrumb/breadcrumb";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import siteMetadata from "@/config/siteMetadata";

export default async function Product({data}: {
	data: TProductWithRelation
}){
	const productsPromise = getRandomPublishedProducts(10)
	const productImages = parseProductImages(data.images)
	const firstImageUrl = productImages[0]?.url
	
	const hasDiscount = typeof data.price === 'number' && Number(data.fakePrice) > 0
	const discountPercent = hasDiscount 
		? Math.round((data.fakePrice! - data.price!) / data.fakePrice! * 100) 
		: 0

	return (
		<>
			{/*Breadcrumb*/}
			<div className="container max-w-5xl mx-auto px-5 pt-4 md:pt-5">
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

			{/* Product Header Section */}
			<div className="container max-w-5xl mx-auto px-5 mt-4 md:mt-5 lg:mt-6">
				<div className={'lg:flex gap-8'}>
					<div className={'w-full lg:max-w-[28rem] flex-shrink-0 mb-6 lg:mb-0'}>
						<ProductSlideImages data={data}/>
					</div>

					<div className={'space-y-5'}>
						<h1 className={'text-2xl md:text-4xl font-extrabold leading-tight md:leading-tight text-gray-800 dark:text-white'}>{data.title}</h1>
						<div className="space-y-1">
							<div className="text-red-500 dark:text-red-400 text-3xl font-black">
								{data.price?.toLocaleString('vi-VN')}đ
							</div>
							{hasDiscount && (
								<div className="flex items-center gap-3">
									<div className="text-lg font-bold line-through text-gray-500 dark:text-gray-400">
										{data.fakePrice?.toLocaleString('vi-VN')}đ
									</div>
									<Badge variant="warning">
										-{discountPercent}%
									</Badge>
								</div>
							)}
						</div>
						<div className={'font-inter text-gray-700 dark:text-gray-300'}>
							{data.description}
						</div>
						<Dialog>
							<DialogTrigger asChild>
								<Button size={'lg'} className={'flex gap-3 items-center w-full sm:w-52'}>
									<ShoppingBag className={'size-5'}/> <span>Mua ngay</span>
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-md">
								<DialogHeader>
									<DialogTitle className="text-gray-800 dark:text-white">Thanh toán chuyển khoản</DialogTitle>
									<DialogDescription className="text-gray-600 dark:text-gray-300">
										Thanh toán thông qua chuyển tiền ngân hàng. Sau đó liên hệ qua <Link className={'text-black dark:text-white bg-yellow-300 dark:bg-yellow-500 px-2 font-semibold hover:underline transition-colors rounded'} href={siteMetadata.social.zalo} target={'_blank'}>zalo</Link> hoặc <Link className={'text-black dark:text-white bg-yellow-300 dark:bg-yellow-500 px-2 font-semibold hover:underline transition-colors rounded'} href={siteMetadata.social.facebook} target={'_blank'}>facebook</Link> của mình để nhận source code nhé
									</DialogDescription>
								</DialogHeader>
								<Image src={'/bank/techcombank.jpg'} alt={'QR code thanh toán'} width={500} height={500} className={'block mx-auto rounded-md'} />
								<div className="border border-dashed border-blue-300 dark:border-blue-600 rounded-md p-3 bg-blue-50 dark:bg-blue-900/20">
									<p className={'text-sm text-gray-700 dark:text-gray-300'}><span className="font-bold underline">Lưu ý:</span> Nội dung chuyển khoản kèm <span className="font-semibold">email</span> hoặc <span className="font-semibold">SĐT</span> của bạn</p>
								</div>
							</DialogContent>
						</Dialog>
					</div>
				</div>
			</div>

			{/* Product Content Section */}
			<div className={'max-w-3xl mx-auto px-5 mt-4 md:mt-6 lg:mt-8'}>
				<div className="grid grid-cols-1 gap-5 md:gap-6">
					<div className={'bg-white dark:bg-surfaceDark rounded-md p-5'}>
						<ProductBody data={data}/>
					</div>
					<div className={'w-full flex flex-col sm:flex-row gap-4 items-start sm:items-center'}>
						<div className={'font-bold text-xl text-gray-800 dark:text-white'}>Tags:</div>
						<div className="flex gap-2 flex-wrap">
							{data.tags.map(tag => (
								<Link href={`/san-pham/tags/${tag.slug}`} key={tag.id} className={'rounded-full p-1 px-2 text-sm font-bold bg-yellow-200 dark:bg-yellow-600 hover:bg-yellow-300 dark:hover:bg-yellow-700 text-gray-800 dark:text-white transition-colors'}>
									#{tag.name}
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Share Buttons Section */}
			<ProductShareButtons
				title={data.title}
				slug={data.slug}
				description={data.description || undefined}
				image={firstImageUrl || undefined}
			/>

			{/* Related Products Section */}
			<RelatedProducts productsPromise={productsPromise}/>

			{/* Back Button Section */}
			<div className={'mt-12 md:mt-16 lg:mt-20 mb-8 md:mb-12 text-center flex items-center justify-center px-5'}>
				<Button variant={'outline-front'} className={'rounded-full'} asChild>
					<Link href={'/san-pham'}>
						<ArrowLeft className={'size-4 mr-1'}/> Tất cả sản phẩm
					</Link>
				</Button>
			</div>
		</>
	)
}
