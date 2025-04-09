import { $axiosProxy } from '~/server/utils/axios'

export default defineEventHandler(async event => {
  try {
    const token = getRequestHeader(event, 'Authorization')
    console.log(token)
    const rs = await $axiosProxy(event).get('/hydra-main/list-account')
    console.log('>>> / rs:', rs)
    return rs
  } catch (error: any) {
    return errorResponseHandler(error, event)
  }
})
