import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export function formatDate(date: Date | string | null | undefined, formatStr: string = "PPP"): string {
  if (!date) return "N/A"
  
  const dateObj = typeof date === "string" ? new Date(date) : date
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return "N/A"
  }
  
  return format(dateObj, formatStr)
}

export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return "N/A"
  
  const dateObj = typeof date === "string" ? new Date(date) : date
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return "N/A"
  }
  
  if (isToday(dateObj)) {
    return "Today"
  }
  
  if (isYesterday(dateObj)) {
    return "Yesterday"
  }
  
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

export function formatPlaytime(hours: number): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60)
    return `${minutes}m`
  }
  
  if (hours < 24) {
    return `${Math.round(hours * 10) / 10}h`
  }
  
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  
  if (remainingHours === 0) {
    return `${days}d`
  }
  
  return `${days}d ${Math.round(remainingHours * 10) / 10}h`
}

// Rating utilities
export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function getRatingColor(rating: number): string {
  if (rating >= 8.5) return "text-green-600"
  if (rating >= 7.0) return "text-blue-600"
  if (rating >= 5.5) return "text-yellow-600"
  if (rating >= 4.0) return "text-orange-600"
  return "text-red-600"
}

export function getRatingLabel(rating: number): string {
  if (rating >= 9.5) return "Masterpiece"
  if (rating >= 8.5) return "Excellent"
  if (rating >= 7.5) return "Very Good"
  if (rating >= 6.5) return "Good"
  if (rating >= 5.5) return "Average"
  if (rating >= 4.5) return "Below Average"
  if (rating >= 3.5) return "Poor"
  if (rating >= 2.5) return "Very Poor"
  if (rating >= 1.5) return "Terrible"
  return "Abysmal"
}

// String utilities
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function capitalizeWords(text: string): string {
  return text
    .split(" ")
    .map(word => capitalizeFirst(word))
    .join(" ")
}

// Array utilities
export function uniqueArray<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

// Number utilities
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function roundToNearest(value: number, step: number): number {
  return Math.round(value / step) * step
}

// URL utilities
export function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

export function getDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return ""
  }
}

// File utilities
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2)
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/
  return usernameRegex.test(username)
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Local storage utilities
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue
  
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore errors
  }
}

// Session storage utilities
export function getSessionStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue
  
  try {
    const item = window.sessionStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setSessionStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore errors
  }
}

// Error handling utilities
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === "string") return error
  return "An unknown error occurred"
}

// Platform detection
export function isMobile(): boolean {
  if (typeof window === "undefined") return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export function isIOS(): boolean {
  if (typeof window === "undefined") return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

export function isAndroid(): boolean {
  if (typeof window === "undefined") return false
  return /Android/.test(navigator.userAgent)
}

// Color utilities
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export function getContrastColor(hexColor: string): "black" | "white" {
  const rgb = hexToRgb(hexColor)
  if (!rgb) return "black"
  
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  return brightness > 128 ? "black" : "white"
}
