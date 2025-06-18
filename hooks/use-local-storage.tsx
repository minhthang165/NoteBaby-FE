"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State để track việc đã mount chưa
  const [isMounted, setIsMounted] = useState(false)

  // State để lưu giá trị
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Effect để load dữ liệu từ localStorage sau khi component mount
  useEffect(() => {
    setIsMounted(true)

    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.log(error)
    }
  }, [key])

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Trả về initialValue cho đến khi component mount và load được dữ liệu từ localStorage
  return [isMounted ? storedValue : initialValue, setValue, isMounted] as const
}
