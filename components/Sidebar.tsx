
import React, { useState } from 'react';
import { ViewMode, CitizenProfile } from '../types';
import { SecurityService } from '../services/securityService';
import { LayoutDashboard, Building2, Wallet, Leaf, Users, Settings, Activity, Router, Briefcase, Siren, Store, ChevronLeft, ChevronRight, Car, HeartPulse, ShoppingBag, GraduationCap, Lock, Phone, Wifi, Trash2 } from 'lucide-react';
import { MOCK_USER } from '../constants';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  isCollapsed: boolean;
  onToggle: () => void;
  isTvMode?: boolean;
  onToggleTvMode?: (mode: boolean) => void;
  user: CitizenProfile;
}

// Custom Composite Icon for WargaNet
const WargaNetIcon = ({ className, strokeWidth }: { className?: string; strokeWidth?: number }) => (
  <div className={`${className} relative flex items-center justify-center overflow-visible`}>
    {/* Leaf Background */}
    <Leaf className="absolute text-green-600/50 scale-125 rotate-12" strokeWidth={1.5} />
    
    {/* Phone (Main) */}
    <Phone className="w-full h-full text-green-500 z-10 relative" strokeWidth={strokeWidth} />
    
    {/* Wifi (Connectivity) - Top Right */}
    <div className="absolute -top-1.5 -right-1.5 bg-slate-900 rounded-full p-[1px] border border-slate-800 z-20">
        <Wifi className="w-2.5 h-2.5 text-green-400" strokeWidth={3} />
    </div>
    
    {/* Trash - Bottom Right */}
    <div className="absolute -bottom-1.5 -right-1.5 bg-slate-900 rounded-full p-[1px] border border-slate-800 z-20">
        <Trash2 className="w-2.5 h-2.5 text-green-400" strokeWidth={3} />
    </div>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isCollapsed, onToggle, isTvMode = false, onToggleTvMode, user = MOCK_USER }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Fallback if user is somehow undefined despite default prop
  const activeUser = user || MOCK_USER;

  const allMenuItems = [
    { mode: ViewMode.DASHBOARD, label: 'Dasbor', icon: LayoutDashboard },
    { mode: ViewMode.GOVERNANCE, label: 'Tata Kelola', icon: Building2 },
    { mode: ViewMode.EOFFICE, label: 'Ruang Kerja', icon: Briefcase },
    { mode: ViewMode.BERDAYA, label: 'Berdaya (Niaga)', icon: ShoppingBag },
    { mode: ViewMode.ECONOMY, label: 'Keuangan', icon: Wallet },
    { mode: ViewMode.MARKET, label: 'Pasar Payungi', icon: Store },
    { mode: ViewMode.PARKING, label: 'Parkir & Mobilitas', icon: Car },
    { mode: ViewMode.HEALTH, label: 'Kesehatan', icon: HeartPulse },
    { mode: ViewMode.EDUCATION, label: 'Pendidikan', icon: GraduationCap },
    { mode: ViewMode.ENVIRONMENT, label: 'WargaNet', icon: WargaNetIcon },
    { mode: ViewMode.SOCIAL, label: 'Sosial & Laporan', icon: Users },
    { mode: ViewMode.GAPURA, label: 'Gerbang Pintar', icon: Router },
    { mode: ViewMode.POSKAMLING, label: 'Keamanan', icon: Siren },
  ];

  // Filter items based on RBAC/Permissions
  const visibleMenuItems = allMenuItems.filter(item => {
      // Check if user has permission for this view
      const decision = SecurityService.evaluateAccess(activeUser, item.mode);
      
      // We show the item if allowed, OR if it's denied due to CAP (so they know it exists but is blocked)
      // But if it's strictly RBAC denied (insufficient privileges), we hide it to reduce clutter
      if (!decision.allowed && decision.reason?.startsWith('RBAC_DENIED')) {
          return false;
      }
      return true;
  });

  // Smart expand logic
  const effectiveWidth = isTvMode 
    ? 'w-[80px]' 
    : (isCollapsed && !isHovered) ? 'w-[90px]' : 'w-[280px]';

  return (
    <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`hidden md:flex flex-col text-white fixed left-4 top-4 bottom-4 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] 
        ${isTvMode ? 'bg-transparent border-none shadow-none pointer-events-none z-[210]' : 'bg-slate-900/70 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] z-[200]'}
        ${effectiveWidth} 
        rounded-[2.5rem] overflow-hidden`}
    >
      {/* Sidebar Header */}
      <div className={`flex items-center h-28 transition-all duration-500 ${isCollapsed || isTvMode ? 'pl-[22px]' : 'pl-8'}`}>
        <div 
            className={`relative shrink-0 group cursor-pointer z-10 ${isTvMode ? 'pointer-events-auto' : ''}`}
            onClick={() => isTvMode && onToggleTvMode && onToggleTvMode(false)}
            title={isTvMode ? "Keluar Mode MetalTV" : "Dasbor MetalOS"}
        >
             <div className={`absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full group-hover:opacity-40 transition duration-500 ${isTvMode ? 'opacity-0' : ''}`}></div>
             <div className={`relative p-3 rounded-2xl border shadow-xl backdrop-blur-md transition-all ${isTvMode ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white/5 border-white/10'}`}>
                <Activity className="text-cyan-400 w-6 h-6" />
             </div>
             <div className={`absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 shadow-[0_0_10px_#22c55e] transition-transform duration-500 ${isCollapsed || isTvMode ? 'scale-100' : 'scale-0'}`}></div>
        </div>
        
        <div className={`ml-4 overflow-hidden whitespace-nowrap transition-all duration-500 ${(isCollapsed && !isHovered) || isTvMode ? 'w-0 opacity-0 translate-x-10' : 'w-40 opacity-100 translate-x-0'}`}>
            {/* BRANDING TEMPLATE */}
            <div className="flex flex-col">
                <h1 className="text-2xl font-black tracking-tight text-white font-sans drop-shadow-md leading-none">
                    Warga<span className="text-cyan-400">.</span>
                </h1>
                <p className="text-[10px] font-bold text-cyan-400 tracking-[0.25em] uppercase mt-1 leading-none opacity-80">
                    YOSOMULYO
                </p>
            </div>
            
            <div className="flex items-center gap-1.5 mt-2.5 opacity-50">
                <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></div>
                <p className="text-[8px] text-slate-300 tracking-wider font-mono">METALOS 1.0</p>
            </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 py-4 space-y-2 px-4 overflow-y-auto overflow-x-hidden custom-scrollbar transition-opacity duration-500 ${isTvMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {visibleMenuItems.map((item) => {
            const isActive = currentView === item.mode;
            const access = SecurityService.evaluateAccess(activeUser, item.mode);
            
            return (
              <button
                key={item.mode}
                onClick={() => onViewChange(item.mode)}
                className={`relative w-full flex items-center py-3.5 rounded-2xl transition-all duration-500 group overflow-hidden ${isCollapsed && !isHovered ? 'px-0' : 'px-0'} ${!access.allowed ? 'opacity-50 grayscale' : ''}`}
                title={!access.allowed ? access.reason : item.label}
              >
                {/* Active Background Slide */}
                <div className={`absolute inset-0 bg-white/10 rounded-2xl transition-all duration-500 ease-out ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`}></div>
                
                {/* Icon */}
                <div className={`relative z-10 shrink-0 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isCollapsed && !isHovered ? 'translate-x-[17px]' : 'translate-x-4'}`}>
                    <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-blue-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-transparent text-slate-400 group-hover:text-white'}`}>
                        <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                </div>
                
                {/* Label */}
                <span className={`relative z-10 font-bold text-sm tracking-wide whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
                    isCollapsed && !isHovered ? 'opacity-0 translate-x-20 w-0' : `opacity-100 translate-x-8 w-auto ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`
                }`}>
                    {item.label}
                </span>

                {/* Lock Icon if restricted by CAP */}
                {!access.allowed && !isCollapsed && (
                    <div className="absolute right-4 z-10">
                        <Lock size={12} className="text-red-400" />
                    </div>
                )}

                {/* Active Indicator Dots */}
                {isActive && (!isCollapsed || isHovered) && (
                    <div className="absolute right-4 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee] animate-in fade-in duration-700"></div>
                )}
                
                {/* Tooltip for Collapsed Mode */}
                {isCollapsed && !isHovered && (
                    <div className="absolute left-[70px] bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 pointer-events-none border border-white/10 z-50 whitespace-nowrap">
                        {item.label} {!access.allowed && ' (Terkunci)'}
                    </div>
                )}
              </button>
            );
        })}
      </nav>

      {/* Footer Actions */}
      <div className={`p-4 space-y-3 mx-auto w-full max-w-[248px] transition-opacity duration-500 ${isTvMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className={`bg-white/5 backdrop-blur-sm rounded-3xl border border-white/5 transition-all duration-500 ${isCollapsed && !isHovered ? 'p-2' : 'p-3'}`}>
            {SecurityService.hasPermission(activeUser, 'SYSTEM_SETTINGS') && (
                <button
                    onClick={() => onViewChange(ViewMode.SETTINGS)}
                    className={`relative w-full flex items-center py-3 rounded-xl transition-all group overflow-hidden ${isCollapsed && !isHovered ? 'justify-center' : 'justify-start px-3'}`}
                >
                    <Settings className={`shrink-0 w-5 h-5 transition-all duration-500 ${currentView === ViewMode.SETTINGS ? 'text-cyan-300 rotate-90' : 'text-slate-400 group-hover:text-white'}`} />
                    <span className={`ml-3 font-medium text-sm whitespace-nowrap transition-all duration-500 ${isCollapsed && !isHovered ? 'w-0 opacity-0 translate-x-10' : 'w-auto opacity-100 translate-x-0 text-slate-400 group-hover:text-white'}`}>
                        Pengaturan
                    </span>
                </button>
            )}
            
            <button
                onClick={onToggle}
                className={`w-full flex items-center justify-center py-3 rounded-xl text-slate-500 hover:bg-white/10 hover:text-cyan-400 transition-all mt-1 ${isCollapsed && !isHovered ? '' : 'border-t border-white/5'}`}
                title={isCollapsed ? "Sematkan Sidebar" : "Lepaskan Sidebar (Tutup Otomatis)"}
            >
                {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
