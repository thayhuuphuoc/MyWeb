"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageCarousel3DProps {
	images: Array<{
		id: string;
		imageUrl: string;
		title?: string | null;
		description?: string | null;
	}>;
}

export function ImageCarousel3D({ images }: ImageCarousel3DProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		if (images.length === 0) return;
		// Auto-play carousel
		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % images.length);
		}, 5000);

		return () => clearInterval(interval);
	}, [images.length]);

	if (images.length === 0) {
		return null;
	}

	const goToPrevious = () => {
		setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
	};

	const goToNext = () => {
		setCurrentIndex((prev) => (prev + 1) % images.length);
	};

	const getImageIndex = (offset: number) => {
		return (currentIndex + offset + images.length) % images.length;
	};

	return (
		<div className="relative w-full pt-0 pb-0">
			{/* 3D Carousel Container */}
			<div 
				className="relative h-[450px] md:h-[650px] flex items-center justify-center"
				style={{ perspective: '1500px' }}
			>
				{/* Left Image */}
				{images.length > 1 && (
					<div
						className={cn(
							"hidden md:block absolute left-0 md:-left-[15px] w-[280px] md:w-[32.8%] h-[210px] md:h-[500px] transition-all duration-500 ease-in-out z-10 opacity-75"
						)}
						style={{
							transform: 'translateX(0) translateZ(-150px) rotateY(30deg)',
							transformStyle: 'preserve-3d',
						}}
					>
						<div className="relative w-full h-full rounded-lg overflow-hidden">
							<Image
								src={images[getImageIndex(-1)].imageUrl}
								alt={images[getImageIndex(-1)].title || "Carousel image"}
								fill
								className="object-cover"
								sizes="(max-width: 768px) 280px, 33vw"
							/>
							{/* Reflection */}
							<div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
						</div>
					</div>
				)}

				{/* Center Image (Main) */}
				<div className="relative w-[360px] md:w-[39.1%] h-[340px] md:h-[600px] transition-all duration-500 ease-in-out z-20 mx-auto">
					<div className="relative w-full h-full rounded-lg overflow-hidden">
						<Image
							src={images[currentIndex].imageUrl}
							alt={images[currentIndex].title || "Carousel image"}
							fill
							className="object-cover"
							sizes="(max-width: 768px) 360px, 40vw"
						/>
						{/* Reflection */}
						<div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
					</div>

					{/* Navigation Buttons */}
					{images.length > 1 && (
						<>
							<Button
								variant="ghost"
								size="icon"
								onClick={goToPrevious}
								className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black rounded-full w-8 h-8 md:w-10 md:h-10 z-30 shadow-lg"
								aria-label="Previous image"
							>
								<ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={goToNext}
								className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black rounded-full w-8 h-8 md:w-10 md:h-10 z-30 shadow-lg"
								aria-label="Next image"
							>
								<ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
							</Button>
						</>
					)}
				</div>

				{/* Right Image */}
				{images.length > 1 && (
					<div
						className={cn(
							"hidden md:block absolute right-0 md:-right-[15px] w-[280px] md:w-[32.8%] h-[210px] md:h-[500px] transition-all duration-500 ease-in-out z-10 opacity-75"
						)}
						style={{
							transform: 'translateX(0) translateZ(-150px) rotateY(-30deg)',
							transformStyle: 'preserve-3d',
						}}
					>
						<div className="relative w-full h-full rounded-lg overflow-hidden">
							<Image
								src={images[getImageIndex(1)].imageUrl}
								alt={images[getImageIndex(1)].title || "Carousel image"}
								fill
								className="object-cover"
								sizes="(max-width: 768px) 280px, 33vw"
							/>
							{/* Reflection */}
							<div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
						</div>
					</div>
				)}
			</div>

			{/* Dots Indicator */}
			{images.length > 1 && (
				<div className="flex justify-center gap-2 mt-4 md:mt-6">
					{images.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentIndex(index)}
							className={cn(
								"w-2 h-2 rounded-full transition-all duration-300",
								index === currentIndex
									? "bg-primary w-8"
									: "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
							)}
							aria-label={`Go to image ${index + 1}`}
						/>
					))}
				</div>
			)}
		</div>
	);
}

