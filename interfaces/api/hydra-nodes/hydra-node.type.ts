export type HydraNode = {
  id: number
  description?: string
  port: number
  vkey: string
  createdAt: string
  status: 'ACTIVE' | 'INACTIVE'
  cardanoWallet: {
    id: number
    baseAddress: string
    pointerAddress: string
    createdAt: string
  }
}
