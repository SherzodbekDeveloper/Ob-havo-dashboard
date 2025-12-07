"use client"

import { format } from "date-fns"
import type { ForecastData } from "../api/types"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react"

interface WeatherForecastProps {
  data: ForecastData
}

interface DailyForecast {
  date: number
  temp_min: number
  temp_max: number
  humidity: number
  wind: number
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }
}

function WeatherForecast({ data }: WeatherForecastProps) {
  const dailyForecasts = data.list.reduce(
    (acc, forecast) => {
      const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd")

      if (!acc[date]) {
        acc[date] = {
          temp_min: forecast.main.temp_min,
          temp_max: forecast.main.temp_max,
          humidity: forecast.main.humidity,
          wind: forecast.wind.speed,
          weather: forecast.weather[0],
          date: forecast.dt,
        }
      } else {
        acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min)
        acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max)
      }

      return acc
    },
    {} as Record<string, DailyForecast>,
  )

  const nextDays = Object.values(dailyForecasts).slice(1, 6)

  const formatTemp = (temp: number) => `${Math.round(temp)}°C`

  return (
    <Card className="card-hover border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-foreground">5 kunlik prognoz</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {nextDays.map((day) => (
            <div
              key={day.date}
              className="grid grid-cols-3 items-center gap-4 rounded-lg border border-border/30 bg-secondary p-4 transition-smooth hover:bg-secondary/80 hover:shadow-sm md:gap-6"
            >
              <div className="space-y-1">
                <p className="font-bold text-foreground">{format(new Date(day.date * 1000), "EEE")}</p>
                <p className="text-xs capitalize text-muted-foreground">{format(new Date(day.date * 1000), "MMM d")}</p>
                <p className="text-xs capitalize text-muted-foreground">{day.weather.description}</p>
              </div>

              <div className="flex justify-center gap-4">
                <span className="flex items-center gap-1 font-semibold text-blue-500">
                  <ArrowDown className="h-4 w-4" />
                  {formatTemp(day.temp_min)}
                </span>
                <span className="flex items-center gap-1 font-semibold text-red-500">
                  <ArrowUp className="h-4 w-4" />
                  {formatTemp(day.temp_max)}
                </span>
              </div>

              <div className="flex justify-end gap-3 text-xs sm:gap-4">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  {day.humidity}%
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Wind className="h-4 w-4 text-blue-500" />
                  {day.wind.toFixed(1)} m/s
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default WeatherForecast
