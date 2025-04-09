<script lang="ts" setup>
  const formData = ref({
    username: '',
    password: ''
  })

  const isLoading = ref(false)
  const authStore = useAuthStore()
  const accountStore = useAccountStore()

  const handleSubmit = async () => {
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
  }
</script>

<template>
  <div class="flex min-h-full items-center justify-center">
    <el-card class="w-96">
      <template #header>
        <h1 class="text-center text-2xl font-bold">Login</h1>
      </template>

      <el-form :model="formData" @submit.prevent="handleSubmit">
        <el-form-item>
          <el-input v-model="formData.username" placeholder="Username">
            <template #prefix>
              <icon name="ic:outline-person-outline" />
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-input v-model="formData.password" type="password" placeholder="Password" show-password>
            <template #prefix>
              <icon name="ic:round-lock" />
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit" class="w-full" :loading="isLoading"> Login </el-button>
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
