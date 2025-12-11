'use client'

import { Facebook, Twitter, Instagram, Copy, Check } from "lucide-react"

// Pinterest icon component
const PinterestIcon = ({ className }: { className?: string }) => (
	<svg
		className={className}
		viewBox="0 0 24 24"
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49-.09-.79-.17-2.01.03-2.87.19-.82 1.22-5.7 1.22-5.7s-.31-.62-.31-1.53c0-1.43.83-2.5 1.86-2.5.88 0 1.3.66 1.3 1.45 0 .88-.56 2.19-.85 3.41-.24 1.02.51 1.85 1.52 1.85 1.82 0 3.22-1.92 3.22-4.7 0-2.46-1.78-4.18-4.32-4.18-2.94 0-4.67 2.21-4.67 4.49 0 .88.34 1.82.76 2.38.08.1.09.19.07.29-.07.3-.24.94-.27 1.07-.04.18-.14.22-.33.13-1.24-.58-2.02-2.4-2.02-3.86 0-3.15 2.29-6.05 6.59-6.05 3.46 0 6.15 2.46 6.15 5.75 0 3.43-2.16 6.18-5.16 6.18-1.01 0-1.96-.53-2.28-1.23l-.62 2.38c-.23.89-.85 2.01-1.27 2.69.96.3 1.98.46 3.05.46 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
	</svg>
)
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProductShareButtonsProps {
	title: string
	slug: string
	description?: string
	image?: string
}

export default function ProductShareButtons({ title, slug, description, image }: ProductShareButtonsProps) {
	const [copied, setCopied] = useState(false)
	const [currentUrl, setCurrentUrl] = useState("")

	useEffect(() => {
		if (typeof window !== "undefined") {
			setCurrentUrl(window.location.href)
		}
	}, [])

	const shareUrl = currentUrl
	const shareText = title
	const shareDescription = description || title

	const handleShare = (platform: string) => {
		let url = ""

		switch (platform) {
			case "facebook":
				url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
				break
			case "twitter":
				url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
				break
			case "instagram":
				toast.info("Vui lòng copy link và chia sẻ trên Instagram")
				return
			case "pinterest":
				url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}${image ? `&media=${encodeURIComponent(image)}` : ""}`
				break
			default:
				return
		}

		if (url) {
			window.open(url, "_blank", "width=600,height=400,scrollbars=yes,resizable=yes")
		}
	}

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl)
			setCopied(true)
			toast.success("Đã copy link vào clipboard!")
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			toast.error("Không thể copy link")
		}
	}

	const shareButtons = [
		{
			name: "Facebook",
			icon: Facebook,
			color: "hover:bg-blue-600 hover:text-white",
			onClick: () => handleShare("facebook"),
		},
		{
			name: "Twitter / X",
			icon: Twitter,
			color: "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black",
			onClick: () => handleShare("twitter"),
		},
		{
			name: "Instagram",
			icon: Instagram,
			color: "hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 hover:text-white",
			onClick: () => handleShare("instagram"),
		},
		{
			name: "Pinterest",
			icon: PinterestIcon,
			color: "hover:bg-red-600 hover:text-white",
			onClick: () => handleShare("pinterest"),
		},
	]

	return (
		<div className="container mx-auto max-w-4xl px-5 mt-12 md:mt-16 lg:mt-20 mb-12 md:mb-16 lg:mb-20">
			{/* Divider */}
			<div className="border-t border-gray-300 dark:border-gray-700 mb-6 md:mb-8"></div>

			{/* Share Section */}
			<div className="bg-white/50 dark:bg-baseInk/50 rounded-lg p-6 md:p-8 border border-gray-200 dark:border-gray-800">
				<h3 className="text-lg md:text-xl font-semibold text-navyGray dark:text-white mb-6 text-center">
					Chia sẻ sản phẩm
				</h3>

				<div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
					{shareButtons.map((button) => {
						const Icon = button.icon
						return (
							<Button
								key={button.name}
								variant="outline"
								size="lg"
								onClick={button.onClick}
								className={cn(
									"flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg transition-all duration-200",
									"border-gray-300 dark:border-gray-700",
									"text-navyGray dark:text-white",
									"hover:scale-105 active:scale-95",
									button.color
								)}
								aria-label={`Chia sẻ lên ${button.name}`}
							>
								<Icon className="w-5 h-5" />
								<span className="text-sm md:text-base font-medium">{button.name}</span>
							</Button>
						)
					})}

					{/* Copy Link Button */}
					<Button
						variant="outline"
						size="lg"
						onClick={handleCopyLink}
						className={cn(
							"flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg transition-all duration-200",
							"border-gray-300 dark:border-gray-700",
							"text-navyGray dark:text-white",
							"hover:bg-indigo-600 hover:text-white hover:border-indigo-600",
							"hover:scale-105 active:scale-95"
						)}
						aria-label="Copy link sản phẩm"
					>
						{copied ? (
							<>
								<Check className="w-5 h-5" />
								<span className="text-sm md:text-base font-medium">Đã copy!</span>
							</>
						) : (
							<>
								<Copy className="w-5 h-5" />
								<span className="text-sm md:text-base font-medium">Copy link</span>
							</>
						)}
					</Button>
				</div>
			</div>

			{/* Divider */}
			<div className="border-t border-gray-300 dark:border-gray-700 mt-6 md:mt-8"></div>
		</div>
	)
}








