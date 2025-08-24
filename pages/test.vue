<script lang="ts" setup>
  import { mnemonicToEntropy } from 'bip39'
  import { AppWallet } from '~/lib/hydra-wallet'
  import { NETWORK_ID } from '~/lib/hydra-wallet/constants/chain'
  import { EmbeddedWallet } from '~/lib/hydra-wallet/embedded'
  import { resolveTxHash } from '~/lib/hydra-wallet/utils/cardano-wasm/resolver'

  const MOCKS = {
    mnemonic: 'daughter silk uncover cheese split ribbon treat forum belt planet divert verify easily fabric shrimp',
    entropy: '37d913b2939d237239f2dd14f4bcff795458a2f1',
    privateKeyHex:
      '38d14c3846cc05bb1361f2535784d4fd580fe786660e4cc7217e0f3f3a6cee59a0791c7c0de1d34237f0b9b6b629f05b21551c5ad7a8adcf9692bdaf8ed815d4c3e3e731a7f72962b21d77a0d79514e50194e5469e6e82ae87a60b4b8dcebc74',
    privateKeyBech32:
      'xprv18rg5cwzxeszmkymp7ff40px5l4vqleuxvc8ye3ep0c8n7wnvaev6q7gu0sx7r56zxlctnd4k98c9kg24r3dd029de7tf90d03mvpt4xru0nnrflh993ty8th5rte2989qx2w2357d6p2apaxpd9cmn4uwsjxcvv2',
    baseAddress:
      'addr_test1qrsx72hrv8ens90hwkezg7ysyhwvcjmyzdveyf88ppq7a0lwu7gv0wuuf9lhzm7wclvj5ntgcfa53j0rqxmu237x20xsne56q3',
    stakeAddress: 'stake_test1urhw0yx8hwwyjlm3dl8v0kf2f45vy76ge83srd79glr98ngx6ak4j',
    pubKeyHash: 'e06f2ae361f33815f775b224789025dccc4b6413599224e70841eebf',
    stakeCredentialHash: 'eee790c7bb9c497f716fcec7d92a4d68c27b48c9e301b7c547c653cd',

    // account 0, key 0
    account00: '',
    paymentKeyHex:
      'b00abe3c46d4e40b8be4548d0abce207690d5c60aeb1a05dc278978b576cee59b6f2dd341d420ee4f00b2569a3ee25b210f26a8a02bc75e2b2bb1530676a94de',
    stakeKeyHex:
      '5034d04215cdc56f2b50454c58148bec7fdf11214d35e04f9a01f0a9566cee59dd2f27e4b872db33d8851b861cc3354c837fe5128301cc9e28cd7a2778dcd407',
    pubDRepKey: 'ff06a2d6374f9c552dc88d7631bd8335b426090ce4c246bf08fe73fab6fe107c',
    dRepIDBech32: 'drep1vreq4xyn543gzgjgdxa2njma9ngks4k0avq43r0tr694jnc7wd50w',
    dRepIDHash: 'f20a9893a56281224869baa9cb7d2cd16856cfeb01588deb1e8b594f',
    baseAddressBech32:
      'addr_test1qrsx72hrv8ens90hwkezg7ysyhwvcjmyzdveyf88ppq7a0lwu7gv0wuuf9lhzm7wclvj5ntgcfa53j0rqxmu237x20xsne56q3',
    enterpriseAddressBech32: 'addr_test1vrsx72hrv8ens90hwkezg7ysyhwvcjmyzdveyf88ppq7a0c79dt9d',
    rewardAddressBech32: 'stake_test1urhw0yx8hwwyjlm3dl8v0kf2f45vy76ge83srd79glr98ngx6ak4j'
  }

  definePageMeta({
    layout: 'test'
  })

  const libBuild = reactive({
    mnemonic: '',
    entropy: '',
    privateKeyHex: '',
    privateKeyBech32: '',
    // account 0, key 0
    account00: null as any,
    paymentKeyHex: '',
    stakeKeyHex: '',
    pubDRepKey: '',
    dRepIDBech32: '',
    dRepIDHash: '',
    baseAddressBech32: '',
    enterpriseAddressBech32: '',
    rewardAddressBech32: '',
    // transaction
    transaction: null,
    txBody: '',
    txBodyHash: '',
    txHash: ''
  })
  onMounted(async () => {
    try {
      const mnemonic =
        'daughter silk uncover cheese split ribbon treat forum belt planet divert verify easily fabric shrimp'

      const embeddedWallet = new EmbeddedWallet({
        networkId: NETWORK_ID,
        key: {
          type: 'mnemonic',
          words: mnemonic.split(' ')
        }
      })

      libBuild.mnemonic = mnemonic
      libBuild.entropy = mnemonicToEntropy(mnemonic)
      libBuild.privateKeyHex = embeddedWallet.getPrivateKeyHex() as string
      libBuild.privateKeyBech32 = EmbeddedWallet.privateKeyHexToBech32(libBuild.privateKeyHex)
      reDrawTable()

      const account = embeddedWallet.getAccount(0, 0)

      libBuild.account00 = account
      libBuild.paymentKeyHex = account.paymentKeyHex
      libBuild.stakeKeyHex = account.stakeKeyHex
      // libBuild.pubDRepKey = account.dRepKey?.toHex() ?? ''
      // libBuild.dRepIDBech32 = account.dRepIDBech32 ?? ''
      // libBuild.dRepIDHash = account.dRepIDHash ?? ''
      libBuild.baseAddressBech32 = account.baseAddressBech32
      libBuild.enterpriseAddressBech32 = account.enterpriseAddressBech32
      libBuild.rewardAddressBech32 = account.rewardAddressBech32
      reDrawTable()

      //
      const appWallet = new AppWallet({
        networkId: NETWORK_ID,
        key: {
          type: 'mnemonic',
          words: mnemonic.split(' ')
        }
      })
      const unSignedCborHex =
        '84a500d901028182582001e93c785af12b3242e76a4a82a68559eadda5bb2b3af87e3f12c9519b735a24010dd901028182582001e93c785af12b3242e76a4a82a68559eadda5bb2b3af87e3f12c9519b735a24010182a300581d70ae01dade3a9c346d5c93ae3ce339412b90a0b8f83f94ec6baa24e30c011a001070fc028201d818582cd8799f581ccf122c4d887f822439fb4196ceebc7007d225c544e4c16ecfcf3589e1b000001977d4bb76280ff82581d6067b499913a7169d504d7887c99b1ff862d980b6f3ad5683c6394cde01a1de12e4c021a0002b3010758209037ac2528c541555d05a24b308fdfbc815ff54f228f4d09cc6d8b4b366570b8a100d901028182582091ebb8c454f37fd86161aeba2d6b8404f4ba030fb97543f0f5bf6dd2fbcdfddc58401a382af64a6a71bde503e88fef3f93eb7b08a33e442a78c90735d03dea250872c5c95873247a48ddd059bc88484d004d7f65ddece8b57d1d8b6fd74742499004f5d90103a100a119d90371487964726156312f4465706f7369745478'
      // Before Sign
      const unsignedTxHash = resolveTxHash(unSignedCborHex)
      console.log('>>> / unSignedCborHex:', unSignedCborHex)
      console.log('unsignedTxHash', unsignedTxHash)

      // After Sign
      const signedCborHex = await appWallet.signTx(unSignedCborHex, true, 0, 0)

      const txHash = resolveTxHash(signedCborHex)
      console.log('>>> / signedTxHash', txHash)
      console.log('>>> / signedCborHex:', signedCborHex)

      //
      const account_1 = appWallet.getAccount(1, 0)
      console.log('>>> / account_1:', account_1)
    } catch (error) {
      console.error('>>> / error:', error)
    }
  })

  const tableData = ref<any[]>([])

  function reDrawTable() {
    const data = []
    for (const key in libBuild) {
      data.push({
        property: key,
        raw: `[${(MOCKS[key as keyof typeof MOCKS] || '').length}] ` + MOCKS[key as keyof typeof MOCKS],
        lib:
          `[${((libBuild[key as keyof typeof libBuild] as string) || '').length}] ` +
          libBuild[key as keyof typeof libBuild]
      })
    }
    tableData.value = data
  }
</script>

<template>
  <div class="">
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="property" label="Property" width="180" />
      <el-table-column prop="raw" label="Raw" />
      <el-table-column prop="lib" label="Build by lib" />
      <el-table-column prop="match" label="R" width="60">
        <template #default="{ row }">
          <el-tag :type="row.raw === row.lib ? 'success' : 'danger'">
            {{ row.raw === row.lib ? 'Y' : 'N' }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped></style>
