import axios from 'axios'

/** Extracts a Nest error response's `message` (string or class-validator string[]), falling back otherwise. */
export function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const message = (err.response?.data as { message?: string | string[] } | undefined)?.message
    if (typeof message === 'string') return message
    if (Array.isArray(message) && message.length > 0) return message[0]
  }
  return fallback
}
