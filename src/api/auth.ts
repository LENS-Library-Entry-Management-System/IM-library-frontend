import client from "./client"

export interface LoginResponse {
  accessToken?: string
  refreshToken?: string
  admin?: Record<string, unknown>
  [key: string]: unknown
}

type ApiEnvelope<T = unknown> = {
  success?: boolean
  message?: string
  data?: T
  [key: string]: unknown
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  try {
    console.log('Calling POST /auth/login with body:', { username, password: '[REDACTED]' })
    const { data } = await client.post("/auth/login", { username, password })
    // Backend returns { success, message, data: { admin, accessToken, refreshToken } }
    // Normalize to return the inner `data` object when present so callers get tokens directly.
    if (data && typeof data === 'object' && 'data' in data) {
      const envelope = data as ApiEnvelope<LoginResponse>
      if (envelope.data && typeof envelope.data === 'object') return envelope.data as LoginResponse
    }
    return data as LoginResponse
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "response" in err) {
      const e = err as Record<string, unknown>
      const response = e["response"] as Record<string, unknown> | undefined
      const respData = response?.["data"] as Record<string, unknown> | undefined
      const msg = (respData && (respData["message"] || respData["error"])) as string | undefined
      throw new Error(msg || "Login failed")
    }
    const message = (err as Error).message
    throw new Error(message || "Network error")
  }
}

export default { login }
