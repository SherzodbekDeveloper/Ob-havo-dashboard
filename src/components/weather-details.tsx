"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Sunrise, Sunset, Compass, Gauge } from "lucide-react"
import { format } from "date-fns"
import type { WeatherData } from "../api/types"

interface WeatherDetailsProps {
  data: WeatherData
}

export function WeatherDetails({ data }: WeatherDetailsProps) {
  const { wind, main, sys } = data

  const formatTime = (timestamp: number) => format(new Date(timestamp * 1000), "h:mm a")

  const getWindDirection = (degree: number) => {
    const directions = ["S", "SSG", "SG", "GSG", "G", "GQ", "Q", "QS"]
    const index = Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 45) % 8
    return directions[index]
  }

  const details = [
    {
      title: "Quyosh chiqishi",
      value: formatTime(sys.sunrise),
      icon: Sunrise,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/10",
    },
    {
      title: "Quyosh botishi",
      value: formatTime(sys.sunset),
      icon: Sunset,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/10",
    },
    {
      title: "Shamol yo‘nalishi",
      value: `${getWindDirection(wind.deg)} (${wind.deg}°)`,
      icon: Compass,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/10",
    },
    {
      title: "Havo bosimi",
      value: `${main.pressure} hPa`,
      icon: Gauge,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/10",
    },
  ]

  return (
    <Card className="card-hover border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-foreground">Ovo-havo detallari</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {details.map((detail) => (
            <div
              key={detail.title}
              className={`flex items-center gap-3 rounded-lg border border-border/30 p-4 transition-smooth ${detail.bgColor}`}
            >
              <detail.icon className={`h-5 w-5 shrink-0 ${detail.color}`} />
              <div className="space-y-0.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{detail.title}</p>
                <p className="font-semibold text-foreground">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
