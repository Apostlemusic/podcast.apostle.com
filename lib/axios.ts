import axios from "axios"

const resolveBaseURL = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  if (typeof window === "undefined") return "http://localhost:10000"

  const { protocol, hostname, port, origin } = window.location
  const devPorts = new Set(["3000", "3001", "5173", "4173"])

  if (hostname === "localhost" || hostname.endsWith(".local") || devPorts.has(port)) {
    return `${protocol}//${hostname}:10000`
  }

  return origin
}

const api = axios.create({
  baseURL: resolveBaseURL(),
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("apostle_admin_access_token") ||
      localStorage.getItem("apostle_admin_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export default api
