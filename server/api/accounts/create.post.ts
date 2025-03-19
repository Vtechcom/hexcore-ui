import { $axios } from '~/server/utils/axios'
import type { CreateAccountResponse } from '~/interfaces/api/accounts/create.type'

export default defineEventHandler(async event => {
  try {
    // const Authorization = getRequestAuthorization(event)
    const body = await readBody(event)
    const rs = await $axios.post<any, CreateAccountResponse>('/hydra-main/create-account', body)
    return rs
  } catch (error: any) {
    setResponseStatus(event, error.status || 400)
    return {
      message: error.message || error?.data.message || 'Bad request',
      status: error.status || error?.data.status || 'FAILED',
      statusCode: error.status,
      code: error?.data.code || null,
      data: error.data || null,
      proxyApi: error.request?.path
    }
  }
})
