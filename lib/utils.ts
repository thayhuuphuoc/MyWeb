import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format category name to title case
 * @param str - Category name string
 * @returns Formatted category name
 */
export function formatCategoryName(str: string | null | undefined): string {
	if (!str) return "";
	return str
		.toLowerCase()
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}