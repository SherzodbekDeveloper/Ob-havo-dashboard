"use client"

import { useParams, useSearchParams } from "react-router-dom"
import { useForecastQuery, useWeatherQuery } from "../hooks/use-weather"
import { Alert, AlertDescription } from "../components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { WeatherSkeleton } from "../components/loading-skeleton"
import { CurrentWeather } from "../components/current-weather"
import HourlyTemperature from "../components/hourly-temperature"
import { WeatherDetails } from "../components/weather-details"
import WeatherForecast from "../components/weather-forecast"
import { FavoriteButton } from "../components/favorite-button"

// Ўзак шахарнинг обо-хаво деталлярини кўрсатиш
export default function CityPage() {
  const [searchParams] = useSearchParams()
  const params = useParams()
  const lat = Number.parseFloat(searchParams.get("lat") || "0")
  const lon = Number.parseFloat(searchParams.get("lon") || "0")

  const coordinates = { lat, lon }

  // API сўровлари: шахар обо-хаво маълумотлари ва прогноз
  const weatherQuery = useWeatherQuery(coordinates)
  const forecastQuery = useForecastQuery(coordinates)

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <>
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Alert variant="destructive" className="border-destructive/50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>Обо-хаво маълумотларини юклаб бўлмади. Қайта уриниб кўринг.</AlertDescription>
            </Alert>
          </div>
        </main>
      </>
    )
  }

  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return (
      <>
      
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <WeatherSkeleton />
          </div>
        </main>
      </>
    )
  }

  return (
    <>

      <main className="min-h-screen bg-background pb-12">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Сарлавҳа: шахарнинг номи ва давлати */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                {params.cityName}
                <span className="text-2xl text-muted-foreground">, {weatherQuery.data.sys.country}</span>
              </h1>
            </div>
            <div className="flex gap-2">
              <FavoriteButton data={{ ...weatherQuery.data, name: params.cityName }} />
            </div>
          </div>

          {/* Асосий обо-хаво маълумотлари */}
          <div className="space-y-6">
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="flex-1">
                <CurrentWeather data={weatherQuery.data} />
              </div>
              <div className="flex-1">
                <HourlyTemperature data={forecastQuery.data} />
              </div>
            </div>

            {/* Деталлий маълумотлар ва 5 кунлик прогноз */}
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
    </>
  )
}
