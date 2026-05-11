// src/stores/buku.js 
import { defineStore } from 'pinia' 
import { ref, computed } from 'vue' 
  
export const useBukuStore = defineStore('buku', () => { 
  // ── STATE ──────────────────────────────────────────────── 
  const daftarBuku     = ref([])     // Array semua buku 
  const bukuTerpilih   = ref(null)   // Buku yang sedang dilihat detailnya 
  const isLoading      = ref(false)  // Status loading 
  const error          = ref(null)   // Pesan error 
  const filter         = ref({       // State filter aktif 
    search:   '', 
    kategori: '', 
    status:   'semua',  // 'semua' | 'tersedia' | 'dipinjam' 
  }) 
  const pagination = ref({ 
    page:     1, 
    perPage:  12, 
    total:    0, 
  }) 
  
  // ── GETTERS ────────────────────────────────────────────── 
  const bukuTersedia = computed(() => 
    daftarBuku.value.filter(b => b.tersedia) 
  ) 
  const bukuDipinjam = computed(() => 
    daftarBuku.value.filter(b => !b.tersedia) 
  ) 
  
  // Filter gabungan berdasarkan state filter 
  const bukuTerfilter = computed(() => { 
    let hasil = [...daftarBuku.value] 
  
    // Filter pencarian 
    if (filter.value.search) { 
      const q = filter.value.search.toLowerCase() 
      hasil = hasil.filter(b => 
        b.judul.toLowerCase().includes(q) || 
        b.penulis.toLowerCase().includes(q) || 
        b.isbn?.includes(q) 
      ) 
    } 
  
    // Filter kategori 
    if (filter.value.kategori) { 
      hasil = hasil.filter(b => b.kategori === filter.value.kategori) 
    } 
  
    // Filter status 
    if (filter.value.status === 'tersedia') { 
      hasil = hasil.filter(b => b.tersedia) 
    } else if (filter.value.status === 'dipinjam') { 
      hasil = hasil.filter(b => !b.tersedia) 
    } 
  
    return hasil 
  }) 
  
  const statistik = computed(() => ({ 
    total:    daftarBuku.value.length, 
    tersedia: bukuTersedia.value.length, 
    dipinjam: bukuDipinjam.value.length, 
    persen:   daftarBuku.value.length > 0 
      ? Math.round((bukuTersedia.value.length / daftarBuku.value.length) * 100) 
      : 0, 
  })) 
  
  const daftarKategori = computed(() => 
    [...new Set(daftarBuku.value.map(b => b.kategori))].sort() 
  ) 
  
  // ── ACTIONS ────────────────────────────────────────────── 
  async function ambilSemuaBuku() { 
    isLoading.value = true 
    error.value = null 
    try { 
      // Simulasi delay (Bab 5 akan diganti fetch ke API)
      await new Promise(r => setTimeout(r, 600)) 
      daftarBuku.value = dataBukuSementara 
      pagination.value.total = dataBukuSementara.length 
    } catch (e) { 
      error.value = e.message || 'Gagal memuat data buku' 
    } finally { 
      isLoading.value = false 
    } 
  } 
  
  async function ambilBukuById(id) { 
    isLoading.value = true 
    try { 
      await new Promise(r => setTimeout(r, 400)) 
      bukuTerpilih.value = daftarBuku.value.find(b => b.id === id) || null 
    } finally { 
      isLoading.value = false 
    } 
  } 
  
  function tambahBuku(dataBuku) { 
    const bukuBaru = { 
      id:        Date.now(), 
      tersedia:  true, 
      createdAt: new Date().toISOString(), 
      ...dataBuku, 
    } 
    daftarBuku.value.unshift(bukuBaru) 
    return bukuBaru 
  } 
  
  function updateBuku(id, dataUpdate) { 
    const idx = daftarBuku.value.findIndex(b => b.id === id) 
    if (idx !== -1) { 
      daftarBuku.value[idx] = { ...daftarBuku.value[idx], ...dataUpdate } 
    } 
  } 
  
  function hapusBuku(id) { 
    daftarBuku.value = daftarBuku.value.filter(b => b.id !== id) 
  } 
  
  function pinjamBuku(id) { 
    const buku = daftarBuku.value.find(b => b.id === id) 
    if (buku && buku.tersedia) { 
      buku.tersedia = false 
    } 
  } 
  
  function setFilter(filterBaru) { 
    Object.assign(filter.value, filterBaru) 
    pagination.value.page = 1 
  } 
  
  function resetFilter() { 
    filter.value = { search: '', kategori: '', status: 'semua' } 
    pagination.value.page = 1 
  } 
  
  return { 
    // State 
    daftarBuku, bukuTerpilih, isLoading, error, filter, pagination, 
    // Getters 
    bukuTersedia, bukuDipinjam, bukuTerfilter, statistik, daftarKategori, 
    // Actions 
    ambilSemuaBuku, ambilBukuById, tambahBuku, updateBuku, hapusBuku, 
    pinjamBuku, setFilter, resetFilter, 
  } 
}) 
  
// Data sementara (Mock Data)
const dataBukuSementara = [ 
  { id:1, judul:'Clean Code', penulis:'Robert C. Martin', kategori:'Teknologi', 
    isbn:'9780132350884', tahun:2008, penerbit:'Prentice Hall', tersedia:true, 
    sinopsis:'Panduan menulis kode yang bersih dan mudah dipelihara.' }, 
  { id:2, judul:'Vue.js 3 for Beginners', penulis:'Simone Cuomo', 
    kategori:'Teknologi', isbn:'9781803239859', tahun:2024, 
    penerbit:'Packt', tersedia:false, 
    sinopsis:'Belajar Vue.js 3 dari dasar hingga aplikasi nyata.' }, 
  { id:3, judul:'Learning Vue', penulis:'Maya Shavin', kategori:'Teknologi', 
    isbn:'9781492098843', tahun:2024, penerbit:"O'Reilly", tersedia:true, 
    sinopsis:'Konsep inti dan pola praktis untuk membangun UI yang scalable.' }, 
  { id:4, judul:'Bumi', penulis:'Tere Liye', kategori:'Fiksi', 
    isbn:'9786020316000', tahun:2014, penerbit:'Gramedia', tersedia:true, 
    sinopsis:'Petualangan epik di dunia paralel yang menakjubkan.' }, 
  { id:5, judul:'Atomic Habits', penulis:'James Clear', kategori:'Bisnis', 
    isbn:'9780735211292', tahun:2018, penerbit:'Avery', tersedia:false, 
    sinopsis:'Cara membangun kebiasaan baik dan menghilangkan kebiasaan buruk.' }, 
  { id:6, judul:'Sapiens', penulis:'Yuval Noah Harari', kategori:'Sejarah', 
    isbn:'9780062316110', tahun:2011, penerbit:'Harper', tersedia:true, 
    sinopsis:'Sejarah singkat umat manusia dari zaman prasejarah.' }, 
]
