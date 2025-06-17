import { EmbeddedWallet } from './embedded'
import { deserializeTx } from './utils/cardano-wasm/deserializer'

export type AppWalletKeyType =
  | {
      type: 'root'
      bech32: string
    }
  | {
      type: 'cli'
      payment: string
      stake?: string
    }
  | {
      type: 'mnemonic'
      words: string[]
    }
export type CreateAppWalletOptions = {
  networkId: number
  fetcher?: IFetcher
  submitter?: ISubmitter
  key: AppWalletKeyType
}
export class AppWallet implements ISigner, ISubmitter {
  private readonly _submitter?: ISubmitter
  private readonly _fetcher?: IFetcher
  private readonly _wallet: EmbeddedWallet

  constructor(options: CreateAppWalletOptions) {
    this._fetcher = options.fetcher
    this._submitter = options.submitter

    switch (options.key.type) {
      case 'mnemonic':
        this._wallet = new EmbeddedWallet({
          networkId: options.networkId,
          key: {
            type: 'mnemonic',
            words: options.key.words
          }
        })
        break
      case 'root':
        this._wallet = new EmbeddedWallet({
          networkId: options.networkId,
          key: {
            type: 'root',
            bech32: options.key.bech32
          }
        })
        break
      case 'cli':
        this._wallet = new EmbeddedWallet({
          networkId: options.networkId,
          key: {
            type: 'cli',
            payment: options.key.payment,
            stake: options.key.stake
          }
        })
    }
  }

  getAccount(accountIndex = 0, keyIndex = 0) {
    return this._wallet.getAccount(accountIndex, keyIndex)
  }

  getEnterpriseAddress(accountIndex = 0, keyIndex = 0): string {
    const account = this._wallet.getAccount(accountIndex, keyIndex)
    return account.enterpriseAddressBech32
  }

  getPaymentAddress(accountIndex = 0, keyIndex = 0): string {
    const account = this._wallet.getAccount(accountIndex, keyIndex)
    return account.baseAddressBech32
  }

  getRewardAddress(accountIndex = 0, keyIndex = 0): string {
    const account = this._wallet.getAccount(accountIndex, keyIndex)
    return account.rewardAddressBech32
  }

  getNetworkId(): number {
    return this._wallet.getNetworkId()
  }

  async signTx(unsignedTx: string, partialSign = false, accountIndex = 0, keyIndex = 0): Promise<string> {
    try {
      const tx = deserializeTx(unsignedTx)

      if (!partialSign && tx.witness_set().vkeys() !== undefined && tx.witness_set().vkeys()?.len() !== 0)
        throw new Error('Signatures already exist in the transaction in a non partial sign call')

      const prvSigningKey = this._wallet.getAccount(accountIndex, keyIndex).paymentKey.to_raw_key()
      tx.sign_and_add_vkey_signature(prvSigningKey)
      return tx.to_hex()
    } catch (error) {
      throw new Error(`[AppWallet] An error occurred during signTx: ${error}.`)
    }
  }

  static brew(strength = 256): string[] {
    return EmbeddedWallet.generateMnemonic(strength)
  }
}
