<script lang="ts" setup>
  import type { FormInstance, FormRules } from 'element-plus'

  definePageMeta({
    layout: 'auth'
  })

  const formData = ref({
    username: '',
    password: ''
  })

  const formRef = ref<FormInstance>()
  const isLoading = ref(false)
  const authStore = useAuthStore()
  const accountStore = useAccountStore()

  const rules = reactive<FormRules>({
    username: [
      { required: true, message: 'Please input username', trigger: 'blur' },
      { min: 3, max: 50, message: 'Length should be 3 to 50 characters', trigger: 'blur' }
    ],
    password: [
      { required: true, message: 'Please input password', trigger: 'blur' },
      { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
    ]
  })

  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async valid => {
      if (!valid) return

      try {
        isLoading.value = true
        const response = await $fetch<{ data: { accessToken: string } }>('/api/auth/login', {
          method: 'POST',
          body: formData.value
        })

        // Store token
        await authStore.signIn(response.data.accessToken)
        await accountStore.getListAccount()
        // Redirect to dashboard
        navigateTo('/dashboard')
      } catch (error: any) {
        ElMessage.error(error?.data?.message || 'Login failed')
      } finally {
        isLoading.value = false
      }
    })
  }
</script>

<template>
  <div class="flex items-center justify-center">
    <el-card class="w-[400px] max-[450px]:w-[90svw]">
      <template #header>
        <div class="text-center">
          <h1 class="text-center text-2xl font-bold">Welcome back</h1>
          <p class="subtitle mt-1 text-sm text-gray-500">Sign in to access your dashboard</p>
        </div>
      </template>
      <el-form
        ref="formRef"
        class="space-y-5 px-2 py-4"
        :model="formData"
        :rules="rules"
        @submit.prevent="handleSubmit"
      >
        <el-form-item prop="username">
          <el-input v-model="formData.username" placeholder="Username" size="large" clearable>
            <template #prefix>
              <icon name="ic:outline-person-outline" />
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="Password"
            show-password
            size="large"
            clearable
          >
            <template #prefix>
              <icon name="ic:round-lock" />
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit" class="w-full" :loading="isLoading"> Sign in </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
  .el-card {
    border-radius: 8px;
  }
</style>
