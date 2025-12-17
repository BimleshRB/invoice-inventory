"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"

export function useFormStorage<T extends Record<string, unknown>>(
  key: string,
  initialData: T,
): {
  formData: T
  setFormData: React.Dispatch<React.SetStateAction<T>>
  clearForm: () => void
  clearOnSuccess: () => void
} {
  const [formData, setFormData] = useState<T>(initialData)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`form_${key}`)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setFormData(parsed)
      } catch {
        // Invalid JSON, use initial data
      }
    }
    setIsLoaded(true)
  }, [key])

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(`form_${key}`, JSON.stringify(formData))
    }
  }, [formData, key, isLoaded])

  const clearForm = useCallback(() => {
    setFormData(initialData)
    localStorage.removeItem(`form_${key}`)
  }, [key, initialData])

  const clearOnSuccess = useCallback(() => {
    localStorage.removeItem(`form_${key}`)
    setFormData(initialData)
  }, [key, initialData])

  return { formData, setFormData, clearForm, clearOnSuccess }
}
