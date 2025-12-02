import { Skeleton } from "./ui/skeleton"

export function WeatherSkeleton() {
	return (
		<div className="space-y-6">
			<Skeleton className="grid gap-6" />
			<Skeleton className='h-[300px] w-full rounded-lg' />
			<Skeleton className='h-[300px] w-full rounded-lg' />
			<div className="grid gap-6 mid:grid-cols-2">
				<Skeleton className="h-4 w-[250px]" />
				<Skeleton className="h-4 w-[200px]" />
			</div>
		</div>
	)
}
