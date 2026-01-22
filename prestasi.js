// js/prestasi.js - ROBUST VERSION dengan Firebase waiting

console.log('🚀 Loading prestasi.js...');

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatTanggal(dateInput) {
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

function getBadgeEmoji(title) {
  if (!title) return '🏆';
  const lower = title.toLowerCase();
  if (lower.includes('juara 1') || lower.includes('juara pertama') || lower.includes('1st')) return '🥇';
  if (lower.includes('juara 2') || lower.includes('juara kedua') || lower.includes('2nd')) return '🥈';
  if (lower.includes('juara 3') || lower.includes('juara ketiga') || lower.includes('3rd')) return '🥉';
  if (lower.includes('harapan')) return '🎖️';
  if (lower.includes('kompetisi') || lower.includes('lomba')) return '🏅';
  if (lower.includes('akademik') || lower.includes('nilai')) return '📚';
  if (lower.includes('olahraga') || lower.includes('basket') || lower.includes('futsal')) return '⚽';
  if (lower.includes('seni') || lower.includes('musik') || lower.includes('tari')) return '🎨';
  if (lower.includes('debat') || lower.includes('pidato')) return '🎤';
  return '🏆';
}

function getBadgeColor(title) {
  if (!title) return '#3b82f6';
  const lower = title.toLowerCase();
  if (lower.includes('juara 1') || lower.includes('juara pertama')) return '#f59e0b';
  if (lower.includes('juara 2') || lower.includes('juara kedua')) return '#94a3b8';
  if (lower.includes('juara 3') || lower.includes('juara ketiga')) return '#92400e';
  if (lower.includes('akademik')) return '#10b981';
  if (lower.includes('olahraga')) return '#ef4444';
  if (lower.includes('seni')) return '#8b5cf6';
  return '#3b82f6';
}

// ============================================
// LOAD DATA FUNCTIONS
// ============================================

async function loadFromFirebase() {
  try {
    console.log('📡 Trying to load from Firebase...');
    
    if (!window.db || !window.firestore) {
      console.warn('⚠️ Firebase not ready');
      return null;
    }
    
    const { getDocs, collection, query, orderBy } = window.firestore;
    const db = window.db;
    
    // Query dengan sorting
    const prestasiRef = collection(db, 'prestasi');
    const snapshot = await getDocs(prestasiRef);
    
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort manual (karena orderBy Firebase kadang error)
    data.sort((a, b) => {
      const dateA = new Date(a.tanggal || a.date || 0);
      const dateB = new Date(b.tanggal || b.date || 0);
      return dateB - dateA;
    });
    
    console.log(`✅ Firebase loaded ${data.length} prestasi`);
    return data;
    
  } catch (error) {
    console.error('❌ Firebase load error:', error);
    return null;
  }
}

function loadFromDataJS() {
  try {
    console.log('📂 Trying to load from Data.js...');
    
    if (typeof DATA === 'undefined') {
      console.warn('⚠️ DATA not defined');
      return null;
    }
    
    const prestasi = DATA.prestasi || DATA.prestasiData || [];
    
    // Sort berdasarkan tanggal
    prestasi.sort((a, b) => {
      const dateA = new Date(a.tanggal || a.date || 0);
      const dateB = new Date(b.tanggal || b.date || 0);
      return dateB - dateA;
    });
    
    console.log(`✅ Data.js loaded ${prestasi.length} prestasi`);
    return prestasi;
    
  } catch (error) {
    console.error('❌ Data.js load error:', error);
    return null;
  }
}

// ============================================
// RENDER FUNCTION
// ============================================

function renderPrestasi(prestasi) {
  const container = document.getElementById('prestasiTimeline');
  if (!container) {
    console.error('❌ Container not found');
    return;
  }
  
  if (!prestasi || prestasi.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:40px;color:#64748b;">
        <div style="font-size:48px;margin-bottom:10px;">🏆</div>
        <p>Belum ada prestasi yang ditambahkan</p>
        <p style="font-size:14px;color:#94a3b8;">Admin dapat menambah prestasi di dashboard</p>
      </div>
    `;
    return;
  }
  
  console.log(`🎨 Rendering ${prestasi.length} prestasi items`);
  
  container.innerHTML = prestasi.map((item, index) => {
    const tanggal = item.tanggal || item.date;
    const formattedDate = tanggal ? formatTanggal(tanggal) : '';
    const badge = getBadgeEmoji(item.title);
    
    const mediaElement = item.url ? (
      item.type === 'video' 
        ? `<video src="${item.url}" controls style="width:100%;border-radius:8px;margin-top:10px;"></video>`
        : `<img src="${item.url}" alt="${item.title}" loading="lazy" style="width:100%;border-radius:8px;margin-top:10px;" onerror="this.style.display='none'">`
    ) : '';
    
    return `
      <div class="timeline-item" style="opacity:0;transform:translateY(20px);animation:fadeInUp 0.5s ease forwards ${index * 0.1}s">
        <div class="timeline-dot" style="background:${getBadgeColor(item.title)}"></div>
        <div class="achievement-card">
          <div class="achievement-header">
            <span class="achievement-badge" style="background:${getBadgeColor(item.title)}20;color:${getBadgeColor(item.title)}">
              ${badge}
            </span>
            ${formattedDate ? `<span class="achievement-date">📅 ${formattedDate}</span>` : ''}
          </div>
          <h3 class="achievement-title">${item.title}</h3>
          ${item.caption ? `<p class="achievement-description">${item.caption}</p>` : ''}
          ${mediaElement}
        </div>
      </div>
    `;
  }).join('');
  
  // Add CSS animation if not exists
  if (!document.getElementById('prestasi-animations')) {
    const style = document.createElement('style');
    style.id = 'prestasi-animations';
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  console.log('✅ Prestasi rendered successfully');
}

// ============================================
// MAIN INITIALIZATION
// ============================================

async function initializePrestasi() {
  console.log('🔄 Initializing prestasi page...');
  
  const container = document.getElementById('prestasiTimeline');
  if (!container) return;
  
  // Show loading
  container.innerHTML = `
    <div style="text-align:center;padding:40px;">
      <div class="spinner" style="border:3px solid rgba(255,255,255,0.1);border-top:3px solid #f59e0b;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;margin:0 auto 15px;"></div>
      <p style="color:#64748b">Memuat prestasi...</p>
    </div>
  `;
  
  // Add spinner animation
  if (!document.getElementById('spinner-style')) {
    const style = document.createElement('style');
    style.id = 'spinner-style';
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
  
  let prestasi = null;
  
  // Strategi 1: Coba Firebase (dengan waiting)
  if (window.db && window.firestore) {
    console.log('🔥 Firebase detected, loading...');
    prestasi = await loadFromFirebase();
  } else {
    console.log('⏳ Waiting for Firebase...');
    
    // Tunggu max 3 detik untuk Firebase
    let attempts = 0;
    while (!window.db && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    if (window.db) {
      console.log('✅ Firebase ready after waiting');
      prestasi = await loadFromFirebase();
    } else {
      console.warn('⚠️ Firebase timeout, trying Data.js...');
    }
  }
  
  // Strategi 2: Fallback ke Data.js
  if (!prestasi) {
    console.log('📂 Firebase failed, trying Data.js...');
    
    // Tunggu sebentar untuk Data.js
    await new Promise(resolve => setTimeout(resolve, 200));
    prestasi = loadFromDataJS();
  }
  
  // Render hasil
  if (prestasi && prestasi.length > 0) {
    renderPrestasi(prestasi);
  } else {
    container.innerHTML = `
      <div style="text-align:center;padding:40px;color:#ef4444;">
        <h3 style="margin-bottom:15px;">❌ Gagal Memuat Data</h3>
        <p style="color:#94a3b8;margin-bottom:15px;">Tidak dapat memuat dari Firebase maupun Data.js</p>
        <p style="color:#64748b;font-size:14px;">Coba refresh halaman atau hubungi admin</p>
      </div>
    `;
  }
}

// ============================================
// START
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM ready for prestasi page');
  initializePrestasi();
});

console.log('✅ prestasi.js loaded');
