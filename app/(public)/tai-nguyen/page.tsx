import { ResourceNavigation } from "@/components/public/resources/resource-navigation";
import { ResourceContent } from "@/components/public/resources/resource-content";
import { Metadata } from "next";
import siteMetadata from "@/config/siteMetadata";

export const metadata: Metadata = {
	title: `Tài nguyên | ${siteMetadata.logoTitle}`,
	description: "Tài nguyên hữu ích: Phần mềm, Công cụ, Ebook, Website và Downloads",
};

export default function ResourcesPage() {
	return (
		<>
			<div className="mt-10 mb-6">
				<h1 className="container mx-auto max-w-6xl px-4 sm:px-7 text-center text-2xl md:text-3xl font-bold m-0">
					Công cụ - Tài nguyên
				</h1>
			</div>
			<div className="container mx-auto max-w-6xl px-4 sm:px-7 pb-10">
				<p className="text-center text-base md:text-lg mb-6 md:mb-10 text-muted-foreground px-4">
					Tổng hợp những phần mềm, tài liệu và nguồn học tập hữu ích
				</p>

				{/* Main Content */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				{/* Sidebar Navigation - Desktop */}
				<div className="hidden lg:block lg:col-span-3">
					<ResourceNavigation />
				</div>
				
				{/* Main Content */}
				<div className="lg:col-span-9 w-full min-w-0">
					{/* Mobile Navigation - Hiển thị trên mobile, trước content */}
					<div className="lg:hidden mb-6 -mx-4 sm:-mx-7 px-4 sm:px-7">
						<ResourceNavigation />
					</div>
					<ResourceContent />
				</div>
			</div>
		</div>
		</>
	);
}

