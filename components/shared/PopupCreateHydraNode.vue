<script lang="ts" setup>
  import type { FormInstance, FormRules } from 'element-plus'
  import { formatId } from '../../utils/format'
  import { networkInfo } from '~/constants/chain'
  import type { HydraNodeCreateResponse } from '~/interfaces/api/hydra-nodes/create.type'

  type FormCreate = {
    accountId: number | ''
  }

  const formData = reactive<FormCreate>({
    accountId: ''
  })

  const rules = ref<FormRules<FormCreate>>({
    accountId: [{ required: true, message: 'Please select an account', trigger: 'change' }]
  })

  const refForm = ref<FormInstance | null>(null)

  const emits = defineEmits<{
    success: []
  }>()

  const accountStore = useAccountStore()
  const { accounts, isLoading } = storeToRefs(accountStore)

  const closePopup = () => {
    usePopupState(Popup.POPUP_CREATE_HYDRA_NODE, 'close')
    formData.accountId = ''
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
      const rs = await $fetch<HydraNodeCreateResponse>('/api/nodes/create', {
        method: 'POST',
        body: {
          fromAccountId: formData.accountId,
          description: 'Created by Hexcore UI'
        }
      })
      if (rs) {
        emits('success')
        ElMessage.success('Create Hydra node successfully')
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
  <base-popup :name="Popup.POPUP_CREATE_HYDRA_NODE" show-footer append-body>
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
        <el-form-item label="Select Account" prop="accountId">
          <el-select v-model="formData.accountId" placeholder="Select account" class="w-full">
            <el-option
              v-for="account in accounts"
              :key="account.id"
              :value="account.id"
              :label="`#${account.id} - ${formatId(account.pointerAddress, 12, 12)} `"
            >
              <div class="flex items-center justify-between">
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
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="flex items-center justify-end p-4">
        <el-button @click="closePopup()">Cancel</el-button>
        <el-button type="primary" :disabled="!formData.accountId" :loading="isCreating" @click="handleCreate()">
          Create
        </el-button>
      </div>
    </template>
  </base-popup>
</template>

<style lang="scss" scoped></style>
