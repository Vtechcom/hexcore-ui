import { $axios } from '~/server/utils/axios'
export default defineEventHandler(async event => {
  try {
    const address = getRouterParam(event, 'address')
    const rs = await $axios.get('/hydra-main/utxo/' + address)
    return rs
  } catch (error) {
    console.error(error)
    return errorResponseHandler(event, error)
  }
})
