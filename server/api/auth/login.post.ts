export default defineEventHandler(async event => {
  try {
    const body = await readBody(event)
    const rs = await $axiosProxy(event).post('/hydra-main/login', body)
    return rs
  } catch (error: any) {
    return errorResponseHandler(error, event)
  }
})
