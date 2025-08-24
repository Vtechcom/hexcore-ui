<script lang="ts" setup>
  import { networkInfo } from '~/constants/chain'
  import type { TxHash } from '~/interfaces/cardano'
  import type { WalletAccount } from '~/interfaces/wallet-account.type'

  import BigNumber from 'bignumber.js'
  import type { CreateAccount } from '~/interfaces/api/accounts/create.type'

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
      return acc.plus(row.utxo[txHash as TxHash].value.lovelace)
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
    <div class="mb-4 flex items-center justify-between px-3">
      <div class="text-sm">Total: {{ tableData.length }}</div>
      <div class="flex">
        <el-button type="primary" @click="usePopupState(Popup.POPUP_CREATE_WALLET_ACCOUNT, 'open')">
          Create account
        </el-button>
      </div>
    </div>
    <el-table
      v-loading="isLoading"
      :data="tableData"
      style="width: 100%; height: 480px"
      height="480"
      class="font-mono text-xs"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="pointerAddress" label="Pointer address">
        <template #default="{ row }">
          <el-popover width="auto" placement="top">
            <div class="text-nowrap text-sm">
              {{ row.pointerAddress }}
            </div>
            <template #reference>
              <span v-copy="row.pointerAddress" class="cursor-pointer">{{ formatId(row.pointerAddress, 6, 12) }}</span>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="baseAddress" label="Base address">
        <template #default="{ row }">
          <el-popover width="auto" placement="top">
            <div class="text-nowrap text-sm">
              {{ row.baseAddress }}
            </div>
            <template #reference>
              <span v-copy="row.baseAddress" class="cursor-pointer">{{ formatId(row.baseAddress, 6, 12) }}</span>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="" label="Total balance" width="160" align="center">
        <template #default="{ row }">
          <p class="">{{ getTotalBalance(row) }} {{ networkInfo.currency.symbol }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="utxo" label="UTxOs" width="120 " align="center">
        <template #default="{ row }">
          <el-button type="success" plain size="small">{{ getUtxo(row).length }} utxo</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="Created at" width="120" align="right">
        <template #default="{ row }">
          <div class="flex flex-col text-sm">
            <div>{{ useDateFormat(row.createdAt, 'DD/MM/YYYY') }}</div>
            <div>{{ useDateFormat(row.createdAt, 'hh:mm:ss A') }}</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <popup-create-wallet-account @success="onCreateAccountSuccess" />
  </div>
</template>

<style lang="scss" scoped></style>
