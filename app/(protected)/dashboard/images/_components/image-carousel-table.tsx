"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { EditImageDialog } from "./edit-image-dialog";
import { DeleteImageDialog } from "./delete-image-dialog";
import { CreateImageDialog } from "./create-image-dialog";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useState, useTransition } from "react";
import { updateImageCarousel } from "@/actions/image-carousel/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function ImageCarouselTable({ images }: { images: any[] }) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleMove = (image: any, direction: "up" | "down") => {
		const sortedImages = [...images].sort((a, b) => a.order - b.order);
		const currentIndex = sortedImages.findIndex((img) => img.id === image.id);

		if (
			(direction === "up" && currentIndex === 0) ||
			(direction === "down" && currentIndex === sortedImages.length - 1)
		) {
			return;
		}

		const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
		const targetImage = sortedImages[targetIndex];

		const newOrder = targetImage.order;
		const oldOrder = image.order;

		startTransition(async () => {
			await updateImageCarousel(image.id, {
				...image,
				order: newOrder,
			});

			await updateImageCarousel(targetImage.id, {
				...targetImage,
				order: oldOrder,
			});

			toast.success("Đã cập nhật thứ tự");
			router.refresh();
		});
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-end mb-4">
				<CreateImageDialog />
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Hình ảnh</TableHead>
							<TableHead>Tiêu đề</TableHead>
							<TableHead>Mô tả</TableHead>
							<TableHead>Thứ tự</TableHead>
							<TableHead>Trạng thái</TableHead>
							<TableHead className="text-right">Thao tác</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{images.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="text-center py-8 text-navyGray dark:text-white/60">
									Chưa có hình ảnh. Vui lòng thêm hình ảnh mới.
								</TableCell>
							</TableRow>
						) : (
							[...images]
								.sort((a, b) => a.order - b.order)
								.map((image, index) => (
									<TableRow key={image.id}>
										<TableCell>
											<div className="relative w-20 h-20 rounded-md overflow-hidden">
												<Image
													src={image.imageUrl}
													alt={image.title || "Image"}
													fill
													className="object-cover"
													sizes="80px"
												/>
											</div>
										</TableCell>
										<TableCell className="font-medium">{image.title || "-"}</TableCell>
										<TableCell className="max-w-xs truncate">{image.description || "-"}</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<span>{image.order}</span>
												<div className="flex flex-col gap-0.5">
													<Button
														variant="ghost"
														size="icon"
														className="h-5 w-5"
														onClick={() => handleMove(image, "up")}
														disabled={isPending || index === 0}
													>
														<ArrowUp className="h-3 w-3" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														className="h-5 w-5"
														onClick={() => handleMove(image, "down")}
														disabled={isPending || index === images.length - 1}
													>
														<ArrowDown className="h-3 w-3" />
													</Button>
												</div>
											</div>
										</TableCell>
										<TableCell>
											{image.isActive ? (
												<span className="text-green-600">Hoạt động</span>
											) : (
												<span className="text-gray-400">Ẩn</span>
											)}
										</TableCell>
										<TableCell>
											<div className="flex items-center justify-end gap-2">
												<EditImageDialog image={image} />
												<DeleteImageDialog image={image} />
											</div>
										</TableCell>
									</TableRow>
								))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}


















