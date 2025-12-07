"use client"

import CitySearch from "./city-search"
import { Link } from 'react-router-dom'
import AuthDrawer from './auth-drawer'

const Header = () => {

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-primary text-primary-foreground shadow-sm backdrop-blur supports-backdrop-filter:bg-primary/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-bold transition-smooth hover:opacity-80">
          <span className="bg-white bg-clip-text text-transparent">Ob-havo</span>
        </Link>

        <div className='flex items-center gap-2'>
        <div className="flex items-center gap-2 sm:gap-4">
          <CitySearch />
        </div>
          <AuthDrawer/>
        </div>
      </div>
    </header>
  )
}

export default Header
