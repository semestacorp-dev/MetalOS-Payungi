
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import GovernanceView from './components/GovernanceView';
import EconomyView from './components/EconomyView';
import EnvironmentView from './components/EnvironmentView';
import GapuraView from './components/GapuraView';
import SettingsView from './components/SettingsView';
import Bootloader from './components/Bootloader';
import AiAssistant from './components/AiAssistant';
import EOfficeView from './components/EOfficeView';
import SocialView from './components/SocialView';
import PosKamlingView from './components/PosKamlingView';
import MarketView from './components/MarketView';
import ParkingView from './components/ParkingView';
import HealthView from './components/HealthView';
import BerdayaView from './components/BerdayaView';
import AnjeloSystem from './components/AnjeloSystem';
import EducationView from './components/EducationView';
import { ViewMode, CitizenProfile } from './types';
import { Bell, Search, Menu, ChevronDown, Check, Loader2, RefreshCw, Home, ShoppingBag, QrCode, Users, User, Sparkles, Wifi, Trash2, Phone, Activity, Camera, Upload, X } from 'lucide-react';
import { MOCK_USER, AVAILABLE_USERS } from './constants';

const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.PARKING);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // New state for desktop/tablet sidebar
  
  // Context Aware User State
  const [currentUser, setCurrentUser] = useState<CitizenProfile>(AVAILABLE_USERS[0]); // Default to first user
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isContextSwitching, setIsContextSwitching] = useState(false);

  // Camera & Profile Photo State
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Assistant State (Lifted)
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  // TV Mode State (Lifted for Sidebar coordination)
  const [isTvMode, setIsTvMode] = useState(false);

  // Global Anjelo State
  const [anjeloState, setAnjeloState] = useState<{
    isOpen: boolean;
    service: 'PACKAGE' | 'RIDE' | 'CASH' | 'TRASH' | 'DOCS' | null;
    note: string;
  }>({ isOpen: false, service: null, note: '' });

  // Camera Functions
  const startCamera = async () => {
    try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        setShowCamera(true);
        // Ensure dropdown closes when camera opens
        setIsUserMenuOpen(false); 
    } catch (err) {
        console.error("Camera access denied", err);
        alert("Akses kamera ditolak atau tidak tersedia. Silakan gunakan upload foto.");
    }
  };

  const stopCamera = () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
    }
    setShowCamera(false);
  };

  useEffect(() => {
      if (showCamera && videoRef.current && stream) {
          videoRef.current.srcObject = stream;
      }
  }, [showCamera, stream]);

  const capturePhoto = () => {
    if (videoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setCurrentUser(prev => ({ ...prev, photoUrl: dataUrl }));
            stopCamera();
        }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setCurrentUser(prev => ({ ...prev, photoUrl: reader.result as string }));
            setIsUserMenuOpen(false); // Close menu after upload
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSwitchUser = (user: CitizenProfile) => {
    setIsUserMenuOpen(false);
    if (user.id === currentUser.id) return;

    setIsContextSwitching(true);
    // Simulate OS context switching (reloading prefs, permissions, dashboard layout)
    setTimeout(() => {
        setCurrentUser(user);
        setIsContextSwitching(false);
    }, 1500);
  };

  const triggerAnjelo = (service: 'PACKAGE' | 'RIDE' | 'CASH' | 'TRASH' | 'DOCS' | null = null, note: string = '') => {
      setAnjeloState({ isOpen: true, service, note });
  };

  const closeAnjelo = () => {
      setAnjeloState(prev => ({ ...prev, isOpen: false }));
  };

  // If system is booting, show Bootloader
  if (isBooting) {
    return <Bootloader onComplete={() => setIsBooting(false)} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case ViewMode.DASHBOARD:
        return <DashboardView user={currentUser} onViewChange={setCurrentView} />;
      case ViewMode.GOVERNANCE:
        return <GovernanceView />;
      case ViewMode.EOFFICE:
        return <EOfficeView onOpenAnjelo={triggerAnjelo} />;
      case ViewMode.ECONOMY:
        return <EconomyView user={currentUser} onOpenAnjelo={triggerAnjelo} />;
      case ViewMode.BERDAYA:
        return <BerdayaView user={currentUser} onOpenAnjelo={triggerAnjelo} />;
      case ViewMode.MARKET:
        return <MarketView user={currentUser} />;
      case ViewMode.PARKING:
        return <ParkingView user={currentUser} />;
      case ViewMode.HEALTH:
        return <HealthView user={currentUser} />;
      case ViewMode.ENVIRONMENT:
        return <EnvironmentView user={currentUser} onOpenAnjelo={triggerAnjelo} />;
      case ViewMode.SOCIAL:
        return <SocialView />;
      case ViewMode.GAPURA:
        return <GapuraView user={currentUser} isTvMode={isTvMode} onToggleTvMode={setIsTvMode} />;
      case ViewMode.POSKAMLING:
        return <PosKamlingView user={currentUser} />;
      case ViewMode.EDUCATION:
        return <EducationView user={currentUser} />;
      case ViewMode.SETTINGS:
        return <SettingsView />;
      default:
        return (
          <div className="flex items-center justify-center h-96 text-white/50 font-bold text-xl bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md m-4">
            Modul sedang dalam pengembangan.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 relative selection:bg-pink-500/30 selection:text-pink-200 overflow-hidden bg-slate-900">
      
      {/* Global Ambient Background (Vibrant Mesh Gradient) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-slate-900"></div>
          <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-gradient-to-br from-purple-600/40 to-blue-600/40 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
          <div className="absolute top-[10%] right-[-20%] w-[60%] h-[60%] bg-gradient-to-bl from-cyan-500/40 to-teal-400/40 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-gradient-to-t from-pink-600/40 to-orange-500/40 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      </div>

      {/* Camera Modal Overlay */}
      {showCamera && (
          <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
              <div className="relative w-full h-full max-w-2xl max-h-[80vh] bg-black flex flex-col items-center">
                  <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover rounded-2xl border-4 border-slate-800"
                  />
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8">
                      <button 
                          onClick={stopCamera}
                          className="bg-slate-800 text-white p-4 rounded-full hover:bg-slate-700 transition"
                      >
                          <X size={24} />
                      </button>
                      <button 
                          onClick={capturePhoto}
                          className="bg-white p-2 rounded-full border-4 border-slate-300 hover:border-white transition"
                      >
                          <div className="w-16 h-16 bg-white rounded-full border-2 border-black"></div>
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Context Switch Overlay */}
      {isContextSwitching && (
          <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center animate-in zoom-in duration-300 border border-white/20 text-white">
                  <RefreshCw className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                  <h3 className="text-xl font-bold tracking-wide">Switching Identity...</h3>
                  <p className="text-white/50 text-sm mt-1">Loading profile for {currentUser.role}</p>
              </div>
          </div>
      )}

      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isTvMode={isTvMode}
        onToggleTvMode={setIsTvMode}
        user={currentUser}
      />

      {/* Main Content Container - Adjusted for Floating Sidebar */}
      <main 
        className={`relative z-10 min-h-screen transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] flex flex-col 
        ${isSidebarCollapsed || isTvMode ? 'md:ml-[114px]' : 'md:ml-[304px]'} 
        pb-28 md:pb-4 md:pr-4 pt-4`}
      >
        
        {/* Ultra Modern Floating Header - Hide in TV Mode */}
        <header className={`sticky top-0 z-30 mx-2 md:mx-0 mb-6 transition-all duration-500 ${isTvMode ? '-translate-y-32 opacity-0' : 'translate-y-0 opacity-100'}`}>
            <div className="bg-white/10 backdrop-blur-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-[2rem] px-6 py-3.5 flex justify-between items-center transition-all duration-300 hover:bg-white/15">
                
                {/* Left: Title & Mobile Menu */}
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="hidden md:flex p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all">
                        <Menu className="w-5 h-5" />
                    </button>
                    <div>
                        {/* Mobile Logo only shown if scrolled or simple view, otherwise dynamic title */}
                        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 drop-shadow-md">
                            <span className="md:hidden text-cyan-400 font-black">Warga.Yosomulyo</span>
                            <span className="hidden md:inline">
                                {currentView === ViewMode.DASHBOARD && 'Cognitive Dashboard'}
                                {currentView === ViewMode.GOVERNANCE && 'Tata Kelola'}
                                {currentView === ViewMode.EOFFICE && 'Workspace'}
                                {currentView === ViewMode.BERDAYA && 'Warga Berdaya'}
                                {currentView === ViewMode.ECONOMY && 'Ekonomi'}
                                {currentView === ViewMode.MARKET && 'Pasar Payungi'}
                                {currentView === ViewMode.PARKING && 'Parkir'}
                                {currentView === ViewMode.HEALTH && 'Kesehatan'}
                                {currentView === ViewMode.ENVIRONMENT && 'Lingkungan'}
                                {currentView === ViewMode.SOCIAL && 'Sosial'}
                                {currentView === ViewMode.GAPURA && 'Smart Gateway'}
                                {currentView === ViewMode.POSKAMLING && 'Keamanan'}
                                {currentView === ViewMode.EDUCATION && 'Pendidikan'}
                                {currentView === ViewMode.SETTINGS && 'Pengaturan'}
                            </span>
                        </h2>
                    </div>
                </div>

                {/* Right: Actions, User & AI */}
                <div className="flex items-center gap-3">
                    
                    {/* MetalGate Connection Widget */}
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full mr-2 backdrop-blur-md shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_5px_#22c55e]"></span>
                        </span>
                        <span className="text-[10px] font-bold text-green-400 tracking-wide uppercase">MetalGate Online</span>
                        <Wifi size={12} className="text-green-400" />
                    </div>

                    {/* Notification */}
                    <button className="relative p-2.5 text-white/70 hover:bg-white/10 hover:text-white rounded-full transition-all">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border border-white/20 shadow-[0_0_8px_#ef4444]"></span>
                    </button>
                    
                    {/* Divider */}
                    <div className="h-6 w-px bg-white/10 mx-1 hidden md:block"></div>

                    {/* User Profile - Left of AI */}
                    <div className="relative flex items-center gap-2">
                        
                        <button 
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-3 p-1 pl-1 pr-2 rounded-full hover:bg-white/10 transition border border-transparent hover:border-white/10 group"
                        >
                            <div className="relative">
                                <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-white/50 to-white/10 shadow-sm ring-1 ring-white/20">
                                    <img 
                                        src={currentUser.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.avatarSeed}`} 
                                        alt="User" 
                                        className="w-full h-full rounded-full bg-slate-800 object-cover"
                                    />
                                </div>
                                <div className="absolute bottom-0 right-0 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-slate-900 shadow-[0_0_5px_#22c55e]"></div>
                            </div>
                            <div className="text-left hidden md:block">
                                <p className="text-xs font-bold text-white leading-none group-hover:text-cyan-300 transition shadow-black drop-shadow-md">{currentUser.name.split(' ')[0]}</p>
                                <p className="text-[9px] text-white/60 font-medium truncate max-w-[80px] leading-tight mt-0.5">{currentUser.role.split(' / ')[0]}</p>
                            </div>
                            <ChevronDown size={12} className="text-white/50 hidden md:block" />
                        </button>

                        {/* Dropdown Menu */}
                        {isUserMenuOpen && (
                            <div className="absolute right-0 top-full mt-3 w-72 bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 py-2 z-50 animate-in fade-in slide-in-from-top-2 ring-1 ring-white/5 flex flex-col overflow-hidden">
                                
                                {/* Current User Profile & Edit Photo */}
                                <div className="p-5 border-b border-white/10 flex flex-col items-center bg-white/5">
                                    <div className="relative w-20 h-20 mb-3 group">
                                        <img 
                                            src={currentUser.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.avatarSeed}`} 
                                            alt="User" 
                                            className="w-full h-full rounded-full bg-slate-800 border-2 border-white/20 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <div className="flex gap-2">
                                                <button onClick={startCamera} className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition" title="Kamera">
                                                    <Camera size={16} className="text-white" />
                                                </button>
                                                <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition" title="Upload Foto">
                                                    <Upload size={16} className="text-white" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                                    
                                    <h3 className="font-bold text-white text-lg">{currentUser.name}</h3>
                                    <p className="text-xs text-slate-400">{currentUser.role}</p>
                                </div>

                                <div className="px-5 py-2 border-b border-white/5">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Switch Identity</span>
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                    {AVAILABLE_USERS.map((user) => (
                                        <button 
                                            key={user.id}
                                            onClick={() => handleSwitchUser(user)}
                                            className="w-full text-left px-5 py-3 hover:bg-white/5 flex items-center justify-between group transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full overflow-hidden border transition-all ${currentUser.id === user.id ? 'border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'border-white/10'}`}>
                                                    <img src={user.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed}`} alt={user.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-bold transition ${currentUser.id === user.id ? 'text-cyan-400' : 'text-slate-200'}`}>{user.name}</p>
                                                    <p className="text-xs text-slate-500 truncate max-w-[140px]">{user.role}</p>
                                                </div>
                                            </div>
                                            {currentUser.id === user.id && <Check size={14} className="text-cyan-400" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Metal AI Trigger - Far Right Corner */}
                    <button 
                        onClick={() => setIsAiChatOpen(!isAiChatOpen)}
                        className={`relative group transition-all duration-300 ${isAiChatOpen ? 'scale-110' : 'hover:scale-105 active:scale-95'}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-full blur opacity-60 group-hover:opacity-80 transition duration-300 animate-pulse"></div>
                        <div className="relative w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-950 rounded-full flex items-center justify-center text-white border border-white/20 shadow-xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                            <Sparkles className={`w-5 h-5 transition-all duration-500 ${isAiChatOpen ? 'text-cyan-300 fill-cyan-300 rotate-180' : 'text-white group-hover:text-blue-200'}`} />
                        </div>
                    </button>

                </div>
            </div>
        </header>

        {/* Main Content Body */}
        <div className="px-2 md:px-0 md:pr-4 max-w-[1600px] mx-auto w-full">
          {renderContent()}
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION - COMPACT GRID LAYOUT */}
      {!isTvMode && (
        <div className="fixed bottom-0 left-0 right-0 w-full bg-slate-900/95 backdrop-blur-3xl border-t border-white/10 md:hidden z-40 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.5)] grid grid-cols-5 items-end pb-1 pt-1">
            <button 
                onClick={() => setCurrentView(ViewMode.DASHBOARD)}
                className={`relative flex flex-col items-center justify-center h-14 w-full transition-all duration-300 group ${currentView === ViewMode.DASHBOARD ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}
            >
                <div className={`p-1.5 rounded-xl transition-all ${currentView === ViewMode.DASHBOARD ? 'bg-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.3)]' : ''}`}>
                    <Home size={18} strokeWidth={currentView === ViewMode.DASHBOARD ? 2.5 : 2} />
                </div>
                <span className="text-[9px] font-bold mt-1">Home</span>
            </button>
            
            <button 
                onClick={() => setCurrentView(ViewMode.BERDAYA)}
                className={`relative flex flex-col items-center justify-center h-14 w-full transition-all duration-300 group ${currentView === ViewMode.BERDAYA ? 'text-orange-400' : 'text-slate-400 hover:text-white'}`}
            >
                <div className={`p-1.5 rounded-xl transition-all ${currentView === ViewMode.BERDAYA ? 'bg-orange-500/20 shadow-[0_0_10px_rgba(251,146,60,0.3)]' : ''}`}>
                    <ShoppingBag size={18} strokeWidth={currentView === ViewMode.BERDAYA ? 2.5 : 2} />
                </div>
                <span className="text-[9px] font-bold mt-1">Niaga</span>
            </button>
            
            {/* Center Action (Pay/Scan) - Integrated */}
            <div className="relative flex justify-center items-end h-full w-full">
                <button 
                    onClick={() => setCurrentView(ViewMode.ECONOMY)}
                    className="absolute -top-3 w-12 h-12 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-[0_5px_20px_rgba(59,130,246,0.5)] text-white hover:scale-105 active:scale-95 transition border-[3px] border-slate-900 ring-1 ring-white/10"
                >
                    <QrCode size={20} strokeWidth={2.5} />
                </button>
                <span className="text-[9px] font-bold text-blue-400 mt-auto mb-1">Scan</span>
            </div>

            <button 
                onClick={() => setCurrentView(ViewMode.SOCIAL)}
                className={`relative flex flex-col items-center justify-center h-14 w-full transition-all duration-300 group ${currentView === ViewMode.SOCIAL ? 'text-red-400' : 'text-slate-400 hover:text-white'}`}
            >
                <div className={`p-1.5 rounded-xl transition-all ${currentView === ViewMode.SOCIAL ? 'bg-red-500/20 shadow-[0_0_10px_rgba(248,113,113,0.3)]' : ''}`}>
                    <Users size={18} strokeWidth={currentView === ViewMode.SOCIAL ? 2.5 : 2} />
                </div>
                <span className="text-[9px] font-bold mt-1">Sosial</span>
            </button>
            
            <button 
                onClick={() => setCurrentView(ViewMode.ENVIRONMENT)}
                className={`relative flex flex-col items-center justify-center h-14 w-full transition-all duration-300 group ${currentView === ViewMode.ENVIRONMENT ? 'text-green-400' : 'text-slate-400 hover:text-white'}`}
            >
                <div className={`p-1.5 rounded-xl transition-all ${currentView === ViewMode.ENVIRONMENT ? 'bg-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.3)]' : ''}`}>
                    <Activity size={18} strokeWidth={currentView === ViewMode.ENVIRONMENT ? 2.5 : 2} />
                </div>
                <span className="text-[9px] font-bold mt-1">Net</span>
            </button>
        </div>
      )}

      <AnjeloSystem 
        isOpen={anjeloState.isOpen} 
        onClose={closeAnjelo} 
        user={currentUser}
        initialService={anjeloState.service}
        initialNote={anjeloState.note}
      />

      {/* AI Assistant Controlled from Header */}
      <AiAssistant 
        isOpen={isAiChatOpen} 
        onClose={() => setIsAiChatOpen(false)} 
      />
    </div>
  );
};

export default App;
