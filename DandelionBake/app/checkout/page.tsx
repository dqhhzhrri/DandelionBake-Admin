'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../context/AppContext';
import { createOrder } from '../actions/orders';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, setCartItems, setActiveOrders } = useAppContext();
  
  const [showPaymentGate, setShowPaymentGate] = useState(false);
  
  // State untuk Pilihan Kategori Utama (QRIS vs Bank)
  const [primaryMethod, setPrimaryMethod] = useState<string | null>(null);

  // State untuk form kartu kredit / daftar metode Agoda-style
  const [selectedSubMethod, setSelectedSubMethod] = useState<string>('credit');
  const [cardName, setCardName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);

  const subtotal = cartItems.reduce((sum:any, item:any) => sum + (item.price * item.qty), 0);
  const total = Math.round(subtotal * 1.1); // + PB1 10%

  const removeFromCart = (itemId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus item ini dari keranjang?")) {
        setCartItems((prev:any) => prev.filter((item:any) => item.id !== itemId));
    }
  };

  const handleCheckoutSuccess = async (requireTerms: boolean) => {
    if (requireTerms && !termsAgreed) {
        alert("Mohon centang kotak persetujuan (Terms of Use & Privacy Policy) sebelum melanjutkan.");
        return;
    }

    if (!customerName && !cardName) {
        alert("Mohon masukkan nama pemesan.");
        return;
    }

    const nama = customerName || cardName;
    const metode = primaryMethod === 'qris' ? 'QRIS' : selectedSubMethod;
    const itemsToSave = cartItems.map((item: any) => ({
        name: item.name,
        qty: item.qty
    }));

    const result = await createOrder({
        namaPembeli: nama,
        totalTagihan: total,
        metodePembayaran: metode,
        items: itemsToSave,
    });

    if (result.success) {
        alert("🎉 Pembayaran Berhasil!\nSistem mendeteksi mutasi dana aman. Roti siap diproses di dapur!");
        const newOrder = {
            id: result.order?.id,
            date: new Date().toLocaleDateString('id-ID'),
            total: total,
            items: cartItems.map((item:any) => ({ name: item.name, qty: item.qty })),
            status: 1
        };
        setActiveOrders((prev:any) => [newOrder, ...prev]);
        setCartItems([]);
        router.push('/pesanan');
    } else {
        alert("Gagal memproses pesanan: " + result.error);
    }
  };

  // Komponen Label Ikon Pembayaran
  const PaymentBadge = ({ text, color = '#1a56db' }: { text: string, color?: string }) => (
      <span style={{ border: `1px solid ${color}33`, color: color, padding: '2px 6px', fontSize: '0.65rem', fontWeight: 'bold', borderRadius: '4px', marginLeft: '5px', display: 'inline-block' }}>{text}</span>
  );

  return (
    <div className="container" style={{ padding: '40px 0', minHeight: '80vh' }}>
      <h2 style={{ fontStyle: 'italic', fontSize: '2.2rem', color: 'var(--color-green)', marginBottom: '30px' }}>Keranjang Belanja</h2>

      {!showPaymentGate ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontWeight: 'bold', color: 'var(--color-green)', marginBottom: '20px', borderBottom: '2px solid #f5f5f5', paddingBottom: '10px' }}>Daftar Item ({cartItems.length})</h3>
            
            {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#888', fontStyle: 'italic' }}>Keranjang belanjaanmu kosong.</div>
            ) : (
                cartItems.map((item:any) => (
                <div key={item.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <img src={item.img} alt={item.name} style={{ width: '75px', height: '75px', borderRadius: '10px', objectFit: 'cover' }} />
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{item.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>Jumlah: {item.qty}x</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--color-green)', fontSize: '1.05rem' }}>Rp {(item.price * item.qty).toLocaleString('id-ID')}</div>
                        <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: '#c62828', cursor: 'pointer', fontSize: '1.1rem' }}><i className="fas fa-trash-alt"></i></button>
                    </div>
                </div>
                ))
            )}
          </div>

          <div style={{ background: 'var(--color-grey-placeholder)', borderRadius: '20px', padding: '30px', height: 'fit-content' }}>
            <h2 style={{ fontStyle: 'italic', marginBottom: '25px', fontWeight: 'bold' }}>Ringkasan</h2>
            <div style={{ background: 'white', padding: '20px', borderRadius: '15px', marginBottom: '25px', color: 'black' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><span>Subtotal Produk:</span><span>Rp {subtotal.toLocaleString('id-ID')}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px dashed #eee', paddingTop: '15px', fontWeight: 'bold', color: 'var(--color-green)' }}><span>Total Pembayaran:</span><span>Rp {total.toLocaleString('id-ID')}</span></div>
            </div>
            <button onClick={() => { if (cartItems.length === 0) return alert("Keranjang kosong!"); setShowPaymentGate(true); }} style={{ background: 'white', color: 'black', width: '100%', padding: '15px', borderRadius: '30px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
              <i className="fas fa-wallet"></i> Bayar & Selesaikan Pesanan
            </button>
          </div>
        </div>
      ) : (
        
        <div style={{ background: 'white', border: '3px solid var(--color-green)', borderRadius: '20px', padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
                <div>
                    <h3 style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--color-green)' }}>💳 Metode Pembayaran</h3>
                    <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '5px' }}>Pilih kategori metode pembayaran Anda</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>Total Tagihan:</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#2e7d32' }}>Rp {total.toLocaleString('id-ID')}</div>
                </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#374151', marginBottom: '8px', display: 'block' }}>Nama Lengkap Pemesan *</label>
                <input 
                    type="text" 
                    placeholder="Masukkan nama Anda" 
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)} 
                    style={{ width: '100%', padding: '12px 15px', border: '2px solid #ddd', borderRadius: '10px', fontSize: '1rem', outline: 'none' }} 
                />
            </div>
            
            {/* DUA PILIHAN AWAL (KATEGORI UTAMA) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div onClick={() => setPrimaryMethod('qris')} style={{ border: primaryMethod === 'qris' ? '3px solid var(--color-green)' : '2px solid #ddd', background: primaryMethod === 'qris' ? '#f4f7f6' : 'white', padding: '25px', borderRadius: '15px', cursor: 'pointer', textAlign: 'center', transition: '0.2s' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px', color: '#e53935' }}><i className="fas fa-qrcode"></i></div>
                    <h4 style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>QRIS (Scan QR Code)</h4>
                    <p style={{ fontSize: '0.75rem', color: '#777', marginTop: '5px' }}>Bayar instan via GoPay, OVO, Dana, dll.</p>
                </div>
                <div onClick={() => setPrimaryMethod('bank')} style={{ border: primaryMethod === 'bank' ? '3px solid var(--color-green)' : '2px solid #ddd', background: primaryMethod === 'bank' ? '#f4f7f6' : 'white', padding: '25px', borderRadius: '15px', cursor: 'pointer', textAlign: 'center', transition: '0.2s' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px', color: '#1a1f71' }}><i className="fab fa-cc-visa" style={{ marginRight: '10px' }}></i><i className="fas fa-university"></i></div>
                    <h4 style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>Bank / Kartu / Lainnya</h4>
                    <p style={{ fontSize: '0.75rem', color: '#777', marginTop: '5px' }}>Virtual Account, Kartu Kredit, PayLater.</p>
                </div>
            </div>

            {/* JIKA MEMILIH QRIS */}
            {primaryMethod === 'qris' && (
                <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '15px', textAlign: 'center', border: '1px solid #e0e0e0', animation: 'fadeIn 0.3s' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '15px' }}>Silakan Scan QRIS Resmi Dandelion Bake Di Bawah Ini:</p>
                    <div style={{ background: 'white', padding: '15px', borderRadius: '10px', display: 'inline-block', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '15px' }}>
                        {/* URL DYNAMIC QR CODE - Menampilkan total tagihan saat discan kamera HP */}
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`Dandelion Bake | Tagihan Pembayaran: Rp ${total.toLocaleString('id-ID')} | Terima kasih!`)}`} 
                            alt="QRIS Code" 
                            style={{ width: '180px', height: '180px' }} 
                        />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#666' }}>💡 *Buka kamera HP atau aplikasi scanner-mu untuk melihat rincian tagihan.*</p>
                    <button onClick={() => handleCheckoutSuccess(false)} style={{ marginTop: '20px', background: '#2e7d32', color: 'white', border: 'none', padding: '12px 35px', borderRadius: '25px', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', display: 'block', margin: '20px auto 0 auto' }}>
                        <i className="fas fa-check-circle"></i> Simulasikan Pembayaran Berhasil
                    </button>
                </div>
            )}

            {/* JIKA MEMILIH BANK / KARTU / LAINNYA */}
            {primaryMethod === 'bank' && (
                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #d1d5db', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', color: '#1f2937', animation: 'fadeIn 0.3s' }}>
                    <div style={{ padding: '20px 25px', borderBottom: '1px solid #e5e7eb' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '5px' }}>Payment method</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontSize: '0.85rem' }}>
                            <i className="fas fa-shield-alt"></i><span>All payment data is encrypted and secure</span>
                        </div>
                    </div>

                    <div style={{ background: '#ecfdf5', color: '#065f46', padding: '15px', textAlign: 'center', fontSize: '0.9rem', borderBottom: '1px solid #e5e7eb' }}>
                        Dandelion Bake accepts 19 different payment methods for this order.
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* 1. Credit/Debit Card */}
                        <div style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 25px', cursor: 'pointer', background: selectedSubMethod === 'credit' ? '#f8fafc' : 'white' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <input type="radio" name="paymentSub" value="credit" checked={selectedSubMethod === 'credit'} onChange={() => setSelectedSubMethod('credit')} style={{ width: '18px', height: '18px', accentColor: '#2563eb' }} />
                                    <span style={{ fontWeight: 'bold', color: selectedSubMethod === 'credit' ? '#2563eb' : '#374151' }}>Credit/debit card</span>
                                </div>
                                <div>
                                    <PaymentBadge text="VISA" color="#1a1f71" />
                                    <PaymentBadge text="MasterCard" color="#eb001b" />
                                    <PaymentBadge text="JCB" color="#005b9f" />
                                </div>
                            </label>
                            
                            {selectedSubMethod === 'credit' && (
                                <div style={{ padding: '0 25px 25px 55px', background: '#f8fafc' }}>
                                    <div style={{ background: '#ecfdf5', color: '#065f46', padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.85rem', textAlign: 'center' }}>
                                        Last step! You're almost done.
                                    </div>
                                    <div style={{ display: 'flex', gap: '30px' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ marginBottom: '15px' }}>
                                                <label style={{ fontSize: '0.8rem', color: '#10b981', marginBottom: '5px', display: 'block' }}>Card holder name *</label>
                                                <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #10b981', borderRadius: '6px', outline: 'none', fontSize: '0.95rem' }} />
                                            </div>
                                            <div style={{ marginBottom: '15px' }}>
                                                <label style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '5px', display: 'block' }}>Credit/debit card number *</label>
                                                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '6px', padding: '0 15px', background: 'white' }}>
                                                    <i className="far fa-credit-card" style={{ color: '#9ca3af' }}></i>
                                                    <input type="text" placeholder="Card Number" style={{ width: '100%', padding: '12px', border: 'none', outline: 'none', fontSize: '0.95rem' }} />
                                                    <i className="fas fa-lock" style={{ color: '#9ca3af' }}></i>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '15px' }}>
                                                <div style={{ flex: 1 }}>
                                                    <label style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '5px', display: 'block' }}>Expiry date *</label>
                                                    <input type="text" placeholder="MM/YY" style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', fontSize: '0.95rem' }} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <label style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '5px', display: 'block' }}>CVC/CVV *</label>
                                                    <input type="password" placeholder="CVC/CVV" style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', fontSize: '0.95rem' }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ width: '250px', background: '#d1d5db', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#f3f4f6', position: 'relative', overflow: 'hidden' }}>
                                            <div style={{ width: '35px', height: '22px', background: '#9ca3af', borderRadius: '4px', opacity: 0.8 }}></div>
                                            <div style={{ marginTop: '20px' }}>
                                                <div style={{ letterSpacing: '2px', fontSize: '1rem', marginBottom: '10px', color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>**** **** **** ****</div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', textTransform: 'uppercase', color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
                                                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>{cardName || 'NAMA PEMILIK'}</span>
                                                    <span>**/**</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. Digital Payment */}
                        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 25px', borderBottom: '1px solid #e5e7eb', cursor: 'pointer' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <input type="radio" name="paymentSub" value="digital" checked={selectedSubMethod === 'digital'} onChange={() => setSelectedSubMethod('digital')} style={{ width: '18px', height: '18px' }} />
                                <span style={{ fontWeight: 'bold' }}>Digital payment</span>
                            </div>
                            <div><PaymentBadge text="PayPal" color="#003087" /></div>
                        </label>

                        {/* 3. Virtual Account */}
                        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 25px', borderBottom: '1px solid #e5e7eb', cursor: 'pointer' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <input type="radio" name="paymentSub" value="va" checked={selectedSubMethod === 'va'} onChange={() => setSelectedSubMethod('va')} style={{ width: '18px', height: '18px' }} />
                                <span style={{ fontWeight: 'bold' }}>Virtual account</span>
                            </div>
                            <div>
                                <PaymentBadge text="BCA" color="#0066ae" />
                                <PaymentBadge text="Mandiri" color="#f2a123" />
                                <PaymentBadge text="BNI" color="#005e6a" />
                            </div>
                        </label>

                        {/* 4. E-Wallet */}
                        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 25px', borderBottom: '1px solid #e5e7eb', cursor: 'pointer' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <input type="radio" name="paymentSub" value="ewallet" checked={selectedSubMethod === 'ewallet'} onChange={() => setSelectedSubMethod('ewallet')} style={{ width: '18px', height: '18px' }} />
                                <span style={{ fontWeight: 'bold' }}>E-Wallet</span>
                            </div>
                            <div>
                                <PaymentBadge text="OVO" color="#4c2a86" />
                                <PaymentBadge text="DANA" color="#118ee0" />
                            </div>
                        </label>
                    </div>

                    <div style={{ padding: '25px', background: '#f8fafc' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', cursor: 'pointer', marginBottom: '20px' }}>
                            <input type="checkbox" checked={termsAgreed} onChange={(e) => setTermsAgreed(e.target.checked)} style={{ width: '18px', height: '18px', marginTop: '2px' }} />
                            <span style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: '1.5' }}>
                                I agree to receive updates and promotions about Dandelion Bake.<br/><br/>
                                By proceeding with this order, I agree to Dandelion Bake's <a href="#" style={{ color: '#2563eb', textDecoration: 'underline' }}>Terms of Use</a> and <a href="#" style={{ color: '#2563eb', textDecoration: 'underline' }}>Privacy Policy</a>.
                            </span>
                        </label>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleCheckoutSuccess(true)} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '12px 40px', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(37,99,235,0.2)' }}>
                                Pay Rp {total.toLocaleString('id-ID')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tombol Back */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button onClick={() => { setShowPaymentGate(false); setPrimaryMethod(null); }} style={{ background: 'transparent', border: 'none', color: '#666', textDecoration: 'underline', cursor: 'pointer' }}>
                    ‹ Batalkan & Kembali ke Keranjang
                </button>
            </div>
        </div>
      )}
    </div>
  );
}