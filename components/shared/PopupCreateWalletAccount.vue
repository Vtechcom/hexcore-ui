<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import type { CreateAccount, CreateAccountResponse } from '~/interfaces/api/accounts/create.type'
import { AppWallet, EmbeddedWallet } from '@hydra-sdk/core'
import { networkInfo } from '~/constants/chain'

import { generateMnemonic } from '~/utils/cardano'

type FormCreate = {
  mnemonic: string
}
const formData = reactive<FormCreate>({
  mnemonic: ''
})

const rules = ref<FormRules<FormCreate>>({
  mnemonic: [{ required: true, message: 'Please input mnemonic', trigger: 'blur' }]
})
const generatedInfo = reactive({
  rootKey: '',
  baseAddr: ''
})
const refForm = ref<FormInstance | null>(null)

const emits = defineEmits<{
  success: [value: CreateAccount]
}>()

const closePopup = () => {
  usePopupState(Popup.POPUP_CREATE_WALLET_ACCOUNT, 'close')
  formData.mnemonic = ''
  generatedInfo.rootKey = ''
  generatedInfo.baseAddr = ''
}

const onClickGenerateMnemonic = () => {
  try {
    const words = AppWallet.brew()

    formData.mnemonic = words.join(' ')

    const rootKeyHex = EmbeddedWallet.mnemonicToPrivateKeyHex(words)
    generatedInfo.rootKey = rootKeyHex

    const tempWallet = new AppWallet({
      networkId: networkInfo.networkId,
      key: {
        type: 'mnemonic',
        words: words
      }
    })

    generatedInfo.baseAddr = tempWallet.getAccount().baseAddressBech32

    validateForm()
  } catch (e) {
    console.error('Error generating wallet info:', e)
  }
}
const copyToClipboard = (text: string) => {
  if (!text) return
  navigator.clipboard.writeText(text)
  ElMessage.success('Copied to clipboard')
}

async function validateForm() {
  return new Promise(resolve => {
    if (!refForm.value) return
    refForm.value.validate(valid => {
      if (valid) {
        resolve(true)
      }
    })
  })
}

const isCreating = ref(false)
const handleCreate = async () => {
  await validateForm()
  try {
    isCreating.value = true
    const rs = await $fetch<CreateAccountResponse>('/api/accounts/create', {
      method: 'POST',
      body: { mnemonic: formData.mnemonic }
    })
    if (rs && rs.data) {
      emits('success', rs.data)
      ElMessage.success('Create account successfully')
      closePopup()
    }
  } catch (error: any) {
    ElMessage.error(error?.message)
  } finally {
    isCreating.value = false
  }
}
</script>

<template>
  <base-popup :name="Popup.POPUP_CREATE_WALLET_ACCOUNT" show-footer append-body>
    <div class="p-4">
      <el-form ref="refForm" style="max-width: 600px" :model="formData" :rules="rules" label-width="auto"
        label-position="top" class="demo-ruleForm" status-icon>
        <el-form-item label="Mnemonic" prop="mnemonic">
          <el-input v-model="formData.mnemonic" type="textarea" :autosize="{ minRows: 3 }" />
        </el-form-item>

        <div class="flex justify-end">
          <el-button type="primary" plain size="small" @click="onClickGenerateMnemonic">Generate</el-button>
        </div>

        <div v-if="generatedInfo.rootKey" class="mt-4 text-xs font-mono break-all leading-5">
          <div class="mb-2">
            <span class="font-bold text-purple-400">Root Key: </span>
            <span class="text-gray-500 mr-1">{{ generatedInfo.rootKey }}</span>
            <Icon name="mdi:content-copy"
              class="inline-block cursor-pointer text-gray-400 hover:text-purple-400 align-middle" size="14"
              @click="copyToClipboard(generatedInfo.rootKey)" />
          </div>

          <div>
            <span class="font-bold text-purple-400">Base Addr: </span>
            <span class="text-gray-500 mr-1">{{ generatedInfo.baseAddr }}</span>
            <Icon name="mdi:content-copy"
              class="inline-block cursor-pointer text-gray-400 hover:text-purple-400 align-middle" size="14"
              @click="copyToClipboard(generatedInfo.baseAddr)" />
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div class="flex items-center justify-end p-4">
        <el-button @click="closePopup()">Cancel</el-button>
        <el-button type="primary" :disabled="!formData.mnemonic" :loading="isCreating" @click="handleCreate()">
          Create
        </el-button>
      </div>
    </template>
  </base-popup>
</template>

<style lang="scss" scoped>
.text-purple-400 {
  color: #c084fc;
}

.text-gray-500 {
  color: #6b7280;
}
</style>
