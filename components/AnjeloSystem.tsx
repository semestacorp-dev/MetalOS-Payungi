
import React, { useState, useEffect } from 'react';
import { Truck, Bike, DollarSign, FileText, Trash2, X, MapPin, User, Star, CheckCircle, MessageCircle, Phone } from 'lucide-react';
import { CitizenProfile } from '../types';

interface AnjeloSystemProps {
  isOpen: boolean;
  onClose: () => void;
  user: CitizenProfile;
  initialService?: 'PACKAGE' | 'RIDE' | 'CASH' | 'TRASH' | 'DOCS' | null;
  initialNote?: string;
}

const AnjeloSystem: React.FC<AnjeloSystemProps> = ({ isOpen, onClose, user, initialService, initialNote }) => {
  const [state, setState] = useState<'SELECT' | 'INPUT' | 'SEARCHING' | 'FOUND'>('SELECT');
  const [service, setService] = useState<'PACKAGE' | 'RIDE' | 'CASH' | 'TRASH' | 'DOCS'>('PACKAGE');
  const [note, setNote] = useState('');
  const [assignedDriver, setAssignedDriver] = useState<{name: string, plate: string, rating: number} | null>(null);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      if (initialService) {
        setService(initialService);
        setNote(initialNote || '');
        setState('INPUT');
      } else {
        setState('SELECT');
        setNote('');
      }
      setAssignedDriver(null);
    }
  }, [isOpen, initialService, initialNote]);

  const handleOrder = () => {
    setState('SEARCHING');
    // Simulate finding driver
    setTimeout(() => {
      const drivers = [
        { name: "Ahmad Dani", plate: "BE 4521 YD", rating: 4.9 },
        { name: "Budi Santoso", plate: "BE 2210 AA", rating: 4.8 },
        { name: "Mas Tono", plate: "BE 5599 XY", rating: 5.0 }
      ];
      setAssignedDriver(drivers[Math.floor(Math.random() * drivers.length)]);
      setState('FOUND');
    }, 2500);
  };

  if (!isOpen) return null;

  const services = [
    { id: 'PACKAGE', label: 'Antar Paket', icon: Truck, color: 'bg-orange-100 text-orange-600', accent: 'bg-orange-500' },
    { id: 'RIDE', label: 'Ojek Desa', icon: Bike, color: 'bg-green-100 text-green-600', accent: 'bg-green-500' },
    { id: 'CASH', label: 'Tarik Tunai', icon: DollarSign, color: 'bg-blue-100 text-blue-600', accent: 'bg-blue-500' },
    { id: 'TRASH', label: 'Jemput Sampah', icon: Trash2, color: 'bg-yellow-100 text-yellow-600', accent: 'bg-yellow-500' },
    { id: 'DOCS', label: 'Kirim Dokumen', icon: FileText, color: 'bg-purple-100 text-purple-600', accent: 'bg-purple-500' },
  ];

  const activeService = services.find(s => s.id === service);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh] border border-white/20 ring-1 ring-black/5 transition-all duration-500">
        
        {/* Header */}
        <div className={`p-8 text-white relative transition-all duration-500 overflow-hidden ${activeService?.accent || 'bg-slate-800'}`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -right-10 -top-10 opacity-20 transform rotate-12 scale-150">
              {activeService && <activeService.icon size={120} />}
          </div>
          
          <button onClick={onClose} className="absolute top-6 right-6 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full transition backdrop-blur-sm">
            <X size={20} />
          </button>
          
          <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md border border-white/20 shadow-sm">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-black tracking-tight">Anjelo System</h2>
              </div>
              <p className="text-white/90 text-sm font-medium ml-1">Layanan Logistik & Mobilitas Desa</p>
          </div>
        </div>

        <div className="p-8 overflow-y-auto">
          
          {/* STATE: SELECT SERVICE */}
          {state === 'SELECT' && (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <h3 className="font-bold text-slate-800 mb-5 text-lg">Pilih Layanan</h3>
              <div className="grid grid-cols-2 gap-4">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setService(s.id as any); setState('INPUT'); }}
                    className="p-5 rounded-2xl border border-white/50 bg-white/50 shadow-sm hover:shadow-md hover:bg-white transition text-left group active:scale-95"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${s.color}`}>
                      <s.icon size={24} />
                    </div>
                    <span className="font-bold text-slate-700 group-hover:text-slate-900 text-sm">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STATE: INPUT DETAILS */}
          {state === 'INPUT' && (
            <div className="animate-in slide-in-from-right-8 duration-300 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/50">
                <div className={`p-3 rounded-xl ${activeService?.color}`}>
                  {activeService && <activeService.icon size={24} />}
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Layanan Aktif</p>
                  <p className="font-bold text-slate-800 text-lg">{activeService?.label}</p>
                </div>
                <button onClick={() => setState('SELECT')} className="ml-auto text-xs text-blue-600 font-bold hover:bg-blue-50 px-3 py-1.5 rounded-full transition">Ubah</button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider ml-1">Lokasi Penjemputan</label>
                  <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="p-2 bg-red-50 rounded-full">
                        <MapPin className="text-red-500 w-5 h-5 shrink-0" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">Rumah {user.name}</p>
                      <p className="text-xs text-slate-500">RW 05, Kelurahan Yosomulyo</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider ml-1">
                    {service === 'CASH' ? 'Nominal Penarikan' : service === 'RIDE' ? 'Tujuan' : 'Catatan / Detail Barang'}
                  </label>
                  <div className="relative">
                    <div className="absolute top-3.5 left-4 text-slate-400">
                        <FileText className="w-5 h-5" />
                    </div>
                    <textarea 
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder={service === 'CASH' ? 'Contoh: Rp 500.000' : 'Tulis detail disini...'}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none h-28 resize-none transition shadow-sm"
                    ></textarea>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleOrder}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl shadow-orange-500/20 transition transform active:scale-[0.98] hover:translate-y-[-2px] text-lg flex items-center justify-center gap-2 ${activeService?.accent}`}
              >
                <Truck size={20} />
                Panggil Anjelo
              </button>
            </div>
          )}

          {/* STATE: SEARCHING */}
          {state === 'SEARCHING' && (
            <div className="py-12 text-center animate-in zoom-in duration-300">
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full animate-ping opacity-75"></div>
                <div className="absolute inset-0 border-4 border-slate-200 rounded-full animate-ping animation-delay-500"></div>
                <div className={`absolute inset-2 border-4 rounded-full animate-pulse ${activeService?.color.replace('bg-', 'border-').replace('100', '200')}`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {activeService && <activeService.icon className={`w-12 h-12 ${activeService.color.split(' ')[1]}`} />}
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Mencari Mitra...</h3>
              <p className="text-slate-500 font-medium">Menghubungkan dengan kurir terdekat</p>
            </div>
          )}

          {/* STATE: FOUND */}
          {state === 'FOUND' && assignedDriver && (
            <div className="text-center animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-[0_0_30px_rgba(34,197,94,0.3)] ring-4 ring-white">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-8">Kurir Ditemukan!</h3>
              
              <div className="bg-white p-5 rounded-2xl flex items-center space-x-5 text-left border border-slate-200 shadow-lg mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 shrink-0 border-2 border-white shadow-md">
                  <User size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 truncate text-lg">{assignedDriver.name}</h4>
                  <div className="flex items-center text-sm text-slate-500 mt-1">
                    <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-mono mr-2 text-xs font-bold">{assignedDriver.plate}</span>
                    <Star className="w-3.5 h-3.5 text-yellow-500 mr-1" fill="currentColor" />
                    <span className="font-bold">{assignedDriver.rating}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tiba</p>
                  <p className="font-black text-green-600 text-xl">3 <span className="text-xs font-normal">mnt</span></p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button onClick={onClose} className="flex-1 border border-slate-200 py-3.5 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition">
                  Tutup
                </button>
                <button className="flex-1 bg-green-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-green-600/20 hover:bg-green-700 flex items-center justify-center gap-2 transition transform active:scale-95">
                  <MessageCircle size={20} /> Chat
                </button>
                <button className="bg-slate-100 text-slate-600 p-3.5 rounded-xl hover:bg-slate-200 transition">
                    <Phone size={20} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AnjeloSystem;
