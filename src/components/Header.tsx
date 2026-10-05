import { Sun, Moon, Languages, Award, ShieldAlert, HelpCircle, Home } from "lucide-react";
import { UserProfile } from "../types";
import { translations } from "../translations";

interface HeaderProps {
  user: UserProfile;
  onChangeLanguage: (lang: 'en' | 'th') => void;
  onChangeTheme: (theme: 'light' | 'dark') => void;
  onOpenSOS: () => void;
  onOpenProfile: () => void;
  onOpenGuide: () => void;
  onOpenLanding?: () => void;
  activeTab?: string;
}

export default function Header({ 
  user, 
  onChangeLanguage, 
  onChangeTheme, 
  onOpenSOS, 
  onOpenProfile, 
  onOpenGuide,
  onOpenLanding,
  activeTab
}: HeaderProps) {
  const t = translations[user.language];

  const toggleLanguage = () => {
    onChangeLanguage(user.language === 'en' ? 'th' : 'en');
  };

  const toggleTheme = () => {
    onChangeTheme(user.theme === 'light' ? 'dark' : 'light');
  };

  const xpProgress = (user.xp % 100);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full border-b border-slate-100/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/90 transition-all duration-300">
      {/* 4-Color Calming Pastel Top Accent Bar (ฟ้า, เขียว, ชมพู, เหลือง) */}
      <div className="h-1 w-full bg-gradient-to-r from-sky-400 via-emerald-400 via-pink-400 to-amber-300" />

      {/* Full-width container spanning edge-to-edge so right controls align with top-right corner */}
      <div id="app-header-container" className="w-full flex h-15 items-center justify-between px-3 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Name */}
        <div 
          id="brand-logo-section" 
          className="flex items-center space-x-3 cursor-pointer shrink-0" 
          onClick={onOpenLanding || onOpenProfile} 
          title={user.language === 'en' ? "Go to Home / Landing Page" : "ไปยังหน้าหลัก"}
        >
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-400 via-emerald-400 via-pink-400 to-amber-300 shadow-md shadow-sky-500/10 transition-transform hover:scale-105 active:scale-95">
            <span className="font-sans text-lg sm:text-xl font-extrabold text-white tracking-wider">M</span>
          </div>
          <div>
            <h1 className="font-sans text-base sm:text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
              {t.appName}
            </h1>
            <p className="hidden text-[10px] text-slate-400 dark:text-slate-500 sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Middle Status Bars (XP / Level) */}
        <div 
          id="header-user-status" 
          className="hidden items-center space-x-4 lg:flex cursor-pointer hover:opacity-95 active:scale-95 transition-all"
          onClick={onOpenProfile}
          title={user.language === 'en' ? "View Level Details" : "ดูรายละเอียดเลเวลและคะแนนสะสม"}
        >
          {/* Level in Sunlight Yellow / Amber */}
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-500 shadow-2xs border border-amber-100/60 dark:border-amber-900/30">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                  Lv. {user.level}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  {user.xp} XP
                </span>
              </div>
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 via-amber-400 to-amber-500 transition-all duration-500 rounded-full" 
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Streak in Warm Amber */}
          <div className="flex items-center space-x-1.5 rounded-full bg-amber-50 px-3 py-1 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 border border-amber-100/60 dark:border-amber-900/30">
            <span className="text-xs font-bold">🔥 {user.streak} {user.language === 'en' ? 'Days' : 'วัน'}</span>
          </div>
        </div>

        {/* Action Controls - Aligned seamlessly to the right */}
        <div id="header-controls" className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          
          {/* Home / Landing Page Button */}
          {onOpenLanding && (
            <button
              id="header-home-btn"
              onClick={onOpenLanding}
              title={user.language === 'en' ? 'Home / Landing Page' : 'หน้าหลัก'}
              className={`flex items-center justify-center space-x-1.5 h-9 px-2.5 sm:px-3 rounded-xl shadow-2xs transition-all cursor-pointer border ${
                activeTab === "landing"
                  ? "bg-sky-500 text-white border-sky-500 shadow-sky-500/20"
                  : "bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700 hover:bg-slate-100"
              }`}
            >
              <Home className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline text-xs font-bold">{user.language === 'en' ? 'Home' : 'หน้าหลัก'}</span>
            </button>
          )}

          {/* Quick SOS Trigger Button (ชมพู / Blossom Rose) */}
          <button
            id="quick-sos-btn"
            onClick={onOpenSOS}
            className="flex items-center justify-center sm:space-x-1.5 h-9 px-2.5 sm:px-3 rounded-xl bg-pink-50 text-pink-600 shadow-2xs hover:bg-pink-100 dark:bg-pink-950/30 dark:text-pink-300 dark:hover:bg-pink-900/40 transition-all cursor-pointer border border-pink-200/60 dark:border-pink-900/40"
          >
            <ShieldAlert className="h-4 w-4 animate-pulse shrink-0 text-pink-500" />
            <span className="hidden sm:inline text-xs font-bold tracking-wide">SOS</span>
          </button>

          {/* Quick User Guide Button (ฟ้า / Sky Blue) */}
          <button
            id="header-user-guide-btn"
            onClick={onOpenGuide}
            title={user.language === 'en' ? 'User Guide & Instructions' : 'คู่มือและวิธีการใช้งาน'}
            className="flex items-center justify-center space-x-1.5 h-9 px-2.5 sm:px-3 rounded-xl bg-sky-50 text-sky-600 shadow-2xs hover:bg-sky-100 dark:bg-sky-950/30 dark:text-sky-300 dark:hover:bg-sky-900/40 transition-all cursor-pointer border border-sky-200/60 dark:border-sky-900/40"
          >
            <HelpCircle className="h-4 w-4 shrink-0 text-sky-500" />
            <span className="hidden sm:inline text-xs font-bold">{user.language === 'en' ? 'Guide' : 'วิธีใช้'}</span>
          </button>

          {/* Language Toggle */}
          <button
            id="language-toggle-btn"
            onClick={toggleLanguage}
            title={user.language === 'en' ? 'Switch to Thai' : 'Switch to English'}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/60 bg-slate-50 text-slate-600 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-all cursor-pointer"
          >
            <Languages className="h-4 w-4" />
          </button>

          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            title={user.theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/60 bg-slate-50 text-slate-600 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-all cursor-pointer"
          >
            {user.theme === 'light' ? <Moon className="h-4 w-4 text-amber-500" /> : <Sun className="h-4 w-4 text-amber-400" />}
          </button>

          {/* Mini Avatar Profile Button (เขียว / Fresh Mint Green) */}
          <button
            id="header-profile-avatar-btn"
            onClick={onOpenProfile}
            title={user.language === 'en' ? 'View My Profile' : 'ดูโปรไฟล์ของฉัน'}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-base border border-emerald-200/70 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/40 hover:bg-emerald-100 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-2xs"
          >
            {user.avatar || user.name.charAt(0).toUpperCase()}
          </button>
        </div>

      </div>
    </header>
  );
}
