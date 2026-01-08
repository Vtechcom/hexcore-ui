<script lang="ts" setup>
  import type { FormInstance, FormRules } from 'element-plus'
  import type { CreateAccount, CreateAccountResponse } from '~/interfaces/api/accounts/create.type'
  import { AppWallet } from '@hydra-sdk/core'

  type FormCreate = {
    mnemonic: string
  }
  const formData = reactive<FormCreate>({
    mnemonic: ''
  })

  const rules = ref<FormRules<FormCreate>>({
    mnemonic: [{ required: true, message: 'Please input mnemonic', trigger: 'blur' }]
  })

  const refForm = ref<FormInstance | null>(null)

  const emits = defineEmits<{
    success: [value: CreateAccount]
  }>()

  const closePopup = () => {
    usePopupState(Popup.POPUP_CREATE_WALLET_ACCOUNT, 'close')
    formData.mnemonic = ''
  }

  const onClickGenerateMnemonic = () => {
    formData.mnemonic = AppWallet.brew(256)?.join(' ')
    validateForm()
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
    <template #title> Create Wallet Account </template>
    <div class="p-4">
      <el-form
        ref="refForm"
        style="max-width: 600px"
        :model="formData"
        :rules="rules"
        label-width="auto"
        label-position="top"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="Mnemonic" prop="mnemonic">
          <el-input v-model="formData.mnemonic" type="textarea" :autosize="{ minRows: 3 }" />
        </el-form-item>
        <div class="flex justify-end">
          <el-button type="primary" plain size="small" @click="onClickGenerateMnemonic()">Generate</el-button>
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

<style lang="scss" scoped></style>
