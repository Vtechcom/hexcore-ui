// Axios instance plugin
import axios from 'axios'

export class AxiosInstance {
  prefix = ''
  instance = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: false,
    timeout: 180000,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })

  constructor(prefix: string, endpointUrl?: string) {
    if (process.env.NODE_ENV !== 'production') {
      if (!endpointUrl) {
        console.log(
          `[Develop debugger] No custom endpoint url, using default endpoint:`,
          this.instance.defaults.baseURL
        )
      } else {
        console.log(`[Develop debugger] Initialized repository endpoint url:`, endpointUrl)
      }
    }
    this.prefix = prefix
    this.instance.defaults.baseURL = endpointUrl
    // this.instance.defaults.baseURL = 'http://172.20.10.3:8069'

    this.instance.defaults.headers.common['Content-Type'] = 'application/json'
    // this.instance.defaults.headers.common.Authorization = Cookies.get('accessToken') ? 'Bearer ' + Cookies.get('accessToken') : ''

    this.instance.interceptors.request.use(request => {
      return request
    })

    this.instance.interceptors.response.use(
      response => {
        return response.data
      },
      async error => {
        const errResponse = error.response
        // error response handler
        console.log('Error response:', errResponse)
        return Promise.reject(error.response)
      }
    )
  }
}

const hexcoreApiUrl = process.env.BASE_API_URL
// const hexcoreApiUrl = 'http://localhost:3002'
if (!hexcoreApiUrl) {
  console.error('BASE_API_URL is not defined')
}
export const $axios = new AxiosInstance('', process.env.BASE_API_URL).instance
