<script lang="ts" setup>
  import type { ApiResponse } from '~/interfaces/api/response-factory.type'
  import BasePopup from '~/components/base/BasePopup.vue'
  import { networkInfo } from '~/constants/chain'
  import type { FormInstance, FormRules } from 'element-plus'
  import { mnemonicToCliKey } from '~/utils/keyHydra'
  import { KeysUtils } from '@hydra-sdk/core'
  import axios from 'axios'

  const emit = defineEmits<{
    (e: 'success'): void
  }>()

  type FormData = {
    // Step 1
    accountMnemonic: string[]
    description: string
    blockfrostProjectId: string
    // Step 2
    contestationPeriod: number
    depositPeriod: number
    persistenceRotateAfter: number
    hydraVersion: string
    protocolParams: {
      maxTxSize: number
      maxBlockBodySize: number
    }
  }

  const accountStore = useAccountStore()
  const { accounts, isLoading } = storeToRefs(accountStore)
  const currentStep = ref(0)

  const defaultFormData: FormData = {
    accountMnemonic: [],
    description: '',
    blockfrostProjectId: '',
    contestationPeriod: 120,
    depositPeriod: 720,
    persistenceRotateAfter: 15000,
    hydraVersion: '1.1.0',
    protocolParams: {
      maxTxSize: 16384,
      maxBlockBodySize: 65536
    }
  }

  const hydraVersionOptions = ['1.1.0', '1.0.0']

  const isCreating = ref(false)
  const isValidating = ref(false)
  const editMode = ref<'field' | 'json'>('field')
  const jsonConfig = ref('')
  const jsonError = ref('')

  const refForm = ref<FormInstance>()
  const formData = ref<FormData>({ ...defaultFormData, protocolParams: { ...defaultFormData.protocolParams } })

  const rules = ref<FormRules<FormData>>({
    accountMnemonic: [{ required: true, message: 'Please select at least one account', trigger: 'change' }],
    description: [{ required: true, message: 'Please enter a description', trigger: 'blur' }],
    contestationPeriod: [{ required: true, message: 'Please enter a contestation period', trigger: 'blur' }],
    depositPeriod: [{ required: true, message: 'Please enter a deposit period', trigger: 'blur' }],
    persistenceRotateAfter: [
      { required: true, message: 'Please enter a persistence rotate after value', trigger: 'blur' }
    ],
    hydraVersion: [{ required: true, message: 'Please select a Hydra version', trigger: 'change' }],
    blockfrostProjectId: [{ required: true, message: 'Please enter a Blockfrost Project ID', trigger: 'blur' }],
    'protocolParams.maxTxSize': [{ required: true, message: 'Please enter a max transaction size', trigger: 'blur' }],
    'protocolParams.maxBlockBodySize': [
      { required: true, message: 'Please enter a max block body size', trigger: 'blur' }
    ]
  })

  // Sync field editor to JSON (only step 2 config fields)
  const syncToJson = () => {
    const configData = {
      contestationPeriod: formData.value.contestationPeriod,
      depositPeriod: formData.value.depositPeriod,
      persistenceRotateAfter: formData.value.persistenceRotateAfter,
      hydraVersion: formData.value.hydraVersion,
      protocolParams: formData.value.protocolParams
    }
    jsonConfig.value = JSON.stringify(configData, null, 2)
    jsonError.value = ''
  }

  // Sync JSON to field editor
  const syncFromJson = () => {
    try {
      const parsed = JSON.parse(jsonConfig.value)
      formData.value.contestationPeriod = parsed.contestationPeriod ?? defaultFormData.contestationPeriod
      formData.value.depositPeriod = parsed.depositPeriod ?? defaultFormData.depositPeriod
      formData.value.persistenceRotateAfter = parsed.persistenceRotateAfter ?? defaultFormData.persistenceRotateAfter
      formData.value.hydraVersion = parsed.hydraVersion ?? defaultFormData.hydraVersion
      formData.value.protocolParams = {
        maxTxSize: parsed.protocolParams?.maxTxSize ?? defaultFormData.protocolParams.maxTxSize,
        maxBlockBodySize: parsed.protocolParams?.maxBlockBodySize ?? defaultFormData.protocolParams.maxBlockBodySize
      }
      jsonError.value = ''
      return true
    } catch (e: any) {
      jsonError.value = `Invalid JSON: ${e.message}`
      return false
    }
  }

  // Watch edit mode changes
  watch(editMode, newMode => {
    if (newMode === 'json') {
      syncToJson()
    } else {
      syncFromJson()
    }
  })

  // Validate JSON on input
  watch(jsonConfig, () => {
    if (editMode.value === 'json') {
      try {
        JSON.parse(jsonConfig.value)
        jsonError.value = ''
      } catch (e: any) {
        jsonError.value = `Invalid JSON: ${e.message}`
      }
    }
  })

  const validateStep1 = async () => {
    if (currentStep.value === 0) {
      try {
        await refForm.value?.validateField(['description', 'accountMnemonic', 'blockfrostProjectId'])
        // Validate Blockfrost API key
        const isApiKeyValid = await validateBlockfrostApiKey(formData.value.blockfrostProjectId)
        if (!isApiKeyValid) {
          ElMessage.error('Invalid Blockfrost Project ID')
          return
        }
        currentStep.value = 1
        syncToJson()
      } catch {
        console.error('Step 1 validation failed')
      }
    }
  }

  const validateStep2 = async () => {
    if (currentStep.value === 1) {
      if (editMode.value === 'json') {
        if (syncFromJson()) {
          return true
        } else {
          ElMessage.error('Please fix JSON errors before proceeding')
          return false
        }
      } else {
        try {
          await refForm.value?.validateField([
            'contestationPeriod',
            'depositPeriod',
            'persistenceRotateAfter',
            'hydraVersion'
          ])
          return true
        } catch {
          console.error('Step 2 validation failed')
          return false
        }
      }
    }
    return false
  }

  const validateBlockfrostApiKey = async (key: string, network: string = 'preprod'): Promise<boolean> => {
    try {
      isValidating.value = true
      await axios.get(`https://cardano-${network}.blockfrost.io/api/v0/metrics`, {
        headers: {
          project_id: key
        }
      })
      return true
    } catch {
      console.error('Blockfrost API key validation failed')
      return false
    } finally {
      isValidating.value = false
    }
  }

  const handleBack = () => {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }

  const generateHeadKeys = (accountMnemonics: string[]) => {
    return accountMnemonics.map(mnemonic => {
      const cardanoKeys = mnemonicToCliKey(mnemonic.split(' '))
      const hydraKeys = KeysUtils.hydraCliKeygen()
      return {
        hydraHeadVkey: hydraKeys.vk.cborHex,
        hydraHeadSkey: hydraKeys.sk.cborHex,
        fundVkey: cardanoKeys.vk,
        fundSkey: cardanoKeys.sk
      }
    })
  }

  const handleSubmit = async () => {
    // Validate step 2
    const isValid = await validateStep2()
    if (!isValid) {
      return
    }

    try {
      isCreating.value = true

      const hydraHeadKeys = generateHeadKeys(formData.value.accountMnemonic)

      const payload = {
        description: formData.value.description,
        hydraHeadKeys,
        contestationPeriod: formData.value.contestationPeriod,
        depositPeriod: formData.value.depositPeriod,
        persistenceRotateAfter: formData.value.persistenceRotateAfter,
        blockfrostProjectId: formData.value.blockfrostProjectId,
        protocolParameters: {
          maxTxSize: formData.value.protocolParams.maxTxSize,
          maxBlockBodySize: formData.value.protocolParams.maxBlockBodySize
        }
      }

      await $fetch<ApiResponse<any>>('/api/heads/create', {
        method: 'POST',
        body: payload
      })
      ElMessage.success('Hydra head created successfully')
      emit('success')
      closePopup()
    } catch (error: any) {
      ElMessage.error(error?.message)
    } finally {
      isCreating.value = false
    }
  }

  const resetForm = () => {
    formData.value = { ...defaultFormData, protocolParams: { ...defaultFormData.protocolParams } }
    jsonConfig.value = ''
    jsonError.value = ''
    currentStep.value = 0
    editMode.value = 'field'
    refForm.value?.resetFields()
  }

  const closePopup = () => {
    usePopupState(Popup.POPUP_CREATE_HYDRA_HEAD, 'close')
    resetForm()
  }
