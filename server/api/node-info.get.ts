import { $axios } from '~/server/utils/axios'

export default defineEventHandler(async event => {
  try {
    // const Authorization = getRequestAuthorization(event)
    const rs = await $axios.get('/hydra-main/node-info')
    console.log('>>> / rs:', rs)

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
