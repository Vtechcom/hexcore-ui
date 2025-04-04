import { ofetch } from 'ofetch'

export default defineNuxtPlugin(_nuxtApp => {
  // @ts-ignore
  globalThis.$fetch = ofetch.create({
    baseURL: useRuntimeConfig().public.baseUrl as string,
    onRequest({ request, options }) {
      options.headers = options.headers || {}
      const token = useLocalStorage('token', '')
      console.log('>>> / token:', token.value)
      if (token.value && token.value !== 'undefined') {
        options.headers.append('Authorization', `Bearer ${token.value}`)
      }
      //   options.headers['Agent-Ip'] = useApp().getIpAddress || ''
      options.headers.append('Agent-Code', 'hydra-client')
    },
    onRequestError({ error }) {
      console.log('[ofetch][Request Error]: ', new Date().toLocaleString('vi-VN'), error?.message || error)
    },
    onResponse({ response, options }) {
      const { status, _data } = response
      const { data, message, code } = _data
    },

    onResponseError({ response, options, request }) {
      // handle request response error
      // @ts-expect-error
      if (options.ignoreNotify) return
      const { status, _data } = response
      const { data, message, code } = _data
    }
  })
})
