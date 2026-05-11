// src/router/guards.js
// Gunakan localStorage sebagai pengganti Pinia jika store belum siap
// Ini mencegah error jika useAuthStore() belum didefinisikan

export function setupGuards(router) { 
  
  // beforeEach: dijalankan sebelum SETIAP navigasi 
  router.beforeEach((to, from, next) => { 
    // 1. Update title tab browser otomatis
    // Menggunakan branding "SiPerpus Digital" sesuai identitas proyek Anda
    document.title = to.meta.title 
      ? `${to.meta.title} — SiPerpus Digital` 
      : 'SiPerpus Digital';
  
    // 2. Ambil data autentikasi dari localStorage (Safe Check)
    const isAuthenticated = JSON.parse(localStorage.getItem('perpus_auth_status')) || false;
    const userRole = localStorage.getItem('perpus_user_role') || 'tamu';
  
    // SKENARIO 1: Halaman butuh login (seperti Dashboard/Riwayat) tapi user belum login 
    if (to.meta.requiresAuth && !isAuthenticated) { 
      alert("Sesi berakhir atau Anda belum login. Silakan masuk terlebih dahulu.");
      next({ 
        name: 'login', 
        query: { redirect: to.fullPath } 
      });
      return;
    } 
  
    // SKENARIO 2: Halaman khusus tamu (seperti Login/Register), tapi user SUDAH login 
    if (to.meta.requiresGuest && isAuthenticated) { 
      next({ name: 'home' }); 
      return;
    } 
  
    // SKENARIO 3: Proteksi Role (Contoh: Hanya Pustakawan yang boleh akses manajemen buku)
    if (to.meta.role === 'pustakawan' && userRole !== 'pustakawan') { 
      alert("Anda tidak memiliki izin akses sebagai Pustakawan.");
      next({ name: 'home' }); 
      return;
    } 
  
    // Lanjutkan navigasi jika semua syarat terpenuhi
    next();
  }); 
  
  // afterEach: dijalankan setelah navigasi sukses
  router.afterEach((to) => { 
    // Logging untuk debugging (bisa dilihat di Console F12)
    console.log(`[SiPerpus Router] Berhasil pindah ke: ${to.fullPath}`);
  }); 
}
