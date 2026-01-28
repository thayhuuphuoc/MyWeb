'use client'

import {parseProductImages, TProductWithRelation} from "@/actions/products/validations";
import React, {Fragment} from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "@/components/public/products/product-slick-images.css"
import Image from "next/image";

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import {CaretLeftIcon, CaretRightIcon} from "@radix-ui/react-icons";


const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
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
const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
	<button
		{...props}
		className={
			"slick-next slick-arrow" +
			(currentSlide === slideCount - 1 ? " slick-disabled" : "")
		}
		aria-hidden="true"
		aria-disabled={currentSlide === slideCount - 1}
		type="button"
	>
		<CaretRightIcon className={'size-6'}/>
	</button>
);

export default function ProductSlickImages({data}: {
	data: TProductWithRelation
}){
	return (
		<div className={'w-full sm:w-96 bg-white p-5 pb-4 rounded-md'}>
			<Slider
				adaptiveHeight={true}
				dots={true}
				dotsClass={'slick-dots vweb-scrollbar'}
				customPaging={(index) => (
					<Image src={parseProductImages(data.images)[index].url} alt={`${data.slug}_image_paging_${index}`} width={54} height={54} className={'aspect-square object-contain'}/>
				)}
				infinite={true}
				speed={250}
				slidesToShow={1}
				slidesToScroll={1}
				touchMove={false}
				// @ts-ignore
				prevArrow={<SlickArrowLeft />}
				// @ts-ignore
				nextArrow={<SlickArrowRight />}
				afterChange={(currentSlide) => {
					const dots_nav: HTMLUListElement | null = document.querySelector('.slick-dots')
					if(!dots_nav) return

					const curSlidePosition = currentSlide * 60
					const inView = curSlidePosition > dots_nav.scrollLeft && curSlidePosition < (dots_nav.scrollLeft + dots_nav.offsetWidth)
					if(inView) return

					dots_nav.scrollLeft = curSlidePosition
				}}
			>
				{parseProductImages(data.images).map((image, index)=> (
					<Fragment key={image.index}>
						<Zoom zoomMargin={40}>
							<picture className={'rounded-md block mb-0 w-full overflow-hidden aspect-square relative border border-gray-200'}>
								<Image
									src={image.url}
									alt={`${data.slug}_image_${index}`}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 66vw"
									className={'object-center object-contain'}
								/>
							</picture>
						</Zoom>
					</Fragment>
				))}
			</Slider>
		</div>
	);
}
