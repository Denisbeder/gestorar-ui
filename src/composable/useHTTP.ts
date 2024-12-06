import axios, { type AxiosInstance } from 'axios'

let http: AxiosInstance

function createHTTP() {
  if (!http) {
    http = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
    })
  }

  return http
}

export async function useCSRF() {
  createHTTP()

  return http.get('sanctum/csrf-cookie')
}

export function useHTTP() {
  createHTTP()

  http.defaults.withCredentials = true
  http.defaults.withXSRFToken = true

  return http
}
