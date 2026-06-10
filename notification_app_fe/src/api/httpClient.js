import axios from 'axios'
import { runtimeConfig } from '../config/runtime.js'

export const httpClient = axios.create({
  baseURL: runtimeConfig.backendBaseUrl,
  timeout: 10000,
  headers: {
    Accept: 'application/json'
  }
})

httpClient.interceptors.request.use((config) => {
  if (runtimeConfig.backendApiToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${runtimeConfig.backendApiToken}`
    }
  }

  return config
})
