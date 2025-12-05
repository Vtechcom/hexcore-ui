<script lang="ts" setup>
  import { networkInfo } from '~/constants/chain'
  import type { WalletAccount } from '~/interfaces/wallet-account.type'

  import BigNumber from 'bignumber.js'
  import type { CreateAccount } from '~/interfaces/api/accounts/create.type'
  import type { TxHash } from '@hydra-sdk/core'

  const accountStore = useAccountStore()
  const { accounts: walletAccounts, isLoading } = storeToRefs(accountStore)

  const tableData = computed(() => {
    const data = walletAccounts.value ? walletAccounts.value : []
    return data.sort((a, b) => b.id - a.id)
  })

  const getUtxo = (row: WalletAccount) => {
    return Object.keys(row.utxo).map(txHash => {
      return {
        txHash,
        data: row.utxo[txHash as TxHash]
      }
    })
  }

  const getTotalBalance = (row: WalletAccount) => {
    const lovelace = Object.keys(row.utxo).reduce((acc, txHash) => {
      return acc.plus((row.utxo[txHash as TxHash].value as { lovelace: number }).lovelace)
    }, BigNumber(0))
    return lovelace.div(10 ** networkInfo.currency.decimals).toFormat()
  }

  const onCreateAccountSuccess = (account: CreateAccount) => {
    if (!walletAccounts.value || !walletAccounts.value) {
      walletAccounts.value = []
    }
    walletAccounts.value.unshift({
      ...account,
      utxo: {}
    })
  }
</script>

<template>
  <div class="w-full">
    <base-breadcrumb :items="[{ text: 'Wallet Accounts', to: '/wallet-accounts' }]">
      <template #right-content>
        <el-button type="primary" @click="usePopupState(Popup.POPUP_CREATE_WALLET_ACCOUNT, 'open')">
          Create account
        </el-button>
      </template>
    </base-breadcrumb>

    <el-table v-loading="isLoading" stripe :border="true" :data="tableData" height="480" class="font-mono">
      <el-table-column prop="id" label="ID" width="50" align="center" />
      <el-table-column prop="pointerAddress" min-width="200" label="Pointer address">
        <template #default="{ row }">
          <el-popover width="auto" placement="top">
            <div class="text-nowrap text-sm">
              {{ row.pointerAddress }}
            </div>
            <template #reference>
              <span v-copy="row.pointerAddress" class="cursor-pointer">{{ formatId(row.pointerAddress, 12, 16) }}</span>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="baseAddress" min-width="200" label="Base address bech32">
        <template #default="{ row }">
          <el-popover width="auto" placement="top">
            <div class="text-nowrap text-sm">
              {{ row.baseAddress }}
            </div>
            <template #reference>
              <span v-copy="row.baseAddress" class="cursor-pointer">{{ formatId(row.baseAddress, 12, 16) }}</span>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="" label="Total balance" min-width="70" align="center">
        <template #default="{ row }">
          <p class="">{{ getTotalBalance(row) }} {{ networkInfo.currency.symbol }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="utxo" label="UTxOs" min-width="90" align="center">
        <template #default="{ row }">
          <el-button type="success" plain size="small">{{ getUtxo(row).length }} utxo</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" width="130" label="Created at" align="center">
        <template #default="{ row }">
          <div class="flex flex-col text-sm">
            <div>{{ useDateFormat(row.createdAt, 'DD/MM/YYYY') }}</div>
            <div>{{ useDateFormat(row.createdAt, 'hh:mm:ss A') }}</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="mt-6 flex items-center justify-end gap-4">
      <div class="font-600 sm-block hidden text-sm">Total: {{ tableData.length }}</div>
      <el-pagination :pager-count="5" background layout="prev, pager, next" :total="100" />
    </div> -->
    <popup-create-wallet-account @success="onCreateAccountSuccess" />
  </div>
</template>

<style lang="scss" scoped></style>
