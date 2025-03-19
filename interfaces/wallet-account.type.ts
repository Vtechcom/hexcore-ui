import type { UTxOObject } from './cardano'

export type WalletAccount = {
  id: number
  baseAddress: string
  pointerAddress: string
  createdAt: string
  utxo: UTxOObject
}
