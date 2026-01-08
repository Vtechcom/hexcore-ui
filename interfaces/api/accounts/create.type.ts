import type { ApiResponse } from '../response-factory.type'

export type CreateAccount = {
  baseAddress: string
  pointerAddress: string
  id: number
  createdAt: string
  mnemonic: string
}

export type CreateAccountResponse = ApiResponse<CreateAccount>
