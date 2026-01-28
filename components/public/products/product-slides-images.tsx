'use client'

import {parseProductImages, TProductWithRelation} from "@/actions/products/validations";
import React, {Fragment, useRef, useState} from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "@/components/public/products/product-slick-images.css"

import Image from "next/image";

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import {CaretLeftIcon, CaretRightIcon} from "@radix-ui/react-icons";
import {cn} from "@/lib/utils";

import LightGallery from 'lightgallery/react';
import { LightGallery as ILightGallery } from 'lightgallery/lightgallery';

// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';


const SlickArrowLeft = ({ currentSlide, slidesToScroll, slideCount, ...props }) => (
	<button
		{...props}
		className={
			"slick-prev slick-arrow" +
			(currentSlide === 0 ? " slick-disabled" : "")
		}
		aria-hidden="true"
		aria-disabled={currentSlide === 0}
		type="button"
	>
		<CaretLeftIcon className={'size-6'}/>
	</button>
);
const SlickArrowRight = ({ currentSlide, slidesToScroll, slideCount, ...props }) => (
	<button
		{...props}
		className={
			"slick-next slick-arrow" +
			(currentSlide >= slideCount - slidesToScroll ? " slick-disabled" : "")
		}
		aria-hidden="true"
		aria-disabled={currentSlide >= slideCount - slidesToScroll}
		type="button"
	>
		<CaretRightIcon className={'size-6'}/>
	</button>
);

export default function ProductSlideImages({data}: {
	data: TProductWithRelation
}){
	const [curSlide, setCurSlide] = useState(0)
	const [curImageIndex, setCurImageIndex] = useState(0)
	const lightGallery = useRef<any>(null);

	return (
		<div className={''}>
			<picture
				className={'cursor-zoom-in rounded-md block w-full overflow-hidden aspect-square relative border border-gray-200 dark:border-gray-700 mb-2 bg-white dark:bg-surfaceDark'}
				onClick={() => {
					lightGallery.current.openGallery(curImageIndex);
				}}
			>
				<img
					src={parseProductImages(data.images)[curImageIndex].url}
					alt={`showing image`}
					className={'w-full h-full object-center object-contain'}
				/>
			</picture>

			<LightGallery
				plugins={[lgZoom, lgThumbnail]}
				selector={'.slick__slide'}
				speed={500}
				onInit={(detail) => {
					lightGallery.current = detail.instance;
				}}
			>
				<Slider
					beforeChange={(currentSlide, nextSlide) => setCurSlide(nextSlide)}
					adaptiveHeight={true}
					infinite={false}
					speed={250}
					slidesToShow={5}
					slidesToScroll={5}
					centerMode={false}
					variableWidth={true}
					touchMove={false}
					prevArrow={<SlickArrowLeft currentSlide={curSlide} slidesToScroll={5} slideCount={data.images.length}/>}
					nextArrow={<SlickArrowRight currentSlide={curSlide} slidesToScroll={5} slideCount={data.images.length}/>}
					className={'-mx-1'}
				>
					{parseProductImages(data.images).map((image, index)=> (
						<div
							key={image.index}
							className={'px-1 relative cursor-pointer'}
							onMouseEnter={() => setCurImageIndex(index)}
						>
							<picture
								data-src={image.url}
								className={cn('slick__slide pointer-events-none rounded-md block mb-0 overflow-hidden w-16 aspect-square relative transition-colors bg-white dark:bg-surfaceDark', {
									'border border-gray-200 dark:border-gray-700': curImageIndex !== index,
									'border-2 border-indigo-500 dark:border-indigo-400': curImageIndex == index,
								})}
							>
								<Image
									src={image.url}
									alt={`Ảnh ${data.title} ${index + 1}`}
									width={67}
									height={67}
									className={'w-full h-full object-center object-contain'}
								/>
							</picture>
						</div>
					))}
				</Slider>
			</LightGallery>
		</div>
	);
}
