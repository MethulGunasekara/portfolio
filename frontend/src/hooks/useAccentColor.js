// src/hooks/useAccentColor.js
import { useEffect } from 'react'
import api from '../api/axios'

export function useAccentColor() {
  useEffect(() => {
    const fetchAccent = async () => {
      try {
        const res = await api.get('/profile')
        if (res.data?.accentColor) {
          document.documentElement.style.setProperty('--accent', res.data.accentColor)
          // Derive dim/glow from the accent
          const hex = res.data.accentColor
          document.documentElement.style.setProperty('--accent-dim', hex + '1F')
          document.documentElement.style.setProperty('--accent-glow', hex + '3F')
        }
      } catch (e) {
        // keep default
      }
    }
    fetchAccent()
  }, [])
}