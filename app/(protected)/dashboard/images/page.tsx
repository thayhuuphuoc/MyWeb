import { getAllImageCarousels } from "@/actions/image-carousel/queries";
import { ImageCarouselTable } from "./_components/image-carousel-table";

export default async function ImagesPage() {
	const result = await getAllImageCarousels();
	const images = result.data || [];

	return (
		<div className="container">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Quản lý Hình ảnh</h1>
			</div>
			<ImageCarouselTable images={images} />
		</div>
	);
}


















