import React, { useState, useRef, useEffect } from 'react';
import { FileText, Table, Presentation, MessageSquare, Video, Search, Plus, MoreVertical, Mic, Camera, PhoneOff, Users, Send, ArrowLeft, ChevronLeft, Share, MessageCircle, Video as VideoIcon, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Sparkles, X, Paperclip, Check, Link, Grid, List, Truck, Phone, Wifi, Loader2, Mail, PenTool, QrCode, ScanBarcode, Calendar as CalendarIcon, ChevronRight, Clock, MapPin, HardDrive, Cloud, Folder, Image as ImageIcon, Music, Film, File, MoreHorizontal, Download, Upload, Trash2, Star, Server, LayoutGrid, Maximize2, Monitor } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';

type AppType = 'DOCS' | 'SHEETS' | 'SLIDES' | 'CHAT' | 'MEET' | 'CALENDAR' | 'DRIVE';

interface EOfficeFile {
    id: string;
    title: string;
    type: 'DOC' | 'SHEET' | 'SLIDE';
    content: string;
    lastModified: string;
    status: string;
}

interface EOfficeViewProps {
    onOpenAnjelo: (service?: any, note?: string) => void;
}

interface SubAppProps {
    onOpenFile: (file: EOfficeFile) => void;
    searchQuery: string;
}

