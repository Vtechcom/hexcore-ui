import type { HydraPartyResponse } from '~/interfaces/api/hydra-nodes/parties.type'
import { $axios } from '~/server/utils/axios'
import { errorResponseHandler } from '~/server/utils/errorHandler'

export default defineEventHandler(async event => {
  try {
    // const Authorization = getRequestAuthorization(event)
    const query = getQuery(event)
    const rs = await $axios.get<any, HydraPartyResponse>('/hydra-main/list-party', { params: query })
    return rs
  } catch (error: any) {
    errorResponseHandler(error, event)
  }
})
