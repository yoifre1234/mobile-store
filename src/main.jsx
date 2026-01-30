import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { BrowserRouter } from 'react-router-dom'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1 hora
      gcTime: 1000 * 60 * 60 * 24, // 24 horas
      refetchOnWindowFocus: false, 
      refetchOnReconnect: false,
    },
  },
})

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PersistQueryClientProvider 
      client={queryClient} 
      persistOptions={{ persister }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistQueryClientProvider>
  </React.StrictMode>,
)