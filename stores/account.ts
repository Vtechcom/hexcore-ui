import { defineStore } from 'pinia'
import type { WalletAccount } from '~/interfaces/wallet-account.type'
import type { CreateAccount } from '~/interfaces/api/accounts/create.type'
import type { ListAccountResponse } from '~/interfaces/api/accounts/list-account.type'
import type { TxHash, UTxOObject } from '~/interfaces/cardano'
import BigNumber from 'bignumber.js'
import { networkInfo } from '~/constants/chain'

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<WalletAccount[]>([])
  const isLoading = ref(false)
  const syncingUtxo = ref(false)
  const syncProgress = ref(0)

  const sortedAccounts = computed(() => {
    return [...accounts.value].sort((a, b) => b.id - a.id)
  })

  function setAccounts(newAccounts: WalletAccount[]) {
    accounts.value = newAccounts
  }

  function addAccount(account: CreateAccount) {
    accounts.value.unshift({
      ...account,
      utxo: {}
    })
  }

  function updateAccountUtxo(accountId: number, utxo: WalletAccount['utxo']) {
    const account = accounts.value.find(acc => acc.id === accountId)
    if (account) {
      account.utxo = utxo
    }
  }

  function getAccountBalance(account: WalletAccount) {
    const lovelace = Object.keys(account.utxo).reduce((acc, txHash) => {
      return acc.plus(account.utxo[txHash as TxHash].value.lovelace)
    }, BigNumber(0))
    return lovelace.div(10 ** networkInfo.currency.decimals).toFormat()
  }

  async function fetchAddressUtxo(account: WalletAccount) {
    const rs = await $fetch<{ data: UTxOObject }>(`/api/accounts/utxo/${account.pointerAddress}`)
    updateAccountUtxo(account.id, rs.data)
  }

  async function syncUtxo() {
    try {
      syncingUtxo.value = true
      const queries = accounts.value.map(account => {
        return fetchAddressUtxo(account)
      })
      await Promise.all(queries)
    } catch (error) {
      console.error(error)
    } finally {
      syncingUtxo.value = false
    }
  }

  async function getListAccount() {
    try {
      isLoading.value = true
      const rs = await $fetch<ListAccountResponse>('/api/accounts/list-accounts')
      setAccounts(rs.data)
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    accounts,
    isLoading,
    sortedAccounts,
    setAccounts,
    addAccount,
    updateAccountUtxo,
    getListAccount,
    getAccountBalance,
    syncingUtxo,
    syncUtxo,
    syncProgress
  }
})
