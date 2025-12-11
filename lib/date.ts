export function getDateVn(date: Date, shorter?: boolean) {
	if(shorter){
		return `${date.toLocaleDateString("vi-VN", {
			year: "numeric",
			month: "short",
			day: "2-digit",
		})}`
	}
	const day = date.toLocaleDateString("vi-VN", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});
	return `${day}`;
}

export function filterDateRange(input: {
	data: any[] | null,
	from: string | Date,
	to: string | Date,
}){
	const startDate = new Date(input.from);
	const endDate = new Date(input.to);

	return input.data?.filter(function (a) {
		const date = new Date(a.createdAt);

		return (date >= startDate && date <= endDate);
	});
}

interface DateRange {
	from: Date
	to: Date
}
interface Preset {
	name: string
	label: string
}

const PRESETS = [
	'today',
	'yesterday',
	'last7',
	'last14',
	'last30',
	'thisWeek',
	'lastWeek',
	'thisMonth',
	'lastMonth',
	'lastMonthTilNow'
] as const
type PRESETS_NAME = typeof PRESETS[number]

export const getPresetRange = (presetName: PRESETS_NAME): DateRange => {
	const preset = PRESETS.find((name) => name === presetName)
	if (!preset) throw new Error(`Unknown date range preset: ${presetName}`)
	const from = new Date()
	const to = new Date()
	// const first = from.getDate() - from.getDay()
	const first = from.getDate() - ((from.getDay() + 6) % 7); // start in Monday

	switch (preset) {
		case 'today':
			from.setHours(0, 0, 0, 0)
			to.setHours(23, 59, 59, 999)
			break
		case 'yesterday':
			from.setDate(from.getDate() - 1)
			from.setHours(0, 0, 0, 0)
			to.setDate(to.getDate() - 1)
			to.setHours(23, 59, 59, 999)
			break
		case 'last7':
			from.setDate(from.getDate() - 6)
			from.setHours(0, 0, 0, 0)
			to.setHours(23, 59, 59, 999)
			break
		case 'last14':
			from.setDate(from.getDate() - 13)
			from.setHours(0, 0, 0, 0)
			to.setHours(23, 59, 59, 999)
			break
		case 'last30':
			from.setDate(from.getDate() - 29)
			from.setHours(0, 0, 0, 0)
			to.setHours(23, 59, 59, 999)
			break
		case 'thisWeek':
			from.setDate(first)
			from.setHours(0, 0, 0, 0)
			to.setHours(23, 59, 59, 999)
			break
		case 'lastWeek':
			// from.setDate(from.getDate() - 7 - from.getDay())
			// to.setDate(to.getDate() - to.getDay() - 1)
			from.setDate(from.getDate() - 6 - from.getDay())
			to.setDate(to.getDate() - to.getDay())
			from.setHours(0, 0, 0, 0)
			to.setHours(23, 59, 59, 999)
			break
		case 'thisMonth':
			from.setDate(1)
			from.setHours(0, 0, 0, 0)
			to.setHours(23, 59, 59, 999)
			break
		case 'lastMonth':
			from.setMonth(from.getMonth() - 1)
			from.setDate(1)
			from.setHours(0, 0, 0, 0)
			to.setDate(0)
			to.setHours(23, 59, 59, 999)
			break
		case 'lastMonthTilNow':
			from.setMonth(from.getMonth() - 1)
			from.setDate(1)
			from.setHours(0, 0, 0, 0)
			to.setHours(23, 59, 59, 999)
			break
		default:
			from.setHours(0, 0, 0, 0)
			to.setHours(23, 59, 59, 999)
			break
	}

	return { from, to }
}