</script>

<template>
  <base-popup
    show-footer
    :name="Popup.POPUP_CREATE_HYDRA_HEAD"
    width="700px"
    append-body
    destroy-on-close
    align-center
    @close="resetForm"
  >
    <template #title> Create New Head </template>

    <div class="p-4 md:p-6">
      <!-- Steps indicator -->
      <el-steps finish-status="success" :active="currentStep" align-center class="mb-6 px-10">
        <el-step title="Select Accounts" description="Select accounts for your head" />
        <el-step title="Configure Head" description="Set up head parameters" />
      </el-steps>

      <!-- Single Form -->
      <el-form ref="refForm" :model="formData" :rules="rules" label-position="top" class="w-full">
        <!-- Step 1: Select Accounts -->
        <div v-show="currentStep === 0">
          <el-form-item :label="`Select Accounts (${formData.accountMnemonic.length})`" prop="accountMnemonic">
            <el-select v-model="formData.accountMnemonic" placeholder="Select accounts" class="w-full" multiple>
              <el-option
                v-for="account in accounts"
                :key="account.id"
                :value="account.mnemonic"
                :label="`#${account.id} - ${formatId(account.pointerAddress, 12, 12)} `"
              >
                <div class="flex items-center justify-between pr-2">
                  <div class="flex items-center">
                    <div>{{ `#${account.id}` }}</div>
                    <div class="text-gray-7 ml-4">{{ formatId(account.pointerAddress, 16, 16) }}</div>
                  </div>
                  <div class="text-gray-7">
                    {{ accountStore.getAccountBalance(account) }} {{ networkInfo.currency.symbol }}
                  </div>
                </div>
              </el-option>
              <template #empty>
                <div class="flex items-center justify-center">
                  <el-empty v-if="!isLoading" description="No accounts found" />
                  <div v-else v-loading="true" class="h-40 w-full"></div>
                </div>
              </template>
            </el-select>
            <div class="text-gray-7 mt-2 text-sm">
              <span class="font-bold">Note:</span>
              The accounts you select will be used to create the hydra head.
            </div>
          </el-form-item>

          <el-form-item label="Blockfrost Project ID" prop="blockfrostProjectId">
            <el-input
              v-model="formData.blockfrostProjectId"
              placeholder="Enter your Blockfrost Project ID"
              class="w-full"
            />
            <div class="text-gray-7 mt-2 text-sm">
              <span class="font-bold">Note:</span>
              You can create an API key at
              <nuxt-link href="https://blockfrost.io/" target="_blank" class="!text-blue-5 !underline"
                >Blockfrost.io
              </nuxt-link>
            </div>
          </el-form-item>

          <el-form-item label="Description" prop="description">
            <el-input
              v-model="formData.description"
              placeholder="Enter a description for your Hydra Head"
              class="w-full"
            />
          </el-form-item>
        </div>

        <!-- Step 2: Configure Head -->
        <div v-show="currentStep === 1">
          <!-- Edit mode toggle -->
          <el-radio-group v-model="editMode" class="mb-2">
            <el-radio value="field">Field editor</el-radio>
            <el-radio value="json">Edit JSON</el-radio>
          </el-radio-group>

          <!-- Field Editor Mode -->
          <div v-show="editMode === 'field'" class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <el-form-item label="Hydra version" prop="hydraVersion">
              <el-select v-model="formData.hydraVersion" placeholder="Select version" class="w-full">
                <el-option v-for="version in hydraVersionOptions" :key="version" :label="version" :value="version" />
              </el-select>
            </el-form-item>

            <el-form-item label="Persistence rotate after" prop="persistenceRotateAfter">
              <el-input v-model.number="formData.persistenceRotateAfter" type="number" :min="0" class="w-full" />
            </el-form-item>

            <el-form-item label="Contestation period" prop="contestationPeriod">
              <el-input v-model.number="formData.contestationPeriod" type="number" :min="0" class="w-full" />
            </el-form-item>

            <el-form-item label="Deposit period" prop="depositPeriod">
              <el-input v-model.number="formData.depositPeriod" type="number" :min="0" class="w-full" />
            </el-form-item>

            <el-form-item label="Protocol max Tx size" prop="protocolParams.maxTxSize">
              <el-input v-model.number="formData.protocolParams.maxTxSize" type="number" :min="0" class="w-full" />
            </el-form-item>

            <el-form-item label="Protocol max block body size" prop="protocolParams.maxBlockBodySize">
              <el-input
                v-model.number="formData.protocolParams.maxBlockBodySize"
                type="number"
                :min="0"
                class="w-full"
              />
            </el-form-item>
          </div>

          <!-- JSON Editor Mode -->
          <div v-show="editMode === 'json'">
            <el-form-item label="Configuration (JSON)">
              <el-input
                v-model="jsonConfig"
                type="textarea"
                :rows="10"
                placeholder="Enter JSON configuration"
                class="font-mono"
              />
            </el-form-item>
            <div v-if="jsonError" class="text-red-5 mb-2 text-sm">
              {{ jsonError }}
            </div>
            <div class="text-gray-6 text-xs">
              JSON will be parsed automatically; invalid JSON will prevent proceeding.
            </div>
          </div>
        </div>
      </el-form>
    </div>

    <!-- Footer with navigation buttons -->
    <template #footer>
      <div class="flex items-center justify-end p-4">
        <el-button v-if="currentStep === 0" @click="closePopup">Cancel</el-button>
        <el-button v-if="currentStep > 0" @click="handleBack">Back</el-button>
        <el-button v-if="currentStep < 1" :loading="isValidating" type="primary" @click="validateStep1">Next</el-button>
        <el-button
          v-if="currentStep === 1"
          type="primary"
          :loading="isCreating"
          :disabled="editMode === 'json' && !!jsonError"
          @click="handleSubmit"
        >
          Create
        </el-button>
      </div>
    </template>
  </base-popup>
</template>

<style lang="scss" scoped>
  :deep(.el-steps) {
    .el-step__title {
      font-size: 14px;
    }
    .el-step__description {
      font-size: 12px;
    }
  }

  :deep(.el-textarea__inner) {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 13px;
    line-height: 1.5;
  }
</style>
