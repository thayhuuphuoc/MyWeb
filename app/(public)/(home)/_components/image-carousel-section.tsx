import { getImageCarousels } from "@/actions/image-carousel/queries";
import { ImageCarousel3D } from "@/components/public/image-carousel/image-carousel-3d";

export default async function ImageCarouselSection() {
	const result = await getImageCarousels();
	const images = result.data || [];

	if (images.length === 0) {
		return null;
	}

	return (
		<section className="bg-gradient-to-b from-primary/10 via-white to-white dark:from-primary/20 dark:via-baseInk dark:to-baseInk">
			<div className="container mx-auto px-4 sm:px-7">
				{/* Header */}
				<div className="text-center mb-8 md:mb-12 pt-8 md:pt-12">
					<h2 className="text-2xl md:text-4xl font-bold text-black dark:text-white mb-2 md:mb-3.5">
						Dấu ấn thời gian
					</h2>
					<p className="text-sm md:text-lg text-navyGray dark:text-white/80">
						Mỗi khoảnh khắc lưu giữ một câu chuyện
					</p>
				</div>
				{/* 3D Carousel */}
				<div className="pb-8 md:pb-12 px-0 sm:px-0 md:px-0">
					<ImageCarousel3D images={images} />
				</div>
			</div>
		</section>
	);
}

