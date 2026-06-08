'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useAppContext } from './context/AppContext';
import { useSearchParams } from 'next/navigation';

function HomeContent() {
    // FIX: Memanggil currentView dan setCurrentView langsung dari AppContext
    const { setCartItems, bestSellingItems, setBestSellingItems, points, setPoints, currentView, setCurrentView } = useAppContext();
    
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get('tab');
    
    const [selectedProductModal, setSelectedProductModal] = useState<any>(null);
    const [newReviewText, setNewReviewText] = useState('');
    const [newReviewRating, setNewReviewRating] = useState(5);

    // Filter Kategori Aktif
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const productSectionRef = useRef<HTMLDivElement>(null);

    const getProductCategory = (name: string) => {
        if (name.includes("Cronut") || name.includes("Combo")) return "Donat Favorit";
        if (name.includes("Cookie Shot")) return "Cookie Shots";
        if (name.includes("Croissant") || name.includes("Roll") || name.includes("Muffin") || name.includes("Danish") || name.includes("Baguette")) return "Aneka Roti Klasik";
        return "Our Signatures";
    };

    const filteredProducts = selectedCategory 
        ? bestSellingItems.filter((item: any) => getProductCategory(item.name) === selectedCategory)
        : bestSellingItems;

    const handleCategoryClick = (categoryName: string) => {
        if (selectedCategory === categoryName) {
            setSelectedCategory(null);
        } else {
            setSelectedCategory(categoryName);
            setTimeout(() => {
                productSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    const submitReview = () => {
        if (!newReviewText.trim()) return alert("Tolong isi komentar ulasanmu terlebih dahulu ya!");

        const newReviewObj = { 
            user: "Dandelion Lovers", 
            rating: newReviewRating, 
            comment: newReviewText 
        };

        const updatedItems = bestSellingItems.map((item:any) => {
            if (item.name === selectedProductModal.name) {
                const totalRatings = item.reviews.reduce((acc:any, curr:any) => acc + curr.rating, 0) + newReviewRating;
                const newAvgRating = (totalRatings / (item.reviews.length + 1)).toFixed(1);
                return { ...item, rating: parseFloat(newAvgRating), reviews: [newReviewObj, ...item.reviews] };
            }
            return item;
        });
        setBestSellingItems(updatedItems);

        setSelectedProductModal((prev:any) => ({
            ...prev,
            rating: updatedItems.find((i:any) => i.name === prev.name).rating,
            reviews: [newReviewObj, ...prev.reviews]
        }));

        setNewReviewText('');
        setNewReviewRating(5);
        alert("Terima kasih! Ulasanmu berhasil ditambahkan.");
    };

    // FIX: Memastikan sinkronisasi URL jika ada dengan Context Global
    useEffect(() => {
        if (tabFromUrl && tabFromUrl !== currentView) {
            setCurrentView(tabFromUrl);
        }
    }, [tabFromUrl, setCurrentView]);

    // Kebutuhan Radar Store
    const [searchQuery, setSearchQuery] = useState('');
    const [showAllStores, setShowAllStores] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scannedStore, setScannedStore] = useState<any>(null);
    const [highlightedStoreId, setHighlightedStoreId] = useState<any>(null);
    const mapRef = useRef(null);
    const mapInstance = useRef<any>(null);

    // Kebutuhan Lucky Box & Voucher
    const [isOpeningBox, setIsOpeningBox] = useState(false);
    const [luckyPrize, setLuckyPrize] = useState<any>(null);
    const [isNotified, setIsNotified] = useState(false);
    const [voucherQuota, setVoucherQuota] = useState(7);
    const [isCodeRevealed, setIsCodeRevealed] = useState(false);

    // Kebutuhan Group Order
    const [groupStep, setGroupStep] = useState(1);
    const [groupEvent, setGroupEvent] = useState('Kantor');
    const [groupPax, setGroupPax] = useState(15);

    const storeLocations = [
        { id: 1, name: "Store Dandelion Bake (Pusat Sukolilo)", lat: -7.2823, lng: 112.7949, address: "Jl. Kampus ITS Sukolilo, Surabaya", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&h=150&q=80" },
        { id: 2, name: "Store Dandelion Bake Rungkut", lat: -7.3204, lng: 112.7845, address: "Jl. Rungkut Madya No.1, Surabaya", img: "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=300&h=150&q=80" },
        { id: 3, name: "Store Dandelion Bake Jakarta", lat: -6.1944, lng: 106.8229, address: "Jl. MH Thamrin, Jakarta Pusat", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&h=150&q=80" },
        { id: 4, name: "Store Dandelion Bake Bandung", lat: -6.9175, lng: 107.6191, address: "Jl. Braga, Bandung", img: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?auto=format&fit=crop&w=300&h=150&q=80" },
        { id: 5, name: "Store Dandelion Bake Yogyakarta", lat: -7.7956, lng: 110.3695, address: "Jl. Malioboro, Yogyakarta", img: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=300&h=150&q=80" },
        { id: 6, name: "Store Dandelion Bake Semarang", lat: -6.9932, lng: 110.4203, address: "Jl. Pemuda, Semarang", img: "https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?auto=format&fit=crop&w=300&h=150&q=80" },
        { id: 7, name: "Store Dandelion Bake Bali", lat: -8.6705, lng: 115.2126, address: "Jl. Teuku Umar, Denpasar, Bali", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&h=150&q=80" },
        { id: 8, name: "Store Dandelion Bake Medan", lat: 3.5952, lng: 98.6722, address: "Jl. Merdeka, Medan", img: "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=300&h=150&q=80" },
        { id: 9, name: "Store Dandelion Bake Makassar", lat: -5.1477, lng: 119.4327, address: "Jl. Losari, Makassar", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&h=150&q=80" },
        { id: 10, name: "Store Dandelion Bake Balikpapan", lat: -1.2379, lng: 116.8529, address: "Jl. Jend. Sudirman, Balikpapan", img: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?auto=format&fit=crop&w=300&h=150&q=80" },
        { id: 11, name: "Store Dandelion Bake Palembang", lat: -2.9909, lng: 104.7566, address: "Jl. Ilir Barat, Palembang", img: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=300&h=150&q=80" }
    ];

    const groupPackages: any = {
        Kantor: { name: "Dandelion Corporate Coffee Break", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&h=300&q=80", items: "5x Classic Croissant, 5x Baguette, 5x Matcha Cake", price: 350000 },
        UlangTahun: { name: "Ultimate Sweet Birthday Bundles", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&h=300&q=80", items: "1x Whole Choco Cake, 8x Donat Lumer, 8x Cupcakes", price: 450000 },
        Kasual: { name: "Picnic Party Sharing Box", img: "https://images.unsplash.com/photo-1618923850107-d1a234d7a73a?auto=format&fit=crop&w=600&h=300&q=80", items: "10x Cookie Shots, 5x Choco Lava, 5x Cinnamon Roll", price: 250000 },
        Pernikahan: { name: "Elegant Wedding & Engagement Hampers", img: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=600&h=300&q=80", items: "1x Premium Tiered Cake, 10x Macarons, 10x Strawberry Tart", price: 750000 },
        PestaAnak: { name: "Kids Joyful Sweet Box", img: "https://images.unsplash.com/photo-1514517521153-1be72277b32f?auto=format&fit=crop&w=600&h=300&q=80", items: "15x Mini Red Velvet Cupcakes, 10x Donat Lumer Coklat, 15x Cookie Shots", price: 320000 },
        Wisuda: { name: "Graduation Celebration Feast", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&h=300&q=80", items: "2x 4pc Cronut Box, 2x Signature Brownies, 10x Tiramisu Slice", price: 400000 }
    };

    const teleportToCard = (store: any) => {
        setShowAllStores(true);
        setTimeout(() => {
            focusMapOnStore(store.lat, store.lng);
            const cardElement = document.getElementById(`store-card-${store.id}`);
            if (cardElement) {
                cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setHighlightedStoreId(store.id);
                setTimeout(() => setHighlightedStoreId(null), 3000);
            }
        }, 300);
    };

    const handleSearch = () => {
        if (!searchQuery.trim()) { startStoreRadar(); return; }
        const query = searchQuery.toLowerCase(); 
        const foundStore = storeLocations.find(store => store.name.toLowerCase().includes(query) || store.address.toLowerCase().includes(query));
        if (foundStore) {
            setIsScanning(true); setScannedStore(null);
            setTimeout(() => { setIsScanning(false); setScannedStore(foundStore); teleportToCard(foundStore); }, 1200);
        } else { alert(`Maaf, toko Dandelion Bake belum tersedia di lokasi "${searchQuery}".`); }
    };

    const startStoreRadar = () => {
        setIsScanning(true); setScannedStore(null);
        setTimeout(() => { 
            setIsScanning(false); 
            const randomNearestStore = storeLocations[Math.floor(Math.random() * storeLocations.length)];
            setScannedStore(randomNearestStore); teleportToCard(randomNearestStore);
        }, 2200);
    };

    const focusMapOnStore = (lat:number, lng:number) => {
        if (mapInstance.current) { mapInstance.current.setView([lat, lng], 16); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    };

    const addToCart = (product: any) => {
        setCartItems((prev:any) => [...prev, { ...product, id: Date.now().toString(), qty: 1 }]);
        alert(`Yeay! ${product.name} berhasil ditambahkan ke Keranjang.`);
        setSelectedProductModal(null);
    };

    const addGroupOrderToCart = () => {
        const selectedPkg = groupPackages[groupEvent];
        const newGroupItem = { id: `group-${Date.now()}`, name: `${selectedPkg.name} (${groupPax} Pax)`, price: selectedPkg.price, img: selectedPkg.img, qty: 1, type: 'group', details: selectedPkg.items };
        setCartItems((prev:any) => [...prev, newGroupItem]);
        setGroupStep(3);
    };

    const handleRedeem = (cost: number, promoName: string) => {
        if (points >= cost) { setPoints((p:number) => p - cost); alert(`Yay! Berhasil menukarkan ${cost} poin untuk ${promoName}. Tunjukkan barcode-mu ke kasir!`); }
        else { alert(`Maaf, poin kamu tidak cukup untuk menukarkan ${promoName}. Kumpulkan poin lagi ya!`); }
    };

    const handleOpenLuckyBox = () => {
        setIsOpeningBox(true); 
        setLuckyPrize(null);
        setTimeout(() => {
            setIsOpeningBox(false);
            const prizePool = [
                { name: "Kupon Potongan Rp10.000", code: "DANDELION10K", desc: "Potongan langsung tanpa minimal pembelian." },
                { name: "Gratis Ongkir Eksklusif", code: "BAKEOFFONGKIR", desc: "Subsidi ongkir s/d Rp15.000 untuk pengiriman kemanapun." }
            ];
            setLuckyPrize(prizePool[Math.floor(Math.random() * prizePool.length)]);
        }, 1500);
    };

    useEffect(() => {
        if (currentView === 'store-view') {
            if (!document.getElementById('leaflet-css-style')) {
                const mapCss = document.createElement('link');
                mapCss.id = 'leaflet-css-style';
                mapCss.rel = 'stylesheet';
                mapCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(mapCss);
            }

            const initMap = () => {
                if ((window as any).L && mapRef.current && !mapInstance.current) {
                    mapInstance.current = (window as any).L.map(mapRef.current).setView([-2.5489, 118.0149], 5);
                    (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
                        attribution: '&copy; OpenStreetMap contributors' 
                    }).addTo(mapInstance.current);

                    storeLocations.forEach(store => {
                        (window as any).L.marker([store.lat, store.lng])
                            .addTo(mapInstance.current)
                            .bindPopup(`<div style="text-align:center;color:black;"><b>${store.name}</b><br/>${store.address}</div>`);
                    });
                }
                setTimeout(() => { if (mapInstance.current) mapInstance.current.invalidateSize(); }, 200);
            };

            if ((window as any).L) {
                initMap();
            } else {
                const checkL = setInterval(() => {
                    if ((window as any).L) {
                        initMap();
                        clearInterval(checkL);
                    }
                }, 300);
                return () => clearInterval(checkL);
            }
        }
    }, [currentView]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes smoothFade {
                    0% { opacity: 0; transform: translateY(15px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .smooth-transition {
                    animation: smoothFade 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
                }
            `}} />

            {/* HOME VIEW KONTEN */}
            {currentView === 'home-view' && (
                <section key={currentView} className="view-section smooth-transition">
                    <div className="hero-section">
                        <img src="https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?auto=format&fit=crop&w=1200&h=400&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} alt="Banner" />
                    </div>
                    
                    <div className="featured-container-wrapper">
                        <div className="container featured-boxes-container">
                            <div className="grid-4">
                                <div className="featured-box" onClick={() => handleCategoryClick("Donat Favorit")} style={{ border: selectedCategory === "Donat Favorit" ? '3px solid #14403a' : 'none', transform: selectedCategory === "Donat Favorit" ? 'scale(1.03)' : 'none', transition: '0.2s', cursor: 'pointer' }}>
                                    <div className="featured-img-wrap"><img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&h=300&q=80" alt="Donat Lumer" /></div>
                                    <h3>Donat Favorit</h3>
                                </div>
                                <div className="featured-box" onClick={() => handleCategoryClick("Our Signatures")} style={{ border: selectedCategory === "Our Signatures" ? '3px solid #14403a' : 'none', transform: selectedCategory === "Our Signatures" ? 'scale(1.03)' : 'none', transition: '0.2s', cursor: 'pointer' }}>
                                    <div className="featured-img-wrap"><img src="https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=400&h=300&q=80" alt="Signatures" /></div>
                                    <h3>Our Signatures</h3>
                                </div>
                                <div className="featured-box" onClick={() => handleCategoryClick("Cookie Shots")} style={{ border: selectedCategory === "Cookie Shots" ? '3px solid #14403a' : 'none', transform: selectedCategory === "Cookie Shots" ? 'scale(1.03)' : 'none', transition: '0.2s', cursor: 'pointer' }}>
                                    <div className="featured-img-wrap"><img src="https://images.unsplash.com/photo-1618923850107-d1a234d7a73a?auto=format&fit=crop&w=400&h=300&q=80" alt="Cookie Shots" /></div>
                                    <h3>Cookie Shots</h3>
                                </div>
                                <div className="featured-box" onClick={() => handleCategoryClick("Aneka Roti Klasik")} style={{ border: selectedCategory === "Aneka Roti Klasik" ? '3px solid #14403a' : 'none', transform: selectedCategory === "Aneka Roti Klasik" ? 'scale(1.03)' : 'none', transition: '0.2s', cursor: 'pointer' }}>
                                    <div className="featured-img-wrap"><img src="https://images.unsplash.com/photo-1597079910443-60c43fc4f729?auto=format&fit=crop&w=400&h=300&q=80" alt="Aneka Roti" /></div>
                                    <h3>Aneka Roti Klasik</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div ref={productSectionRef} className="home-products-section bg-yellow" style={{ paddingTop: '40px' }}>
                        <div className="container">
                            <h2 style={{ fontSize: '1.8rem', fontStyle: 'italic', marginBottom: '25px', color: '#14403a' }}>
                                {selectedCategory ? `✨ Kategori: ${selectedCategory}` : "✨ Our Best Selling Items"}
                            </h2>
                            <div className="grid-4">
                                {filteredProducts.map((item: any, index: number) => (
                                    <div key={index} className="product-card hover-card" onClick={() => setSelectedProductModal(item)}>
                                        <div className="product-img-wrapper">
                                            <div className="rating-badge"><i className="fas fa-star" style={{ color: '#f5b041' }}></i> {item.rating}</div>
                                            <img src={item.img} alt={item.name} />
                                        </div>
                                        <div className="product-info">
                                            <div><div className="product-title">{item.name}</div><div className="product-sold">{item.sold} Terjual • ({item.pax} pax)</div></div>
                                            <div className="product-meta">
                                                <div className="product-price">Rp {item.price.toLocaleString('id-ID')}</div>
                                                <button className="btn-add" onClick={(e) => { e.stopPropagation(); addToCart(item); }}><i className="fas fa-plus"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* HALAMAN REWARDS */}
            {currentView === 'rewards-view' && (
                <section key={currentView} className="view-section rewards-view container smooth-transition" style={{ padding: '60px 0' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '40px', fontStyle: 'italic', fontSize: '2.2rem' }}>Tukarkan Poin</h2>
                    <div className="rewards-grid">
                        <div className="left-col">
                            <div className="member-card" style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)', color: 'white', boxShadow: '0 10px 20px rgba(0,0,0,0.15)', position: 'sticky', top: '90px' }}>
                                <div style={{ position: 'relative', zIndex: 2 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div><p style={{ fontSize: '0.9rem', marginBottom: '5px' }}>Halo, Dandelion Lovers!</p><h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Dandelion Loyalty</h3></div>
                                        <div style={{ background: 'white', padding: '5px 15px', borderRadius: '20px', color: '#AA7C11', fontWeight: 'bold', fontSize: '0.9rem' }}>GOLD MEMBER</div>
                                    </div>
                                    <div style={{ marginTop: '20px' }}>
                                        <p style={{ fontSize: '0.9rem', marginBottom: '0' }}>Total Poin Kamu</p>
                                        <h1 style={{ fontSize: '3.5rem', margin: '0' }}>{points.toLocaleString('id-ID')}</h1>
                                    </div>
                                    <div style={{ marginTop: '25px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px' }}>
                                            <span>{10000 - points > 0 ? `${(10000 - points).toLocaleString('id-ID')} poin menuju Diamond` : 'Diamond Member!'}</span><span>10.000 Pts</span>
                                        </div>
                                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px' }}>
                                            <div style={{ width: `${Math.min((points / 10000) * 100, 100)}%`, height: '100%', background: 'white', borderRadius: '4px', transition: 'width 0.5s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="right-col promo-grid">
                            {[
                                { img: "https://images.unsplash.com/photo-1555507036-ab1e4006a2a0?auto=format&fit=crop&w=400&h=400&q=80", cost: 500, title: "Gratis 1 Classic Croissant" },
                                { img: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=400&h=400&q=80", cost: 1000, title: "Diskon 50% Whole Cake" },
                                { img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&h=400&q=80", cost: 2500, title: "Gratis 4pc Cronut Gift Box" },
                                { img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&h=400&q=80", cost: 1500, title: "Signature Brownies Pack" }
                            ].map((promo, idx) => (
                                <div key={idx} className="promo-box" style={{ backgroundImage: `url(${promo.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0', textAlign: 'left', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.1) 100%)' }}></div>
                                    <div style={{ position: 'relative', zIndex: 2, padding: '25px' }}>
                                        <div style={{ background: 'var(--color-yellow)', color: 'var(--color-green)', display: 'inline-block', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', marginBottom: '10px', fontWeight: 'bold' }}>{promo.cost} Poin</div>
                                        <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', fontStyle: 'normal' }}>{promo.title}</h3>
                                        <button style={{ width: '100%', padding: '12px', background: 'white', border: 'none', borderRadius: '30px', color: 'var(--color-green)', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleRedeem(promo.cost, promo.title)}>Tukarkan Sekarang</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* HALAMAN NEWS & PROMO */}
            {currentView === 'news-view' && (
                <section key={currentView} className="view-section news-view container smooth-transition">
                    <h2 style={{ textAlign: 'center', marginBottom: '40px', color: 'var(--color-green)', fontStyle: 'italic', fontSize: '2.2rem' }}>News & Promo</h2>
                    <div style={{ background: 'white', border: '3px solid var(--color-green)', padding: '40px', borderRadius: '20px', marginBottom: '40px', textAlign: 'center' }}>
                        {!isOpeningBox && !luckyPrize && (
                            <div>
                                <h2 style={{ fontWeight: 'bold', fontSize: '2rem', marginBottom: '10px', color: 'var(--color-green)' }}>🎁 Dandelion Daily Lucky Box</h2>
                                <p style={{ fontSize: '0.95rem', marginBottom: '25px', opacity: 0.9 }}>Klik tombol di bawah untuk membuka kotak misteri harian dan dapatkan *secret voucher*!</p>
                                <button className="contact-btn btn-dark" onClick={handleOpenLuckyBox} style={{ margin: '0 auto', background: 'var(--color-green)', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '30px', fontSize: '1.1rem', cursor: 'pointer' }}><i className="fas fa-box-open fa-bounce"></i> Buka Kotak Keberuntungan</button>
                            </div>
                        )}
                        {isOpeningBox && (
                            <div style={{ padding: '20px 0', color: 'var(--color-green)' }}>
                                <i className="fas fa-gift fa-spin" style={{ fontSize: '3.5rem', marginBottom: '15px' }}></i>
                                <h3 style={{ fontStyle: 'italic', fontWeight: 'bold', fontSize: '1.3rem' }}>Membuka kotak kebahagiaan kamu... 🪄</h3>
                            </div>
                        )}
                        {!isOpeningBox && luckyPrize && (
                            <div style={{ color: 'black' }}>
                                <span style={{ fontSize: '3rem' }}>🎉</span>
                                <h3 style={{ color: 'var(--color-green)', fontWeight: 'bold', fontSize: '1.8rem', marginTop: '10px' }}>{luckyPrize.name}</h3>
                                <p style={{ fontSize: '1rem', color: '#666', marginBottom: '20px' }}>{luckyPrize.desc}</p>
                                <div style={{ background: '#fffde7', border: '2px dashed #AA7C11', padding: '15px', borderRadius: '10px', fontSize: '1.3rem', fontWeight: 'bold', letterSpacing: '2px', color: '#AA7C11', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', maxWidth: '400px', margin: '0 auto 20px auto' }}>
                                    <span>{luckyPrize.code}</span>
                                    <button onClick={() => { navigator.clipboard.writeText(luckyPrize.code); alert("📋 Kode kupon harian berhasil disalin!"); }} style={{ background: 'var(--color-green)', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', fontSize: '0.9rem', cursor: 'pointer' }}>Salin</button>
                                </div>
                                <button onClick={() => setLuckyPrize(null)} style={{ background: '#eee', color: '#333', border: 'none', padding: '10px 25px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>Tutup</button>
                            </div>
                        )}
                    </div>

                    <div className="grid-3">
                        <div className="news-card" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=400&h=650&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0', border: 'none', height: '480px' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%)' }}></div>
                            <div style={{ position: 'relative', zIndex: 2, padding: '25px' }}>
                                <div style={{ background: '#e3f2fd', color: '#1e88e5', display: 'inline-block', padding: '4px 12px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '10px' }}>COMING SOON</div>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Matcha Almond Croissant</h3>
                                <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '20px' }}>Perpaduan renyahnya croissant dengan matcha artisan.</p>
                                <button onClick={() => { setIsNotified(true); alert("🔔 Notifikasi diaktifkan!"); }} style={{ width: '100%', padding: '12px', background: isNotified ? '#4caf50' : 'white', border: 'none', borderRadius: '30px', color: isNotified ? 'white' : 'var(--color-green)', fontWeight: 'bold', cursor: 'pointer' }}>
                                    <i className={isNotified ? "fas fa-check" : "far fa-bell"}></i> {isNotified ? "Sudah Terdaftar" : "Ingatkan Saya"}
                                </button>
                            </div>
                        </div>
                        <div className="news-card" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&h=650&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0', border: 'none', height: '480px' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%)' }}></div>
                            <div style={{ position: 'relative', zIndex: 2, padding: '25px' }}>
                                <div style={{ background: '#ffebee', color: '#c62828', display: 'inline-block', padding: '4px 12px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '10px' }}>LIVE FLASH SALE</div>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Kupon Potongan 50%</h3>
                                <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '12px' }}>Spesial perayaan member baru!</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '15px', background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '8px' }}>
                                    <span>🔥 Kuota:</span><span style={{ fontWeight: 'bold', color: 'var(--color-yellow)' }}>Sisa {voucherQuota} Voucher</span>
                                </div>
                                <button onClick={() => { if (voucherQuota > 0) { setVoucherQuota(p => p - 1); alert("🎉 Berhasil diklaim!"); } else alert("Voucher Habis!"); }} style={{ width: '100%', padding: '12px', background: 'var(--color-yellow)', border: 'none', borderRadius: '30px', color: 'black', fontWeight: 'bold', cursor: 'pointer' }}>Klaim Voucher Sekarang</button>
                            </div>
                        </div>
                        <div className="news-card" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&h=650&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0', border: 'none', height: '480px' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%)' }}></div>
                            <div style={{ position: 'relative', zIndex: 2, padding: '25px' }}>
                                <div style={{ background: '#e8f5e9', color: '#2e7d32', display: 'inline-block', padding: '4px 12px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '10px' }}>SECRET BUNDLE</div>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Paket Kopi & Donut</h3>
                                <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '20px' }}>Dapatkan seharga Rp45.000 dengan kode rahasia.</p>
                                <div onClick={() => setIsCodeRevealed(true)} style={{ border: '2px dashed var(--color-yellow)', background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '10px', textAlign: 'center', marginBottom: '15px', cursor: isCodeRevealed ? 'default' : 'pointer' }}>
                                    {isCodeRevealed ? (
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ fontSize: '1.1rem', letterSpacing: '2px', fontWeight: 'bold', color: 'var(--color-yellow)' }}>DANDELIONBUNDLE</span>
                                        </div>
                                    ) : (
                                        <span style={{ filter: 'blur(4px)', userSelect: 'none', fontSize: '1rem' }}>XXXX-XXXX-XXXX</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* HALAMAN GROUP ORDER */}
            {currentView === 'group-order-view' && (
                <section key={currentView} className="view-section group-order-view container smooth-transition" style={{ color: 'black' }}>
                    <h2 style={{ fontStyle: 'italic', fontSize: '2.2rem', marginBottom: '30px' }}>Group Order</h2>
                    <div style={{ background: 'white', border: '3px solid var(--color-green)', borderRadius: '20px', padding: '40px', textAlign: 'left' }}>
                        {groupStep === 1 && (
                            <div>
                                <h3 style={{ fontWeight: 'bold', fontSize: '1.4rem', color: 'var(--color-green)', marginBottom: '5px' }}>🎈 Langkah 1: Beritahu Detail Acaramu</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px', marginTop: '25px' }}>
                                    <div>
                                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Jenis Acara:</label>
                                        <select value={groupEvent} onChange={(e) => setGroupEvent(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #ddd' }}>
                                            <option value="Kantor">Meeting / Corporate</option>
                                            <option value="UlangTahun">Birthday Party</option>
                                            <option value="Kasual">Arisan / Santai</option>
                                            <option value="Pernikahan">Wedding / Lamaran</option>
                                            <option value="PestaAnak">Pesta Anak-Anak</option>
                                            <option value="Wisuda">Perayaan Wisuda</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Estimasi Pax:</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <input type="number" value={groupPax} onChange={(e) => setGroupPax(parseInt(e.target.value) || 1)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '2px solid #ddd', textAlign: 'center' }} />
                                            <span>Orang</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setGroupStep(2)} style={{ width: '100%', padding: '15px', background: 'var(--color-green)', color: 'white', border: 'none', borderRadius: '30px', fontSize: '1.05rem', fontWeight: 'bold', cursor: 'pointer' }}>🪄 Generate Paket Menu AI</button>
                            </div>
                        )}
                        {groupStep === 2 && (
                            <div>
                                <h3 style={{ fontWeight: 'bold', fontSize: '1.4rem', color: 'var(--color-green)', marginBottom: '5px' }}>✨ Langkah 2: Rekomendasi AI</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', background: '#f5f7f6', padding: '25px', borderRadius: '15px', marginBottom: '30px', border: '1px solid #e0e0e0', marginTop: '20px' }}>
                                    <div>
                                        <h4 style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--color-green)', marginBottom: '5px' }}>{groupPackages[groupEvent].name}</h4>
                                        <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '15px' }}><b>Isi:</b> {groupPackages[groupEvent].items}</p>
                                        <div style={{ borderTop: '1px solid #ddd', paddingTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                            <div><span style={{ fontSize: '0.8rem', color: '#666' }}>Total:</span><div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Rp {groupPackages[groupEvent].price.toLocaleString('id-ID')}</div></div>
                                            <div><span style={{ fontSize: '0.8rem', color: '#666' }}>Per Pax:</span><div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2e7d32' }}>Rp {Math.round(groupPackages[groupEvent].price / groupPax).toLocaleString('id-ID')}</div></div>
                                        </div>
                                    </div>
                                    <div style={{ borderRadius: '10px', overflow: 'hidden', height: '180px' }}><img src={groupPackages[groupEvent].img} alt="Package" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                                </div>
                                <button onClick={addGroupOrderToCart} style={{ width: '100%', padding: '15px', background: 'black', color: 'white', border: 'none', borderRadius: '30px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>🛒 Kunci & Masukkan ke Keranjang</button>
                                <p onClick={() => setGroupStep(1)} style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '15px', cursor: 'pointer', textDecoration: 'underline' }}>Kembali</p>
                            </div>
                        )}
                        {groupStep === 3 && (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '3.5rem' }}>🎉</div>
                                <h3 style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--color-green)' }}>Berhasil Ditambahkan!</h3>
                                <p style={{ marginBottom: '20px' }}>Silakan lanjut ke menu Keranjang (Chart) untuk melakukan pembayaran.</p>
                                <button onClick={() => setGroupStep(1)} style={{ padding: '12px 35px', background: '#eee', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' }}>Pesan Lagi</button>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* HALAMAN STORE RADAR */}
            {currentView === 'store-view' && (
                <section key={currentView} className="view-section store-view container smooth-transition" style={{ paddingTop: '20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <i className="fas fa-satellite-dish" style={{ fontSize: '3.5rem', color: 'var(--color-green)', marginBottom: '15px' }}></i>
                        <h2 style={{ fontWeight: '900', fontSize: '2.5rem', color: 'var(--color-green)', marginBottom: '10px' }}>Dandelion Store Radar</h2>
                    </div>

                    <div className="search-bar-wrapper" style={{ maxWidth: '800px', margin: '0 auto 30px auto', display: 'flex', gap: '15px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <i className="fas fa-search" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}></i>
                            <input 
                                type="text" 
                                className="store-search-input" 
                                placeholder="Ketik nama kota (ex: Bandung, Bali, Palembang)..." 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                style={{ width: '100%', padding: '15px 20px 15px 50px', borderRadius: '30px', border: '2px solid #ddd', background: 'white', fontSize: '1rem', outline: 'none' }} 
                            />
                        </div>
                        <button className="search-btn" onClick={handleSearch} style={{ background: 'var(--color-green)', color: 'var(--color-yellow)', padding: '15px 40px', borderRadius: '30px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Cari / Radar</button>
                    </div>

                    {isScanning && (
                        <div style={{ padding: '20px 0', textAlign: 'center' }}>
                            <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'var(--color-green)', marginBottom: '15px' }}></i>
                            <h3 style={{ fontStyle: 'italic', fontWeight: 'bold' }}>Mencari lokasi toko terdekat...</h3>
                        </div>
                    )}

                    {!isScanning && scannedStore && (
                        <div style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', textAlign: 'left', color: 'black', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '25px', position: 'relative', overflow: 'hidden', maxWidth: '800px', margin: '0 auto 30px auto' }}>
                            <div className="scanning-bar"></div>
                            <div style={{ borderRadius: '10px', overflow: 'hidden', height: '100%', minHeight: '130px' }}><img src={scannedStore.img} alt={scannedStore.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ background: '#e8f5e9', color: '#2e7d32', display: 'inline-block', padding: '3px 10px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 'bold', width: 'fit-content', marginBottom: '8px' }}>🎯 RADAR BERHASIL MENEMUKAN OUTLET!</div>
                                <h3 style={{ color: 'var(--color-green)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '4px' }}>{scannedStore.name}</h3>
                                <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '12px' }}><i className="fas fa-map-marker-alt"></i> {scannedStore.address}</p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => teleportToCard(scannedStore)} style={{ background: 'var(--color-green)', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}>📍 Buka di Peta & Lihat Toko</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div 
                        id="map" 
                        ref={mapRef} 
                        style={{ 
                            height: '450px', 
                            width: '100%', 
                            borderRadius: '24px', 
                            border: '3px solid #14403a', 
                            backgroundColor: '#e5e7eb',
                            position: 'relative',
                            zIndex: 1,
                            marginBottom: '30px'
                        }}
                    ></div>

                    <div className="store-grid section-pad">
                        {(showAllStores ? storeLocations : storeLocations.slice(0, 4)).map((store) => (
                            <div id={`store-card-${store.id}`} key={store.id} className={`store-card ${highlightedStoreId === store.id ? 'highlighted' : ''}`} onClick={() => focusMapOnStore(store.lat, store.lng)}>
                                <img src={store.img} alt={store.name} className="store-card-img" />
                                <div className="store-card-content">
                                    <div className="store-card-title">{store.name}</div>
                                    <div className="store-card-address"><i className="fas fa-map-marker-alt"></i> {store.address}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {!showAllStores && (
                        <div style={{ textAlign: 'center', paddingBottom: '30px' }}>
                            <button onClick={() => setShowAllStores(true)} style={{ backgroundColor: 'var(--color-green)', color: 'white', padding: '10px 30px', borderRadius: '25px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Tampilkan Semua Toko</button>
                        </div>
                    )}
                </section>
            )}

            {/* MODAL DETAIL PRODUK */}
            {selectedProductModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelectedProductModal(null)}>
                    <div style={{ background: 'white', width: '92%', maxWidth: '480px', borderRadius: '24px', overflow: 'hidden', position: 'relative', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 15px 40px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>
                        
                        <div style={{ position: 'relative', width: '100%', height: '240px', flexShrink: 0 }}>
                            <img src={selectedProductModal.img} alt={selectedProductModal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button onClick={() => setSelectedProductModal(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fas fa-times" style={{ color: '#333', fontSize: '0.9rem' }}></i>
                            </button>
                        </div>
                        
                        <div style={{ padding: '25px 25px 10px 25px', overflowY: 'auto', flex: 1, backgroundColor: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <h3 style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#14403a', margin: 0 }}>{selectedProductModal.name}</h3>
                                <div style={{ background: '#f5b041', color: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <i className="fas fa-star"></i> {selectedProductModal.rating}
                                </div>
                            </div>
                            
                            <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5' }}>{selectedProductModal.description}</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '25px' }}>
                                <div style={{ background: '#f8faf9', padding: '12px 15px', borderRadius: '12px', border: '1px solid #edf0ee' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '4px', fontWeight: 'bold' }}>FRESH LEVEL</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <i className="fas fa-clock"></i> {selectedProductModal.freshLevel}
                                    </div>
                                </div>
                                <div style={{ background: '#f8faf9', padding: '12px 15px', borderRadius: '12px', border: '1px solid #edf0ee' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '4px', fontWeight: 'bold' }}>SISA STOK</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#14403a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <i className="fas fa-box"></i> {selectedProductModal.stock} Porsi
                                    </div>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px dashed #ddd', paddingTop: '20px', marginBottom: '15px' }}>
                                <h4 style={{ fontWeight: 'bold', fontSize: '1rem', color: '#14403a', marginBottom: '12px' }}><i className="far fa-comments"></i> Ulasan Konsumen ({selectedProductModal.reviews?.length || 0})</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
                                    {selectedProductModal.reviews?.map((rev:any, idx:number) => (
                                        <div key={idx} style={{ background: '#f9f9f9', padding: '10px 12px', borderRadius: '10px', border: '1px solid #f0f0f0' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                                <span style={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#333' }}>{rev.user}</span>
                                                <span style={{ color: '#f5b041', fontSize: '0.75rem' }}>{'★'.repeat(rev.rating)}{'☆'.repeat(5-rev.rating)}</span>
                                            </div>
                                            <p style={{ fontSize: '0.8rem', color: '#555', margin: 0 }}>"{rev.comment}"</p>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ background: '#fffde7', border: '1px solid #e0bb66', padding: '12px', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#14403a' }}>Tambah Ulasan Baru:</div>
                                    <div style={{ display: 'flex', gap: '5px', margin: '6px 0 8px 0' }}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <i key={star} className={star <= newReviewRating ? "fas fa-star" : "far fa-star"} onClick={() => setNewReviewRating(star)} style={{ color: '#f5b041', cursor: 'pointer', fontSize: '1.1rem' }}></i>
                                        ))}
                                    </div>
                                    <textarea value={newReviewText} onChange={e => setNewReviewText(e.target.value)} placeholder="Tulis ulasan rasa kue di sini..." style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none', resize: 'none', height: '50px', fontSize: '0.8rem', marginBottom: '8px' }}></textarea>
                                    <button onClick={submitReview} style={{ background: '#14403a', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>Kirim Ulasan</button>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '15px 25px 20px 25px', borderTop: '1px dashed #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', flexShrink: 0 }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#14403a' }}>Rp {selectedProductModal.price.toLocaleString('id-ID')}</div>
                            <button onClick={() => addToCart(selectedProductModal)} style={{ background: '#14403a', color: '#fff24b', border: 'none', padding: '10px 25px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="fas fa-shopping-cart"></i> Tambah
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#14403a', fontWeight: 'bold' }}>Memuat Katalog Roti...</div>}>
      <HomeContent />
    </Suspense>
  );
}