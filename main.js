// main.js - FIXED VERSION
console.log('🚀 Loading main.js...');

// ============================================
// 1. CEK DATA
// ============================================
function checkData() {
  if (typeof DATA === 'undefined' || !DATA) {
    console.error('❌ DATA not found! Using empty data');
    window.DATA = {
      galeri: [],
      struktur: [],
      jadwal: [],
      tugas: [],
      prestasi: []
    };
    return false;
  }
  console.log('✅ DATA loaded successfully:', DATA);
  return true;
}

// ============================================
// 2. NAVIGATION
// ============================================
window.toggleMenu = function() {
  const menu = document.getElementById('navMenu');
  if (menu) menu.classList.toggle('show');
};

window.scrollToSection = function(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    const menu = document.getElementById('navMenu');
    if (menu) menu.classList.remove('show');
  }
};

// ============================================
// 3. RENDER STRUKTUR
// ============================================
function renderStruktur() {
  const container = document.getElementById('strukturGrid');
  if (!container) return;
  
  if (!DATA.struktur || DATA.struktur.length === 0) {
    container.innerHTML = '<p style="text-align:center;padding:20px;color:#64748b">Data struktur belum tersedia</p>';
    return;
  }
  
  console.log(`📊 Rendering ${DATA.struktur.length} struktur items`);
  
  let html = '';
  const showCount = DATA.struktur.length; // Tampilkan semua anggota
  
  DATA.struktur
    .sort((a, b) => (a.urutan || 999) - (b.urutan || 999))
    .slice(0, showCount)
    .forEach(anggota => {
      const initial = anggota.initial || (anggota.nama ? anggota.nama.charAt(0).toUpperCase() : '?');
      
      html += `
        <div class="anggota-card">
          <div class="anggota-foto">
            ${anggota.foto && anggota.foto !== 'null' ? 
              `<img src="${anggota.foto}" alt="${anggota.nama}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
               <div class="initial-placeholder" style="display:none;">${initial}</div>` : 
              `<div class="initial-placeholder">${initial}</div>`
            }
          </div>
          <div class="anggota-info">
            <h4>${anggota.nama || 'Anggota'}</h4>
            <p>${anggota.jabatan || 'Kelas'}</p>
          </div>
        </div>
      `;
    });
  
  container.innerHTML = html;
  console.log('✅ Struktur rendered');
}

// ============================================
// 4. RENDER FOTO TERBARU
// ============================================
function renderFotoTerbaru() {
  const container = document.getElementById('fotoTerbaruGrid');
  if (!container) return;
  
  if (!DATA.galeri || DATA.galeri.length === 0) {
    container.innerHTML = '<p style="text-align:center;padding:20px;color:#64748b">Foto akan segera diupload</p>';
    return;
  }
  
  // Filter foto terbaru
  const fotoTerbaru = DATA.galeri
    .filter(item => item.category === 'foto-terbaru' && item.type === 'image')
    .slice(0, 4);
  
  if (fotoTerbaru.length === 0) {
    container.innerHTML = '<p style="text-align:center;padding:20px;color:#64748b">Belum ada foto terbaru</p>';
    return;
  }
  
  console.log(`📸 Rendering ${fotoTerbaru.length} foto terbaru`);
  
  let html = '';
  fotoTerbaru.forEach(foto => {
    html += `
      <div class="photo-card">
        <div class="photo-img">
          <img src="${foto.url}" alt="${foto.title || 'Foto'}" loading="lazy" 
               onerror="this.parentElement.innerHTML='<div style=padding:20px;text-align:center;color:#64748b>❌ Gambar error</div>'">
        </div>
        <div class="photo-info">
          <p>${foto.title || 'Foto Kelas'}</p>
          ${foto.caption ? `<small>${foto.caption}</small>` : ''}
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  console.log('✅ Foto terbaru rendered');
}

// ============================================
// 5. RENDER KENANGAN
// ============================================
function renderKenangan() {
  const container = document.getElementById('kenanganPreview');
  if (!container) return;
  
  if (!DATA.galeri || DATA.galeri.length === 0) {
    container.innerHTML = '<p style="text-align:center;padding:20px;color:#64748b">Belum ada kenangan</p>';
    return;
  }
  
  // Filter kenangan
  const kenangan = DATA.galeri
    .filter(item => item.category === 'kenangan')
    .slice(0, 3);
  
  if (kenangan.length === 0) {
    container.innerHTML = '<p style="text-align:center;padding:20px;color:#64748b">Belum ada kenangan</p>';
    return;
  }
  
  console.log(`🎥 Rendering ${kenangan.length} kenangan`);
  
  let html = '';
  kenangan.forEach(item => {
    if (item.type === 'video') {
      html += `
        <div class="kenangan-item video">
          <div class="kenangan-media">
            <video src="${item.url}" controls muted preload="metadata"></video>
            <div class="video-badge">🎥</div>
          </div>
          <div class="kenangan-info">
            <h4>${item.title || 'Video Kenangan'}</h4>
            ${item.caption ? `<p>${item.caption}</p>` : ''}
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="kenangan-item">
          <div class="kenangan-media">
            <img src="${item.url}" alt="${item.title || 'Kenangan'}" loading="lazy"
                 onerror="this.parentElement.innerHTML='<div style=padding:20px;text-align:center;color:#64748b>❌ Gambar error</div>'">
          </div>
          <div class="kenangan-info">
            <h4>${item.title || 'Foto Kenangan'}</h4>
            ${item.caption ? `<p>${item.caption}</p>` : ''}
          </div>
        </div>
      `;
    }
  });
  
  container.innerHTML = html;
  console.log('✅ Kenangan rendered');
}

// ============================================
// 6. RENDER ALL
// ============================================
function renderAllContent() {
  console.log('🎨 Rendering all content...');
  try {
    renderStruktur();
    renderFotoTerbaru();
    renderKenangan();
    
    // Show all sections
    document.querySelectorAll('section').forEach(section => {
      section.style.opacity = '1';
      section.style.visibility = 'visible';
    });
  } catch (error) {
    console.error('❌ Error rendering content:', error);
  }
}

// ============================================
// 7. INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM Content Loaded');
  
  // Tunggu 200ms untuk Data.js dimuat
  setTimeout(() => {
    const dataExists = checkData();
    
    if (dataExists) {
      renderAllContent();
    } else {
      console.warn('⚠️ Rendering with empty data');
      // Tampilkan pesan "data kosong" di semua section
      const sections = ['fotoTerbaruGrid', 'kenanganPreview', 'strukturGrid'];
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.innerHTML = '<p style="text-align:center;padding:20px;color:#64748b">Data belum tersedia. Pastikan file Data.js sudah ter-upload ke hosting.</p>';
        }
      });
    }
    
    // Show sections regardless
    document.querySelectorAll('section').forEach(section => {
      section.style.opacity = '1';
      section.style.visibility = 'visible';
    });
  }, 200);
});

// ============================================
// 8. LOADING SCREEN (jika ada)
// ============================================
window.addEventListener('load', function() {
  setTimeout(() => {
    const loading = document.getElementById('globalLoading');
    if (loading) {
      loading.style.opacity = '0';
      setTimeout(() => loading.style.display = 'none', 300);
    }
  }, 500);
});

console.log('✅ main.js loaded successfully');
