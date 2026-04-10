import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom' // Required for Page Navigation
import { UserProvider } from './context/UserContext' // Required for Login State
import App from './App.jsx'
import './index.css'

// 1. Define global theme settings (Dual Theme Support)
const theme = extendTheme({
  config: {
    initialColorMode: 'dark', // Keep it dark by default
    useSystemColorMode: false,
  },
  semanticTokens: {
    colors: {
      "glass-bg": {
        default: "rgba(255, 255, 255, 0.85)", // Light Mode: Frosty White
        _dark: "rgba(15, 23, 42, 0.75)",      // Dark Mode: Navy Slate
      },
      "solid-bg": {
        default: "white",
        _dark: "#0F172A",
      },
      "slate-bg": {
        default: "#F8FAFC",
        _dark: "#0F172A",
      },
      "border-color": {
        default: "#E2E8F0",
        _dark: "#1E293B",
      },
      "text-primary": {
        default: "gray.900",
        _dark: "white",
      },
      "text-muted": {
        default: "gray.600",
        _dark: "gray.400",
      },
      "page-bg": {
        default: "#F1F5F9",
        _dark: "#0a0a0a",
      },
      "accent-cyan": {
        default: "cyan.600",
        _dark: "cyan.400",
      },
      "light-cyan": {
        default: "cyan.600",
        _dark: "cyan.300",
      },
      "pale-cyan": {
        default: "blue.500",
        _dark: "cyan.100",
      },
      "pale-gray": {
        default: "gray.600",
        _dark: "gray.300",
      }
    }
  },
  styles: {
    global: {
      body: {
        bg: 'page-bg',
        color: 'text-primary',
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <UserProvider>
          <App />
        </UserProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
)