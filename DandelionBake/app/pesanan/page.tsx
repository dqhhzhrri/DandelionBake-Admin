'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMyOrders } from '../actions/orders';

export default function PesananPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    const data = await getMyOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusNumber = (status: string) => {
    switch(status) {
      case 'Dikonfirmasi': return 1;
      case 'Diproses_Dapur': return 2;
      case 'Sedang_Dikirim': return 3;
      case 'Selesai': return 4;
      default: return 1;
    }
  };

  if (loading) {
    return (
        <div style={{ textAlign: 'center', padding: '100px' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'var(--color-green)' }}></i>
            <p style={{ marginTop: '20px', color: '#666' }}>Memuat pesanan Anda...</p>
        </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontStyle: 'italic', fontSize: '2.2rem', color: 'var(--color-green)', margin: 0 }}>Lacak Pesanan Saya</h2>
        <button onClick={loadOrders} style={{ background: 'var(--color-green)', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
            <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>
      
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '15px', border: '1px solid #eee' }}>
            <i className="fas fa-box-open" style={{ fontSize: '4rem', color: '#ccc', marginBottom: '15px' }}></i>
            <h3 style={{ color: '#666' }}>Belum ada pesanan aktif</h3>
            <Link href="/" style={{ display: 'inline-block', marginTop: '15px', padding: '10px 25px', background: 'var(--color-green)', color: 'white', borderRadius: '20px', fontWeight: 'bold' }}>Mulai Belanja</Link>
        </div>
      ) : (
        orders.map((order:any) => {
          const statusNum = getStatusNumber(order.status);
          const items = Array.isArray(order.items) ? order.items : [];

          return (
            <div key={order.id} style={{ background: 'white', borderRadius: '15px', padding: '25px', marginBottom: '20px', border: '1px solid #eee', boxShadow: '0 8px 25px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px dashed #eee', paddingBottom: '15px', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--color-green)', fontSize: '1.2rem' }}>#{order.id}</div>
                  <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '4px' }}>{new Date(order.createdAt).toLocaleString('id-ID')}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>Total Belanja</div>
                  <div style={{ fontWeight: 'bold', color: '#2e7d32', fontSize: '1.2rem' }}>Rp {order.totalTagihan.toLocaleString('id-ID')}</div>
                </div>
              </div>

              <div style={{ marginBottom: '25px', background: '#fafafa', padding: '15px', borderRadius: '10px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#888', marginBottom: '8px' }}>DAFTAR ITEM:</div>
                <ul style={{ paddingLeft: '15px' }}>
                  {items.map((i:any, idx:number) => (
                    <li key={idx} style={{ marginBottom: '4px' }}><b>{i.qty}x</b> {i.name}</li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: '20px' }}>
                <div style={{ position: 'absolute', top: '15px', left: '10%', width: '80%', height: '4px', background: '#eee', zIndex: 0 }}></div>
                {['Dikonfirmasi', 'Diproses Dapur', 'Sedang Dikirim', 'Selesai'].map((step, index) => {
                  const stepNum = index + 1;
                  const isActive = statusNum === stepNum;
                  const isDone = statusNum > stepNum;
                  
                  return (
                    <div key={step} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '25%', textAlign: 'center', gap: '8px' }}>
                      <div style={{ width: '35px', height: '35px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', border: '3px solid white', background: isActive ? 'var(--color-yellow)' : isDone ? 'var(--color-green)' : '#eee', color: isActive ? 'var(--color-green)' : isDone ? 'white' : '#aaa' }}>
                        <i className={index === 0 ? "fas fa-receipt" : index === 1 ? "fas fa-fire-burner" : index === 2 ? "fas fa-motorcycle" : "fas fa-check-double"}></i>
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: (isActive || isDone) ? 'var(--color-green)' : '#888' }}>{step}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}