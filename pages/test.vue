<script lang="ts" setup>
  import { mnemonicToEntropy } from 'bip39'
  import { Bip32PrivateKey } from '~/lib/hydra-wallet/utils/cardano-wasm'

  import * as BaseEncoding from '@scure/base'
  import { EmbeddedWallet } from '~/lib/hydra-wallet'
  import { NETWORK_ID } from '~/lib/hydra-wallet/constants/chain'

  const MOCKS = {
    mnemonic: 'daughter silk uncover cheese split ribbon treat forum belt planet divert verify easily fabric shrimp',

    privateKeyHex:
      '38d14c3846cc05bb1361f2535784d4fd580fe786660e4cc7217e0f3f3a6cee59a0791c7c0de1d34237f0b9b6b629f05b21551c5ad7a8adcf9692bdaf8ed815d4c3e3e731a7f72962b21d77a0d79514e50194e5469e6e82ae87a60b4b8dcebc74',
    privateKeyBech32:
      'xprv18rg5cwzxeszmkymp7ff40px5l4vqleuxvc8ye3ep0c8n7wnvaev6q7gu0sx7r56zxlctnd4k98c9kg24r3dd029de7tf90d03mvpt4xru0nnrflh993ty8th5rte2989qx2w2357d6p2apaxpd9cmn4uwsjxcvv2',
    baseAddress:
      'addr_test1qrsx72hrv8ens90hwkezg7ysyhwvcjmyzdveyf88ppq7a0lwu7gv0wuuf9lhzm7wclvj5ntgcfa53j0rqxmu237x20xsne56q3',
    stakeAddress: 'stake_test1urhw0yx8hwwyjlm3dl8v0kf2f45vy76ge83srd79glr98ngx6ak4j',
    pubKeyHash: 'e06f2ae361f33815f775b224789025dccc4b6413599224e70841eebf',
    stakeCredentialHash: 'eee790c7bb9c497f716fcec7d92a4d68c27b48c9e301b7c547c653cd',

    account: {
      baseAddress: {},
      enterpriseAddress: {},
      rewardAddress: {},
      baseAddressBech32:
        'addr_test1qrsx72hrv8ens90hwkezg7ysyhwvcjmyzdveyf88ppq7a0lwu7gv0wuuf9lhzm7wclvj5ntgcfa53j0rqxmu237x20xsne56q3',
      enterpriseAddressBech32: 'addr_test1vrsx72hrv8ens90hwkezg7ysyhwvcjmyzdveyf88ppq7a0c79dt9d',
      rewardAddressBech32: 'stake_test1urhw0yx8hwwyjlm3dl8v0kf2f45vy76ge83srd79glr98ngx6ak4j',
      paymentKey: {
        __type: 'Extended'
      },
      stakeKey: {
        __type: 'Extended'
      },
      paymentKeyHex:
        'b00abe3c46d4e40b8be4548d0abce207690d5c60aeb1a05dc278978b576cee59b6f2dd341d420ee4f00b2569a3ee25b210f26a8a02bc75e2b2bb1530676a94de',
      stakeKeyHex:
        '5034d04215cdc56f2b50454c58148bec7fdf11214d35e04f9a01f0a9566cee59dd2f27e4b872db33d8851b861cc3354c837fe5128301cc9e28cd7a2778dcd407',
      pubDRepKey: 'ff06a2d6374f9c552dc88d7631bd8335b426090ce4c246bf08fe73fab6fe107c',
      dRepIDBech32: 'drep1vreq4xyn543gzgjgdxa2njma9ngks4k0avq43r0tr694jnc7wd50w',
      dRepIDHash: 'f20a9893a56281224869baa9cb7d2cd16856cfeb01588deb1e8b594f'
    }
  }

  onMounted(() => {
    try {
      const mnemonic =
        'daughter silk uncover cheese split ribbon treat forum belt planet divert verify easily fabric shrimp'
      const entropy = mnemonicToEntropy(mnemonic)
      const bip32PrivateKey = Bip32PrivateKey.fromBip39Entropy(entropy, '')
      const privateKeyHex = bip32PrivateKey.toHex()
      console.log('>>> / privateKeyHex:', privateKeyHex)

      const bech32Words = BaseEncoding.bech32.toWords(bip32PrivateKey.toBytes())
      const xprvBech32 = BaseEncoding.bech32.encode('xprv', bech32Words, 195)
      console.log('>>> / xprvBech32:', xprvBech32)

      const embeddedWallet = new EmbeddedWallet({
        networkId: NETWORK_ID,
        key: {
          type: 'mnemonic',
          words: mnemonic.split(' ')
        }
      })
      console.log('>>> / embeddedWallet:', embeddedWallet)
      const account = embeddedWallet.getAccount(0, 0)
      console.log('>>> / account:', account)
    } catch (error) {
      console.error('>>> / error:', error)
    }
  })
</script>

<template>
  <div class=""></div>
</template>

<style lang="scss" scoped></style>
