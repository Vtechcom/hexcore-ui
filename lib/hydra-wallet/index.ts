/* eslint-disable @typescript-eslint/no-extraneous-class */
import * as BaseEncoding from '@scure/base'
import { generateMnemonic, mnemonicToEntropy } from 'bip39'
import { Bip32PrivateKey, type Ed25519PrivateKey } from './utils/cardano-wasm'
import * as CardanoWASM from '@emurgo/cardano-serialization-lib-browser'
import {
  buildBaseAddress,
  buildEnterpriseAddress,
  buildKeys,
  buildRewardAddress
} from './utils/cardano-wasm/build-keys'
import { deserializeTx } from './utils/cardano-wasm/deserializer'
import { resolveTxBodyHash, resolveTxHash } from './utils/cardano-wasm/resolver'

//
//
export class WalletStaticMethods {
  static privateKeyBech32ToPrivateKeyHex(_bech32: string): string {
    const bech32DecodedBytes = BaseEncoding.bech32.decodeToBytes(_bech32).bytes
    const bip32PrivateKey = Bip32PrivateKey.fromBytes(bech32DecodedBytes)
    return bip32PrivateKey.toHex()
  }

  static mnemonicToPrivateKeyHex(words: string[], password = ''): string {
    const entropy = mnemonicToEntropy(words.join(' '))
    const bip32PrivateKey = Bip32PrivateKey.fromBip39Entropy(entropy, password)
    return bip32PrivateKey.toHex()
  }

  static privateKeyHexToBech32(privateKeyHex: string) {
    const bip32PrivateKey = Bip32PrivateKey.fromHex(privateKeyHex)
    const bech32Words = BaseEncoding.bech32.toWords(bip32PrivateKey.toBytes())
    const xprvBech32 = BaseEncoding.bech32.encode('xprv', bech32Words, 195)
    return xprvBech32
  }

  static signingKeyToHexes(paymentKey: string, stakeKey: string): [string, string] {
    return [
      paymentKey.startsWith('5820') ? paymentKey.slice(4) : paymentKey,
      stakeKey.startsWith('5820') ? stakeKey.slice(4) : stakeKey
    ]
  }

  static bip32BytesToPrivateKeyHex(bip32Bytes: Uint8Array): string {
    const bip32PrivateKey = Bip32PrivateKey.fromBytes(bip32Bytes)
    return bip32PrivateKey.toHex()
  }

  static getAddresses(
    paymentKey: Ed25519PrivateKey,
    stakingKey: Ed25519PrivateKey,
    networkId = 0
  ): {
    baseAddress: CardanoWASM.Address
    enterpriseAddress: CardanoWASM.Address
    rewardAddress: CardanoWASM.Address
  } {
    console.log('>>> / paymentKey, stakingKey:', paymentKey, stakingKey)
    console.log(
      '>>> / paymentKey.toPublic().hash(), stakingKey.toPublic().hash():',
      paymentKey.toPublic().hash(),
      stakingKey.toPublic().hash()
    )
    const baseAddress = buildBaseAddress(
      networkId,
      paymentKey.toPublic().hash(),
      stakingKey.toPublic().hash()
    ).to_address()
    console.log('>>> / baseAddress:', baseAddress.to_bech32())

    const enterpriseAddress = buildEnterpriseAddress(networkId, paymentKey.toPublic().hash()).to_address()

    const rewardAddress = buildRewardAddress(networkId, stakingKey.toPublic().hash()).to_address()

    return {
      baseAddress: baseAddress,
      enterpriseAddress: enterpriseAddress,
      rewardAddress: rewardAddress
    }
  }

  static generateMnemonic(strength = 256): string[] {
    const mnemonic = generateMnemonic(strength)
    return mnemonic.split(' ')
  }

  // static getDRepKey(
  //   dRepKey: Ed25519PrivateKey,
  //   networkId = 0
  // ): {
  //   pubDRepKey: string
  //   dRepIDBech32: DRepID
  //   dRepIDHash: Ed25519KeyHashHex
  // } {
  //   const pubDRepKey = dRepKey.toPublic().hex().toString()

  //   const dRepIDBech32 = buildDRepID(Ed25519PublicKeyHex(pubDRepKey), networkId)
  //   const dRep = DRep.newKeyHash(dRepKey.toPublic().hash().hex())
  //   const dRepIDHash = dRep.toKeyHash()!

  //   return {
  //     pubDRepKey,
  //     dRepIDBech32,
  //     dRepIDHash
  //   }
  // }

  // TODO: need more test
  static addWitnessSets(txCborHex: string, witnesses: CardanoWASM.Vkeywitness[]): string {
    const tx = deserializeTx(txCborHex)
    const witnessSet = tx.witness_set()
    const witnessSetVkeys = witnessSet.vkeys() || CardanoWASM.Vkeywitnesses.new()
    // const witnessSetVkeysValues: CardanoWASM.Vkeywitness[] = witnessSetVkeys
    //   ? [...witnessSetVkeys.values(), ...witnesses]
    //   : witnesses
    // witnessSet.setVkeys(
    //   Serialization.CborSet.fromCore(
    //     witnessSetVkeysValues.map(vkw => vkw.toCore()),
    //     VkeyWitness.fromCore
    //   )
    // )
    for (const witness of witnesses) {
      witnessSetVkeys.add(witness)
    }
    witnessSet.set_vkeys(witnessSetVkeys)
    const txBody = tx.body()
    const newTx = CardanoWASM.Transaction.new(txBody, witnessSet, tx.auxiliary_data())
    return newTx.to_hex()
  }
}

