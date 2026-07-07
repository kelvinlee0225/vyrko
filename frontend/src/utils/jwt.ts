export interface JwtPayload {
  sub: string
  username: string
  rol: string
  iat: number
  exp: number
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json) as JwtPayload
  } catch {
    return null
  }
}

export function isTokenExpired(payload: JwtPayload) {
  return payload.exp * 1000 < Date.now()
}
