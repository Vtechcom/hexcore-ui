import type { BigintWrap } from './BigintWrap.type'

export type OgmiosAddressUtxo = {
  transaction: {
    id: string
  }
  index: number
  address: string
  value:
    | {
        [policyId: string]: {
          [assetName: string]: string
        }
      }
    | {
        ada: {
          lovelace: string
        }
      }
  datumHash?: string | null
  datum?: string | null
  script?: {
    language: 'plutus:v1' | 'plutus:v2' | 'plutus:v3'
    cbor: string
  }
}
export type AddressesUtxoRes = BigintWrap<Array<OgmiosAddressUtxo>>
