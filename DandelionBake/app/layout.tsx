'use client';
import './globals.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Memanggil currentView dari otak aplikasi (Context)
  const { points, cartItems, globalSearchInput, setGlobalSearchInput, bestSellingItems, currentView, setCurrentView } = useAppContext();
  
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);

  // Script Eksternal untuk Leaflet Peta
  useEffect(() => {
      if (!document.getElementById('leaflet-js-cdn')) {
          const scriptLeaflet = document.createElement('script');
          scriptLeaflet.id = 'leaflet-js-cdn';
          scriptLeaflet.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          scriptLeaflet.async = true;
          document.head.appendChild(scriptLeaflet);
      }
  }, []);

  const simulateProductClick = (name: string, price: number, img: string) => {
    alert(`Mensimulasikan klik produk: ${name}. Dalam Next.js, Anda bisa mengarahkan ini ke halaman /product/[id].`);
    setShowGlobalSearch(false);
    setGlobalSearchInput('');
  };

  // Fungsi Pindah Halaman Menu Instan
  const handleNavClick = (view: string) => {
    setCurrentView(view);
    if (pathname !== '/') {
        router.push('/'); // Lempar ke halaman home jika sedang di checkout
    }
  };

  return (
    <div className="app-container">
      {/* HEADER UTAMA */}
      <header className="main-header">
          <div className="logo-area">
              <img src="/Assets/Logodandelionbake.png" alt="Logo Header" style={{ width: '40px', height: '40px', marginRight: '10px', borderRadius: '50%', objectFit: 'cover' }} />
              Dandelion Bake
          </div>
          <nav>
              <ul className="nav-links" style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '0.9rem' }}>
                  {/* Tombol menu sekarang merespon secara instan via Context */}
                  <li><a onClick={() => handleNavClick('home-view')} className={pathname === '/' && currentView === 'home-view' ? 'active' : ''} style={{ cursor: 'pointer' }}>Our Menu</a></li>
                  <li><a onClick={() => handleNavClick('rewards-view')} className={pathname === '/' && currentView === 'rewards-view' ? 'active' : ''} style={{ cursor: 'pointer' }}>Rewards</a></li>
                  <li><a onClick={() => handleNavClick('news-view')} className={pathname === '/' && currentView === 'news-view' ? 'active' : ''} style={{ cursor: 'pointer' }}>News & Promo</a></li>
                  <li><a onClick={() => handleNavClick('group-order-view')} className={pathname === '/' && currentView === 'group-order-view' ? 'active' : ''} style={{ cursor: 'pointer' }}>Group Order</a></li>
                  <li><a onClick={() => handleNavClick('store-view')} className={pathname === '/' && currentView === 'store-view' ? 'active' : ''} style={{ cursor: 'pointer' }}>Store Radar</a></li>
                  
                  <li style={{ borderLeft: '2px solid rgba(255,255,255,0.3)', height: '20px', margin: '0 5px' }}></li>
                  
                  <li><Link href="/checkout" className={pathname === '/checkout' ? 'active' : ''}>Keranjang ({cartItems.length})</Link></li>
                  <li><Link href="/pesanan" className={pathname === '/pesanan' ? 'active' : ''}>Orderan</Link></li>
              </ul>
          </nav>
          <div className="header-icons">
              <i className="fas fa-search" style={{ cursor: 'pointer', transition: '0.2s' }} onClick={() => setShowGlobalSearch(true)}></i>
              <i className="far fa-user" style={{ cursor: 'pointer', transition: '0.2s' }} onClick={() => setShowProfileModal(true)}></i>
          </div>
      </header>

      {/* KONTEN HALAMAN */}
      <main id="main-content-container">
        {children}
      </main>

      {/* FOOTER */}
      <footer>
          <div className="container footer-links-section">
              <div className="footer-col footer-about">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}>
                      <img src="/Assets/Logodandelionbake.png" alt="Dandelion Bake Logo" style={{ height: '80px', width: 'auto' }} />
                  </div>
                  <p style={{ textAlign: 'left', color: '#e0bb66', fontSize: '0.9rem', lineHeight: '1.6', paddingRight: '20px' }}>
                      "Dandelion Bake adalah tempat di mana keahlian tangan bertemu dengan harapan yang mekar. Kami tidak hanya menyajikan roti, kami menyajikan momen kehangatan yang mekar di setiap gigitan, memastikan bahwa kelezatan yang dirasakan hari ini akan menjadi kerinduan yang tersebar esok hari."
                  </p>
                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-start' }}>
                      <img src="https://img.icons8.com/ios/50/e0bb66/halal-sign.png" alt="Halal" style={{ width: '45px', height: 'auto' }} />
                  </div>
              </div>
              <div className="footer-col">
                <h3>Menu</h3>
                {/* Mengarahkan menu produk ke home-view (Katalog Utama) */}
                <ul>
                    <li onClick={() => switchView('home-view')}>Cemilan Manis</li>
                    <li onClick={() => switchView('home-view')}>Cookies</li>
                    <li onClick={() => { 
                        // Opsional: Langsung membuka modal pencarian dengan kata kunci Donat
                        setShowGlobalSearch(true); 
                        setGlobalSearchInput('Donat'); 
                    }}>Donat Favorit</li>
                    <li onClick={() => switchView('home-view')}>Exclusive by Dandelion Bake</li>
                    <li onClick={() => switchView('home-view')}>Product Viral</li>
                    <li onClick={() => switchView('group-order-view')}>Special Pilihan Acara</li>
                    <li onClick={() => switchView('home-view')}>Roti Hemat</li>
                </ul>
            </div>
            <div className="footer-col">
                <h3>Layanan</h3>
                <ul>
                    {/* Mengarahkan pesanan khusus ke halaman Group Order */}
                    <li onClick={() => switchView('group-order-view')}>Pesanan Korporat</li>
                    <li onClick={() => switchView('group-order-view')}>Snack Box &amp; Meeting</li>
                    
                    {/* Mengarahkan Promo ke halaman News & Promo */}
                    <li onClick={() => switchView('news-view')}>Promo</li>
                    
                    {/* Fitur yang belum ada halamannya bisa diberikan alert sementara */}
                    <li onClick={() => alert("Halaman Karir sedang dalam tahap pengembangan. Pantau terus ya!")}>Karir</li>
                    
                    <li onClick={() => switchView('home-view')}>Katalog</li>
                </ul>
            </div>
              <div className="footer-col">
                  <h3 style={{ fontSize: '1.3rem' }}>Sosial</h3>
                  <div className="social-icons" style={{ fontSize: '2.5rem', gap: '20px', marginBottom: '35px' }}>
                      <i className="fab fa-instagram"></i><i className="fab fa-twitter"></i><i className="fab fa-youtube"></i>
                  </div>
                  <h3 style={{ fontSize: '1.3rem' }}>Hubungi kami</h3>
                  <div className="contact-info-footer" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <i className="fas fa-truck" style={{ fontSize: '3.5rem' }}></i>
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <div style={{ fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '2px', lineHeight: '1.2' }}>Dandelion Bake</div>
                          <div style={{ fontSize: '1.1rem', letterSpacing: '0.5px' }}>+62 821-4050-6224</div>
                      </div>
                  </div>
              </div>
          </div>
      </footer>

      {/* MODAL SEARCH GLOBAL */}
      {showGlobalSearch && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: 'white', width: '90%', maxWidth: '550px', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', position: 'relative' }}>
                  <button onClick={() => { setShowGlobalSearch(false); setGlobalSearchInput(''); }} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#888' }}>&times;</button>
                  <h3 style={{ fontWeight: 'bold', color: 'var(--color-green)', marginBottom: '15px', fontStyle: 'normal' }}><i className="fas fa-search"></i> Cari Menu Dandelion Bake</h3>
                  <input type="text" placeholder="Ketik nama kue atau roti..." value={globalSearchInput} onChange={(e) => setGlobalSearchInput(e.target.value)} style={{ width: '100%', padding: '12px 20px', borderRadius: '30px', border: '2px solid var(--color-green)', fontSize: '1rem', outline: 'none', marginBottom: '20px' }} autoFocus />
                  <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                      {globalSearchInput.trim() !== '' && bestSellingItems.filter((item:any) => item.name.toLowerCase().includes(globalSearchInput.toLowerCase())).map((item:any, idx:number) => (
                          <div key={idx} onClick={() => simulateProductClick(item.name, item.price, item.img)} style={{ display: 'flex', gap: '15px', alignItems: 'center', padding: '10px', borderRadius: '10px', cursor: 'pointer', marginBottom: '8px', border: '1px solid #eee', background: '#fefefe' }}>
                              <img src={item.img} alt={item.name} style={{ width: '50px', height: '50px', borderRadius: '5px', objectFit: 'cover' }} />
                              <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'black' }}>{item.name}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--color-green)', fontWeight: 'bold', marginTop: '2px' }}>Rp {item.price.toLocaleString('id-ID')}</div>
                              </div>
                              <i className="fas fa-chevron-right" style={{ color: '#ccc', fontSize: '0.8rem' }}></i>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* MODAL PROFILE */}
      {showProfileModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: 'white', width: '90%', maxWidth: '400px', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', position: 'relative', textAlign: 'center' }}>
                  <button onClick={() => setShowProfileModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#888' }}>&times;</button>
                  <div style={{ width: '80px', height: '80px', background: 'var(--color-yellow)', color: 'var(--color-green)', borderRadius: '50%', margin: '0 auto 15px auto', fontSize: '2.5rem', fontWeight: 'bold' }} className="flex-center">
                      <i className="far fa-user"></i>
                  </div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '1.25rem', margin: '0', color: 'black' }}>Dandelion Lovers</h3>
                  <p style={{ fontSize: '0.8rem', color: '#777', marginTop: '2px' }}>Member sejak September 2025</p>

                  <div style={{ background: 'linear-gradient(135deg, #14403a 0%, #0d2b27 100%)', color: 'white', borderRadius: '15px', padding: '20px', margin: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ textAlign: 'left' }}>
                          <span style={{ fontSize: '0.75rem', opacity: 0.8, letterSpacing: '1px' }}>STATUS AKUN</span>
                          <div style={{ color: 'var(--color-yellow)', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '2px' }}>GOLD MEMBER</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>LIVE POIN</span>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginTop: '2px' }}><i className="fas fa-star" style={{ color: 'var(--color-yellow)', fontSize: '1.1rem' }}></i> {points.toLocaleString('id-ID')}</div>
                      </div>
                  </div>

                  <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button onClick={() => { setShowProfileModal(false); handleNavClick('rewards-view'); }} style={{ width: '100%', padding: '10px', background: 'var(--color-yellow)', border: 'none', borderRadius: '25px', color: 'black', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
                          Tukarkan Hadiah Poin
                      </button>
                      <button onClick={() => { setShowProfileModal(false); alert("Sistem Logout Berhasil!"); }} style={{ width: '100%', padding: '10px', background: 'transparent', border: 'none', color: '#c62828', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}>
                          Keluar Akun
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <AppProvider>
            <LayoutContent>{children}</LayoutContent>
        </AppProvider>
      </body>
    </html>
  );
}