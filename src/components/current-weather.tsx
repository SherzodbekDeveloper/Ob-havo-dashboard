"use client"

import type { GeocodingResponse, WeatherData } from "../api/types"
import { Card, CardContent } from "./ui/card"
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react"

interface CurrentWeatherProps {
  data: WeatherData
  locationName?: GeocodingResponse
}

export function CurrentWeather({ data, locationName }: CurrentWeatherProps) {
  const {
    weather: [currentWeather],
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed },
  } = data

const formatTemp = (temp: number) => `${Math.round(temp)}°C`


  return (
    <Card className="card-hover overflow-hidden border-border/50 shadow-sm">
      <CardContent className="p-6 sm:p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  {locationName?.name || "Shahar"}
                </h2>
                {locationName?.state && <span className="text-sm text-muted-foreground">, {locationName.state}</span>}
              </div>
              <p className="text-sm text-muted-foreground">{locationName?.country}</p>
            </div>

            <div className="flex items-end gap-4">
              <p className="text-6xl font-bold tracking-tighter text-foreground">{formatTemp(temp)}</p>
              <div className="space-y-1 pb-1">
                <p className="text-sm font-medium text-muted-foreground">Tuyilishi {formatTemp(feels_like)}</p>
                <div className="flex gap-2 text-sm font-medium">
                  <span className="flex items-center gap-1 text-blue-500">
                    <ArrowDown className="h-3 w-3" />
                    {formatTemp(temp_min)}
                  </span>
                  <span className="flex items-center gap-1 text-red-500">
                    <ArrowUp className="h-3 w-3" />
                    {formatTemp(temp_max)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 ">
              <div className="flex items-start gap-3 rounded-lg bg-secondary p-4 transition-smooth">
                <Droplets className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Namlik</p>
                  <p className="text-lg font-bold text-foreground">{humidity}%</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-secondary p-4 transition-smooth">
                <Wind className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Shamol </p>
                  <p className="text-lg font-bold text-foreground">{speed}<span className='text-[10px]'>m/s</span> </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative flex w-full max-w-xs flex-col items-center justify-center space-y-4">
              <img
                src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
                alt={currentWeather.description}
                className="h-40 w-40 drop-shadow-lg transition-smooth"
              />
              <div className="text-center">
                <p className="text-lg font-semibold capitalize text-foreground">
                  {currentWeather.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
