import { defineStore } from 'pinia'
import type { WalletAccount } from '~/interfaces/wallet-account.type'
import type { CreateAccount } from '~/interfaces/api/accounts/create.type'
import type { ListAccountResponse } from '~/interfaces/api/accounts/list-account.type'
import type { TxHash } from '~/interfaces/cardano'
import BigNumber from 'bignumber.js'
import { networkInfo } from '~/constants/chain'

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<WalletAccount[]>([])
  const isLoading = ref(false)

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
      return acc + account.utxo[txHash as TxHash].value.lovelace
    }, 0)
    return BigNumber(lovelace)
      .div(10 ** networkInfo.currency.decimals)
      .toFormat()
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
    getAccountBalance
  }
})