const EOfficeView: React.FC<EOfficeViewProps> = ({ onOpenAnjelo }) => {
  const [activeApp, setActiveApp] = useState<AppType>('DOCS');
  const [activeFile, setActiveFile] = useState<EOfficeFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const apps = [
    { id: 'DRIVE', label: 'Cloud Drive', icon: HardDrive, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'DOCS', label: 'Surat', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'SHEETS', label: 'Data', icon: Table, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'SLIDES', label: 'Paparan', icon: Presentation, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { id: 'CALENDAR', label: 'Kalender', icon: CalendarIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'CHAT', label: 'Chat', icon: MessageSquare, color: 'text-teal-600', bg: 'bg-teal-50' },
    { id: 'MEET', label: 'Rapat', icon: Video, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const handleOpenFile = (file: EOfficeFile) => {
      setActiveFile(file);
  };

  const handleCloseFile = () => {
      setActiveFile(null);
  };

  // Reset search when switching apps
  useEffect(() => {
      setSearchQuery('');
  }, [activeApp]);

  const renderContent = () => {
    // If a file is open, show the Workspace Editor
    if (activeFile) {
        return <WorkspaceEditor file={activeFile} onClose={handleCloseFile} onOpenAnjelo={onOpenAnjelo} />;
    }

    // Otherwise show the app list view
    switch (activeApp) {
      case 'DRIVE':
        return <DriveApp />;
      case 'DOCS':
        return <DocsApp onOpenFile={handleOpenFile} searchQuery={searchQuery} />;
      case 'SHEETS':
        return <SheetsApp onOpenFile={handleOpenFile} searchQuery={searchQuery} />;
      case 'SLIDES':
        return <SlidesApp onOpenFile={handleOpenFile} searchQuery={searchQuery} />;
      case 'CALENDAR':
        return <CalendarApp />;
      case 'CHAT':
        return <ChatApp />;
      case 'MEET':
        return <MeetApp />;
      default:
        return <DocsApp onOpenFile={handleOpenFile} searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
      {/* Desktop Sidebar - Hide when file is open to maximize space */}
      {!activeFile && (
        <div className="hidden md:flex w-64 bg-slate-50 border-r border-slate-200 flex-col">
            <div className="p-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="p-1.5 bg-slate-800 text-white rounded">WS</span>
                Workspace
            </h2>
            </div>
            <nav className="flex-1 p-2 space-y-1">
            {apps.map((app) => (
                <button
                key={app.id}
                onClick={() => setActiveApp(app.id as AppType)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                    activeApp === app.id
                    ? 'bg-white shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
                >
                <div className={`p-1.5 rounded ${app.bg} ${app.color}`}>
                    <app.icon size={18} />
                </div>
                <span className={`text-sm font-medium ${activeApp === app.id ? 'text-slate-800' : ''}`}>
                    {app.label}
                </span>
                </button>
            ))}
            </nav>
        </div>
      )}

      {/* Mobile Bottom Nav - Enhanced Highlighting & Animation */}
      {!activeFile && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/85 backdrop-blur-xl border-t border-slate-200 z-[60] flex justify-around items-end px-2 pb-5 pt-2 safe-area-bottom shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.1)] h-[85px] overflow-x-auto no-scrollbar">
            {apps.map((app) => {
                const isActive = activeApp === app.id;
                return (
                    <button
                    key={app.id}
                    onClick={() => setActiveApp(app.id as AppType)}
                    className={`relative flex flex-col items-center justify-center min-w-[60px] h-16 rounded-2xl transition-all duration-500 ease-out ${
                        isActive 
                        ? `${app.bg} ${app.color} transform -translate-y-3 shadow-lg shadow-slate-200/50 ring-1 ring-white` 
                        : 'text-slate-400 hover:bg-slate-50'
                    }`}
                    >
                        {/* Active Indicator Dot */}
                        {isActive && (
                            <span className="absolute -top-1 right-1 w-2 h-2 bg-current rounded-full animate-ping opacity-75" />
                        )}
                        
                        <app.icon 
                            size={isActive ? 24 : 22} 
                            className={`transition-all duration-300 ${isActive ? 'scale-110' : ''}`} 
                            fill={isActive ? "currentColor" : "none"}
                            fillOpacity={0.15}
                            strokeWidth={isActive ? 2.5 : 2}
                        />
                        <span className={`text-[10px] mt-1 transition-all duration-300 ${isActive ? 'font-extrabold scale-105' : 'font-medium'}`}>
                            {app.label}
                        </span>
                    </button>
                );
            })}
        </div>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 bg-white relative ${!activeFile ? 'mb-[90px] md:mb-0' : ''}`}>
        
        {/* Persistent Search Bar (Only for file apps) */}
        {!activeFile && ['DOCS', 'SHEETS', 'SLIDES', 'DRIVE'].includes(activeApp) && (
            <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center space-x-3 shadow-sm">
                <Search className="text-slate-400 w-5 h-5 shrink-0" />
                <input 
                    type="text" 
                    placeholder={`Cari di ${activeApp === 'DOCS' ? 'Surat & Dokumen' : activeApp === 'SHEETS' ? 'Data & Spreadsheet' : activeApp === 'DRIVE' ? 'Cloud Drive & NAS' : 'Paparan & Slide'}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-slate-400"
                />
            </div>
        )}

        <div key={activeApp} className="flex-1 flex flex-col h-full animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out overflow-hidden">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

// === NEW: CLOUD DRIVE & NAS MODULE ===
const DriveApp = () => {
    const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
    const [activeSection, setActiveSection] = useState<'MY_DRIVE' | 'SHARED_NAS' | 'RECENT' | 'STARRED' | 'TRASH'>('MY_DRIVE');
    
    const folders = [
        { id: 'f1', name: 'Dokumen Desa', type: 'folder', size: '12 items' },
        { id: 'f2', name: 'Media Center', type: 'folder', size: '45 items' },
        { id: 'f3', name: 'Arsip 2023', type: 'folder', size: '120 items' },
        { id: 'f4', name: 'Project WargaPay', type: 'folder', size: '8 items' },
    ];

    const sharedDrives = [
        { id: 'nas1', name: 'Public Share (NAS)', type: 'network', size: '1.2 TB' },
        { id: 'nas2', name: 'Perangkat Desa Only', type: 'network', size: '500 GB' },
    ];

    const files = [
        { id: 'doc1', name: 'Proposal_Kegiatan_Agustus.pdf', type: 'pdf', size: '2.4 MB', date: 'Today' },
        { id: 'img1', name: 'Dokumentasi_Rapat.jpg', type: 'image', size: '4.1 MB', date: 'Yesterday' },
        { id: 'vid1', name: 'Profil_Desa_2024.mp4', type: 'video', size: '125 MB', date: 'Oct 20' },
        { id: 'aud1', name: 'Rekaman_Musrenbang.mp3', type: 'audio', size: '15 MB', date: 'Oct 18' },
        { id: 'doc2', name: 'Data_Penduduk_RW07.xlsx', type: 'sheet', size: '45 KB', date: 'Oct 15' },
    ];

    const getFileIcon = (type: string) => {
        switch(type) {
            case 'folder': return <Folder className="text-blue-500 fill-blue-500/20" size={40} />;
            case 'network': return <Server className="text-indigo-500" size={40} />;
            case 'pdf': return <FileText className="text-red-500" size={32} />;
            case 'image': return <ImageIcon className="text-purple-500" size={32} />;
            case 'video': return <Film className="text-pink-500" size={32} />;
            case 'audio': return <Music className="text-yellow-500" size={32} />;
            case 'sheet': return <Table className="text-green-500" size={32} />;
            default: return <File className="text-slate-400" size={32} />;
        }
    };

    return (
        <div className="flex h-full bg-slate-50">
            {/* Drive Sidebar */}
            <div className="w-60 border-r border-slate-200 bg-slate-50/50 p-4 flex flex-col hidden md:flex">
                <button className="bg-white border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-2xl shadow-sm hover:shadow-md flex items-center gap-2 mb-6 transition-all active:scale-95">
                    <Plus className="text-orange-600" size={20} />
                    <span>Upload Baru</span>
                </button>

                <nav className="space-y-1 flex-1">
                    {[
                        { id: 'MY_DRIVE', label: 'My Drive', icon: HardDrive },
                        { id: 'SHARED_NAS', label: 'NAS / Shared', icon: Server },
                        { id: 'RECENT', label: 'Terbaru', icon: Clock },
                        { id: 'STARRED', label: 'Berbintang', icon: Star },
                        { id: 'TRASH', label: 'Sampah', icon: Trash2 },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id as any)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                activeSection === item.id 
                                ? 'bg-orange-100 text-orange-700' 
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <item.icon size={18} className={activeSection === item.id ? 'text-orange-600' : 'text-slate-400'} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                        <Cloud size={16} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-500">Penyimpanan</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2">
                        <div className="bg-orange-500 h-full w-[75%]"></div>
                    </div>
                    <p className="text-[10px] text-slate-400">7.5 GB dari 10 GB terpakai</p>
                </div>
            </div>

            {/* Main Drive Area */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
                {/* Toolbar */}
                <div className="h-14 border-b border-slate-100 flex items-center justify-between px-6">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="font-bold text-slate-700 hover:underline cursor-pointer">Drive Saya</span>
                        <ChevronRight size={14} />
                        <span className="hover:underline cursor-pointer">Projects</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setViewMode('LIST')}
                            className={`p-1.5 rounded hover:bg-slate-100 ${viewMode === 'LIST' ? 'bg-slate-100 text-slate-800' : 'text-slate-400'}`}
                        >
                            <List size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('GRID')}
                            className={`p-1.5 rounded hover:bg-slate-100 ${viewMode === 'GRID' ? 'bg-slate-100 text-slate-800' : 'text-slate-400'}`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <div className="w-px h-4 bg-slate-200 mx-1"></div>
                        <button className="p-1.5 rounded hover:bg-slate-100 text-slate-400">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    
                    {/* Section: Network Drives */}
                    {activeSection === 'MY_DRIVE' && (
                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">Network Drives & NAS</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sharedDrives.map((drive) => (
                                    <div key={drive.id} className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:shadow-md transition group">
                                        <div className="bg-white p-3 rounded-lg shadow-sm group-hover:scale-110 transition">
                                            {getFileIcon(drive.type)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-indigo-900">{drive.name}</h4>
                                            <p className="text-xs text-indigo-400">Capacity: {drive.size}</p>
                                        </div>
                                        <div className="ml-auto">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Section: Folders */}
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">Folders</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {folders.map((folder) => (
                                <div key={folder.id} className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col items-center text-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition hover:shadow-sm aspect-[4/3] justify-center">
                                    {getFileIcon(folder.type)}
                                    <div>
                                        <h4 className="font-medium text-sm text-slate-700 truncate w-full px-2">{folder.name}</h4>
                                        <p className="text-[10px] text-slate-400">{folder.size}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section: Files */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">Files</h3>
                        {viewMode === 'GRID' ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {files.map((file) => (
                                    <div key={file.id} className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition cursor-pointer">
                                        <div className="aspect-square bg-slate-50 flex items-center justify-center relative">
                                            {getFileIcon(file.type)}
                                            {/* Overlay on hover */}
                                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                                <button className="p-2 bg-white rounded-full shadow text-slate-700 hover:text-blue-600"><Maximize2 size={14} /></button>
                                                <button className="p-2 bg-white rounded-full shadow text-slate-700 hover:text-blue-600"><Download size={14} /></button>
                                            </div>
                                        </div>
                                        <div className="p-3 border-t border-slate-100">
                                            <h4 className="font-medium text-xs text-slate-700 truncate mb-1" title={file.name}>{file.name}</h4>
                                            <div className="flex justify-between items-center text-[10px] text-slate-400">
                                                <span>{file.size}</span>
                                                <span>{file.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3">Name</th>
                                            <th className="px-4 py-3">Owner</th>
                                            <th className="px-4 py-3">Last Modified</th>
                                            <th className="px-4 py-3">Size</th>
                                            <th className="px-4 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {files.map((file) => (
                                            <tr key={file.id} className="hover:bg-slate-50 transition cursor-pointer group">
                                                <td className="px-4 py-3 flex items-center gap-3">
                                                    {getFileIcon(file.type)}
                                                    <span className="font-medium text-slate-700">{file.name}</span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500">me</td>
                                                <td className="px-4 py-3 text-slate-500">{file.date}</td>
                                                <td className="px-4 py-3 text-slate-500">{file.size}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <button className="p-1.5 rounded hover:bg-slate-200 text-slate-400 opacity-0 group-hover:opacity-100 transition">
                                                        <MoreHorizontal size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ... (DocumentContentRenderer and WorkspaceEditor components remain unchanged) ...
const DocumentContentRenderer: React.FC<{ content: string }> = ({ content }) => {
    // Split content by the signature delimiter
    const parts = content.split(/(\[\[DIGITAL_SIGNATURE\|.*?\|.*?\|.*?\]\])/g);
    return (
        <>
            {parts.map((part, index) => {
                const match = part.match(/\[\[DIGITAL_SIGNATURE\|(.*?)\|(.*?)\|(.*?)\]\]/);
                if (match) {
                    const [_, name, date, id] = match;
                    return (
                        <div key={index} className="block my-8 select-none">
                            <div className="border-2 border-slate-800 rounded-lg p-1.5 bg-white/50 backdrop-blur-sm inline-flex items-center gap-4 pr-6 shadow-sm relative overflow-hidden group">
                                <div className="bg-slate-900 p-2 rounded text-white flex flex-col items-center justify-center min-w-[70px]">
                                    <QrCode size={40} />
                                    <span className="text-[9px] font-mono mt-1 tracking-widest">SECURE</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Digitally Signed</p>
                                    </div>
                                    <p className="font-bold text-slate-900 text-lg leading-tight font-serif italic">{name}</p>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <p className="text-[10px] text-slate-600 font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{date}</p>
                                        <p className="text-[10px] text-slate-400 font-mono">ID: {id}</p>
                                    </div>
                                </div>
                                <div className="opacity-5 absolute -right-2 -bottom-2 transform -rotate-12 pointer-events-none">
                                    <ScanBarcode size={80} />
                                </div>
                            </div>
                        </div>
                    );
                }
                return <span key={index}>{part}</span>;
            })}
        </>
    );
};

const WorkspaceEditor: React.FC<{ file: EOfficeFile; onClose: () => void; onOpenAnjelo: (s?:any, n?:string) => void }> = ({ file, onClose, onOpenAnjelo }) => {
    const [content, setContent] = useState(file.content);
    const [isAIPromptOpen, setIsAIPromptOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    // Email state
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [emailRecipient, setEmailRecipient] = useState('');
    const [emailSubject, setEmailSubject] = useState(file.title);
    const [emailBody, setEmailBody] = useState('Terlampir dokumen yang Anda butuhkan.');
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    // Signature state
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

    // Determine styles based on file type
    const config = {
        DOC: { color: 'blue', icon: FileText, placeholder: 'Ketik @ untuk menyisipkan...' },
        SHEET: { color: 'green', icon: Table, placeholder: '' },
        SLIDE: { color: 'yellow', icon: Presentation, placeholder: 'Klik untuk menambahkan catatan...' }
    }[file.type];

    const handleAIWrite = async () => {
        if (!aiPrompt.trim()) return;
        setIsGenerating(true);
        
        // Contextual prompt based on file type
        const systemPrompt = `You are a helpful assistant inside a document editor for a village office (Kelurahan). 
        The user is editing a ${file.type === 'DOC' ? 'document' : file.type === 'SHEET' ? 'spreadsheet' : 'presentation'}.
        Current content context: ${content.substring(0, 200)}...
        Generate content based on this request: ${aiPrompt}. 
        Return ONLY the content text/data, no conversational filler.`;

        const response = await sendMessageToGemini(systemPrompt, []);
        
        // Append generated content
        setContent(prev => prev + "\n" + response.text);
        setIsGenerating(false);
        setIsAIPromptOpen(false);
        setAiPrompt('');
    };

    const handleSendEmail = () => {
        setIsSendingEmail(true);
        // Simulate sending email
        setTimeout(() => {
            setIsSendingEmail(false);
            setIsEmailModalOpen(false);
            alert("Email berhasil dikirim!");
        }, 2000);
    }

    const handleSignDocument = () => {
        const signatureId = `DS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const signatureDate = new Date().toLocaleString();
        const signatureBlock = `\n\n[[DIGITAL_SIGNATURE|Budi Santoso|${signatureDate}|${signatureId}]]\n`;
        setContent(prev => prev + signatureBlock);
        setIsSignatureModalOpen(false);
    };

    return (
        <div className="flex flex-col h-full bg-[#F9FBFD]">
            {/* 1. Header Bar */}
            <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-3 overflow-hidden">
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                        <ArrowLeft size={20} />
                    </button>
                    <div className={`p-1.5 rounded bg-${config.color}-50 text-${config.color}-600`}>
                        <config.icon size={20} />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-sm md:text-lg font-medium text-slate-800 truncate">{file.title}</h1>
                        <div className="flex items-center text-xs text-slate-500 space-x-2">
                            <span>File</span>
                            <span>Edit</span>
                            <span>View</span>
                            <span>Insert</span>
                            <span>Format</span>
                            <span>Tools</span>
                            <span className="text-slate-400">| Last edit was seconds ago</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
                     <button className="hidden md:flex items-center space-x-2 text-slate-600 hover:bg-slate-100 px-3 py-2 rounded-full transition">
                        <MessageCircle size={20} />
                     </button>
                     <button className="hidden md:flex items-center space-x-2 text-slate-600 hover:bg-slate-100 px-3 py-2 rounded-full transition">
                        <VideoIcon size={20} />
                     </button>
                     <button className={`flex items-center space-x-2 bg-${config.color}-100 text-${config.color}-800 px-4 py-2 rounded-full font-medium hover:bg-${config.color}-200 transition`}>
                        <Share size={18} />
                        <span className="hidden md:inline">Share</span>
                     </button>
                     <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                         <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Budi" alt="User" />
                     </div>
                </div>
            </div>

            {/* 2. Toolbar */}
            <div className="bg-white px-4 py-2 border-b border-slate-200 flex items-center space-x-1 md:space-x-2 overflow-x-auto no-scrollbar">
                <button className="p-1.5 rounded hover:bg-slate-100 text-slate-600 shrink-0"><Search size={16} /></button>
                <div className="w-px h-4 bg-slate-300 mx-1 shrink-0"></div>
                <button className="p-1.5 rounded hover:bg-slate-100 text-slate-600 shrink-0"><ArrowLeft size={16} /></button>
                <div className="w-px h-4 bg-slate-300 mx-1 shrink-0"></div>
                
                {/* AI Hero Button */}
                <button 
                    onClick={() => setIsAIPromptOpen(true)}
                    className="flex items-center space-x-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-600 px-2 py-1 rounded-lg border border-indigo-100 hover:shadow-sm transition shrink-0"
                >
                    <Sparkles size={14} />
                    <span className="text-xs font-bold">Help me write</span>
                </button>
                
                <div className="w-px h-4 bg-slate-300 mx-1 shrink-0"></div>
                <button className="p-1.5 rounded hover:bg-slate-100 text-slate-600 shrink-0"><Bold size={16} /></button>
                <button className="p-1.5 rounded hover:bg-slate-100 text-slate-600 shrink-0"><Italic size={16} /></button>
                <button className="p-1.5 rounded hover:bg-slate-100 text-slate-600 shrink-0"><Underline size={16} /></button>
                <div className="w-px h-4 bg-slate-300 mx-1 shrink-0"></div>
                <button className="p-1.5 rounded hover:bg-slate-100 text-slate-600 shrink-0"><AlignLeft size={16} /></button>
                <button className="p-1.5 rounded hover:bg-slate-100 text-slate-600 shrink-0"><AlignCenter size={16} /></button>
                <button className="p-1.5 rounded hover:bg-slate-100 text-slate-600 shrink-0"><AlignRight size={16} /></button>
                <div className="w-px h-4 bg-slate-300 mx-1 shrink-0"></div>
                <button 
                    onClick={() => setIsEmailModalOpen(true)}
                    className="p-1.5 rounded hover:bg-slate-100 text-slate-600 shrink-0 flex items-center gap-1" 
                    title="Kirim via Email"
                >
                    <Mail size={16} />
                </button>
                <button 
                    onClick={() => onOpenAnjelo('DOCS', `Kirim Dokumen: ${file.title}`)}
                    className="p-1.5 rounded hover:bg-orange-50 text-orange-600 shrink-0 flex items-center gap-1 border border-transparent hover:border-orange-200" 
                    title="Kirim Fisik via Anjelo"
                >
                    <Truck size={16} /> 
                    <span className="text-[10px] font-bold hidden lg:inline">Kirim Fisik</span>
                </button>
                <button 
                    onClick={() => setIsSignatureModalOpen(true)}
                    className="p-1.5 rounded hover:bg-blue-50 text-blue-600 shrink-0 flex items-center gap-1 border border-transparent hover:border-blue-200" 
                    title="Add Digital Signature"
                >
                    <PenTool size={16} />
                </button>
            </div>

            {/* 3. Main Canvas */}
            <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-[#F9FBFD]">
                <div className="w-full max-w-4xl bg-white shadow-sm border border-slate-200 min-h-[800px] p-8 md:p-12 outline-none" contentEditable suppressContentEditableWarning>
                     {/* Render content differently based on type */}
                     {file.type === 'SHEET' ? (
                         <div className="overflow-auto">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr>
                                        {[...Array(6)].map((_, i) => <th key={i} className="border border-slate-300 bg-slate-50 p-1 w-24 text-center font-normal text-slate-500">{String.fromCharCode(65 + i)}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(20)].map((_, r) => (
                                        <tr key={r}>
                                            {[...Array(6)].map((_, c) => (
                                                <td key={c} className="border border-slate-200 p-1 min-w-[100px] h-8 text-slate-800">
                                                    {r === 0 && c === 0 && content ? content.split('\n')[0] : ''}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>
                     ) : (
                         <div className="whitespace-pre-wrap font-serif text-slate-800 leading-relaxed text-base md:text-lg">
                            <DocumentContentRenderer content={content} />
                         </div>
                     )}
                </div>
            </div>

            {/* AI Prompt Modal */}
            {isAIPromptOpen && (
                <div className="absolute top-36 left-1/2 transform -translate-x-1/2 w-full max-w-lg z-50 animate-in fade-in slide-in-from-top-4">
                    <div className="bg-white rounded-2xl shadow-2xl border border-indigo-100 p-1 ring-4 ring-indigo-50">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                            <div className="flex items-center space-x-2 text-indigo-700 mb-2 font-medium">
                                <Sparkles size={16} />
                                <span>Help me write</span>
                            </div>
                            <textarea
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                placeholder={`Ask Gemini to write ${file.type === 'SHEET' ? 'data' : 'content'}...`}
                                className="w-full bg-white border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-300 resize-none h-24 shadow-sm"
                                autoFocus
                            />
                            <div className="flex justify-end space-x-2 mt-3">
                                <button 
                                    onClick={() => setIsAIPromptOpen(false)}
                                    className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-white/50 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleAIWrite}
                                    disabled={!aiPrompt.trim() || isGenerating}
                                    className="px-4 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md flex items-center space-x-1"
                                >
                                    {isGenerating ? <span>Generating...</span> : (
                                        <>
                                            <span>Create</span>
                                            <ArrowLeft size={12} className="rotate-180" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Email Modal */}
            {isEmailModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Kirim via Email</h3>
                            <button onClick={() => setIsEmailModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Penerima</label>
                                <input 
                                    type="email" 
                                    value={emailRecipient} 
                                    onChange={(e) => setEmailRecipient(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="email@tujuan.com"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Subjek</label>
                                <input 
                                    type="text" 
                                    value={emailSubject} 
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Pesan</label>
                                <textarea 
                                    value={emailBody} 
                                    onChange={(e) => setEmailBody(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                                ></textarea>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded">
                                    <FileText size={16} />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-xs font-bold text-slate-700 truncate">{file.title}</p>
                                    <p className="text-2xs text-slate-500">Lampiran</p>
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <button 
                                    onClick={handleSendEmail}
                                    disabled={isSendingEmail || !emailRecipient}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSendingEmail ? 'Mengirim...' : (
                                        <>
                                            <Send size={14} /> Kirim
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Signature Modal */}
            {isSignatureModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-200">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Digital Signature</h3>
                            <button onClick={() => setIsSignatureModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="border-2 border-dashed border-slate-300 rounded-lg h-32 flex items-center justify-center bg-slate-50 relative group cursor-pointer hover:bg-slate-100 transition">
                                 <div className="text-center">
                                     <span className="text-slate-800 text-2xl italic font-serif block mb-1">Budi Santoso</span>
                                     <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Verified ID</span>
                                 </div>
                                 <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition rounded-lg">
                                     <PenTool size={24} className="text-slate-500" />
                                 </div>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-slate-500">
                                    By clicking sign, you certify that you have reviewed this document and agree to its contents using your MetalOS Digital Identity.
                                </p>
                            </div>
                            <button
                                onClick={handleSignDocument}
                                className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 active:scale-95"
                            >
                                Sign Document with Barcode Stamp
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DocsApp: React.FC<SubAppProps> = ({ onOpenFile, searchQuery }) => {
  const docs: EOfficeFile[] = [
    { id: '1', type: 'DOC', title: 'Surat Pengantar KTP - Budi Santoso', lastModified: 'Hari ini', status: 'Draft', content: 'SURAT PENGANTAR\n\nYang bertanda tangan di bawah ini Ketua RT 04 RW 07 Kelurahan Yosomulyo menerangkan bahwa:\n\nNama: Budi Santoso\nNIK: 18710328821\nAlamat: Jl. Ahmad Yani No 45\n\nAdalah benar warga kami...' },
    { id: '2', type: 'DOC', title: 'Undangan Musrenbang RW 07', lastModified: 'Kemarin', status: 'Final', content: 'UNDANGAN\n\nKepada Yth,\nBapak/Ibu Warga RW 07\n\nDengan hormat,\nMengharap kehadiran Bapak/Ibu pada acara Musyawarah Perencanaan Pembangunan (Musrenbang)...' },
    { id: '3', type: 'DOC', title: 'Laporan Kegiatan Posyandu Okt', lastModified: '20 Okt', status: 'Review', content: 'LAPORAN KEGIATAN POSYANDU\n\nBulan: Oktober 2024\nJumlah Balita: 45\nImunisasi: Lengkap\nPemberian Makanan Tambahan: Bubur Kacang Hijau...' },
    { id: '4', type: 'DOC', title: 'Proposal Pengajuan Dana Mocaf', lastModified: '18 Okt', status: 'Final', content: 'PROPOSAL PENGEMBANGAN MOCAF HUB\n\nLatar Belakang:\nPotensi singkong di Yosomulyo sangat besar, namun harga jual rendah. Diperlukan hilirisasi...' },
  ];

  const filteredDocs = docs.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="p-4 bg-white border-b border-slate-200 flex flex-col md:flex-row justify-between md:items-center gap-3">
        <div className="flex items-center space-x-3">
           <FileText className="text-blue-600" />
           <span className="font-bold text-slate-800">Dokumen / Surat</span>
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
           <button 
             onClick={() => onOpenFile({ id: 'new', type: 'DOC', title: 'Dokumen Baru', content: '', lastModified: 'Now', status: 'Draft' })}
             className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1 shadow hover:bg-blue-700 whitespace-nowrap"
           >
             <Plus size={16} /> <span>Baru</span>
           </button>
        </div>
      </div>
      
      <div className="p-4 md:p-6 overflow-y-auto">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc, i) => (
              <div 
                key={i} 
                onClick={() => onOpenFile(doc)}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition cursor-pointer group active:scale-[0.98]"
              >
                 <div className="h-32 bg-slate-100 rounded-lg mb-3 flex items-center justify-center border border-slate-100 group-hover:border-blue-200 relative overflow-hidden">
                    <div className="absolute inset-2 bg-white shadow-sm border border-slate-200 p-2 text-[6px] text-slate-400 overflow-hidden leading-tight select-none">
                       {doc.content.substring(0, 300)}...
                    </div>
                 </div>
                 <h4 className="font-bold text-slate-800 text-sm truncate">{doc.title}</h4>
                 <div className="flex justify-between mt-2 text-xs text-slate-500">
                    <span>{doc.lastModified}</span>
                    <span className={`px-2 py-0.5 rounded-full ${doc.status === 'Final' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {doc.status}
                    </span>
                 </div>
              </div>
            ))}
            {filteredDocs.length === 0 && (
                <div className="col-span-full py-10 text-center text-slate-400">
                    Tidak ada dokumen ditemukan untuk "{searchQuery}"
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

const SheetsApp: React.FC<SubAppProps> = ({ onOpenFile, searchQuery }) => {
  const sheets: EOfficeFile[] = [
      { id: 's1', type: 'SHEET', title: 'Data Kependudukan RW 07', content: 'No,NIK,Nama,Alamat\n1,18710...,Budi,Jl. A\n2,18710...,Siti,Jl. B', lastModified: 'Yesterday', status: 'Final' },
      { id: 's2', type: 'SHEET', title: 'Anggaran Dana Desa 2024', content: 'Pos,Anggaran,Realisasi\nFisik,500jt,450jt\nSosial,200jt,150jt', lastModified: 'Oct 20', status: 'Draft' },
      { id: 's3', type: 'SHEET', title: 'Inventaris Posyandu', content: 'Barang,Jumlah,Kondisi\nTimbangan,2,Baik\nMeja,4,Baik', lastModified: 'Oct 15', status: 'Final' },
      { id: 's4', type: 'SHEET', title: 'Jadwal Ronda Malam', content: 'Hari,Petugas,Pos\nSenin,Budi,Pos 1\nSelasa,Joko,Pos 1', lastModified: 'Oct 12', status: 'Final' },
  ];

  const filteredSheets = sheets.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col">
       <div className="p-3 border-b border-slate-200 flex items-center justify-between space-x-2 bg-white">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-green-50 rounded text-green-600"><Table size={18} /></div>
            <div className="font-bold text-slate-700">Data Desa</div>
          </div>
          <button 
             onClick={() => onOpenFile({ id: 'new_sheet', type: 'SHEET', title: 'Spreadsheet Baru', content: '', lastModified: 'Now', status: 'Draft' })}
             className="bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1 shadow hover:bg-green-700"
           >
             <Plus size={14} /> <span>Sheet Baru</span>
           </button>
       </div>
       <div className="flex-1 overflow-auto bg-slate-50 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredSheets.map((sheet) => (
                    <div 
                        key={sheet.id}
                        onClick={() => onOpenFile(sheet)}
                        className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md cursor-pointer flex items-center space-x-3 group"
                    >
                        <div className="bg-green-100 p-3 rounded-lg text-green-700 group-hover:bg-green-200 transition"><Table /></div>
                        <div>
                            <div className="font-bold text-sm text-slate-800">{sheet.title}</div>
                            <div className="text-xs text-slate-400">{sheet.lastModified}</div>
                        </div>
                    </div>
                ))}
                {filteredSheets.length === 0 && (
                    <div className="col-span-full py-10 text-center text-slate-400">
                        Tidak ada data ditemukan untuk "{searchQuery}"
                    </div>
                )}
            </div>
       </div>
    </div>
  );
};

const SlidesApp: React.FC<SubAppProps> = ({ onOpenFile, searchQuery }) => {
    const slides: EOfficeFile[] = [
        { id: 'sl1', type: 'SLIDE', title: 'Laporan Realisasi APBDes Q3', content: 'Realisasi APBDes Q3 2024\nKelurahan Yosomulyo', lastModified: 'Yesterday', status: 'Final' },
        { id: 'sl2', type: 'SLIDE', title: 'Strategi Mocaf Hub 2025', content: 'Ekspansi Pasar Mocaf\nTarget: Ekspor', lastModified: 'Oct 18', status: 'Draft' },
        { id: 'sl3', type: 'SLIDE', title: 'Sosialisasi Bank Sampah', content: 'Ubah Sampah Jadi Kuota\nProgram Warga-Enviro', lastModified: 'Oct 10', status: 'Final' },
        { id: 'sl4', type: 'SLIDE', title: 'Profil Kelurahan Digital', content: 'MetalOS: Masa Depan Desa', lastModified: 'Sep 25', status: 'Final' },
    ];

    const filteredSlides = slides.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="flex-1 flex flex-col bg-slate-50">
           <div className="p-3 bg-white border-b border-slate-200 w-full flex justify-between items-center">
             <div className="flex items-center space-x-2">
                 <div className="p-1.5 bg-yellow-50 rounded text-yellow-600"><Presentation size={18} /></div>
                 <span className="font-bold text-slate-800">Presentasi</span>
             </div>
             <div className="flex space-x-2">
                <button 
                    onClick={() => onOpenFile({ id: 'new_slide', type: 'SLIDE', title: 'Paparan Baru', content: 'Title Slide', lastModified: 'Now', status: 'Draft' })}
                    className="bg-yellow-500 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1 shadow hover:bg-yellow-600"
                >
                    <Plus size={14} /> <span>Slide Baru</span>
                </button>
             </div>
           </div>
           
           <div className="p-4 md:p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredSlides.map((slide) => (
                        <div 
                            key={slide.id}
                            onClick={() => onOpenFile(slide)}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md cursor-pointer group transition active:scale-[0.99]"
                        >
                            <div className="aspect-video bg-slate-100 border-b border-slate-100 p-4 flex flex-col items-center justify-center text-center relative group-hover:bg-slate-50">
                                <div className="w-3/4 h-3/4 bg-white shadow-sm border border-slate-200 flex items-center justify-center p-2">
                                    <div className="text-[8px] text-slate-400 leading-tight">
                                        {slide.content}
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/5">
                                    <div className="bg-white p-2 rounded-full shadow-sm">
                                        <Presentation size={20} className="text-yellow-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-3">
                                <h4 className="font-bold text-slate-800 text-sm truncate">{slide.title}</h4>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-slate-400">{slide.lastModified}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${slide.status === 'Final' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {slide.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredSlides.length === 0 && (
                        <div className="col-span-full py-10 text-center text-slate-400">
                            Tidak ada presentasi ditemukan untuk "{searchQuery}"
                        </div>
                    )}
                </div>
           </div>
        </div>
    )
}

const CalendarApp = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([
        { id: 'ev1', title: 'Rapat Koordinasi RW 07', date: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 9, 0), type: 'Work', color: 'bg-blue-500' },
        { id: 'ev2', title: 'Posyandu Balita', date: new Date(new Date().getFullYear(), new Date().getMonth(), 20, 8, 0), type: 'Health', color: 'bg-red-500' },
        { id: 'ev3', title: 'Kerja Bakti', date: new Date(new Date().getFullYear(), new Date().getMonth(), 25, 7, 0), type: 'Community', color: 'bg-green-500' },
        { id: 'ev4', title: 'Deadline Laporan APBDes', date: new Date(new Date().getFullYear(), new Date().getMonth(), 28), type: 'Work', color: 'bg-orange-500' },
        { id: 'ev5', title: 'Cuti Bersama', date: new Date(new Date().getFullYear(), new Date().getMonth(), 5), type: 'Holiday', color: 'bg-purple-500' },
    ]);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '09:00', type: 'Work' });

    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const handleAddEvent = () => {
        if (!newEvent.title || !newEvent.date) return;
        
        const eventDate = new Date(`${newEvent.date}T${newEvent.time}`);
        
        const colors = {
            'Work': 'bg-blue-500',
            'Personal': 'bg-slate-500',
            'Holiday': 'bg-purple-500',
            'Health': 'bg-red-500',
            'Community': 'bg-green-500'
        };

        setEvents([...events, {
            id: `ev_${Date.now()}`,
            title: newEvent.title,
            date: eventDate,
            type: newEvent.type as any,
            color: colors[newEvent.type as keyof typeof colors] || 'bg-blue-500'
        }]);
        
        setIsEventModalOpen(false);
        setNewEvent({ title: '', date: '', time: '09:00', type: 'Work' });
    };

    // Generate Grid
    const totalDays = daysInMonth(currentDate);
    const startDay = firstDayOfMonth(currentDate);
    const daysArray = [];
    
    // Empty cells for offset
    for (let i = 0; i < startDay; i++) {
        daysArray.push(null);
    }
    
    // Day cells
    for (let i = 1; i <= totalDays; i++) {
        daysArray.push(i);
    }

    return (
        <div className="flex h-full bg-white">
            {/* Sidebar */}
            <div className="w-64 border-r border-slate-200 p-4 hidden md:block bg-slate-50">
                <button 
                    onClick={() => setIsEventModalOpen(true)}
                    className="w-full bg-white border border-slate-200 shadow-sm text-slate-700 font-bold py-3 rounded-full flex items-center justify-center gap-2 hover:bg-slate-50 hover:shadow-md transition mb-6"
                >
                    <Plus size={20} className="text-indigo-600" /> Buat Jadwal
                </button>
                
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Kalender Saya</h3>
                    <div className="space-y-2">
                        {['Pekerjaan (Desa)', 'Pribadi', 'Libur Nasional', 'Kesehatan', 'Komunitas'].map((cal, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
                                <span className="text-sm text-slate-700">{cal}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mini Cal (Static for visual) */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-center font-bold text-sm mb-2 text-slate-800">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-400">
                        {['S','M','T','W','T','F','S'].map(d => <div key={d}>{d}</div>)}
                        {Array.from({length: 30}, (_, i) => (
                            <div key={i} className={`p-1 rounded-full ${i+1 === new Date().getDate() ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100'}`}>{i+1}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Calendar */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-slate-800">
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h2>
                        <div className="flex items-center bg-slate-100 rounded-lg p-1">
                            <button onClick={handlePrevMonth} className="p-1 hover:bg-white rounded-md shadow-sm transition"><ChevronLeft size={16} /></button>
                            <button onClick={handleNextMonth} className="p-1 hover:bg-white rounded-md shadow-sm transition"><ChevronRight size={16} /></button>
                        </div>
                        <button onClick={handleToday} className="text-sm font-bold text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition">
                            Hari Ini
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <select className="bg-slate-100 border-none rounded-lg text-sm font-bold text-slate-600 px-3 py-1.5 outline-none cursor-pointer">
                            <option>Bulan</option>
                            <option>Minggu</option>
                            <option>Hari</option>
                        </select>
                    </div>
                </div>

                {/* Grid Header */}
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50">
                    {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(day => (
                        <div key={day} className="py-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Grid Body */}
                <div className="flex-1 grid grid-cols-7 grid-rows-5 overflow-y-auto bg-white">
                    {daysArray.map((day, idx) => {
                        // Filter events for this day
                        const dayEvents = day ? events.filter(e => 
                            e.date.getDate() === day && 
                            e.date.getMonth() === currentDate.getMonth() && 
                            e.date.getFullYear() === currentDate.getFullYear()
                        ) : [];

                        return (
                            <div key={idx} className={`border-b border-r border-slate-100 p-2 min-h-[100px] relative group transition hover:bg-slate-50 ${!day ? 'bg-slate-50/30' : ''}`}>
                                {day && (
                                    <>
                                        <div className={`text-sm font-bold mb-1 w-7 h-7 flex items-center justify-center rounded-full ${
                                            day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth()
                                            ? 'bg-indigo-600 text-white shadow-md' 
                                            : 'text-slate-500'
                                        }`}>
                                            {day}
                                        </div>
                                        <div className="space-y-1">
                                            {dayEvents.map(ev => (
                                                <div 
                                                    key={ev.id} 
                                                    className={`${ev.color} text-white text-[10px] px-2 py-1 rounded shadow-sm truncate cursor-pointer hover:opacity-90`}
                                                    title={ev.title}
                                                >
                                                    {ev.date.getHours() > 0 && <span className="opacity-75 mr-1">{ev.date.getHours()}:{ev.date.getMinutes().toString().padStart(2, '0')}</span>}
                                                    {ev.title}
                                                </div>
                                            ))}
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setNewEvent(prev => ({ ...prev, date: `${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}` }));
                                                setIsEventModalOpen(true);
                                            }}
                                            className="absolute top-2 right-2 p-1 rounded hover:bg-slate-200 text-slate-400 opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Event Modal */}
            {isEventModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                        <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                            <h3 className="font-bold flex items-center gap-2">
                                <CalendarIcon size={18} /> Jadwal Baru
                            </h3>
                            <button onClick={() => setIsEventModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kegiatan</label>
                                <input 
                                    type="text" 
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Rapat, Kunjungan, dll..."
                                    autoFocus
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal</label>
                                    <input 
                                        type="date" 
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Waktu</label>
                                    <div className="flex items-center border border-slate-300 rounded-lg px-3 py-2 focus-within:ring-2 focus:ring-indigo-500 bg-white">
                                        <Clock size={14} className="text-slate-400 mr-2" />
                                        <input 
                                            type="time" 
                                            value={newEvent.time}
                                            onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                                            className="w-full text-sm outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                                <div className="flex gap-2">
                                    {['Work', 'Personal', 'Holiday'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setNewEvent({...newEvent, type})}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition ${newEvent.type === type ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi (Opsional)</label>
                                <div className="flex items-center border border-slate-300 rounded-lg px-3 py-2 focus-within:ring-2 focus:ring-indigo-500 bg-white">
                                    <MapPin size={14} className="text-slate-400 mr-2" />
                                    <input 
                                        type="text" 
                                        placeholder="Balai Desa, Online..."
                                        className="w-full text-sm outline-none"
                                    />
                                </div>
                            </div>
                            <button 
                                onClick={handleAddEvent}
                                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition active:scale-95 mt-2"
                            >
                                Simpan Jadwal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ChatApp = () => {
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
    const [chatInput, setChatInput] = useState('');
    const [callStatus, setCallStatus] = useState<'IDLE' | 'DIALING' | 'CONNECTED'>('IDLE');
    const [callDuration, setCallDuration] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Expanded Contact Interface
    interface ChatContact {
        id: string;
        name: string;
        role: string;
        status: 'online' | 'offline' | 'busy';
        lastMessage: string;
        lastTime: string;
        unread: number;
        avatarSeed: string;
    }

    const [contacts, setContacts] = useState<ChatContact[]>([
        { id: '1', name: 'Pak Lurah', role: 'Kepala Desa', status: 'online', lastMessage: 'Siap pak, data sudah valid.', lastTime: '10:45', unread: 0, avatarSeed: 'Lurah' },
        { id: '2', name: 'Bu Sekdes', role: 'Sekretaris', status: 'busy', lastMessage: 'Tolong revisi surat pengantar.', lastTime: '09:30', unread: 2, avatarSeed: 'Sekdes' },
        { id: '3', name: 'Ketua RW 07', role: 'Tokoh Masyarakat', status: 'offline', lastMessage: 'Warga minta kerja bakti minggu ini.', lastTime: 'Kemarin', unread: 0, avatarSeed: 'RW07' },
        { id: '4', name: 'Admin Anjelo', role: 'Logistik', status: 'online', lastMessage: 'Armada motor listrik siap.', lastTime: '08:15', unread: 0, avatarSeed: 'Anjelo' },
        { id: '5', name: 'Operator Gapura', role: 'IT Support', status: 'online', lastMessage: 'Jaringan aman terkendali.', lastTime: '08:00', unread: 0, avatarSeed: 'Gapura' },
    ]);

    const [messages, setMessages] = useState<{id: string, sender: string, text: string, timestamp: Date, type?: 'file', file?: string}[]>([
        { id: 'm1', sender: 'Pak Lurah', text: 'Selamat siang Pak, laporan sensor banjir RW 07 sepertinya offline.', timestamp: new Date(Date.now() - 3600000) }
    ]);

    const selectedContact = contacts.find(c => c.id === selectedContactId);

    // Simulate Real-time Status Changes - Smarter Logic
    useEffect(() => {
        const interval = setInterval(() => {
            setContacts(prev => prev.map(c => {
                // Keep active contact mostly online for better UX
                if (c.id === selectedContactId && Math.random() > 0.2) return { ...c, status: 'online' };
                
                if (Math.random() > 0.8) {
                    const statuses: ('online' | 'offline' | 'busy')[] = ['online', 'offline', 'busy'];
                    const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                    return { ...c, status: newStatus };
                }
                return c;
            }));
        }, 8000);
        return () => clearInterval(interval);
    }, [selectedContactId]);

    // Call Duration Timer
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (callStatus === 'CONNECTED') {
            timer = setInterval(() => setCallDuration(prev => prev + 1), 1000);
        } else {
            setCallDuration(0);
        }
        return () => clearInterval(timer);
    }, [callStatus]);

    const handleStartCall = () => {
        setCallStatus('DIALING');
        setTimeout(() => {
            setCallStatus('CONNECTED');
        }, 2000);
    };

    const handleEndCall = () => {
        setCallStatus('IDLE');
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const handleSend = () => {
        if (!chatInput.trim()) return;
        
        const newMsg = { 
            id: Date.now().toString(), 
            sender: 'Me', 
            text: chatInput, 
            timestamp: new Date() 
        };
        
        setMessages(prev => [...prev, newMsg]);
        setChatInput('');
        
        // Update last message in sidebar
        if (selectedContactId) {
            setContacts(prev => prev.map(c => 
                c.id === selectedContactId 
                ? { ...c, lastMessage: chatInput, lastTime: 'Now' } 
                : c
            ));
        }

        // Start typing simulation
        setTimeout(() => setIsTyping(true), 800);

        // Sim response
        setTimeout(() => {
            if (selectedContact) {
                setIsTyping(false);
                const replyMsg = { 
                    id: (Date.now()+1).toString(), 
                    sender: selectedContact.name, 
                    text: 'Siap, laksanakan. Segera saya proses.', 
                    timestamp: new Date() 
                };
                setMessages(prev => [...prev, replyMsg]);
                
                setContacts(prev => prev.map(c => 
                    c.id === selectedContactId 
                    ? { ...c, lastMessage: 'Siap, laksanakan. Segera saya proses.', lastTime: 'Now' } 
                    : c
                ));
            }
        }, 2500 + Math.random() * 1000);
    };

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const newMsg = { 
                id: Date.now().toString(), 
                sender: 'Me', 
                text: `Mengirim file: ${file.name}`, 
                type: 'file' as const, 
                file: file.name,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, newMsg]);
            
            // Clear input
            e.target.value = '';
        }
    };

    // Render helpers for status
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'online': return 'bg-green-500';
            case 'busy': return 'bg-red-500';
            default: return 'bg-slate-400';
        }
    };

    const getStatusLabel = (status: string) => {
        switch(status) {
            case 'online': return 'Online';
            case 'busy': return 'Sibuk';
            default: return 'Offline';
        }
    }

    return (
        <div className="flex-1 flex bg-white relative overflow-hidden">
            {/* Hidden File Input */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
            />

            {/* Call Overlay */}
            {callStatus !== 'IDLE' && selectedContact && (
                <div className="absolute inset-0 z-50 bg-slate-900/95 flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
                    <div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center mb-8 relative overflow-visible">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedContact.avatarSeed}`} alt={selectedContact.name} className="w-28 h-28 rounded-full" />
                        <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-ping opacity-20"></div>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{selectedContact.name}</h2>
                    <p className="text-blue-300 text-sm font-mono mb-8 flex items-center gap-2">
                        <Wifi size={14} />
                        {callStatus === 'DIALING' ? 'Dialing via WargaNet...' : `Connected • ${formatTime(callDuration)}`}
                    </p>
                    
                    <div className="flex gap-6">
                        <button className="p-4 bg-slate-800 rounded-full hover:bg-slate-700 transition"><Mic size={24} /></button>
                        <button onClick={handleEndCall} className="p-4 bg-red-600 rounded-full hover:bg-red-700 shadow-lg shadow-red-600/20 transition transform hover:scale-105">
                            <PhoneOff size={32} fill="currentColor" />
                        </button>
                        <button className="p-4 bg-slate-800 rounded-full hover:bg-slate-700 transition"><Video size={24} /></button>
                    </div>
                    <p className="mt-8 text-xs text-slate-500 uppercase tracking-widest">End-to-End Encrypted</p>
                </div>
            )}

            {/* Contact List */}
            <div className={`w-full md:w-80 border-r border-slate-200 flex flex-col ${selectedContactId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-3 border-b border-slate-200">
                    <input type="text" placeholder="Cari kontak..." className="w-full bg-slate-100 px-3 py-2 rounded-lg text-sm outline-none" />
                </div>
                <div className="flex-1 overflow-y-auto">
                    {contacts.map((contact) => (
                        <div 
                            key={contact.id} 
                            onClick={() => setSelectedContactId(contact.id)}
                            className={`flex items-center space-x-3 p-3 cursor-pointer hover:bg-slate-50 transition ${selectedContactId === contact.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'border-l-4 border-transparent'}`}
                        >
                            <div className="relative">
                                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold text-xs overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.avatarSeed}`} alt={contact.name} />
                                </div>
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-sm text-slate-800 truncate">{contact.name}</h4>
                                    <span className="text-[10px] text-slate-400">{contact.lastTime}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className={`text-xs truncate ${contact.unread > 0 ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                                        {contact.lastMessage}
                                    </p>
                                    {contact.unread > 0 && (
                                        <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold ml-2">
                                            {contact.unread}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col absolute inset-0 md:static bg-white z-10 transition-transform duration-300 ${
                selectedContactId ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
            } md:transform-none`}>
                
                {!selectedContactId && (
                   <div className="hidden md:flex flex-1 items-center justify-center flex-col text-slate-300">
                       <MessageSquare size={48} className="mb-4 opacity-50" />
                       <p>Pilih kontak untuk memulai chat</p>
                   </div>
                )}

                {selectedContact && (
                    <>
                        <div className="p-3 md:p-4 border-b border-slate-200 flex items-center space-x-3 bg-white z-20 shadow-sm">
                            <button onClick={() => setSelectedContactId(null)} className="md:hidden p-1 -ml-1 text-slate-500">
                                <ArrowLeft size={20} />
                            </button>
                            <div className="relative">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold text-xs overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedContact.avatarSeed}`} alt={selectedContact.name} />
                                </div>
                                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${getStatusColor(selectedContact.status)}`}></div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 text-sm md:text-base">{selectedContact.name}</h3>
                                <div className="flex items-center space-x-1">
                                    {isTyping ? (
                                        <span className="text-xs text-green-600 font-medium animate-pulse">Sedang mengetik...</span>
                                    ) : (
                                        <>
                                            <span className="text-xs text-slate-500 capitalize">{getStatusLabel(selectedContact.status)}</span>
                                            <span className="text-xs text-slate-300">•</span>
                                            <span className="text-xs text-slate-400">{selectedContact.role}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button 
                                    onClick={handleStartCall}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
                                    title="Call via WargaNet"
                                >
                                    <Phone size={20} />
                                </button>
                                <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition">
                                    <VideoIcon size={20} />
                                </button>
                                <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50/30 flex flex-col">
                            {messages.map((msg, idx) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'Me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex flex-col ${msg.sender === 'Me' ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-md`}>
                                        <div className={`${msg.sender === 'Me' ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'} p-3 rounded-2xl text-sm shadow-sm`}>
                                            {msg.type === 'file' ? (
                                                <div className="flex items-center space-x-2 bg-black/10 p-2 rounded">
                                                    <FileText size={16} />
                                                    <span className="underline cursor-pointer">{msg.file}</span>
                                                </div>
                                            ) : msg.text}
                                        </div>
                                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                                            {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start animate-pulse">
                                    <div className="bg-slate-200/50 p-3 rounded-2xl rounded-tl-none">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-3 border-t border-slate-200 flex space-x-2 bg-white items-center">
                            <button 
                                onClick={handleAttachClick} 
                                className="p-2 text-slate-400 hover:text-slate-600 transition hover:bg-slate-100 rounded-full"
                            >
                                <Paperclip size={20} />
                            </button>
                            <input 
                                type="text" 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ketik pesan..." 
                                className="flex-1 bg-slate-100 px-4 py-2 rounded-full text-sm outline-none focus:ring-1 focus:ring-teal-500" 
                            />
                            <button 
                                onClick={handleSend}
                                disabled={!chatInput.trim()}
                                className="p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 shadow-md transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

const MeetApp = () => {
    const [isMeetingActive, setIsMeetingActive] = useState(false);
    const [meetingCode, setMeetingCode] = useState('');

    const handleStartMeeting = () => {
        setIsMeetingActive(true);
    };

    if (isMeetingActive) {
        return (
            <div className="flex-1 flex flex-col bg-slate-900 relative overflow-hidden animate-in fade-in duration-300">
                 {/* Top Status Bar */}
                 <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-white text-xs font-mono flex items-center space-x-2">
                     <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                     <span>Rakor Mingguan • 00:14:22</span>
                 </div>
                 
                 {/* Video Grid */}
                 <div className="flex-1 p-2 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 overflow-y-auto">
                     {/* Pak Lurah */}
                     <div className="bg-slate-800 rounded-xl relative overflow-hidden border border-slate-700 aspect-video md:aspect-auto">
                         <div className="absolute inset-0 flex items-center justify-center">
                             <div className="w-16 h-16 md:w-24 md:h-24 bg-purple-600 rounded-full flex items-center justify-center text-xl md:text-3xl font-bold text-white shadow-lg">L</div>
                         </div>
                         <div className="absolute bottom-3 left-3 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">Pak Lurah</div>
                     </div>
                     {/* Bu Sekdes */}
                     <div className="bg-slate-800 rounded-xl relative overflow-hidden border border-slate-700 aspect-video md:aspect-auto hidden md:block">
                          <div className="absolute inset-0 flex items-center justify-center">
                             <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">S</div>
                         </div>
                         <div className="absolute bottom-3 left-3 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">Bu Sekdes</div>
                         <div className="absolute top-3 right-3 bg-slate-900/80 p-1.5 rounded-full">
                             <Mic size={14} className="text-red-500" />
                         </div>
                     </div>
                     {/* Tim Anjelo */}
                     <div className="bg-slate-800 rounded-xl relative overflow-hidden border border-slate-700 aspect-video md:aspect-auto hidden md:block">
                         <div className="absolute inset-0 flex items-center justify-center">
                             <Users size={48} className="text-slate-600" />
                         </div>
                         <div className="absolute bottom-3 left-3 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">Tim Anjelo (+3)</div>
                     </div>
                     {/* Self View */}
                     <div className="bg-slate-700 rounded-xl relative overflow-hidden border-2 border-blue-500 shadow-blue-900/50 shadow-lg aspect-video md:aspect-auto">
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                              <p className="text-sm">Anda (Presenting)</p>
                          </div>
                          <div className="absolute bottom-3 right-3 w-24 h-16 md:w-32 md:h-20 bg-black rounded border border-slate-600"></div>
                     </div>
                 </div>

                 {/* Controls */}
                 <div className="bg-slate-800/90 backdrop-blur border-t border-slate-700 p-4 pb-20 md:pb-4 flex items-center justify-center space-x-3 md:space-x-6 z-30 safe-area-bottom">
                     <button className="p-3 rounded-full bg-slate-700 text-white hover:bg-slate-600 active:scale-95 transition"><Mic size={20} /></button>
                     <button className="p-3 rounded-full bg-slate-700 text-white hover:bg-slate-600 active:scale-95 transition"><Camera size={20} /></button>
                     <button 
                        onClick={() => setIsMeetingActive(false)}
                        className="px-6 py-3 rounded-full bg-red-600 text-white hover:bg-red-700 active:scale-95 transition flex items-center space-x-2 font-bold shadow-lg"
                     >
                         <PhoneOff size={20} />
                         <span className="hidden md:inline">Akhiri</span>
                     </button>
                     <button className="p-3 rounded-full bg-slate-700 text-white hover:bg-slate-600 active:scale-95 transition"><Users size={20} /></button>
                     <button className="p-3 rounded-full bg-slate-700 text-white hover:bg-slate-600 active:scale-95 transition"><MessageSquare size={20} /></button>
                 </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white">
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                 <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                    <Video size={64} className="text-red-600" />
                 </div>
                 <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Rapat Digital Desa</h2>
                 <p className="text-slate-500 max-w-md mb-8 text-sm md:text-base">
                    Hubungkan warga dan perangkat desa di mana saja. Aman, mudah, dan terintegrasi dengan MetalOS.
                 </p>
                 
                 <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4 w-full max-w-md">
                     <button 
                        onClick={handleStartMeeting}
                        className="w-full md:w-auto px-6 py-3.5 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 active:scale-95 transition flex items-center justify-center space-x-2"
                     >
                        <Video size={20} />
                        <span>Rapat Baru</span>
                     </button>
                     <div className="flex items-center space-x-2 w-full md:w-auto relative group">
                        <div className="absolute left-3 text-slate-400 group-focus-within:text-red-500 transition">
                            <Link size={18} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Masukkan kode rapat" 
                            className="w-full pl-10 pr-4 py-3.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition bg-slate-50 focus:bg-white"
                        />
                     </div>
                 </div>
            </div>
            
            <div className="border-t border-slate-100 p-6 bg-slate-50/50">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kontak Cepat</h3>
                    <button className="text-xs text-red-600 font-bold hover:underline">Lihat Semua</button>
                 </div>
                 <div className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar">
                     {['Pak Lurah', 'Bu Sekdes', 'Ketua RW 01', 'Bhabin', 'Operator'].map((name, i) => (
                         <button key={i} onClick={handleStartMeeting} className="flex flex-col items-center space-y-2 min-w-[72px] group">
                             <div className="w-14 h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center group-hover:border-red-500 group-hover:shadow-md transition relative">
                                 <span className="font-bold text-slate-600 text-sm">{name.substring(0,2).toUpperCase()}</span>
                                 <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                             </div>
                             <span className="text-xs text-slate-600 font-medium truncate w-full text-center group-hover:text-red-600 transition">{name}</span>
                         </button>
                     ))}
                 </div>
            </div>
        </div>
    );
};

export default EOfficeView;