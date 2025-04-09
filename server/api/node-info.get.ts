import { $axios } from '~/server/utils/axios'

export default defineEventHandler(async event => {
  try {
    // const Authorization = getRequestAuthorization(event)
    const rs = await $axios.get('/hydra-main/node-info')
    return rs
  } catch (error: any) {
    return errorResponseHandler(error, event)
  }
})
