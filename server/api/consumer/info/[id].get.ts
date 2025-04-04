export default defineEventHandler(async event => {
  try {
    const id = getRouterParam(event, 'id')
    const response = await $axiosProxy(event).get(`/hydra-consumer/admin/consumer/${id}`)
    return response
  } catch (error) {
    return errorResponseHandler(error, event)
  }
})
