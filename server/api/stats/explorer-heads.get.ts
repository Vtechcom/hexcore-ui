import { $axios } from '~/server/utils/axios'

export default defineEventHandler(async event => {
  try {
    // const Authorization = getRequestAuthorization(event)
    const rs = await $axios.get('http://explorer.hydra.family/heads')
    return rs
  } catch (error: any) {
    return errorResponseHandler(error, event)
  }
})
