import { BuildKeys, WalletStaticMethods, KeysUtils } from '@hydra-sdk/core'

export const mnemonicToCliKey = (
  mnemonic: string[],
  accountIndex: number = 0,
  keyIndex: number = 0
): { sk: string; vk: string } => {
  const walletSecret = WalletStaticMethods.mnemonicToPrivateKeyHex(mnemonic)

  const { paymentKey } = BuildKeys.buildKeys(walletSecret, accountIndex, keyIndex)
  const extendedPrvKey = paymentKey.to_raw_key().to_hex().slice(4, 68)

  const skey = {
    type: 'PaymentSigningKeyShelley_ed25519',
    description: 'Payment Signing Key',
    cborHex: `5820${extendedPrvKey}`
  } as const

  const vkey = KeysUtils.genVkey(skey)

  return {
    sk: skey.cborHex,
    vk: vkey.cborHex
  }
}
