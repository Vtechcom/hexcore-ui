import { defineStore } from 'pinia'
import type { WalletAccount } from '~/interfaces/wallet-account.type'
import type { CreateAccount } from '~/interfaces/api/accounts/create.type'
import type { ListAccountResponse } from '~/interfaces/api/accounts/list-account.type'
import type { TxHash, UTxOObject } from '@hydra-sdk/core'
import BigNumber from 'bignumber.js'
import { networkInfo } from '~/constants/chain'
import type { AddressesUtxoRes } from '~/shared/types/AddressesUtxoRes.type'

export const useAccountStore = defineStore('account', () => {
  const accounts = shallowRef<WalletAccount[]>([])
  const isLoading = ref(false)
  const syncingUtxo = ref(false)
  const syncProgress = ref(0)

  const sortedAccounts = computed(() => {
    return [...accounts.value].sort((a, b) => b.id - a.id)
  })

  function setAccounts(newAccounts: WalletAccount[]) {
    accounts.value = newAccounts
    triggerRef(accounts)
  }

  function addAccount(account: CreateAccount) {
    accounts.value.unshift({
      ...account,
      utxo: {}
    })
    triggerRef(accounts)
  }

  function getAccountBalance(account: WalletAccount) {
    const lovelace = Object.keys(account.utxo).reduce((acc, txHash) => {
      return acc.plus((account.utxo[txHash as TxHash].value as { lovelace: number }).lovelace)
    }, BigNumber(0))
    return lovelace.div(10 ** networkInfo.currency.decimals).toFormat()
  }

  async function getUtxoByBatch(batchAddresses: string[]) {
    try {
      const rs = await $fetch<AddressesUtxoRes>(`/api/accounts/utxos`, {
        method: 'GET',
        query: { addresses: batchAddresses }
      })

      const updatedAccounts = accounts.value.map(account => {
        if (batchAddresses.includes(account.pointerAddress)) {
          const utxos = rs.data.data
            .filter(utxo => utxo.address === account.pointerAddress)
            .map(parseOgmiosUtxoToObject)

          const mergedUtxo: UTxOObject = {}
          utxos.forEach(u => Object.assign(mergedUtxo, u))

          return {
            ...account,
            utxo: mergedUtxo
          }
        }
        return account
      })

      setAccounts(updatedAccounts)
    } catch (e) {
      console.error(e)
    }
  }

  async function syncUtxo() {
    try {
      syncingUtxo.value = true
      const walletAddresses = accounts.value.map(acc => acc.pointerAddress)
      for (let i = 0; i < walletAddresses.length; i += 3) {
        const batch = walletAddresses.slice(i, i + 3)
        await getUtxoByBatch(batch)
      }
    } catch (e) {
      console.error(e)
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
    getListAccount,
    getAccountBalance,
    syncingUtxo,
    syncUtxo,
    syncProgress
  }
})
