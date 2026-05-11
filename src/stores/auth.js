// src/stores/auth.js 
import { defineStore } from 'pinia' 
import { ref, computed } from 'vue' 
  
export const useAuthStore = defineStore('auth', () => { 
  // ── STATE ──────────────────────────────────────────────── 
  // Membaca token dan data user dari localStorage agar sesi tetap aktif saat refresh halaman
  const token = ref(localStorage.getItem('siperpus_token') || null) 
  const user  = ref(JSON.parse(localStorage.getItem('siperpus_user') || 'null')) 
  
  // ── GETTERS (computed) ─────────────────────────────────── 
  // Cek apakah user sudah login berdasarkan keberadaan token
  const isLoggedIn    = computed(() => !!token.value) 
  // Cek role user untuk otorisasi akses halaman tertentu
  const isPustakawan  = computed(() => user.value?.role === 'pustakawan') 
  const isAnggota     = computed(() => user.value?.role === 'anggota') 
  const namaUser      = computed(() => user.value?.nama || 'Tamu') 
  
  // Menghasilkan inisial nama (contoh: Ahmad Pustakawan -> AP)
  const inisialUser   = computed(() => { 
    if (!user.value?.nama) return '?' 
    return user.value.nama 
      .split(' ') 
      .map(n => n[0]) 
      .join('') 
      .toUpperCase() 
      .slice(0, 2) 
  }) 
  
  // ── ACTIONS ────────────────────────────────────────────── 
  /**
   * Fungsi Login: Saat ini masih menggunakan simulasi data hardcode.
   * Nantinya akan dihubungkan ke backend Express.js.
   */
  async function login(email, password) { 
    const users = [ 
      { id:1, nama:'Ahmad Pustakawan', email:'admin@siperpus.id', 
        password:'admin123', role:'pustakawan' }, 
      { id:2, nama:'Siti Anggota', email:'siti@gmail.com', 
        password:'anggota123', role:'anggota' }, 
    ] 
  
    const found = users.find(u => u.email === email && u.password === password) 
    
    if (!found) { 
      throw new Error('Email atau password salah') 
    } 
  
    // Simulasi pembuatan token sederhana
    const fakeToken = `token-${found.id}-${Date.now()}` 
    const userData = { 
      id: found.id, 
      nama: found.nama, 
      email: found.email, 
      role: found.role 
    } 
  
    // Update state reaktif
    token.value = fakeToken 
    user.value  = userData 
  
    // Simpan ke localStorage agar data tidak hilang saat browser di-refresh
    localStorage.setItem('siperpus_token', fakeToken) 
    localStorage.setItem('siperpus_user', JSON.stringify(userData)) 
  
    return userData 
  } 
  
  /**
   * Fungsi Logout: Menghapus semua data sesi dari state dan localStorage.
   */
  function logout() { 
    token.value = null 
    user.value  = null 
    localStorage.removeItem('siperpus_token') 
    localStorage.removeItem('siperpus_user') 
  } 
  
  return { 
    // State 
    token, user, 
    // Getters 
    isLoggedIn, isPustakawan, isAnggota, namaUser, inisialUser, 
    // Actions 
    login, logout, 
  } 
})
