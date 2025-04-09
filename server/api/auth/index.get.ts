export default defineEventHandler(async event => {
  try {
    const rs = await $axiosProxy(event).get('/hydra-main/auth')
    return rs
  } catch (error: any) {
    return errorResponseHandler(error, event)
  }
})
