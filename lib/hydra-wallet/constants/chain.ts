import CardanoWASM from '../utils/cardano-wasm'

export const NETWORK_ID = CardanoWASM.NetworkInfo.testnet_preprod().network_id()
export const NETWORK_MAGIC = CardanoWASM.NetworkInfo.testnet_preprod().protocol_magic()
