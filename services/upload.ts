import { http } from './http'

interface Res<T = unknown> {
  resource: T
  code: number
}

export function upload(data: FormData) {
  return http.post<Res>('/upload', data)
}
