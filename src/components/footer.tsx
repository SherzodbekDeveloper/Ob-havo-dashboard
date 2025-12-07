"use client"

const Footer = () => {
  return (
    <footer className="w-full border-t border-border/50 bg-primary text-primary-foreground shadow-sm backdrop-blur supports-backdrop-filter:bg-primary/95">
      <div className="mx-auto max-w-7xl flex items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
        <p className="text-sm opacity-80 text-center">
          © {new Date().getFullYear()} Ob-havo. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </footer>
  )
}

export default Footer
