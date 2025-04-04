import { $axiosProxy } from '~/server/utils/axios'
export default defineEventHandler(async event => {
  try {
    // const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const rs = await $axiosProxy(event).put(`/hydra-consumer/admin/update-consumer`, body)
    return rs
  } catch (error) {
    return errorResponseHandler(error, event)
  }
})
