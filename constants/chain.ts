import CardanoWASM from '~/lib/hydra-wallet/utils/cardano-wasm'

type ChainType = 'preprod' | 'mainnet'

export const CHAIN: ChainType = 'preprod'
export const networkInfo = {
  networkId: CardanoWASM.NetworkInfo.testnet_preprod().network_id(),
  networkMagic: CardanoWASM.NetworkInfo.testnet_preprod().protocol_magic(),
  networkName: 'preprod',
  currency: {
    decimals: 6,
    name: 'tADA',
    symbol: 't₳'
  }
}
