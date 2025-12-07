"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { format } from "date-fns"
import type { ForecastData } from "../api/types"

interface HourlyTemperatureProps {
  data: ForecastData
}

interface ChartData {
  time: string
  temp: number
  feels_like: number
}

export default function HourlyTemperature({ data }: HourlyTemperatureProps) {
  const chartData: ChartData[] = data.list.slice(0, 8).map((item) => ({
    time: format(new Date(item.dt * 1000), "ha"),
    temp: Math.round(item.main.temp),
    feels_like: Math.round(item.main.feels_like),
  }))

  return (
    <Card className="card-hover border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-foreground">Bugungi harorat (grafik asosida)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}°C`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                        <div className="space-y-2">
                          <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-wider text-muted-foreground">Harorat</span>
                            <span className="font-bold text-foreground">{payload[0].value}°C</span>
                          </div>
                          <div className="flex flex-col border-t border-border pt-2">
                            <span className="text-xs uppercase tracking-wider text-muted-foreground">Tuyuladi</span>
                            <span className="font-bold text-foreground">{payload[1].value}°C</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={3} dot={false} />
              <Line
                type="monotone"
                dataKey="feels_like"
                stroke="#9ca3af"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
