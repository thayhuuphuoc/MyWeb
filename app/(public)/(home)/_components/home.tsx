import {getPosts} from "@/actions/posts/queries";
import * as React from "react";
import Link from "next/link";
import PostCard from "@/components/public/posts/post-card";
import siteMetadata from "@/config/siteMetadata";
import Image from "next/image";
import {PricingSection} from "@/app/(public)/(home)/_components/pricing";
import ProductCard from "@/components/public/products/product-card";
import {getProducts} from "@/actions/products/queries";

export default function Home(
	props: {
		postsPromise: ReturnType<typeof getPosts>,
		newProductsPromise: ReturnType<typeof getProducts>,
	}
){
	const { data, pageCount } = React.use(props.postsPromise)
	const newProducts = React.use(props.newProductsPromise)

	return (
		<>
			<section className="container 2xl:max-w-[1536px] mx-auto px-5 max-[660px]:px-0">
				<div className="relative min-[1024px]:pl-[500px] max-[1023px]:pb-[0px] max-[660px]:rounded-none max-[1023px]:bg-[length:auto_600px] rounded-2xl grid items-center bg-vweb_bg bg-left-bottom bg-no-repeat px-10 py-12 hero-shadow">
					<div className="relative z-20 flex-col justify-center items-start gap-7 flex max-w-[700px]">
						<h1 className="text-3xl md:text-6xl font-bold m-0">Lập Trình NextJS</h1>
						<hr className="gradient-line"/>
						<div className="prose prose-lg">
							<p></p>
							<p>Nâng tầm doanh nghiệp với website NextJS siêu tốc, chuẩn SEO, công nghệ làm web tốt nhất hiện nay.</p>
							<p>Chúng tôi cung cấp dịch vụ <span className={'bg-yellow-200 italic font-medium text-black'}>lập trình Next.js toàn diện</span>, từ thiết kế giao diện đến tối ưu hóa hiệu suất, đảm bảo website của bạn nhanh chóng, bảo mật và thân thiện với công cụ tìm kiếm.</p>
							<p></p>
						</div>
						<div className="mb-6 justify-start items-center gap-5 inline-flex max-[660px]:flex max-[660px]:flex-col w-full max-[660px]:items-start min-[1000px]:flex min-[1000px]:flex-col min-[1250px]:inline-flex min-[1000px]:items-start min-[1250px]:flex-row">
							<div className="justify-start items-center gap-5 inline-flex">
								{siteMetadata.social.youtube && (
									<Link target={'_blank'} href={siteMetadata.social.youtube}>
										<Image src={'/icons/youtube-circle.webp'} alt={'youtube'} width={52} height={52}/>
									</Link>
								)}
								{siteMetadata.social.facebook && (
									<Link target={'_blank'} href={siteMetadata.social.facebook}>
										<Image src={'/icons/facebook.png'} alt={'facebook'} width={52} height={52}/>
									</Link>
								)}
								{siteMetadata.social.zalo && (
									<Link target={'_blank'} href={siteMetadata.social.zalo}>
										<Image src={'/icons/zalo.svg'} alt={'zalo'} width={52} height={52}/>
									</Link>
								)}
							</div>
						</div>
					</div>
					<picture className={'absolute max-[1023px]:static bottom-0 left-0 rounded-2xl z-10 overflow-hidden max-[1023px]:overflow-visible'}>
						<source srcSet="/heroop.png" media="(max-width: 640)" width="640" height="569"/>
						<source srcSet="/heroop.png" media="(max-width: 768px)" width="768" height="683"/>
						<Image priority src={'/heroop.png'} alt={'hero-image'} width={925} height={822}/>
					</picture>
				</div>
			</section>


			{/*benifit*/}
			<h2 className="container mx-auto px-5 text-center text-xl font-bold m-0 mt-10 lg:mt-16">
				Lợi ích khi chọn <span className="px-1 bg-yellow-200 capitalize">dịch vụ NextJS</span> của chúng tôi
			</h2>
			<hr className="gradient-line mx-auto"/>
			<div className={'container mx-auto max-w-[1400px] px-5 grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-7'}>
				<div className={'rounded-lg bg-white border border-indigo-200 border-opacity-50 p-5 flex flex-col justify-start text-center items-center'}>
					<Image src={'/home/speed.webp'} alt={'speed'} width={96} height={96} className={'aspect-square size-24 mt-2 mb-4'} />
					<div className={'font-semibold lg:text-lg mt-2'}>
						Tốc độ vượt trội
					</div>
					<p className={'text-sm lg:text-base mt-1'}>
						Website tải nhanh như chớp, mang đến trải nghiệm mượt mà cho người dùng.
					</p>
				</div>
				<div className={'rounded-lg bg-white border border-indigo-200 border-opacity-50 p-5 flex flex-col justify-start text-center items-center'}>
					<Image src={'/home/seo.webp'} alt={'seo'} width={96} height={96} className={'aspect-square size-24 mt-2 mb-4'} />
					<div className={'font-semibold lg:text-lg mt-2'}>
						SEO thân thiện
					</div>
					<p className={'text-sm lg:text-base mt-1'}>
						Đạt thứ hạng cao trên Google, thu hút lượng lớn khách hàng tiềm năng.
					</p>
				</div>
				<div className={'rounded-lg bg-white border border-indigo-200 border-opacity-50 p-5 flex flex-col justify-start text-center items-center'}>
					<Image src={'/home/customize.webp'} alt={'customize'} width={96} height={96} className={'aspect-square size-24 mt-2 mb-4'} />
					<div className={'font-semibold lg:text-lg mt-2'}>
						Giao diện tùy chỉnh
					</div>
					<p className={'text-sm lg:text-base mt-1'}>
						Thiết kế độc đáo, ấn tượng, thể hiện cá tính thương hiệu riêng biệt.
					</p>
				</div>
				<div className={'rounded-lg bg-white border border-indigo-200 border-opacity-50 p-5 flex flex-col justify-start text-center items-center'}>
					<Image src={'/home/shield.webp'} alt={'shield'} width={96} height={96} className={'aspect-square size-24 mt-2 mb-4'} />
					<div className={'font-semibold lg:text-lg mt-2'}>
						Bảo mật toàn diện
					</div>
					<p className={'text-sm lg:text-base mt-1'}>
						An tâm tuyệt đối với hệ thống bảo vệ vững chắc, dữ liệu luôn an toàn.
					</p>
				</div>
				<div className={'rounded-lg bg-white border border-indigo-200 border-opacity-50 p-5 flex flex-col justify-start text-center items-center'}>
					<Image src={'/home/price.webp'} alt={'price'} width={96} height={96} className={'aspect-square size-24 mt-2 mb-4'} />
					<div className={'font-semibold lg:text-lg mt-2'}>
						Chi phí hợp lý
					</div>
					<p className={'text-sm lg:text-base mt-1'}>
						Đầu tư hiệu quả, nhận lại giá trị vượt trội, tối ưu ngân sách cho doanh nghiệp.
					</p>
				</div>
				<div className={'rounded-lg bg-white border border-indigo-200 border-opacity-50 p-5 flex flex-col justify-start text-center items-center'}>
					<Image src={'/home/support.webp'} alt={'support'} width={96} height={96} className={'aspect-square size-24 mt-2 mb-4'} />
					<div className={'font-semibold lg:text-lg mt-2'}>
						Hỗ trợ tận tâm
					</div>
					<p className={'text-sm lg:text-base mt-1'}>
						Luôn đồng hành, giải đáp mọi thắc mắc và hỗ trợ kỹ thuật nhanh chóng.
					</p>
				</div>
			</div>


			<PricingSection/>

			<div className={'mt-10 container mx-auto max-w-[1400px] px-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-5'}>
				{newProducts.data.map((product, index) => (
					<ProductCard product={product} key={product.id} size={'sm'} />
				))}
			</div>
			<div className={'container mx-auto px-5 text-center mt-5 relative z-2'}>
				<Link href={`/san-pham`} className={'h-14 inline-flex rounded-full bg-gradient-to-r from-pink-400 via-blue-400 to-green-400 p-[2px]'}>
					<span className={'text-base font-bold tracking-wide flex rounded-full h-full items-center justify-center bg-vweb_bg back px-6 transition-all duration-150 hover:bg-opacity-80 text-[15px]'}>
						xem thêm sản phẩm
					</span>
				</Link>
			</div>

			{/*posts*/}
			<h2 className="container mx-auto px-5 text-center text-xl font-bold m-0 mt-10">
				Bài viết mới nhất
			</h2>
			<hr className="gradient-line mx-auto"/>
			<div className={'container mx-auto max-w-[1400px] px-5 grid grid-cols-1 min-[1024px]:grid-cols-2 gap-7'}>
				{data.slice(0,2).map((post, index) => (
					<PostCard post={post} key={post.id} />
				))}
			</div>


			{/*tags*/}
			<h2 className="container mx-auto px-5 text-center text-xl font-bold m-0 mt-10">
				Chủ đề nổi bật
			</h2>
			<hr className="gradient-line mx-auto"/>
			<div className={'container mx-auto max-w-[1400px] px-5 justify-center items-start gap-3 xl:gap-7 flex flex-wrap'}>
				<Link
					href={'blog/tags/co-ban'}
					className={'lg:px-4 lg:pr-6 lg:py-3 px-1.5 py-1 pr-3 bg-vweb_bg border border-indigo-200 border-opacity-50 rounded-full justify-start items-center gap-3 lg:gap-7 flex transition-all duration-150 hover:bg-opacity-60'}
				>
					<div className="w-16 h-16 rounded-full bg-blue-100 overflow-hidden">
						<Image src={'/features/basic.webp'} alt={'basic'} width={80} height={80} className={'w-full h-full object-center object-cover'}/>
					</div>
					<div className="text-md font-bold">Cơ bản</div>
				</Link>
				<Link
					href={'blog/tags/nang-cao'}
					className={'lg:px-4 lg:pr-6 lg:py-3 px-1.5 py-1 pr-3 bg-vweb_bg border border-indigo-200 border-opacity-50 rounded-full justify-start items-center gap-3 lg:gap-7 flex transition-all duration-150 hover:bg-opacity-60'}
				>
					<div className="w-16 h-16 rounded-full bg-blue-100 overflow-hidden">
						<Image src={'/features/ranking.webp'} alt={'ranking'} width={80} height={80} className={'w-full h-full object-center object-cover'}/>
					</div>
					<div className="text-md font-bold">Nâng cao</div>
				</Link>
				<Link
					href={'blog/tags/chuyen-sau'}
					className={'lg:px-4 lg:pr-6 lg:py-3 px-1.5 py-1 pr-3 bg-vweb_bg border border-indigo-200 border-opacity-50 rounded-full justify-start items-center gap-3 lg:gap-7 flex transition-all duration-150 hover:bg-opacity-60'}
				>
					<div className="w-16 h-16 rounded-full bg-blue-100 overflow-hidden">
						<Image src={'/features/advanced.webp'} alt={'advanced'} width={80} height={80} className={'w-full h-full object-center object-cover'}/>
					</div>
					<div className="text-md font-bold">Chuyên sâu</div>
				</Link>
				<Link
					href={'blog/tags/thu-thuat'}
					className={'lg:px-4 lg:pr-6 lg:py-3 px-1.5 py-1 pr-3 bg-vweb_bg border border-indigo-200 border-opacity-50 rounded-full justify-start items-center gap-3 lg:gap-7 flex transition-all duration-150 hover:bg-opacity-60'}
				>
					<div className="w-16 h-16 rounded-full bg-blue-100 overflow-hidden">
						<Image src={'/features/tips.webp'} alt={'tips'} width={80} height={80} className={'w-full h-full object-center object-cover'}/>
					</div>
					<div className="text-md font-bold">Thủ thuật</div>
				</Link>
			</div>


			{/*posts*/}
			<div className={'container mx-auto max-w-[1400px] px-5 grid grid-cols-1 min-[1024px]:grid-cols-2 gap-7 mt-10'}>
				{data.slice(2, data.length).map((post, index) => (
					<PostCard post={post} key={post.id} />
				))}
			</div>

			<div className={'container mx-auto px-5 text-center mt-10'}>
				<Link href={`/blog`} className={'h-14 inline-flex rounded-full bg-gradient-to-r from-pink-400 via-blue-400 to-green-400 p-[2px]'}>
					<div className={'text-base font-bold tracking-wide flex rounded-full h-full items-center justify-center bg-vweb_bg back px-6 transition-all duration-150 hover:bg-opacity-80 text-[15px]'}>
						xem thêm bài viết
					</div>
				</Link>
			</div>
		</>
	)
}
