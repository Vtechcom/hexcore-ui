export default defineEventHandler(async event => {
  try {
    const body = await readBody(event)
    const rs = await $axiosProxy(event).post('/hydra-heads/clear-head-data', body)
    return rs
  } catch (error) {
    errorResponseHandler(error, event)
  }
})
