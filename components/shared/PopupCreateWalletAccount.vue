<script lang="ts" setup>
  import { generateMnemonic } from '~/utils/cardano'

  const formData = reactive({
    mnemonic: ''
  })

  const rules = {
    mnemonic: [{ required: true, message: 'Please input mnemonic', trigger: 'blur' }]
  }

  const refForm = ref(null)

  const closePopup = () => {
    usePopupState(Popup.POPUP_CREATE_WALLET_ACCOUNT, 'close')
  }

  const onClickGenerateMnemonic = () => {
    formData.mnemonic = generateMnemonic(24)
  }
</script>

<template>
  <base-popup :name="Popup.POPUP_CREATE_WALLET_ACCOUNT" show-footer>
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
        <el-button type="primary">Create</el-button>
      </div>
    </template>
  </base-popup>
</template>

<style lang="scss" scoped></style>
