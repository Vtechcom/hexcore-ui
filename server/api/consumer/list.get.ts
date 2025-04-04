import { errorResponseHandler } from '~/server/utils/errorHandler'

export default defineEventHandler(async event => {
  try {
    const response = await $axiosProxy(event).get(`/hydra-consumer/admin/list-consumers`)
    return response
  } catch (error) {
    return errorResponseHandler(error, event)
  }
})
