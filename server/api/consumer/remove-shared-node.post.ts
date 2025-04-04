export default defineEventHandler(async event => {
  try {
    const body = await readBody(event)
    const rs = await $axiosProxy(event).post('/hydra-consumer/admin/remove-shared-node', body)
    return rs
  } catch (error) {
    return errorResponseHandler(error, event)
  }
})
