
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { Users, TrendingUp, AlertTriangle, Activity, ShieldCheck, Wallet, Facebook, Instagram, Youtube, MessageCircle, ArrowRight, Truck, Mail, FileSignature, Inbox, ShoppingBag, Utensils, Stethoscope, Zap, Trash2, MoreHorizontal, QrCode, ScanLine, Send, PlusCircle, Calendar, CloudSun, X, Camera, CheckCircle, RefreshCw, Building2, ThumbsUp, AlertCircle, FileText, MessageSquare, Wrench, Armchair, Car, BookOpen, Briefcase, GraduationCap, Siren, Percent, Leaf, Wifi, Phone } from 'lucide-react';
import { STUNTING_DATA, BUDGET_DATA, MOCK_USER, EOFFICE_SUMMARY, SOCIAL_REPORTS, MARKETPLACE_ITEMS } from '../constants';
import { CitizenProfile, ViewMode } from '../types';

interface DashboardViewProps {
  user?: CitizenProfile;
  onViewChange?: (view: ViewMode) => void;
  isGlassHouseMode?: boolean;
}

const DashboardView: React.FC<DashboardViewProps> = ({ user = MOCK_USER, onViewChange, isGlassHouseMode = false }) => {
  const isAdmin = user.role === 'Lurah / Admin';

  // Scanner State
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Simulation: Scan detection
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isScannerOpen && !scanResult) {
        timer = setTimeout(() => {
            setScanResult("QRIS: Warung Bu Siti - Rp 25.000");
        }, 2500);
    }
    return () => clearTimeout(timer);
  }, [isScannerOpen, scanResult]);

  const handleScanClick = () => {
      setIsScannerOpen(true);
      setScanResult(null);
  };

  const closeScanner = () => {
      setIsScannerOpen(false);
      setScanResult(null);
  };

  // Mobile Berdaya Grid Menu - Expanded for "Super App"
  const berdayaMenu = [
      { label: 'Pesan Meja', icon: Armchair, color: 'bg-blue-600 text-white', view: ViewMode.MARKET, shadow: 'shadow-blue-600/30' },
      { label: 'Belanja', icon: ShoppingBag, color: 'bg-orange-500 text-white', view: ViewMode.BERDAYA, shadow: 'shadow-orange-500/30' }, 
      { label: 'Anjelo', icon: Truck, color: 'bg-green-600 text-white', view: ViewMode.BERDAYA, shadow: 'shadow-green-600/30' }, 
      { label: 'Parkir', icon: Car, color: 'bg-indigo-500 text-white', view: ViewMode.PARKING, shadow: 'shadow-indigo-500/30' }, // NEW
      
      { label: 'Workspace', icon: Briefcase, color: 'bg-slate-700 text-white', view: ViewMode.EOFFICE, shadow: 'shadow-slate-700/30' }, // NEW
      { label: 'Pustaka', icon: BookOpen, color: 'bg-violet-500 text-white', view: ViewMode.EDUCATION, shadow: 'shadow-violet-500/30', noQuota: true }, // NEW - No Quota
      { label: 'Kursus', icon: GraduationCap, color: 'bg-pink-600 text-white', view: ViewMode.EDUCATION, shadow: 'shadow-pink-600/30', noQuota: true }, // NEW - No Quota
      { label: 'Poskamling', icon: Siren, color: 'bg-rose-600 text-white', view: ViewMode.POSKAMLING, shadow: 'shadow-rose-600/30' }, // NEW

      { label: 'Sehat', icon: Stethoscope, color: 'bg-teal-500 text-white', view: ViewMode.HEALTH, shadow: 'shadow-teal-500/30' },
      { label: 'WargaNet', icon: Activity, color: 'bg-cyan-600 text-white', view: ViewMode.ENVIRONMENT, shadow: 'shadow-cyan-600/30' }, // CHANGED ICON TO ACTIVITY (Pulse)
      { label: 'Lapor', icon: AlertTriangle, color: 'bg-red-500 text-white', view: ViewMode.SOCIAL, shadow: 'shadow-red-500/30' },
      { label: 'Lainnya', icon: MoreHorizontal, color: 'bg-slate-800 text-white', view: ViewMode.GAPURA, shadow: 'shadow-slate-800/30' },
  ];

  if (isGlassHouseMode) {
      return (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              {/* Glass House Header */}
              <div className="bg-blue-900/80 backdrop-blur-xl text-white p-8 rounded-3xl shadow-2xl border border-blue-500/30 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                  <div className="relative z-10">
                      <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                          <Building2 className="text-blue-400" size={32} /> Tata Kelola Rumah Kaca
                      </h2>
                      <p className="text-blue-200 max-w-2xl text-lg">
                          Transparansi total APBDes dan tata kelola pemerintahan. Data ini terhubung langsung ke Inti MetalOS dan dapat diakses publik secara real-time.
                      </p>
                  </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: Budget */}
                  <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20">
                      <div className="flex justify-between items-center mb-8">
                          <h3 className="font-bold text-2xl text-white">Realisasi Anggaran (Langsung)</h3>
                          <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full font-bold border border-blue-500/30">Kuartal 4 2023</span>
                      </div>
                      
                      <div className="space-y-6">
                          {BUDGET_DATA.map((item) => {
                              const percentage = Math.round((item.realized / item.allocated) * 100);
                              return (
                                  <div key={item.id}>
                                      <div className="flex justify-between text-base mb-2">
                                          <span className="font-bold text-slate-200">{item.category}</span>
                                          <span className={`font-black ${
                                              item.status === 'Warning' ? 'text-orange-400' : 'text-white'
                                          }`}>{percentage}%</span>
                                      </div>
                                      <div className="w-full bg-white/10 rounded-full h-3 border border-white/5">
                                          <div 
                                              className={`h-full rounded-full shadow-lg ${
                                                  item.status === 'Warning' ? 'bg-orange-500' : 'bg-blue-500'
                                              }`} 
                                              style={{ width: `${percentage}%` }}
                                          ></div>
                                      </div>
                                      <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                                          <span>Terpakai: Rp {(item.realized / 1000000).toFixed(0)} Jt</span>
                                          <span>Pagu: Rp {(item.allocated / 1000000).toFixed(0)} Jt</span>
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  </div>

                  {/* Right Column: Musrenbang & Reports */}
                  <div className="space-y-8">
                      
                      {/* Musrenbang Digital */}
                      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20">
                          <h3 className="font-bold text-2xl text-white mb-6 flex items-center">
                              <ThumbsUp className="w-6 h-6 mr-3 text-purple-400" />
                              Musrenbang Digital
                          </h3>
                          <p className="text-sm text-slate-300 mb-6">
                              Voting usulan pembangunan prioritas warga bulan ini.
                          </p>
                          
                          <div className="space-y-4">
                              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 cursor-pointer transition">
                                  <div className="flex justify-between mb-2">
                                      <span className="font-bold text-white">Perbaikan Lampu Jalan RW 05</span>
                                      <span className="text-green-400 text-sm font-black">145 Suara</span>
                                  </div>
                                  <div className="w-full bg-white/10 rounded-full h-2">
                                      <div className="bg-purple-500 h-2 rounded-full shadow-[0_0_10px_#a855f7]" style={{ width: '75%' }}></div>
                                  </div>
                              </div>
                              
                              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 cursor-pointer transition">
                                  <div className="flex justify-between mb-2">
                                      <span className="font-bold text-white">Pelatihan Digital Marketing UMKM</span>
                                      <span className="text-slate-400 text-sm font-bold">82 Suara</span>
                                  </div>
                                  <div className="w-full bg-white/10 rounded-full h-2">
                                      <div className="bg-slate-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Laporan Warga */}
                      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20">
                          <h3 className="font-bold text-2xl text-white mb-6 flex items-center">
                              <AlertCircle className="w-6 h-6 mr-3 text-red-400" />
                              Laporan Terkini
                          </h3>
                          <div className="space-y-4">
                              {SOCIAL_REPORTS.slice(0, 2).map(report => (
                                  <div key={report.id} className="flex items-start space-x-4 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                                      <div className="bg-red-500/20 p-2 rounded-xl text-red-400">
                                          <MessageSquare size={20} />
                                      </div>
                                      <div>
                                          <p className="text-base font-bold text-white">{report.title}</p>
                                          <p className="text-xs text-slate-400 mt-1">Dilaporkan {report.date} oleh {report.author}</p>
                                          <span className="inline-block mt-2 text-[10px] font-bold bg-red-500/20 px-3 py-1 rounded-full text-red-300 border border-red-500/30 uppercase tracking-wider">
                                              {report.status}
                                          </span>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-8 pb-32 md:pb-8 relative">
      
      {/* MOBILE: ULTRA MODERN HOME SCREEN */}
      <div className="md:hidden flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* 1. Greeting & Context */}
          <div className="flex justify-between items-end px-2">
              <div>
                  <p className="text-white/60 text-xs font-medium mb-0.5">Selamat Pagi,</p>
                  <h1 className="text-2xl font-black text-white tracking-tight">{user.name.split(' ')[0]}! 👋</h1>
              </div>
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full shadow-lg">
                  <CloudSun size={16} className="text-orange-400" />
                  <span className="text-xs font-bold text-white">28°C</span>
              </div>
          </div>

          {/* 2. Hero Wallet Card 2.0 */}
          <div className="relative w-full rounded-[2rem] overflow-hidden shadow-2xl transform transition-all active:scale-[0.98] border border-white/10">
              {/* Dynamic Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-indigo-600/90 to-purple-700/90 backdrop-blur-xl"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
              
              <div className="relative z-10 p-6 flex flex-col justify-between h-48 text-white">
                  <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">
                          <ShieldCheck size={14} className="text-yellow-400" />
                          <span className="text-[10px] font-bold tracking-wider uppercase">Warga Berdaya</span>
                      </div>
                      <QrCode size={24} className="opacity-80" />
                  </div>
                  
                  <div className="space-y-1">
                      <span className="text-blue-100 text-xs font-medium tracking-wider uppercase opacity-80">Saldo Aktif</span>
                      <div className="flex items-baseline gap-1">
                          <span className="text-lg font-medium opacity-80">Rp</span>
                          <h2 className="text-4xl font-black tracking-tighter">{(user.balance/1000).toLocaleString()}<span className="text-2xl opacity-60">.000</span></h2>
                      </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-2">
                      <div className="flex gap-4 text-xs font-medium text-blue-100">
                          <span>{user.points} Poin</span>
                          <span>•</span>
                          <span>ID: 8821-9901</span>
                      </div>
                  </div>
              </div>
          </div>

          {/* 3. Quick Actions Bar */}
          <div className="grid grid-cols-4 gap-3 px-2">
              <button 
                onClick={handleScanClick}
                className="flex flex-col items-center gap-2 group"
              >
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg border border-white/20 flex items-center justify-center text-cyan-400 group-active:scale-95 transition hover:bg-white/20">
                      <ScanLine size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-white">Pindai</span>
              </button>
              <button 
                onClick={() => onViewChange && onViewChange(ViewMode.ECONOMY)}
                className="flex flex-col items-center gap-2 group"
              >
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg border border-white/20 flex items-center justify-center text-green-400 group-active:scale-95 transition hover:bg-white/20">
                      <PlusCircle size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-white">Isi Saldo</span>
              </button>
              <button 
                onClick={() => onViewChange && onViewChange(ViewMode.ECONOMY)}
                className="flex flex-col items-center gap-2 group"
              >
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg border border-white/20 flex items-center justify-center text-orange-400 group-active:scale-95 transition hover:bg-white/20">
                      <Send size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-white">Kirim</span>
              </button>
              <button 
                onClick={() => onViewChange && onViewChange(ViewMode.ECONOMY)}
                className="flex flex-col items-center gap-2 group"
              >
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg border border-white/20 flex items-center justify-center text-purple-400 group-active:scale-95 transition hover:bg-white/20">
                      <Activity size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-white">Mutasi</span>
              </button>
          </div>

          {/* 4. "Warga Berdaya" Super Grid */}
          <div className="pt-2">
              <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="font-black text-white text-lg drop-shadow-sm">Layanan Desa</h3>
                  <button className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">Atur</button>
              </div>
              <div className="grid grid-cols-4 gap-y-6 gap-x-2">
                  {berdayaMenu.map((item, idx) => (
                      <button 
                        key={idx}
                        onClick={() => onViewChange && onViewChange(item.view)}
                        className="flex flex-col items-center gap-2 group relative"
                      >
                          <div className={`w-[68px] h-[68px] rounded-[1.5rem] flex items-center justify-center shadow-lg transition-all duration-300 active:scale-90 active:rotate-3 relative ${item.color} ${item.shadow}`}>
                              {item.view === ViewMode.ENVIRONMENT ? (
                                  /* Custom Render for WargaNet: Activity (Pulse) matching system core */
                                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-cyan-600 to-blue-700">
                                      <div className="absolute inset-0 bg-white/10 rounded-full animate-ping opacity-30 scale-75"></div>
                                      <Activity size={28} strokeWidth={2.5} className="relative z-10 text-white" />
                                  </div>
                              ) : (
                                  <>
                                    <item.icon size={28} strokeWidth={2} />
                                    {item.noQuota && (
                                        <div className="absolute -top-1 -right-1 bg-white text-slate-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-slate-200 shadow-sm whitespace-nowrap">
                                            NO QUOTA
                                        </div>
                                    )}
                                  </>
                              )}
                          </div>
                          <span className="text-[11px] font-bold text-white tracking-tight leading-none text-center">{item.label}</span>
                      </button>
                  ))}
              </div>
          </div>

          {/* 5. Promo Carousel (New) */}
          <div className="pt-4">
              <h3 className="font-black text-white text-lg mb-4 px-2 drop-shadow-sm">Promo Spesial</h3>
              <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x px-2">
                  <div className="min-w-[85%] snap-center bg-gradient-to-r from-orange-500 to-pink-500 p-5 rounded-[1.5rem] shadow-lg text-white relative overflow-hidden border border-white/10">
                      <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                      <div className="relative z-10">
                          <span className="bg-white/20 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-2 inline-block border border-white/10">Kuliner</span>
                          <h4 className="text-xl font-bold mb-1 leading-tight">Diskon 50% Kopi Payungi</h4>
                          <p className="text-xs text-orange-100 mb-3 opacity-90">Bayar pakai WargaPay hari ini!</p>
                          <div className="flex items-center gap-2 text-[10px] font-bold bg-black/20 w-fit px-2 py-1 rounded-lg">
                              <Percent size={12} /> Voucher: KOPI50
                          </div>
                      </div>
                  </div>
                  
                  <div className="min-w-[85%] snap-center bg-gradient-to-r from-blue-500 to-cyan-500 p-5 rounded-[1.5rem] shadow-lg text-white relative overflow-hidden border border-white/10">
                      <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                      <div className="relative z-10">
                          <span className="bg-white/20 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-2 inline-block border border-white/10">Jasa</span>
                          <h4 className="text-xl font-bold mb-1 leading-tight">Gratis Ongkir Anjelo</h4>
                          <p className="text-xs text-blue-100 mb-3 opacity-90">Untuk pengiriman dokumen kantor desa.</p>
                          <div className="flex items-center gap-2 text-[10px] font-bold bg-black/20 w-fit px-2 py-1 rounded-lg">
                              <Percent size={12} /> Voucher: FREEKIRIM
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* 6. Live Catalog (New) */}
          <div className="pt-2">
              <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="font-black text-white text-lg drop-shadow-sm">Jelajah Pasar</h3>
                  <button onClick={() => onViewChange && onViewChange(ViewMode.BERDAYA)} className="text-xs font-bold text-white/70 hover:text-white">Lihat Semua</button>
              </div>
              <div className="flex overflow-x-auto gap-3 pb-6 no-scrollbar px-2">
                  {MARKETPLACE_ITEMS.slice(0, 5).map((item) => (
                      <div key={item.id} className="min-w-[140px] bg-white rounded-2xl p-3 shadow-md border border-slate-100 flex flex-col gap-2">
                          <div className={`aspect-square rounded-xl ${item.imageColor} relative overflow-hidden`}>
                              {item.imageUrl && <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} />}
                          </div>
                          <div>
                              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</h4>
                              <p className="text-[10px] text-slate-500 truncate">{item.seller}</p>
                              <p className="text-xs font-black text-orange-600 mt-1">Rp {item.price.toLocaleString()}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* 7. Info Widgets Stack */}
          <div className="pt-2">
              <h3 className="font-black text-white text-lg mb-4 px-2 drop-shadow-sm">Info Pintar</h3>
              <div className="flex overflow-x-auto gap-4 pb-6 no-scrollbar snap-x px-2">
                  {/* E-Office Widget */}
                  <div className="min-w-[85%] snap-center bg-white/10 backdrop-blur-xl p-5 rounded-[1.5rem] border border-white/20 shadow-lg flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center shrink-0 border border-blue-500/30">
                          <Mail size={24} />
                      </div>
                      <div>
                          <h4 className="font-bold text-white">Surat Pengantar</h4>
                          <p className="text-xs text-slate-300 mb-2">Status: <span className="text-green-400 font-bold">Siap Diambil</span></p>
                          <p className="text-[10px] text-slate-400">Diperbarui: 10:30 WIB</p>
                      </div>
                  </div>

                  {/* Health Queue Widget */}
                  <div className="min-w-[85%] snap-center bg-white/10 backdrop-blur-xl p-5 rounded-[1.5rem] border border-white/20 shadow-lg flex items-center gap-4">
                      <div className="w-12 h-12 bg-teal-500/20 text-teal-400 rounded-2xl flex items-center justify-center shrink-0 border border-teal-500/30">
                          <Calendar size={24} />
                      </div>
                      <div>
                          <h4 className="font-bold text-white">Posyandu Balita</h4>
                          <p className="text-xs text-slate-300 mb-2">Jadwal: <span className="text-white font-bold">Besok, 08:00</span></p>
                          <p className="text-xs text-slate-400">Pos Melati RW 07</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* DESKTOP: DASHBOARD LAYOUT (Unchanged structure, style updated for glassmorphism) */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Context Aware */}
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] shadow-xl border border-white/20 relative overflow-hidden group hover:bg-white/15 transition-all duration-500 hover:-translate-y-1">
          {isAdmin ? (
             <>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Penduduk</p>
                    <h3 className="text-3xl font-black text-white mt-2">4.285</h3>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400 group-hover:scale-110 transition shadow-sm border border-blue-500/30">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-6 flex items-center text-sm">
                  <span className="text-green-400 font-bold flex items-center bg-green-500/10 px-2 py-0.5 rounded-lg border border-green-500/20">
                    <TrendingUp className="w-4 h-4 mr-1" /> +2.4%
                  </span>
                  <span className="text-slate-400 ml-2 font-medium">bulan ini</span>
                </div>
             </>
          ) : (
             <>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Skor Warga</p>
                    <h3 className="text-3xl font-black text-white mt-2">{user.wargaScore}</h3>
                  </div>
                  <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400 group-hover:scale-110 transition shadow-sm border border-indigo-500/30">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-6 text-sm text-slate-400 font-medium">Kredit: <span className="font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-lg border border-green-500/20">Sangat Baik</span></div>
             </>
          )}
        </div>

        {/* Card 2: Context Aware */}
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] shadow-xl border border-white/20 group hover:bg-white/15 transition-all duration-500 hover:-translate-y-1">
           {isAdmin ? (
             <>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Indeks Desa</p>
                  <h3 className="text-3xl font-black text-white mt-2">0.895</h3>
                </div>
                <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400 group-hover:scale-110 transition shadow-sm border border-emerald-500/30">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-6 text-sm text-slate-400 font-medium">Status: <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">Mandiri</span></div>
             </>
           ) : (
             <>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Saldo WargaPay</p>
                  <h3 className="text-3xl font-black text-white mt-2">{(user.balance/1000).toFixed(0)}k</h3>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400 group-hover:scale-110 transition shadow-sm border border-blue-500/30">
                  <Wallet className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-6 text-sm text-slate-400 font-medium">Poin: <span className="font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-lg border border-orange-500/20">{user.points} poin</span></div>
             </>
           )}
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] shadow-xl border border-white/20 group hover:bg-white/15 transition-all duration-500 hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Logistik</p>
              <h3 className="text-3xl font-black text-white mt-2">12</h3>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-2xl text-orange-400 group-hover:scale-110 transition shadow-sm border border-orange-500/30">
              <Truck className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-6 text-sm text-slate-400 font-medium">Aktif: <span className="font-bold text-slate-200 bg-white/10 px-2 py-0.5 rounded-lg border border-white/10">85 Pengantaran</span></div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] shadow-xl border border-white/20 group hover:bg-white/15 transition-all duration-500 hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Peringatan</p>
              <h3 className="text-3xl font-black text-red-500 mt-2">1</h3>
            </div>
            <div className="p-3 bg-red-500/20 rounded-2xl text-red-500 group-hover:scale-110 transition shadow-sm border border-red-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-6 text-sm text-slate-400 font-medium">Level Air: <span className="font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-lg border border-orange-500/20">Waspada</span></div>
        </div>
      </div>

      {/* Complex Charts & Desktop Widgets */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* E-OFFICE NOTIFICATION WIDGET */}
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] shadow-xl border border-white/20 flex flex-col h-full">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg mr-3 border border-blue-500/30">
                        <Mail className="w-5 h-5" />
                    </div>
                    Pembaruan E-Office
                </div>
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">LANGSUNG</span>
            </h3>
            
            <div className="space-y-4 flex-1">
                {/* Pending Signatures */}
                <div className="p-5 bg-red-500/10 rounded-2xl border border-red-500/20 flex items-center justify-between cursor-pointer hover:bg-red-500/20 transition group">
                    <div className="flex items-center space-x-4">
                        <div className="p-2.5 bg-white/10 rounded-xl text-red-400 shadow-sm group-hover:scale-110 transition border border-red-500/20">
                            <FileSignature size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-red-300 font-bold uppercase tracking-wider">Tindakan Diperlukan</p>
                            <p className="text-sm font-bold text-white">Perlu Tanda Tangan</p>
                        </div>
                    </div>
                    <span className="text-2xl font-black text-red-400">{EOFFICE_SUMMARY.waitingSignature}</span>
                </div>

                {/* Incoming Letters */}
                <div className="p-5 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-between cursor-pointer hover:bg-blue-500/20 transition group">
                    <div className="flex items-center space-x-4">
                        <div className="p-2.5 bg-white/10 rounded-xl text-blue-400 shadow-sm group-hover:scale-110 transition border border-blue-500/20">
                            <Inbox size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">Surat Baru</p>
                            <p className="text-sm font-bold text-white">Surat Masuk</p>
                        </div>
                    </div>
                    <span className="text-2xl font-black text-blue-400">{EOFFICE_SUMMARY.thisMonth}</span>
                </div>

                {/* Quick Action List */}
                <div className="space-y-1 mt-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Tugas Tertunda</p>
                    <div className="flex justify-between items-center p-3 hover:bg-white/5 rounded-xl transition cursor-pointer text-sm border border-transparent hover:border-white/10 group">
                        <div className="flex items-center gap-3 text-slate-300 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                            <span>Disposisi Surat Camat</span>
                        </div>
                        <ArrowRight size={14} className="text-slate-500 group-hover:text-blue-400 transition" />
                    </div>
                    <div className="flex justify-between items-center p-3 hover:bg-white/5 rounded-xl transition cursor-pointer text-sm border border-transparent hover:border-white/10 group">
                        <div className="flex items-center gap-3 text-slate-300 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            <span>Verifikasi Data KTP (5)</span>
                        </div>
                        <ArrowRight size={14} className="text-slate-500 group-hover:text-blue-400 transition" />
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] shadow-xl border border-white/20">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-red-500 rounded-full"></div>
              Analisis Stunting
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={STUNTING_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15,23,42,0.9)', color: 'white', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)', padding: '12px'}} 
                />
                <Line type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={3} dot={{r: 4, fill: '#ef4444', strokeWidth: 0}} activeDot={{r: 6, strokeWidth: 0}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs font-medium text-slate-400 mt-4 text-center bg-white/5 py-2 rounded-xl border border-white/5">Data real-time dari Posyandu Digital</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] shadow-xl border border-white/20">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              Realisasi APBDes
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BUDGET_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" hide />
                <YAxis dataKey="category" type="category" width={100} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} />
                <Tooltip 
                   formatter={(value: number) => `Rp ${value.toLocaleString()}`}
                   cursor={{fill: 'rgba(255,255,255,0.05)'}}
                   contentStyle={{borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15,23,42,0.9)', color: 'white', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)', padding: '12px'}}
                />
                <Bar dataKey="realized" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs font-medium text-slate-400 mt-4 text-center bg-white/5 py-2 rounded-xl border border-white/5">Transparansi Anggaran Real-time</p>
        </div>
      </div>

      {/* SOCIAL HUB & NOTIFICATION CENTER - Only visible if NOT in Glass House Mode to avoid clutter */}
      {!isGlassHouseMode && (
          <div className="hidden md:block bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-white/10">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-pulse"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black tracking-wide flex items-center text-white">
                        <div className="p-2 bg-green-500/20 rounded-xl mr-3 backdrop-blur-sm border border-green-500/30">
                            <MessageCircle className="text-green-400" />
                        </div>
                        Pusat Sosial & Laporan
                    </h3>
                    <button 
                        onClick={() => onViewChange && onViewChange(ViewMode.SOCIAL)}
                        className="text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition flex items-center backdrop-blur-sm text-white border border-white/10"
                    >
                        Lihat Semua <ArrowRight size={14} className="ml-2" />
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* WhatsApp Broadcast Card */}
                    <div className="bg-white/5 p-5 rounded-3xl border border-white/5 hover:bg-white/10 transition cursor-pointer hover:-translate-y-1 hover:shadow-lg duration-300 group">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-[#25D366] rounded-2xl text-white shadow-lg group-hover:scale-110 transition">
                                <MessageCircle size={20} fill="white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-base text-white">Info RW 07</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Siaran • 10:00 WIB</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            Kerja bakti minggu ini akan difokuskan pada pembersihan saluran air di Gang Mawar...
                        </p>
                    </div>

                    {/* Social Media Feed Card */}
                    <div className="bg-white/5 p-5 rounded-3xl border border-white/5 hover:bg-white/10 transition cursor-pointer hover:-translate-y-1 hover:shadow-lg duration-300 group">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-2xl text-white shadow-lg group-hover:scale-110 transition">
                                <Instagram size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-base text-white">@pasarpayungi</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cerita • 30m lalu</p>
                            </div>
                        </div>
                        <div className="h-16 bg-white/5 rounded-xl flex items-center justify-center text-xs text-slate-500 font-medium border border-white/5 group-hover:border-white/10 transition">
                            [Pratinjau Gambar: Jajanan Pasar]
                        </div>
                    </div>

                    {/* YouTube Card */}
                    <div className="bg-white/5 p-5 rounded-3xl border border-white/5 hover:bg-white/10 transition cursor-pointer hover:-translate-y-1 hover:shadow-lg duration-300 group">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-[#FF0000] rounded-2xl text-white shadow-lg group-hover:scale-110 transition">
                                <Youtube size={20} fill="white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-base text-white">MetalOS TV</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Video Baru • 2j lalu</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            Tutorial: Cara Menggunakan WargaPay untuk Pembayaran PBB Online...
                        </p>
                    </div>
                </div>
              </div>
          </div>
      )}

      {/* SCANNER OVERLAY */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col animate-in fade-in duration-300">
          {/* Scanner Header */}
          <div className="p-4 flex justify-between items-center bg-black/50 backdrop-blur-md absolute top-0 left-0 right-0 z-10">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-cyan-400" />
              <span className="font-bold tracking-wider">METAL-SCANNER</span>
            </div>
            <button onClick={closeScanner} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
              <X size={20} />
            </button>
          </div>

          {/* Camera Viewport Simulation */}
          <div className="flex-1 relative flex items-center justify-center bg-gray-900">
            
            {!scanResult ? (
                <>
                {/* Simulated Camera Feed Background */}
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-gray-800 to-black"></div>
                
                {/* Viewfinder */}
                <div className="relative w-64 h-64 border-2 border-white/30 rounded-3xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-500 rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-500 rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-500 rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-500 rounded-br-xl"></div>
                    
                    {/* Laser Line */}
                    <div className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-[scan_2s_infinite_linear]"></div>
                </div>
                <div className="absolute mt-80 text-center">
                    <p className="text-sm font-medium animate-pulse">Mencari QR / Kode Batang...</p>
                    <p className="text-xs text-gray-400 mt-1">Sejajarkan kode dalam bingkai</p>
                </div>
                </>
            ) : (
                /* Success Result for Scanner */
                <div className="bg-white text-slate-900 p-8 rounded-2xl max-w-sm w-full mx-6 text-center shadow-2xl animate-in zoom-in duration-200">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Kode Terdeteksi</h3>
                    <div className="bg-slate-100 p-3 rounded-lg font-mono text-sm mb-4 border border-slate-200 break-all">
                        {scanResult}
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                        <button 
                            onClick={closeScanner}
                            className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={() => {
                                closeScanner();
                                if (onViewChange) onViewChange(ViewMode.ECONOMY); // Simple redirect for now
                            }}
                            className="flex-1 py-3 bg-cyan-600 text-white rounded-xl font-bold shadow-lg hover:bg-cyan-700 transition"
                        >
                            Proses
                        </button>
                    </div>
                </div>
            )}
          </div>

          {/* Scanner Footer */}
          {!scanResult && (
             <div className="p-6 bg-black/80 backdrop-blur-sm flex justify-center space-x-8">
                <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition">
                    <div className="p-3 bg-white/10 rounded-full">
                        <Zap size={20} />
                    </div>
                    <span className="text-[10px]">Kilat</span>
                </button>
                <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition">
                     <div className="p-3 bg-white/10 rounded-full">
                        <RefreshCw size={20} />
                    </div>
                    <span className="text-[10px]">Balik</span>
                </button>
             </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { top: 16px; }
          50% { top: 90%; }
          100% { top: 16px; }
        }
      `}</style>
    </div>
  );
};

export default DashboardView;
