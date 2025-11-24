import Link from "next/link";
import Image from "next/image";
import * as React from "react";

export default function ProductTags(){
	return (
		<>
			<h2 className="container mx-auto px-5 text-center text-xl font-bold m-0 mt-10">
				Tag Sản Phẩm
			</h2>
			<hr className="gradient-line mx-auto"/>
			<div className={'container mx-auto max-w-[1400px] px-5 justify-center items-start gap-3 xl:gap-7 flex flex-wrap'}>
				<Link
					href={'san-pham/tags/banh'}
					className={'lg:px-4 lg:pr-6 lg:py-3 px-1.5 py-1 pr-3 bg-vweb_bg border border-indigo-200 border-opacity-50 rounded-full justify-start items-center gap-3 lg:gap-7 flex transition-all duration-150 hover:bg-opacity-60'}
				>
					<div className="w-16 h-16 rounded-full bg-blue-200 overflow-hidden">
						<Image src={'/features/banh.jpg'} alt={'banh'} width={80} height={80} className={'w-full h-full object-center object-cover'}/>
					</div>
					<div className="text-sm lg:text-md font-bold">bánh</div>
				</Link>
				<Link
					href={'san-pham/tags/keo'}
					className={'lg:px-4 lg:pr-6 lg:py-3 px-1.5 py-1 pr-3 bg-vweb_bg border border-indigo-200 border-opacity-50 rounded-full justify-start items-center gap-3 lg:gap-7 flex transition-all duration-150 hover:bg-opacity-60'}
				>
					<div className="w-16 h-16 rounded-full bg-blue-200 overflow-hidden">
						<Image src={'/features/keo.jpg'} alt={'keo'} width={80} height={80} className={'w-full h-full object-center object-cover'}/>
					</div>
					<div className="text-sm lg:text-md font-bold">kẹo</div>
				</Link>
				<Link
					href={'san-pham/tags/an-vat'}
					className={'lg:px-4 lg:pr-6 lg:py-3 px-1.5 py-1 pr-3 bg-vweb_bg border border-indigo-200 border-opacity-50 rounded-full justify-start items-center gap-3 lg:gap-7 flex transition-all duration-150 hover:bg-opacity-60'}
				>
					<div className="w-16 h-16 rounded-full bg-blue-200 overflow-hidden">
						<Image src={'/features/an-vat.jpg'} alt={'keo'} width={80} height={80} className={'w-full h-full object-center object-cover'}/>
					</div>
					<div className="text-sm lg:text-md font-bold">ăn vặt</div>
				</Link>
				<Link
					href={'san-pham/tags/banh-trung-thu'}
					className={'lg:px-4 lg:pr-6 lg:py-3 px-1.5 py-1 pr-3 bg-vweb_bg border border-indigo-200 border-opacity-50 rounded-full justify-start items-center gap-3 lg:gap-7 flex transition-all duration-150 hover:bg-opacity-60'}
				>
					<div className="w-16 h-16 rounded-full bg-blue-200 overflow-hidden">
						<Image src={'/features/banh-trung-thu.jpg'} alt={'banh-trung-thu'} width={80} height={80} className={'w-full h-full object-center object-cover'}/>
					</div>
					<div className="text-sm lg:text-md font-bold">bánh trung thu</div>
				</Link>
				<Link
					href={'san-pham/tags/hot-trend'}
					className={'lg:px-4 lg:pr-6 lg:py-3 px-1.5 py-1 pr-3 bg-vweb_bg border border-indigo-200 border-opacity-50 rounded-full justify-start items-center gap-3 lg:gap-7 flex transition-all duration-150 hover:bg-opacity-60'}
				>
					<div className="w-16 h-16 rounded-full bg-blue-200 overflow-hidden">
						<Image src={'/features/hot-trend.jpg'} alt={'hot-trend'} width={80} height={80} className={'w-full h-full object-center object-cover'}/>
					</div>
					<div className="text-sm lg:text-md font-bold">hot trend</div>
				</Link>
			</div>
		</>
	)
}
