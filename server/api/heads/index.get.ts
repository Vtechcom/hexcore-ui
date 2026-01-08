import type { HydraHeadResponse } from '~/interfaces/api/hydra-nodes/hydra-heads.type'
import { errorResponseHandler } from '~/server/utils/errorHandler'

export default defineEventHandler(async event => {
  try {
    // const Authorization = getRequestAuthorization(event)
    const query = getQuery(event)
    const rs = await $axiosProxy(event).get<any, HydraHeadResponse>('/hydra-heads/list', { params: query })
    return rs
  } catch (error: any) {
    errorResponseHandler(error, event)
  }
})
