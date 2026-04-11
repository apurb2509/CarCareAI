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
        default: "rgba(224, 242, 254, 0.8)", // Light Mode: Sky Tinted Glass
        _dark: "rgba(15, 23, 42, 0.75)",      // Dark Mode: Navy Slate
      },
      "solid-bg": {
        default: "#F0F9FF",
        _dark: "#0F172A",
      },
      "slate-bg": {
        default: "#E0F2FE", // Sky 100
        _dark: "#0F172A",
      },
      "border-color": {
        default: "#BAE6FD", // Sky 200
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
        default: "#F0F9FF", // Sky 50
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