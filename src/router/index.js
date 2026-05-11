import { createRouter, createWebHistory } from 'vue-router'
// Kita tidak mengimport dari folder views karena semua kodingan ada di App.vue
// Ini untuk menghindari error "Failed to resolve import" seperti di gambar Anda

const routes = [
  {
    path: '/',
    name: 'home',
    // Menggunakan component kosong karena logika tampilan sudah diatur di App.vue pakai v-if
    component: { render: () => null }, 
    meta: { title: 'Beranda - SiPerpus' }
  },
  {
    path: '/katalog',
    name: 'katalog',
    component: { render: () => null },
    meta: { title: 'Katalog Buku - SiPerpus' }
  },
  {
    path: '/login',
    name: 'login',
    component: { render: () => null },
    meta: { title: 'Login - SiPerpus Digital' }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: { render: () => null },
    meta: { title: 'Dashboard - SiPerpus', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Fix Error & Page Title
router.beforeEach((to, from, next) => {
  // Update judul tab browser otomatis
  document.title = to.meta.title || 'SiPerpus Digital'
  
  // Ambil status login dari localStorage
  const isAuthenticated = JSON.parse(localStorage.getItem('perpus_auth_status')) || false
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
