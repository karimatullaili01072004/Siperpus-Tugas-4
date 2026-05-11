<!-- src/layouts/DashboardLayout.vue -->
<template>
  <div class="flex h-screen overflow-hidden">

    <!-- Sidebar -->
    <aside class="w-64 bg-card border-r flex flex-col">

      <!-- Header -->
      <div class="p-4 border-b">
        <p class="font-bold text-lg text-primary">📚 SiPerpus</p>
        <p class="text-xs text-muted-foreground">Panel Pustakawan</p>
      </div>

      <!-- Menu -->
      <nav class="flex-1 p-3 space-y-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="{ name: item.name }"
          class="flex items-center gap-3 px-3 py-2 rounded-md text-sm
                 text-muted-foreground hover:bg-accent hover:text-accent-foreground
                 transition-colors"
          active-class="bg-primary text-primary-foreground font-medium"
        >
          <component :is="item.icon" class="h-4 w-4" />
          {{ item.label }}
        </RouterLink>
      </nav>

    </aside>

    <!-- Content -->
    <main class="flex-1 overflow-auto bg-background">
      <div class="p-6">

        <!-- Title -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold">
            {{ route.meta.title || 'Dashboard' }}
          </h1>
        </div>

        <!-- Child Route -->
        <RouterView />

      </div>
    </main>

  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

// Icons
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BookMarked,
  BarChart3
} from 'lucide-vue-next'

// Route aktif
const route = useRoute()

// Menu sidebar
const navItems = [
  { name: 'dashboard',      label: 'Dashboard',      icon: LayoutDashboard },
  { name: 'kelola-buku',    label: 'Kelola Buku',    icon: BookOpen },
  { name: 'kelola-anggota', label: 'Kelola Anggota', icon: Users },
  { name: 'peminjaman',     label: 'Peminjaman',     icon: BookMarked },
  { name: 'laporan',        label: 'Laporan',        icon: BarChart3 },
]
</script>
