import type { AddressesUtxoRes } from '~/shared/types/AddressesUtxoRes.type'
import { $axios } from '~/server/utils/axios'
import { z } from 'zod'
import { useZodValidator } from '~/server/utils/useValidator'

export default defineEventHandler(async event => {
  try {
    const query = useZodValidator(
      z.object({
        addresses: z.array(z.string().max(108)).min(1).or(z.string().max(108).min(1))
      }),
      getQuery(event)
    )
    const { addresses } = query
    const rs = await $axios.get<any, AddressesUtxoRes>('/ogmios/addresses/utxo', {
      params: {
        addresses
      }
    })
    return rs
  } catch (error) {
    return errorResponseHandler(error, event)
  }
})
