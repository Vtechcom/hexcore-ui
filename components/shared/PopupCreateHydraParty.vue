<script lang="ts" setup>
  import type { ApiResponse } from '~/interfaces/api/response-factory.type'
  import BasePopup from '~/components/base/BasePopup.vue'
  import { networkInfo } from '~/constants/chain'
  import type { FormRules } from 'element-plus'

  const emit = defineEmits<{
    (e: 'success'): void
  }>()

  const accountStore = useAccountStore()
  const { accounts, isLoading } = storeToRefs(accountStore)

  type FormCreate = {
    cardanoAccountIds: number[]
  }

  const isCreating = ref(false)

  const form = ref<FormCreate>({
    cardanoAccountIds: []
  })

  const rules = ref<FormRules<FormCreate>>({
    cardanoAccountIds: [{ required: true, message: 'Please select an account', trigger: 'change' }]
  })

  const handleSubmit = async () => {
    try {
      isCreating.value = true
      await $fetch<ApiResponse<any>>('/api/nodes/create-party', {
        method: 'POST',
        body: {
          cardanoAccountIds: form.value.cardanoAccountIds,
          nodes: form.value.cardanoAccountIds.length
        }
      })
      ElMessage.success('Hydra party created successfully')
      emit('success')
      closePopup()
    } catch (error: any) {
      ElMessage.error(error?.message)
    } finally {
      isCreating.value = false
    }
  }

  const closePopup = () => {
    usePopupState(Popup.POPUP_CREATE_HYDRA_PARTY, 'close')
    form.value.cardanoAccountIds = []
  }
</script>

<template>
  <base-popup :name="Popup.POPUP_CREATE_HYDRA_PARTY" show-footer append-body>
    <div class="p-4">
      <el-form
        ref="refForm"
        style="max-width: 600px"
        :model="form"
        :rules="rules"
        label-width="auto"
        label-position="top"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item :label="`Select Accounts (${form.cardanoAccountIds.length})`" prop="cardanoAccountIds">
          <el-select v-model="form.cardanoAccountIds" placeholder="Select accounts" class="w-full" multiple>
            <el-option
              v-for="account in accounts"
              :key="account.id"
              :value="account.id"
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
        </el-form-item>
        <div class="text-gray-7 text-sm">
          <div>
            <span class="font-bold">Note:</span>
            The accounts you select will be used to create the hydra party.
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div class="flex items-center justify-end p-4">
        <el-button @click="closePopup()">Cancel</el-button>
        <el-button type="primary" :disabled="!form.cardanoAccountIds" :loading="isCreating" @click="handleSubmit()">
          Create
        </el-button>
      </div>
    </template>
  </base-popup>
</template>
