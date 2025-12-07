import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/layout'
import WeatherDashboard from './pages/weather-dashboard'
import CityPage from './pages/city-page'
import {

  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Toaster } from './components/ui/sonner'


function App() {

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false
      }
    }
  })
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter> 
          <Layout>
            <Routes>
              <Route path='/' element={<WeatherDashboard />} />
              <Route path='/city/:cityName' element={<CityPage />} />
            </Routes>
            <Toaster position='top-center'/>
          </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
