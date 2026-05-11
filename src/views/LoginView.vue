<!-- src/views/LoginView.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/30 p-4">
    <Card class="w-full max-w-md">
      
      <CardHeader class="text-center">
        <div class="flex justify-center mb-3">
          <BookOpenCheck class="h-10 w-10 text-primary" />
        </div>
        <CardTitle class="text-2xl">Masuk ke SiPerpus</CardTitle>
        <CardDescription>Masukkan email dan password Anda</CardDescription>
      </CardHeader>

      <CardContent>
        <!-- Error Alert -->
        <div
          v-if="errorMsg"
          class="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded-md border border-red-300 flex items-center gap-2"
        >
          <AlertCircle class="h-4 w-4" />
          {{ errorMsg }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          
          <!-- Email -->
          <div>
            <label class="text-sm font-medium">Email</label>
            <Input
              v-model="form.email"
              type="email"
              placeholder="admin@siperpus.id"
              :disabled="isLoading"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="text-sm font-medium">Password</label>
            <div class="relative">
              <Input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Masukkan password"
                :disabled="isLoading"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                @click="showPassword = !showPassword"
              >
                <Eye v-if="!showPassword" class="h-4 w-4" />
                <EyeOff v-else class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Submit -->
          <Button type="submit" class="w-full" :disabled="isLoading">
            <LoaderCircle
              v-if="isLoading"
              class="mr-2 h-4 w-4 animate-spin"
            />
            {{ isLoading ? 'Memverifikasi...' : 'Masuk' }}
          </Button>
        </form>

        <!-- Demo Account -->
        <div class="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
          <p class="font-medium">Akun Demo:</p>
          <p>Admin: admin@siperpus.id / admin123</p>
          <p>User: user@gmail.com / user123</p>
        </div>
      </CardContent>

    </Card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// Icons
import {
  BookOpenCheck,
  Eye,
  EyeOff,
  LoaderCircle,
  AlertCircle
} from 'lucide-vue-next'

// Router & Store
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// State
const form = reactive({
  email: '',
  password: ''
})

const isLoading = ref(false)
const errorMsg = ref('')
const showPassword = ref(false)

// Function Login
async function handleLogin() {
  if (!form.email || !form.password) {
    errorMsg.value = 'Email dan password harus diisi'
    return
  }

  isLoading.value = true
  errorMsg.value = ''

  try {
    await authStore.login(form.email, form.password)

    const redirectTo = route.query.redirect || '/'
    router.push(redirectTo)

  } catch (err) {
    errorMsg.value = err.message || 'Login gagal'
  } finally {
    isLoading.value = false
  }
}
</script>
