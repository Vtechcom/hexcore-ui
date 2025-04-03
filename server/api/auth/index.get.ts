import { getRequestAuthorization } from '~/server/utils/getRequestAuthorization'

export default defineEventHandler(async event => {
  const Authorization = getRequestAuthorization(event)
  const rs = await $axios.get('/hydra-main/auth', {
    headers: {
      Authorization
    }
  })
  return rs
})
