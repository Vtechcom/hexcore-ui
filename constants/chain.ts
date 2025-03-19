import { Cardano } from '@cardano-sdk/core'

type ChainType = 'preprod' | 'mainnet'

export const CHAIN: ChainType = 'preprod'
export const networkInfo = {
  networkId: Cardano.ChainIds.Preprod.networkId,
  networkMagic: Cardano.ChainIds.Preprod.networkMagic,
  networkName: 'preprod',
  currency: {
    decimals: 6,
    name: 'tADA',
    symbol: 't₳'
  }
}
