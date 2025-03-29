import type { ApiResponse } from '../response-factory.type'
import type { WalletAccount } from '~/interfaces/wallet-account.type'

export type ListAccountResponse = ApiResponse<WalletAccount[]>
