/**
 * Google AdSense Configuration
 * 
 * Ad Slot IDs for different positions on the website.
 * You can override these values using environment variables.
 */

export const adsenseConfig = {
	// Blog Post Ad Slots
	blogPost: {
		// Ad after description (before featured image)
		afterDescription: process.env.NEXT_PUBLIC_ADSENSE_BLOG_POST_AFTER_DESC || '9341242472',
		// Ad after post content (after PostBody)
		afterContent: process.env.NEXT_PUBLIC_ADSENSE_BLOG_POST_AFTER_CONTENT || '9341242472',
		// Ad after share buttons (before comments)
		afterShareButtons: process.env.NEXT_PUBLIC_ADSENSE_BLOG_POST_AFTER_SHARE || '9341242472',
	},
	// Product Page Ad Slots (for future use)
	productPage: {
		afterDescription: process.env.NEXT_PUBLIC_ADSENSE_PRODUCT_AFTER_DESC || '',
		afterContent: process.env.NEXT_PUBLIC_ADSENSE_PRODUCT_AFTER_CONTENT || '',
		afterShareButtons: process.env.NEXT_PUBLIC_ADSENSE_PRODUCT_AFTER_SHARE || '',
	},
	// Homepage Ad Slots (for future use)
	homepage: {
		top: process.env.NEXT_PUBLIC_ADSENSE_HOMEPAGE_TOP || '',
		middle: process.env.NEXT_PUBLIC_ADSENSE_HOMEPAGE_MIDDLE || '',
		bottom: process.env.NEXT_PUBLIC_ADSENSE_HOMEPAGE_BOTTOM || '',
	},
} as const

/**
 * Helper function to check if an ad slot is configured
 */
export function isAdSlotConfigured(slotId: string | undefined): boolean {
	return Boolean(slotId && slotId.trim() !== '')
}








