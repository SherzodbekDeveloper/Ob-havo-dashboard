"use client"

import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from "../hooks/use-weather"
import { CurrentWeather } from "../components/current-weather"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { Button } from "../components/ui/button"
import { MapPin, AlertTriangle, RefreshCw } from "lucide-react"
import { useGeolocation } from "../hooks/use-geolocation"
import { WeatherDetails } from "../components/weather-details"
import { FavoriteCities } from "../components/favorite-cities"
import { WeatherSkeleton } from "../components/loading-skeleton"
import WeatherForecast from "../components/weather-forecast"
import HourlyTemperature from "../components/hourly-temperature"

export default function WeatherDashboard() {
  const { coordinates, error: locationError, isLoading: locationLoading, getLocation } = useGeolocation()

  const weatherQuery = useWeatherQuery(coordinates)
  const forecastQuery = useForecastQuery(coordinates)
  const locationQuery = useReverseGeocodeQuery(coordinates)

  const handleRefresh = () => {
    getLocation()
    if (coordinates) {
      weatherQuery.refetch()
      forecastQuery.refetch()
      locationQuery.refetch()
    }
  }

  if (locationLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <WeatherSkeleton />
        </div>
      </main>
    )
  }

  if (locationError) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Alert variant="destructive" className="border-destructive/50">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Joy xatosi</AlertTitle>
            <AlertDescription className="mt-2 flex flex-col gap-4">
              <p>{locationError}</p>
              <Button variant="outline" onClick={getLocation} className="w-fit bg-transparent">
                <MapPin className="mr-2 h-4 w-4" />
                Joyni aniqlash
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </main>
    )
  }

  if (!coordinates) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Alert className="border-border/50 bg-card">
            <MapPin className="h-4 w-4" />
            <AlertTitle>Joy so‘rovi</AlertTitle>
            <AlertDescription className="mt-2 flex flex-col gap-4">
              <p>Joriy ob-havo ma’lumotlarini ko‘rish uchun joyni aniqlang.</p>
              <Button variant="outline" onClick={getLocation} className="w-fit bg-transparent">
                <MapPin className="mr-2 h-4 w-4" />
                Joyni aniqlash
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </main>
    )
  }

  const locationName = locationQuery.data?.[0]

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Alert variant="destructive" className="border-destructive/50">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Xato</AlertTitle>
            <AlertDescription className="mt-2 flex flex-col gap-4">
              <p>Ob-havo ma’lumotlarini yuklab bo‘lmadi. Qayta urinib ko‘ring.</p>
              <Button variant="outline" onClick={handleRefresh} className="w-fit bg-transparent">
                <RefreshCw className="mr-2 h-4 w-4" />
                Qayta yuklash
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </main>
    )
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <WeatherSkeleton />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background pb-12">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-8">
          <FavoriteCities />
        </section>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Joriy joy</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={weatherQuery.isFetching || forecastQuery.isFetching}
            className="transition-smooth hover:bg-secondary bg-transparent"
          >
            <RefreshCw className={`h-5 w-5 ${weatherQuery.isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-1">
              <CurrentWeather data={weatherQuery.data} locationName={locationName} />
            </div>
            <div className="flex-1">
              <HourlyTemperature data={forecastQuery.data} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <div className="md:col-span-2">
              <WeatherDetails data={weatherQuery.data} />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <WeatherForecast data={forecastQuery.data} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
