import { $axiosProxy } from '~/server/utils/axios'

export default defineEventHandler(async event => {
  try {
    const rs = await $axiosProxy(event).get('/hydra-main/list-account')
    return rs
  } catch (error: any) {
    return errorResponseHandler(error, event)
  }
})
