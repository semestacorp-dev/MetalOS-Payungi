import React, { useState, useRef } from 'react';
import { Store, ShoppingBag, CreditCard, User, QrCode, Search, Filter, History, CheckCircle, TrendingUp, DollarSign, Wallet, ArrowRight, Printer, RefreshCw, X, Map as MapIcon, Armchair, AlertCircle, Utensils, Brush, Users, Move, Lock, Unlock, Save, Eraser, Plus, Home, MoreHorizontal, Trees, Footprints, Zap, Briefcase, Box, LayoutTemplate, MousePointer, Leaf, Coins, Check, Calendar, ChevronRight } from 'lucide-react';
import { MARKET_STALLS, MOCK_USER, MARKET_LAYOUT_DATA } from '../constants';
import { CitizenProfile, MarketStall, MarketLayoutItem, TableStatus, LayoutItemType } from '../types';

interface MarketViewProps {
  user?: CitizenProfile;
}

const POINT_CONVERSION_RATE = 100; // 1 Point = Rp 100

const MarketView: React.FC<MarketViewProps> = ({ user = MOCK_USER }) => {
  // Determine if User is a regular customer (not admin/merchant)
  const isCustomer = user.role === 'Warga Berdaya' || user.role === 'Warga Bergerak';

  const [activeTab, setActiveTab] = useState<'POS' | 'TOPUP' | 'MANAGE' | 'LAYOUT'>(isCustomer ? 'LAYOUT' : 'POS');
  const [stalls, setStalls] = useState<MarketStall[]>(MARKET_STALLS);
  
  // POS STATE
  const [selectedStall, setSelectedStall] = useState<MarketStall | null>(null);
  const [amount, setAmount] = useState<string>('');
  
  // PAYMENT FLOW STATE
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'SELECT' | 'PROCESSING' | 'SUCCESS'>('SELECT');
  const [selectedMethod, setSelectedMethod] = useState<'QRIS' | 'WARGAPAY' | 'POINTS' | null>(null);

  // TOPUP STATE
  const [topupUser, setTopupUser] = useState('');
  const [topupAmount, setTopupAmount] = useState<string>('');
  const [isTopupSuccess, setIsTopupSuccess] = useState(false);

  // LAYOUT STATE
  const [layoutItems, setLayoutItems] = useState<MarketLayoutItem[]>(MARKET_LAYOUT_DATA);
  const [selectedTable, setSelectedTable] = useState<MarketLayoutItem | null>(null);
  
  // LAYOUT EDITING STATE
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEraserActive, setIsEraserActive] = useState(false);
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // RESERVATION STATE
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservationTable, setReservationTable] = useState<MarketLayoutItem | null>(null);

  // SEARCH & FILTER
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStalls = stalls.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNumberClick = (num: string) => {
      if (amount.length < 10) setAmount(prev => prev + num);
  };

  const handleBackspace = () => {
      setAmount(prev => prev.slice(0, -1));
  };

  const openPaymentSelection = () => {
      if (!selectedStall || !amount) return;
      setPaymentStep('SELECT');
      setSelectedMethod(null);
      setShowPaymentModal(true);
  };

  const handleProcessPayment = (method: 'QRIS' | 'WARGAPAY' | 'POINTS') => {
      setSelectedMethod(method);
      setPaymentStep('PROCESSING');
      
      // Simulate Processing
      setTimeout(() => {
          setPaymentStep('SUCCESS');
          // Update Revenue
          setStalls(prev => prev.map(s => 
              s.id === selectedStall?.id 
              ? { ...s, revenueToday: s.revenueToday + parseInt(amount) } 
              : s
          ));
      }, 2000);
  };

  const handleClosePayment = () => {
      setShowPaymentModal(false);
      setAmount('');
      setSelectedStall(null);
      setPaymentStep('SELECT');
      setSelectedMethod(null);
  };

  const handleTopup = () => {
      if (!topupUser || !topupAmount) return;
      setIsTopupSuccess(true);
      setTimeout(() => {
          setIsTopupSuccess(false);
          setTopupUser('');
          setTopupAmount('');
      }, 2000);
  };

  // Layout Handlers
  const handleAddItem = (type: LayoutItemType) => {
      const newItem: MarketLayoutItem = {
          id: `item_${Date.now()}`,
          type: type,
          label: type.charAt(0) + type.slice(1).toLowerCase(),
          x: 50,
          y: 50,
          width: type === 'STREET' ? 20 : undefined,
          height: type === 'STREET' ? 5 : undefined,
          status: type === 'TABLE' ? 'AVAILABLE' : undefined,
          capacity: type === 'TABLE' ? 4 : undefined
      };
      setLayoutItems([...layoutItems, newItem]);
  };

  const handleRemoveItem = (id: string) => {
      setLayoutItems(prev => prev.filter(item => item.id !== id));
  };

  const handleLayoutItemClick = (item: MarketLayoutItem) => {
      // If eraser is active in edit mode, delete the item
      if (isEditMode && isEraserActive) {
          handleRemoveItem(item.id);
          return;
      }

      // Disable detail interaction in edit mode (unless it's deletion)
      if (isEditMode) return;

      // Customer Logic: Reservation
      if (isCustomer) {
          if (item.type === 'TABLE' && item.status === 'AVAILABLE') {
              setReservationTable(item);
              setShowReservationModal(true);
          }
          return;
      }

      // Admin Logic
      if (item.type === 'STALL' && item.linkedStallId) {
          // Find the stall and switch to POS
          const stall = stalls.find(s => s.id === item.linkedStallId);
          if (stall) {
              setSelectedStall(stall);
              setActiveTab('POS');
          }
      } else if (item.type === 'TABLE') {
          setSelectedTable(item);
      }
  };

  const updateTableStatus = (status: TableStatus) => {
      if (!selectedTable) return;
      setLayoutItems(prev => prev.map(item => 
          item.id === selectedTable.id ? { ...item, status } : item
      ));
      setSelectedTable(null);
  };

  const handleReserveTable = () => {
      if (!reservationTable) return;
      
      // Update table status to occupied (simulating booking)
      setLayoutItems(prev => prev.map(item => 
          item.id === reservationTable.id ? { ...item, status: 'OCCUPIED' } : item
      ));
      
      setShowReservationModal(false);
      setReservationTable(null);
      alert(`Meja ${reservationTable.label} berhasil dipesan atas nama ${user.name}!`);
  };

  // Drag and Drop Logic
  const handleMouseDown = (e: React.MouseEvent, itemId: string) => {
      if (!isEditMode || isEraserActive) return;
      e.preventDefault();
      e.stopPropagation();
      setDraggingItemId(itemId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (!isEditMode || !draggingItemId || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Calculate new position as percentage relative to container
      let newX = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      let newY = ((e.clientY - containerRect.top) / containerRect.height) * 100;

      // Clamp values
      newX = Math.max(0, Math.min(100, newX));
      newY = Math.max(0, Math.min(100, newY));

      setLayoutItems(prev => prev.map(item => 
          item.id === draggingItemId ? { ...item, x: newX, y: newY } : item
      ));
  };

  const handleMouseUp = () => {
      setDraggingItemId(null);
  };

  const getTableColor = (status?: TableStatus) => {
      switch(status) {
          case 'AVAILABLE': return 'bg-green-100 border-green-300 text-green-700';
          case 'OCCUPIED': return 'bg-red-100 border-red-300 text-red-700';
          case 'ORDERING': return 'bg-orange-100 border-orange-300 text-orange-700';
          case 'DIRTY': return 'bg-slate-200 border-slate-400 text-slate-600';
          default: return 'bg-white border-slate-200';
      }
  };

  const renderItemVisual = (item: MarketLayoutItem) => {
      const isSelected = isEditMode && draggingItemId === item.id;
      
      const baseClasses = `absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shadow-sm border-2 select-none
        ${isEditMode 
            ? (isEraserActive ? 'cursor-not-allowed hover:bg-red-100 hover:border-red-500' : 'cursor-move hover:scale-105 hover:shadow-lg') 
            : 'cursor-pointer hover:scale-105 active:scale-95'}
        ${isSelected ? 'scale-110 shadow-xl z-50 opacity-90' : 'transition-transform'}
      `;

      // Style logic based on type
      let styleClasses = '';
      let content = null;
      let width = item.width ? `${item.width}%` : undefined;
      let height = item.height ? `${item.height}%` : undefined;

      switch (item.type) {
          case 'STALL':
              styleClasses = 'w-16 h-16 rounded-lg bg-white border-blue-500 z-20';
              content = (
                  <div className="text-center pointer-events-none">
                      <Store size={20} className="mx-auto text-blue-600" />
                      <span className="text-[10px] font-bold text-slate-700 block mt-1 leading-none truncate w-14">{item.label}</span>
                  </div>
              );
              break;
          case 'TABLE':
              styleClasses = `w-12 h-12 rounded-full z-30 ${getTableColor(item.status)}`;
              content = (
                  <div className="text-center pointer-events-none">
                      <span className="text-sm font-bold">{item.label}</span>
                      {item.status === 'OCCUPIED' && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>}
                  </div>
              );
              break;
          case 'STAGE':
              styleClasses = 'bg-purple-100 border-purple-400 rounded-lg z-10';
              content = <span className="text-xs font-bold text-purple-700 tracking-widest uppercase pointer-events-none">Panggung</span>;
              break;
          case 'ENTRANCE':
              styleClasses = 'bg-slate-800 text-white rounded px-3 py-1 border-transparent z-20';
              content = <span className="text-xs font-bold pointer-events-none">MASUK</span>;
              break;
          case 'TOILET':
              styleClasses = 'w-10 h-10 bg-slate-100 border-slate-300 rounded z-20';
              content = <span className="text-[10px] font-bold pointer-events-none">WC</span>;
              break;
          case 'TREE':
              styleClasses = 'w-16 h-16 bg-green-100/50 border-green-200 rounded-full z-10 border-dashed';
              content = <Trees size={24} className="text-green-600 opacity-50" />;
              break;
          case 'STREET':
              styleClasses = 'bg-slate-300 border-slate-400 z-0 rounded-sm';
              content = <span className="text-[8px] text-slate-500 tracking-widest pointer-events-none uppercase opacity-50">Jalan</span>;
              break;
          case 'HOUSE':
              styleClasses = 'w-16 h-16 bg-yellow-50 border-yellow-400 rounded z-10';
              content = <div className="flex flex-col items-center"><Home size={20} className="text-yellow-600" /><span className="text-[9px] font-bold mt-1">Rumah</span></div>;
              break;
          case 'POLE':
              styleClasses = 'w-4 h-4 bg-slate-800 rounded-full border-slate-600 z-20 shadow-md';
              content = <div className="absolute -top-4"><Zap size={12} className="text-yellow-500" /></div>;
              break;
          case 'OFFICE':
              styleClasses = 'w-20 h-16 bg-blue-50 border-blue-400 rounded z-10';
              content = <div className="flex flex-col items-center"><Briefcase size={20} className="text-blue-600" /><span className="text-[9px] font-bold mt-1">Kantor</span></div>;
              break;
          case 'OTHER':
              styleClasses = 'w-12 h-12 bg-gray-100 border-gray-300 rounded border-dashed z-10';
              content = <Box size={20} className="text-gray-400" />;
              break;
          default:
              styleClasses = 'bg-white border-slate-200';
      }

      return (
          <div
              key={item.id}
              onMouseDown={(e) => handleMouseDown(e, item.id)}
              onClick={() => handleLayoutItemClick(item)}
              className={`${baseClasses} ${styleClasses}`}
              style={{ 
                  left: `${item.x}%`, 
                  top: `${item.y}%`,
                  width: width,
                  height: height,
              }}
          >
              {content}
          </div>
      );
  };

  const tools: {type: LayoutItemType, icon: any, label: string}[] = [
      { type: 'STALL', icon: Store, label: 'Lapak' },
      { type: 'TABLE', icon: Armchair, label: 'Meja' },
      { type: 'STAGE', icon: LayoutTemplate, label: 'Panggung' },
      { type: 'STREET', icon: Footprints, label: 'Jalan' },
      { type: 'HOUSE', icon: Home, label: 'Rumah' },
      { type: 'POLE', icon: Zap, label: 'Tiang' },
      { type: 'OFFICE', icon: Briefcase, label: 'Kantor' },
      { type: 'TREE', icon: Trees, label: 'Pohon' },
      { type: 'ENTRANCE', icon: ArrowRight, label: 'Masuk' },
      { type: 'TOILET', icon: Box, label: 'WC' },
      { type: 'OTHER', icon: MoreHorizontal, label: 'Lain' },
  ];

  // Adjust Nav Items based on Role
  const marketNavItems = isCustomer 
    ? [
        { id: 'LAYOUT', label: 'Denah', icon: MapIcon, color: 'text-purple-600', bg: 'bg-purple-50', activeBg: 'bg-purple-600' },
        { id: 'POS', label: 'Kasir', icon: CreditCard, color: 'text-orange-600', bg: 'bg-orange-50', activeBg: 'bg-orange-600' },
      ]
    : [
        { id: 'POS', label: 'Kasir', icon: CreditCard, color: 'text-orange-600', bg: 'bg-orange-50', activeBg: 'bg-orange-600' },
        { id: 'TOPUP', label: 'Top Up', icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50', activeBg: 'bg-blue-600' },
        { id: 'LAYOUT', label: 'Denah', icon: MapIcon, color: 'text-purple-600', bg: 'bg-purple-50', activeBg: 'bg-purple-600' },
        { id: 'MANAGE', label: 'Monitor', icon: TrendingUp, color: 'text-slate-600', bg: 'bg-slate-50', activeBg: 'bg-slate-800' },
    ];

  const pointsValue = user.points * POINT_CONVERSION_RATE;
  const currentBillAmount = parseInt(amount || '0');
  const canPayWithPoints = pointsValue >= currentBillAmount;

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6 relative pb-20 md:pb-0">
      
      {/* MOBILE NAVIGATION: ICON GRID */}
      <div className={`md:hidden grid ${isCustomer ? 'grid-cols-2' : 'grid-cols-4'} gap-3 px-1 mb-4`}>
          {marketNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                  <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className="flex flex-col items-center gap-2 group transition-all duration-300"
                  >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-300 ${isActive ? `${item.activeBg} text-white shadow-lg scale-105` : `bg-white border border-slate-100 ${item.color}`}`}>
                          <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                      </div>
                      <span className={`text-[10px] font-bold tracking-tight transition-colors ${isActive ? 'text-white font-extrabold' : 'text-white'}`}>
                          {item.label}
                      </span>
                  </button>
              );
          })}
      </div>

      {/* LEFT SIDEBAR (Desktop) */}
      <div className="hidden md:flex w-full md:w-64 flex-col gap-4">
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                     <Store size={24} />
                 </div>
                 <div>
                     <h2 className="font-bold text-slate-800">Pasar Payungi</h2>
                     <p className="text-xs text-slate-500">{isCustomer ? 'Pesan Meja' : 'Hub Manajemen'}</p>
                 </div>
             </div>
             
             <nav className="space-y-2">
                 {marketNavItems.map((item) => (
                     <button 
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${activeTab === item.id ? `${item.activeBg.replace('text-','bg-')} text-white shadow-md` : 'text-slate-600 hover:bg-slate-50'}`}
                     >
                         <item.icon size={18} /> <span className="font-bold text-sm">{item.label}</span>
                     </button>
                 ))}
             </nav>
         </div>

         {/* Summary Widget */}
         {!isCustomer && (
             <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex-1 flex flex-col justify-center">
                 <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Transaksi Hari Ini</h3>
                 <div className="text-3xl font-bold mb-1">Rp 12.450.000</div>
                 <div className="flex items-center text-green-400 text-sm font-medium gap-1 mb-6">
                     <TrendingUp size={14} /> +15% dari kemarin
                 </div>
                 <div className="space-y-3">
                     <div className="flex justify-between text-sm">
                         <span className="text-slate-400">QRIS WargaPay</span>
                         <span className="font-bold">85%</span>
                     </div>
                     <div className="w-full bg-slate-700 h-1.5 rounded-full">
                         <div className="bg-orange-500 h-1.5 rounded-full w-[85%]"></div>
                     </div>
                 </div>
             </div>
         )}
      </div>

      {/* RIGHT CONTENT: MAIN WORKSPACE */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          
          {/* TOP BAR */}
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-lg text-slate-800">
                  {activeTab === 'POS' && 'Kasir & Pembayaran'}
                  {activeTab === 'TOPUP' && 'Layanan Top Up WargaPay'}
                  {activeTab === 'LAYOUT' && (isCustomer ? 'Reservasi Meja Payungi' : 'Denah Lapak & Manajemen Meja')}
                  {activeTab === 'MANAGE' && 'Monitoring Lapak Pasar'}
              </h2>
              <div className="flex items-center gap-2">
                  <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-2 text-sm text-slate-500">
                      <User size={14} /> {isCustomer ? 'Warga' : 'Operator'}: {user.name}
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
          </div>

          {/* MAIN CANVAS */}
          <div className="flex-1 overflow-hidden p-0 relative">
              
              {/* === MODE: KASIR TERPUSAT (POS) === */}
              {activeTab === 'POS' && (
                  <div className="h-full flex flex-col md:flex-row overflow-hidden">
                      {/* Left: Stall Selector - Scrollable area */}
                      <div className="flex-1 md:w-1/2 p-4 md:p-6 overflow-y-auto border-b md:border-b-0 md:border-r border-slate-100 bg-white">
                          <div className="relative mb-4 sticky top-0 z-10">
                              <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                              <input 
                                type="text" 
                                placeholder="Cari lapak atau pedagang..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
                              />
                          </div>
                          <div className="grid grid-cols-2 gap-3 pb-20 md:pb-0">
                              {filteredStalls.map((stall) => (
                                  <button 
                                    key={stall.id}
                                    onClick={() => setSelectedStall(stall)}
                                    className={`p-4 rounded-xl border text-left transition relative overflow-hidden group shadow-sm ${
                                        selectedStall?.id === stall.id 
                                        ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' 
                                        : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50'
                                    }`}
                                  >
                                      <div className="flex justify-between items-start mb-2">
                                          <div className={`p-2 rounded-lg ${stall.category === 'KULINER' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                              <Store size={18} />
                                          </div>
                                          {stall.status === 'CLOSED' && <span className="text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-bold">TUTUP</span>}
                                      </div>
                                      <h4 className="font-bold text-slate-800 text-sm mb-0.5 line-clamp-1">{stall.name}</h4>
                                      <p className="text-xs text-slate-500">{stall.owner}</p>
                                      {selectedStall?.id === stall.id && (
                                          <div className="absolute top-2 right-2 text-orange-500">
                                              <CheckCircle size={16} fill="white" />
                                          </div>
                                      )}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Right: Calculator & Checkout - Fixed at bottom on mobile, full right side on desktop */}
                      <div className="w-full md:w-1/2 bg-slate-50 border-t md:border-t-0 border-slate-200 flex flex-col shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:shadow-none z-20">
                          {/* Display Area */}
                          <div className="p-4 md:p-6 pb-2 flex flex-col justify-end min-h-[100px]">
                              <div className="text-right mb-2">
                                  <span className="text-sm font-bold text-slate-400">Total Pembayaran</span>
                              </div>
                              <div className="text-right text-5xl font-black text-slate-800 tracking-tight">
                                  Rp {amount ? parseInt(amount).toLocaleString() : '0'}
                              </div>
                              <div className="text-right text-sm text-orange-600 font-medium mt-2 h-6 flex justify-end items-center">
                                  {selectedStall ? (
                                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold">Bayar ke: {selectedStall.name}</span>
                                  ) : (
                                      <span className="text-slate-400 italic">Pilih lapak terlebih dahulu</span>
                                  )}
                              </div>
                          </div>

                          {/* Numpad */}
                          <div className="p-4 md:p-6 pt-0">
                              <div className="grid grid-cols-3 gap-3 mb-6">
                                  {[1,2,3,4,5,6,7,8,9].map(num => (
                                      <button 
                                        key={num}
                                        onClick={() => handleNumberClick(num.toString())}
                                        className="h-14 bg-white rounded-xl shadow-sm border border-slate-200 text-2xl font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition"
                                      >
                                          {num}
                                      </button>
                                  ))}
                                  <button onClick={() => setAmount('')} className="h-14 bg-red-50 rounded-xl border border-red-100 text-red-600 font-bold hover:bg-red-100 transition text-lg">C</button>
                                  <button onClick={() => handleNumberClick('0')} className="h-14 bg-white rounded-xl shadow-sm border border-slate-200 text-2xl font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition">0</button>
                                  <button onClick={handleBackspace} className="h-14 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition text-lg">⌫</button>
                                  <button onClick={() => handleNumberClick('000')} className="col-span-3 h-12 bg-slate-100 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition text-lg tracking-widest">000</button>
                              </div>

                              <button 
                                  onClick={openPaymentSelection}
                                  disabled={!selectedStall || !amount}
                                  className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-600/20 hover:bg-orange-700 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                              >
                                  <CreditCard size={20} /> Pilih Metode Pembayaran
                              </button>
                          </div>
                      </div>
                  </div>
              )}

              {/* ... (LAYOUT AND TOPUP TABS REMAIN THE SAME) ... */}
              {activeTab === 'LAYOUT' && (
                  <div 
                    className={`h-full relative bg-slate-100 overflow-hidden ${isEditMode ? (isEraserActive ? 'cursor-not-allowed' : 'cursor-crosshair') : 'cursor-default'}`}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    ref={containerRef}
                  >
                      {/* Interactive Map Area */}
                      <div className={`absolute inset-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 ${isEditMode ? 'ring-4 ring-purple-500/20 border-purple-500' : ''}`}>
                          <div className="absolute inset-0 bg-[#f8fafc] opacity-50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"></div>
                          
                          {isEditMode && !isCustomer && (
                              <div className="absolute top-4 left-4 z-50 bg-purple-600 text-white px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                  {isEraserActive ? <Eraser size={16} className="animate-pulse" /> : <Move size={16} className="animate-pulse" />}
                                  <span className="text-xs font-bold">{isEraserActive ? 'Mode Hapus (Klik Item)' : 'Mode Edit Layout'}</span>
                              </div>
                          )}

                          {isCustomer && (
                              <div className="absolute top-4 left-4 z-50 bg-green-600 text-white px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                  <Armchair size={16} />
                                  <span className="text-xs font-bold">Klik Meja Hijau untuk Reservasi</span>
                              </div>
                          )}

                          {layoutItems.map(renderItemVisual)}
                      </div>
                      
                      {/* Editor Toolbar (Visible only in Edit Mode AND NOT Customer) */}
                      {isEditMode && !isCustomer && (
                          <div className="absolute top-4 right-6 bottom-24 w-16 bg-white rounded-xl shadow-xl border border-slate-200 flex flex-col items-center py-4 gap-2 z-40 overflow-y-auto no-scrollbar animate-in slide-in-from-right-10 fade-in duration-300">
                              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Tools</div>
                              <button 
                                onClick={() => setIsEraserActive(!isEraserActive)}
                                className={`p-2 rounded-lg transition mb-2 ${isEraserActive ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                title="Hapus Item"
                              >
                                  <Eraser size={20} />
                              </button>
                              <button 
                                onClick={() => setIsEraserActive(false)}
                                className={`p-2 rounded-lg transition mb-2 ${!isEraserActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                title="Pindah Item (Select)"
                              >
                                  <MousePointer size={20} />
                              </button>
                              
                              <div className="w-8 h-px bg-slate-200 my-1"></div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Add</div>
                              
                              {tools.map((tool) => (
                                  <button 
                                    key={tool.type}
                                    onClick={() => { setIsEraserActive(false); handleAddItem(tool.type); }}
                                    className="p-2 rounded-lg hover:bg-purple-50 hover:text-purple-600 text-slate-500 transition flex flex-col items-center gap-1 group"
                                    title={`Tambah ${tool.label}`}
                                  >
                                      <tool.icon size={20} />
                                      <span className="text-[8px] font-medium hidden group-hover:block absolute right-16 bg-slate-800 text-white px-2 py-1 rounded shadow-lg">{tool.label}</span>
                                  </button>
                              ))}
                          </div>
                      )}

                      {/* Legend / Controls */}
                      <div className="absolute bottom-6 left-6 right-6 md:right-auto flex items-end gap-4">
                          {!isEditMode && (
                              <div className="bg-white/90 backdrop-blur p-3 rounded-xl border border-slate-200 shadow-sm text-xs space-y-2 min-w-[140px]">
                                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-100 border border-green-300"></div> <span>Kosong</span></div>
                                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-100 border border-orange-300"></div> <span>Order</span></div>
                                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-100 border border-red-300"></div> <span>Terisi</span></div>
                                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-200 border border-slate-400"></div> <span>Kotor</span></div>
                              </div>
                          )}

                          {/* Edit Mode Toggle - Only for Admin */}
                          {!isCustomer && (
                              <button 
                                onClick={() => {
                                    setIsEditMode(!isEditMode);
                                    setIsEraserActive(false);
                                }}
                                className={`px-4 py-3 rounded-xl shadow-lg font-bold text-xs flex items-center gap-2 transition-all ${
                                    isEditMode 
                                    ? 'bg-purple-600 text-white hover:bg-purple-700' 
                                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                                }`}
                              >
                                  {isEditMode ? (
                                      <>
                                        <Save size={16} /> Selesai Edit
                                      </>
                                  ) : (
                                      <>
                                        <Move size={16} /> Atur Layout
                                      </>
                                  )}
                              </button>
                          )}
                      </div>

                      {/* Table Management Modal (Admin) */}
                      {selectedTable && !isEditMode && !isCustomer && (
                          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in">
                              <div className="bg-white p-6 rounded-2xl shadow-xl w-80">
                                  <div className="flex justify-between items-center mb-4">
                                      <h3 className="font-bold text-lg flex items-center gap-2">
                                          <Armchair size={20} /> Meja {selectedTable.label}
                                      </h3>
                                      <button onClick={() => setSelectedTable(null)} className="text-slate-400 hover:text-slate-600">
                                          <X size={20} />
                                      </button>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-3 mb-4">
                                      <button 
                                        onClick={() => updateTableStatus('AVAILABLE')}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 ${selectedTable.status === 'AVAILABLE' ? 'bg-green-100 border-green-500 text-green-700 ring-1 ring-green-500' : 'bg-slate-50 border-slate-200 hover:bg-white'}`}
                                      >
                                          <CheckCircle size={20} /> <span className="text-xs font-bold">Kosong</span>
                                      </button>
                                      <button 
                                        onClick={() => updateTableStatus('ORDERING')}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 ${selectedTable.status === 'ORDERING' ? 'bg-orange-100 border-orange-500 text-orange-700 ring-1 ring-orange-500' : 'bg-slate-50 border-slate-200 hover:bg-white'}`}
                                      >
                                          <Utensils size={20} /> <span className="text-xs font-bold">Order</span>
                                      </button>
                                      <button 
                                        onClick={() => updateTableStatus('OCCUPIED')}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 ${selectedTable.status === 'OCCUPIED' ? 'bg-red-100 border-red-500 text-red-700 ring-1 ring-red-500' : 'bg-slate-50 border-slate-200 hover:bg-white'}`}
                                      >
                                          <Users size={20} /> <span className="text-xs font-bold">Makan</span>
                                      </button>
                                      <button 
                                        onClick={() => updateTableStatus('DIRTY')}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 ${selectedTable.status === 'DIRTY' ? 'bg-slate-200 border-slate-500 text-slate-700 ring-1 ring-slate-500' : 'bg-slate-50 border-slate-200 hover:bg-white'}`}
                                      >
                                          <Brush size={20} /> <span className="text-xs font-bold">Bersihkan</span>
                                      </button>
                                  </div>

                                  <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-500 text-center">
                                      Kapasitas: {selectedTable.capacity} Orang
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* Reservation Modal (User) */}
                      {showReservationModal && reservationTable && isCustomer && (
                          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in p-4">
                              <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-sm relative">
                                  <div className="flex justify-between items-start mb-6">
                                      <div>
                                          <h3 className="font-bold text-xl text-slate-800">
                                              Reservasi Meja Payungi
                                          </h3>
                                          <p className="text-xs text-slate-500 mt-1">Konfirmasi pemesanan tempat duduk</p>
                                      </div>
                                      <button onClick={() => setShowReservationModal(false)} className="bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition">
                                          <X size={20} className="text-slate-500" />
                                      </button>
                                  </div>

                                  <div className="bg-green-50 p-5 rounded-2xl border border-green-100 mb-6 flex flex-col items-center text-center relative overflow-hidden">
                                      <div className="bg-green-100 p-4 rounded-full text-green-600 mb-3 shadow-inner">
                                          <Armchair size={32} />
                                      </div>
                                      <div className="absolute top-2 right-2">
                                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse block"></span>
                                      </div>
                                      <p className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">Meja Pilihan</p>
                                      <p className="text-3xl font-black text-slate-800">Nomor {reservationTable.label}</p>
                                      <p className="text-sm text-slate-500 mt-1 font-medium">Kapasitas {reservationTable.capacity} Orang</p>
                                  </div>

                                  <div className="space-y-3 mb-8">
                                      <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                          <div className="bg-white p-2 rounded-lg text-slate-400 shadow-sm"><User size={18} /></div>
                                          <div className="flex-1">
                                              <p className="text-[10px] text-slate-400 uppercase font-bold">Pemesan</p>
                                              <p className="text-sm font-bold text-slate-800">Warga: {user.name}</p>
                                          </div>
                                      </div>
                                      <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                          <div className="bg-white p-2 rounded-lg text-slate-400 shadow-sm"><Calendar size={18} /></div>
                                          <div className="flex-1">
                                              <p className="text-[10px] text-slate-400 uppercase font-bold">Waktu</p>
                                              <p className="text-sm font-bold text-slate-800">Sekarang (Walk-in)</p>
                                          </div>
                                      </div>
                                  </div>

                                  <button 
                                    onClick={handleReserveTable}
                                    className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-green-600/30 hover:bg-green-700 active:scale-95 transition flex items-center justify-center gap-3 text-lg"
                                  >
                                      <CheckCircle size={22} /> Konfirmasi Reservasi
                                  </button>
                              </div>
                          </div>
                      )}
                  </div>
              )}

              {activeTab === 'TOPUP' && (
                  <div className="h-full p-8 flex flex-col items-center justify-center max-w-2xl mx-auto">
                      <div className="bg-white w-full rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                          <div className="bg-blue-600 p-6 text-white text-center">
                              <Wallet size={48} className="mx-auto mb-4 opacity-80" />
                              <h3 className="text-2xl font-bold">Top Up WargaPay</h3>
                              <p className="text-blue-100">Layanan Agen Laku Pandai Pasar</p>
                          </div>
                          
                          <div className="p-8 space-y-6">
                              {!isTopupSuccess ? (
                                  <>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Identitas Warga (ID/QR)</label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={topupUser}
                                                onChange={(e) => setTopupUser(e.target.value)}
                                                placeholder="Scan QR Warga atau Input ID"
                                                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button className="p-3 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200">
                                                <QrCode size={20} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nominal Top Up</label>
                                        <div className="grid grid-cols-3 gap-3 mb-3">
                                            {[10000, 20000, 50000, 100000].map(val => (
                                                <button 
                                                    key={val}
                                                    onClick={() => setTopupAmount(val.toString())}
                                                    className={`py-2 rounded-lg border text-sm font-bold transition ${topupAmount === val.toString() ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}
                                                >
                                                    {val/1000}k
                                                </button>
                                            ))}
                                        </div>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 font-bold text-slate-400">Rp</span>
                                            <input 
                                                type="number" 
                                                value={topupAmount}
                                                onChange={(e) => setTopupAmount(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg"
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleTopup}
                                        disabled={!topupUser || !topupAmount}
                                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition disabled:opacity-50"
                                    >
                                        Proses Top Up
                                    </button>
                                  </>
                              ) : (
                                  <div className="text-center py-8">
                                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                          <CheckCircle size={40} />
                                      </div>
                                      <h3 className="text-xl font-bold text-slate-800">Top Up Berhasil!</h3>
                                      <p className="text-slate-500 mb-6">Saldo telah masuk ke akun warga.</p>
                                      <div className="bg-slate-50 p-4 rounded-xl text-left text-sm mb-6">
                                          <div className="flex justify-between mb-2">
                                              <span className="text-slate-500">ID Warga</span>
                                              <span className="font-bold text-slate-800">{topupUser}</span>
                                          </div>
                                          <div className="flex justify-between">
                                              <span className="text-slate-500">Nominal</span>
                                              <span className="font-bold text-blue-600">Rp {parseInt(topupAmount).toLocaleString()}</span>
                                          </div>
                                      </div>
                                      <button 
                                        onClick={() => setIsTopupSuccess(false)}
                                        className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800"
                                      >
                                          Transaksi Baru
                                      </button>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              )}

              {/* === MODE: MANAGE STALLS === */}
              {activeTab === 'MANAGE' && (
                  <div className="h-full p-6 overflow-y-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {stalls.map((stall) => (
                              <div key={stall.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
                                  <div className="flex justify-between items-start mb-4">
                                      <div className={`p-3 rounded-xl ${stall.category === 'KULINER' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
                                          <Store size={20} />
                                      </div>
                                      <div className={`px-2 py-1 rounded text-[10px] font-bold ${stall.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                          {stall.status}
                                      </div>
                                  </div>
                                  <h3 className="font-bold text-slate-800 text-lg mb-1">{stall.name}</h3>
                                  <p className="text-sm text-slate-500 mb-4">{stall.owner} • {stall.category}</p>
                                  
                                  <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between border border-slate-100">
                                      <div className="text-xs text-slate-500">Pendapatan Hari Ini</div>
                                      <div className="font-bold text-slate-800 text-sm">Rp {stall.revenueToday.toLocaleString()}</div>
                                  </div>
                                  
                                  <div className="flex gap-2 mt-4">
                                      <button className="flex-1 bg-white border border-slate-200 py-2 rounded-lg text-xs font-bold hover:bg-slate-50">Detail</button>
                                      <button className="flex-1 bg-slate-900 text-white py-2 rounded-lg text-xs font-bold hover:bg-slate-800">Cetak Laporan</button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

          </div>
      </div>

      {/* PAYMENT METHOD & QR MODAL */}
      {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative">
                  <button onClick={handleClosePayment} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10">
                      <X size={24} />
                  </button>
                  
                  {/* STEP 1: SELECT PAYMENT METHOD */}
                  {paymentStep === 'SELECT' && (
                      <div className="p-6">
                          <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Metode Pembayaran</h3>
                          
                          <div className="mb-6 bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Total Tagihan</p>
                              <div className="text-3xl font-black text-slate-800">Rp {parseInt(amount).toLocaleString()}</div>
                          </div>

                          <div className="space-y-3">
                              {/* 1. WargaPay */}
                              <button 
                                onClick={() => handleProcessPayment('WARGAPAY')}
                                className="w-full p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition flex items-center gap-4 group text-left"
                              >
                                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                      <Wallet size={24} />
                                  </div>
                                  <div className="flex-1">
                                      <span className="block font-bold text-slate-800 group-hover:text-blue-700">WargaPay</span>
                                      <span className="text-xs text-slate-500">Saldo: Rp {user.balance.toLocaleString()}</span>
                                  </div>
                              </button>

                              {/* 2. Trash Points (NEW) */}
                              <button 
                                onClick={() => canPayWithPoints && handleProcessPayment('POINTS')}
                                disabled={!canPayWithPoints}
                                className={`w-full p-4 rounded-xl border flex items-center gap-4 group text-left transition ${
                                    canPayWithPoints 
                                    ? 'border-slate-200 hover:border-green-500 hover:bg-green-50 cursor-pointer' 
                                    : 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                                }`}
                              >
                                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${canPayWithPoints ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'}`}>
                                      <Leaf size={24} />
                                  </div>
                                  <div className="flex-1">
                                      <span className={`block font-bold ${canPayWithPoints ? 'text-slate-800 group-hover:text-green-700' : 'text-slate-500'}`}>Poin Sampah</span>
                                      <span className="text-xs text-slate-500 flex items-center gap-1">
                                          <Coins size={10} /> {user.points} Poin = Rp {pointsValue.toLocaleString()}
                                      </span>
                                      {!canPayWithPoints && <span className="text-[10px] text-red-500 font-bold block mt-0.5">Saldo Poin Tidak Cukup</span>}
                                  </div>
                              </button>

                              {/* 3. QRIS / Cash */}
                              <button 
                                onClick={() => handleProcessPayment('QRIS')}
                                className="w-full p-4 rounded-xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition flex items-center gap-4 group text-left"
                              >
                                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                                      <QrCode size={24} />
                                  </div>
                                  <div className="flex-1">
                                      <span className="block font-bold text-slate-800 group-hover:text-orange-700">QRIS / Tunai</span>
                                      <span className="text-xs text-slate-500">Scan atau bayar manual</span>
                                  </div>
                              </button>
                          </div>
                      </div>
                  )}

                  {/* STEP 2: PROCESSING (SPINNER) */}
                  {paymentStep === 'PROCESSING' && (
                      <div className="p-12 text-center flex flex-col items-center justify-center h-[400px]">
                          <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                          <h3 className="text-xl font-bold text-slate-800 mb-2">Memproses...</h3>
                          <p className="text-sm text-slate-500">
                              {selectedMethod === 'POINTS' ? 'Menukarkan Poin Sampah...' : 'Menghubungkan Gateway...'}
                          </p>
                      </div>
                  )}

                  {/* STEP 3: SUCCESS */}
                  {paymentStep === 'SUCCESS' && (
                      <div className="p-8 flex flex-col items-center text-center animate-in zoom-in duration-300">
                          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-green-500/30">
                              <CheckCircle size={40} />
                          </div>
                          
                          <h3 className="text-2xl font-black text-slate-800 mb-1">Pembayaran Berhasil!</h3>
                          <p className="text-slate-500 text-sm mb-6">
                              {selectedMethod === 'POINTS' 
                                  ? 'Terima kasih telah berkontribusi pada lingkungan!' 
                                  : `Dibayar ke ${selectedStall?.name}`}
                          </p>

                          <div className="bg-slate-50 w-full p-4 rounded-xl border border-slate-100 mb-6">
                              <div className="flex justify-between items-center text-sm mb-2">
                                  <span className="text-slate-500">Total</span>
                                  <span className="font-bold text-slate-800">Rp {parseInt(amount).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                  <span className="text-slate-500">Metode</span>
                                  <span className="font-bold text-blue-600 flex items-center gap-1">
                                      {selectedMethod === 'POINTS' && <Leaf size={12} />}
                                      {selectedMethod === 'POINTS' ? 'Poin Sampah' : selectedMethod === 'WARGAPAY' ? 'WargaPay' : 'QRIS'}
                                  </span>
                              </div>
                          </div>

                          <div className="flex gap-3 w-full">
                              <button onClick={handleClosePayment} className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition">
                                  Selesai
                              </button>
                              <button className="bg-slate-100 text-slate-600 p-3 rounded-xl hover:bg-slate-200">
                                  <Printer size={20} />
                              </button>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      )}

    </div>
  );
};

export default MarketView;