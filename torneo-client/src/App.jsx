import { Suspense } from 'react'
import { AuthProvider } from './context/Auth.jsx'
import { SeasonProvider } from './context/Season.jsx'
import { AppRouter } from './router/AppRouter'
import { Loader } from './components/Loader.jsx'

function App () {
  return (
    <>
      <AuthProvider>
        <SeasonProvider>
          <Suspense fallback={<Loader />}>
            <AppRouter />
          </Suspense>
          <footer className='footer'>

            Desarrollado por Softy © - +54 381-301-9083
          </footer>
        </SeasonProvider>
      </AuthProvider>
    </>
  )
}

export default App
