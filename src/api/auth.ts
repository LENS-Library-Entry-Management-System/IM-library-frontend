import client from "./client"

export interface LoginResponse {
  accessToken?: string
  refreshToken?: string
  admin?: Record<string, unknown>
  [key: string]: unknown
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  try {
    const { data } = await client.post("/auth/login", { username, password })
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