export type Account = {
  baseAddress: CardanoWASM.Address
  enterpriseAddress: CardanoWASM.Address
  rewardAddress: CardanoWASM.Address
  baseAddressBech32: string
  enterpriseAddressBech32: string
  rewardAddressBech32: string
  paymentKey: Ed25519PrivateKey
  stakeKey: Ed25519PrivateKey
  paymentKeyHex: string
  stakeKeyHex: string

  pubDRepKey?: string
  dRepIDBech32?: ReturnType<CardanoWASM.DRep['to_bech32']>
  dRepIDHash?: ReturnType<CardanoWASM.DRep['to_key_hash']>
}

export type CreateEmbeddedWalletOptions = {
  networkId: number
  key: EmbeddedWalletKeyType
}

export type EmbeddedWalletKeyType =
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
  | {
      type: 'bip32Bytes'
      bip32Bytes: Uint8Array
    }

export class EmbeddedWallet extends WalletStaticMethods {
  private readonly _walletSecret?: string | [string, string]
  private readonly _networkId: number

  constructor(options: CreateEmbeddedWalletOptions) {
    super()
    this._networkId = options.networkId

    switch (options.key.type) {
      case 'mnemonic':
        this._walletSecret = WalletStaticMethods.mnemonicToPrivateKeyHex(options.key.words)
        break
      case 'root':
        this._walletSecret = WalletStaticMethods.privateKeyBech32ToPrivateKeyHex(options.key.bech32)
        break
      case 'cli':
        this._walletSecret = WalletStaticMethods.signingKeyToHexes(
          options.key.payment,
          options.key.stake ?? 'f0'.repeat(32)
        )
        break
      case 'bip32Bytes':
        this._walletSecret = WalletStaticMethods.bip32BytesToPrivateKeyHex(options.key.bip32Bytes)
        break
    }
  }

  getAccount(accountIndex = 0, keyIndex = 0): Account {
    if (this._walletSecret == undefined) throw new Error('[EmbeddedWallet] No keys initialized')

    const { paymentKey, stakeKey } = buildKeys(this._walletSecret, accountIndex, keyIndex)
    console.log('>>> / paymentKey, stakeKey:', paymentKey.toRawKey().to_hex(), stakeKey.toHex())

    const { baseAddress, enterpriseAddress, rewardAddress } = WalletStaticMethods.getAddresses(
      paymentKey,
      stakeKey,
      this._networkId
    )

    const _account: Account = {
      baseAddress: baseAddress,
      enterpriseAddress: enterpriseAddress,
      rewardAddress: rewardAddress,

      baseAddressBech32: baseAddress.to_bech32(),
      enterpriseAddressBech32: enterpriseAddress.to_bech32(),
      rewardAddressBech32: rewardAddress.to_bech32(),

      paymentKey: paymentKey,
      stakeKey: stakeKey,

      paymentKeyHex: paymentKey.toHex(),
      stakeKeyHex: stakeKey.toHex()
    }

    // if (dRepKey) {
    //   const { pubDRepKey, dRepIDBech32, dRepIDHash } = WalletStaticMethods.getDRepKey(dRepKey, this._networkId)
    //   _account.pubDRepKey = pubDRepKey
    //   _account.dRepIDBech32 = dRepIDBech32
    //   _account.dRepIDHash = dRepIDHash
    // }

    return _account
  }

  /**
   * Get wallet network ID.
   *
   * @returns network ID
   */
  getNetworkId(): number {
    return this._networkId
  }

  /**
   * This endpoints sign the provided transaction (unsignedTx) with the private key of the owner.
   *
   * @param unsignedTx - a transaction in CBOR
   * @param accountIndex account index (default: 0)
   * @param keyIndex key index (default: 0)
   * @returns VkeyWitness
   */
  signTx(unsignedTx: string, accountIndex = 0, keyIndex = 0): CardanoWASM.Vkeywitness {
    try {
      const txBody = deserializeTx(unsignedTx).body()
      const txBodyHash = resolveTxBodyHash(txBody)

      const { paymentKey } = this.getAccount(accountIndex, keyIndex)
      // const vKeyWitness = new VkeyWitness(paymentKey.toPublic().hex(), paymentKey.sign(HexBlob(txHash)).hex())
      const vKeyWitness = CardanoWASM.make_vkey_witness(txBodyHash, paymentKey.toRawKey())
      return vKeyWitness
    } catch (error) {
      throw new Error(`[EmbeddedWallet] An error occurred during signTx: ${error}.`)
    }
  }

  //   /**
  //    * This endpoint utilizes the [CIP-8 - Message Signing](https://cips.cardano.org/cips/cip8/) to sign arbitrary data, to verify the data was signed by the owner of the private key.
  //    *
  //    * @param address - bech32 address to sign the data with
  //    * @param payload - the data to be signed
  //    * @param accountIndex account index (default: 0)
  //    * @returns a signature
  //    */
  //   signData(address: string, payload: string, accountIndex = 0, keyIndex = 0): DataSignature {
  //     try {
  //       const { baseAddress, enterpriseAddress, rewardAddress, paymentKey } = this.getAccount(accountIndex, keyIndex)

  //       const foundAddress = [baseAddress, enterpriseAddress, rewardAddress].find(a => a.toBech32() === address)

  //       if (foundAddress === undefined)
  //         throw new Error(`[EmbeddedWallet] Address: ${address} doesn't belong to this account.`)

  //       // todo tw
  //       return signData(payload, {
  //         address: Address.fromBech32(address),
  //         key: paymentKey
  //       })
  //     } catch (error) {
  //       throw new Error(`[EmbeddedWallet] An error occurred during signData: ${error}.`)
  //     }
  //   }
}
