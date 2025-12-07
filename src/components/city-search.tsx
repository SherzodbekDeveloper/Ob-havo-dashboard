"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { Search, Loader2, Clock, XCircle } from "lucide-react"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command"
import { useLocationSearch } from "../hooks/use-weather"
import { useSearchHistory } from "../hooks/use-search-history"
import { Button } from "./ui/button"

export default function CitySearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  const { data: locations, isLoading } = useLocationSearch(query)
  const { history, clearHistory, addToHistory } = useSearchHistory()

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split("|")

    addToHistory.mutate({
      query,
      name,
      lat: Number.parseFloat(lat),
      lon: Number.parseFloat(lon),
      country,
    })

    setOpen(false)
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`)
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative justify-start text-sm sm:text-muted-foreground transition-smooth hover:bg-secondary sm:pr-12 md:w-48 lg:w-64 bg-transparent"
        onClick={() => setOpen(true)}
      >
        <Search className="sm:mr-2 sm:h-4 sm:w-4 h-6 w-6 " />
        <span className="hidden sm:inline">Shaharlarni qidirish...</span>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Shahar nomini kiriting..." value={query} onValueChange={setQuery} />
          <CommandList>
            {query.length > 2 && !isLoading && <CommandEmpty>Shahar topilmadi.</CommandEmpty>}

            {history.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="So‘nggi qidiruvlar">
                  <div className="flex items-center justify-between px-2 py-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearHistory.mutate()}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Tozalash
                    </Button>
                  </div>
                  {history.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={`${item.lat}|${item.lon}|${item.name}|${item.country}`}
                      onSelect={handleSelect}
                      className="transition-smooth hover:bg-secondary"
                    >
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{item.name}</span>
                      {item.state && <span className="text-sm text-muted-foreground">, {item.state}</span>}
                      <span className="text-sm text-muted-foreground">, {item.country}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {format(item.searchedAt, "MMM d, h:mm a")}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            <CommandSeparator />
            {locations && locations.length > 0 && (
              <CommandGroup heading="Takliflar">
                {isLoading && (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin text-accent" />
                  </div>
                )}
                {locations?.map((location) => (
                  <CommandItem
                    key={`${location.lat}-${location.lon}`}
                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                    onSelect={handleSelect}
                    className="transition-smooth hover:bg-secondary"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    <span className="font-medium">{location.name}</span>
                    {location.state && <span className="text-sm text-muted-foreground">, {location.state}</span>}
                    <span className="text-sm text-muted-foreground">, {location.country}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
