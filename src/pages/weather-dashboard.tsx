import { AlertCircleIcon, AlertTriangle, MapPin, RefreshCcw } from 'lucide-react'
import { Button } from '../components/ui/button'
import { useGeolocation } from '../hooks/use-geolocation'
import { WeatherSkeleton } from '../components/loading-skeleton'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from '../hooks/use-weather'


const WeatherDashboard = () => {
	const { coordinates, error: locationError, getLocation, isLoading: locationLoading } = useGeolocation()

	const locationQuery = useReverseGeocodeQuery(coordinates)
	const weatherQuery = useForecastQuery(coordinates)
	const forecastQuery = useWeatherQuery(coordinates)

	console.log(weatherQuery.data)


	const handleRefresh = () => {
		getLocation()
		if (coordinates) {
			weatherQuery.refetch()
			forecastQuery.refetch()
			locationQuery.refetch()
		}
	}

	if (locationLoading) {
		return <WeatherSkeleton />
	}

	if (locationError) {
		return (
			<Alert variant="destructive">
				<AlertTriangle />
				<AlertTitle>Location Error.</AlertTitle>
				<AlertDescription>
					{locationError}
					<Button onClick={getLocation} variant={'outline'} className='w-fit'>
						<MapPin className='mr-2 h-4 w-4' />
						Enable location
					</Button>
				</AlertDescription>
			</Alert>
		)
	}

	if (!coordinates) {
		return (
			<Alert variant="destructive">
				<AlertTriangle />
				<AlertTitle>Location required.</AlertTitle>
				<AlertDescription>
					Please enable location to see our local weather.
					<Button onClick={getLocation} variant={'outline'} className='w-fit'>
						<MapPin className='mr-2 h-4 w-4' />
						Enable location
					</Button>
				</AlertDescription>
			</Alert>
		)
	}

	const locationName = locationQuery.data?.[0]

	if (weatherQuery.error || forecastQuery.error) {
		<Alert variant="destructive">
			<AlertTriangle />
			<AlertTitle>Error.</AlertTitle>
			<AlertDescription>
				{"Failed to fetch weather data"}
				<Button onClick={getLocation} variant={'outline'} className='w-fit'>
					<MapPin className='mr-2 h-4 w-4' />
					Enable location
				</Button>
			</AlertDescription>
		</Alert>
	}

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<h1>My location</h1>
				<Button size={"icon"} variant={"outline"}>
					<RefreshCcw />
				</Button>
			</div>
		</div>
	)
}

export default WeatherDashboard