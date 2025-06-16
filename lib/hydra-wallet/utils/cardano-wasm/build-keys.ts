import { NetworkId, NetworkInfo } from '@emurgo/cardano-serialization-lib-browser'
import * as BaseEncoding from '@scure/base'
import hash from 'hash.js'
import CardanoWASM, { Bip32PrivateKey, Ed25519PrivateKey } from '.'
import { HARDENED_KEY_START } from '../../constants'

export const buildBaseAddress = (
  networkId: number,
  paymentKeyHash: CardanoWASM.Ed25519KeyHash,
  stakeKeyHash: CardanoWASM.Ed25519KeyHash
): CardanoWASM.BaseAddress => {
  const paymentCredential = CardanoWASM.Credential.from_keyhash(paymentKeyHash)
  const stakeCredential = CardanoWASM.Credential.from_keyhash(stakeKeyHash)
  return CardanoWASM.BaseAddress.new(networkId, paymentCredential, stakeCredential)
}

export const buildEnterpriseAddress = (
  networkId: number,
  paymentKeyHash: CardanoWASM.Ed25519KeyHash
): CardanoWASM.EnterpriseAddress => {
  //   return EnterpriseAddress.fromCredentials(networkId, {
  //     hash: paymentKeyHash,
  //     type: CredentialType.KeyHash
  //   })
  const paymentCredential = CardanoWASM.Credential.from_hex(paymentKeyHash.to_hex())
  return CardanoWASM.EnterpriseAddress.new(networkId, paymentCredential)
}

export const buildRewardAddress = (
  networkId: number,
  stakeKeyHash: CardanoWASM.Ed25519KeyHash
): CardanoWASM.RewardAddress => {
  //   const cred = {
  //     type: CredentialType.KeyHash,
  //     hash: stakeKeyHash
  //   }
  //   return RewardAddress.fromCredentials(networkId, cred)
  const stakeCredential = CardanoWASM.Credential.from_hex(stakeKeyHash.to_hex())
  return CardanoWASM.RewardAddress.new(networkId, stakeCredential)
}

export const buildDRepID = (
  dRepKey: CardanoWASM.Ed25519KeyHash,
  networkId: number = NetworkInfo.testnet_preprod().network_id()
  // addressType: AddressType = AddressType.EnterpriseKey
) => {
  // const dRepKeyBytes = Buffer.from(dRepKey, 'hex')
  // const dRepIdHex = blake2b(28).update(dRepKeyBytes).digest('hex')
  // const paymentAddress = EnterpriseAddress.packParts({
  //   networkId,
  //   paymentPart: {
  //     hash: Hash28ByteBase16(dRepIdHex),
  //     type: CredentialType.KeyHash
  //   },
  //   type: addressType
  // })
  // return HexBlob.toTypedBech32<DRepID>('drep', HexBlob.fromBytes(paymentAddress))

  // CardanoWASM.DRep.new_from_credential(CardanoWASM.Credential.from_hex(dRepKey.to_hex()))
  // const paymentAddress = CardanoWASM.EnterpriseAddress.new(networkId, CardanoWASM.Credential.from_hex(dRepKey.to_hex()))

  return null
}

export const buildKeys = (
  privateKeyHex: string | [string, string],
  accountIndex: number,
  keyIndex = 0
): {
  paymentKey: Ed25519PrivateKey
  stakeKey: Ed25519PrivateKey
  dRepKey?: Ed25519PrivateKey
} => {
  if (typeof privateKeyHex === 'string') {
    const privateKey = Bip32PrivateKey.fromHex(privateKeyHex)

    // hardened derivation
    const accountKey = privateKey.derive([
      HARDENED_KEY_START + 1852, // purpose
      HARDENED_KEY_START + 1815, // coin type
      HARDENED_KEY_START + accountIndex // account index
    ])

    const paymentKey = accountKey.derive([0, keyIndex]).toRawKey() // external chain, payment key index
    const stakeKey = accountKey.derive([2, 0]).toRawKey() // staking key, index 0
    const dRepKey = accountKey.derive([3, keyIndex]).toRawKey() // dRep Keys, index

    return { paymentKey, stakeKey, dRepKey }
  } else {
    const paymentKey = buildEd25519PrivateKeyFromSecretKey(privateKeyHex[0])
    const stakeKey = buildEd25519PrivateKeyFromSecretKey(privateKeyHex[1])

    return { paymentKey, stakeKey }
  }
}

export const buildEd25519PrivateKeyFromSecretKey = (secretKeyHex: string) => {
  return Ed25519PrivateKey.fromExtendedBytes(
    new Uint8Array(clampScalar(Buffer.from(hash.sha512().update(Buffer.from(secretKeyHex, 'hex')).digest())))
  )
}

export const clampScalar = (scalar: Buffer): Buffer => {
  if (scalar[0] !== undefined) {
    scalar[0] &= 0b1111_1000
  }
  if (scalar[31] !== undefined) {
    scalar[31] &= 0b0001_1111
    scalar[31] |= 0b0100_0000
  }
  return scalar
}
