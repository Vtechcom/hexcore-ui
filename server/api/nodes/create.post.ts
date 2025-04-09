export default defineEventHandler(async event => {
  try {
    const body = await readBody(event)
    const rs = await $axiosProxy(event).post('/hydra-main/create-node', body)
    return rs
  } catch (error) {
    errorResponseHandler(error, event)
  }
})
