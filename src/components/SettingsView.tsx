import React, { useState } from "react";
import { 
  Settings as SettingsIcon, 
  LogOut, 
  User, 
  ShieldCheck, 
  Moon, 
  Sun, 
  Languages, 
  HelpCircle, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  Zap,
  Lock,
  Eye,
  Home,
  LayoutDashboard
} from "lucide-react";
import { UserProfile } from "../types";

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onOpenProfile: () => void;
  onNavigate: (tab: string) => void;
  onLogout: () => void;
  onChangeLanguage: (lang: "en" | "th") => void;
  onChangeTheme: (theme: "light" | "dark") => void;
}

export default function SettingsView({
  user,
  onUpdateUser,
  onOpenProfile,
  onNavigate,
  onLogout,
  onChangeLanguage,
  onChangeTheme
}: SettingsViewProps) {
  const isEn = user.language === "en";
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  return (
    <div id="settings-view-main" className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-sky-100/90 via-pink-100/70 to-amber-100/70 p-6 sm:p-8 dark:from-slate-900 dark:via-sky-950/30 dark:to-slate-900 border border-sky-100/80 dark:border-slate-800 shadow-sm">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 text-[10px] font-bold text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-slate-700 uppercase tracking-wider">
              <SettingsIcon className="h-3 w-3 text-sky-500" />
              <span>{isEn ? "System Settings" : "การตั้งค่าระบบและบัญชี"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {isEn ? "Settings & Preferences" : "การตั้งค่าระบบ (Settings)"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              {isEn
                ? "Manage your account session, logout options, language, display themes, and privacy preferences."
                : "จัดการการเข้าสู่ระบบ ยกเลิกการเข้าสู่ระบบ ธีม ภาษา และความเป็นส่วนตัวของบัญชีคุณ"}
            </p>
          </div>

          {/* Quick link back to User Guide which is directly above Settings */}
          <button
            onClick={() => onNavigate("guide")}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-bold border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow transition-all cursor-pointer self-start sm:self-auto active:scale-95"
            title={isEn ? "Go to User Guide" : "ไปยังวิธีการใช้งาน"}
          >
            <HelpCircle className="h-4 w-4 text-emerald-500" />
            <span>{isEn ? "User Guide ➜" : "วิธีการใช้งาน ➜"}</span>
          </button>
        </div>
      </div>

      {/* 2. Core Section: Authentication & Account Management (ยกเลิกการเข้าสู่ระบบ) */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                {isEn ? "Account & Authentication Status" : "สถานะบัญชีและการเข้าสู่ระบบ"}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isEn ? "Active logged-in session details and sign out actions" : "รายละเอียดบัญชีปัจจุบัน และการยกเลิกการเข้าสู่ระบบ"}
              </p>
            </div>
          </div>

          <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
            user.isRegistered 
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800" 
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
          }`}>
            <span className={`h-2 w-2 rounded-full ${user.isRegistered ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
            <span>{user.isRegistered ? (isEn ? "Logged In" : "เข้าสู่ระบบแล้ว") : (isEn ? "Guest Mode" : "ยังไม่ได้สมัคร/เข้าสู่ระบบ")}</span>
          </span>
        </div>

        {user.isRegistered ? (
          <div className="space-y-4">
            {/* User Profile Mini Snapshot */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 gap-3">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 flex items-center justify-center text-2xl aspect-square overflow-hidden">
                  {user.avatar || "🧘"}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name.replace(/!+$/, '')}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300">
                      {user.role === "student" ? (isEn ? "Student" : "นักศึกษา") : (isEn ? "Working Adult" : "วัยทำงาน")}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Lv. {user.level} • {user.xp} XP • {user.streak} {isEn ? "Days Streak" : "วันต่อเนื่อง"}
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenProfile}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 shadow-2xs transition-all cursor-pointer flex items-center space-x-1.5"
                title={isEn ? "Open Profile (Only place where you can edit your name)" : "เปิดโปรไฟล์ผู้ใช้งาน (สามารถแก้ไขชื่อได้ที่นี่)"}
              >
                <span>{isEn ? "View Profile & Edit Name" : "ดูโปรไฟล์และแก้ไขชื่อ"}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Logout Action Card (ตามความต้องการของผู้ใช้: ในการตั้งค่า ให้มี ที่กด ยกเลิกการเข้าสู่ระบบด้วย) */}
            <div className="p-4 sm:p-5 rounded-2xl border border-rose-200/80 dark:border-rose-900/40 bg-gradient-to-br from-rose-50/60 to-pink-50/40 dark:from-rose-950/20 dark:to-slate-900 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <LogOut className="h-4 w-4 text-rose-500" />
                    <h4 className="text-xs sm:text-sm font-bold text-rose-800 dark:text-rose-300">
                      {isEn ? "Sign Out / Cancel Login" : "ยกเลิกการเข้าสู่ระบบ"}
                    </h4>
                  </div>
                  <p className="text-[11px] text-rose-700/80 dark:text-rose-400/80 leading-relaxed max-w-xl">
                    {isEn
                      ? "When you sign out, your level, XP points, continuous streak, and certificates are saved safely in the system. You can log back in anytime using your registered name and 6-digit passcode to restore all your data."
                      : "เมื่อกดยกเลิกการเข้าสู่ระบบ ระบบจะบันทึกข้อมูล เลเวล ({user.level}), คะแนน ({user.xp} XP), สถิติต่อเนื่อง ({user.streak} วัน) และเกียรติบัตรทั้งหมดของคุณไว้อย่างปลอดภัยในระบบ หากต้องการกลับมาใช้งานต่อ สามารถกด 'เข้าสู่ระบบ' ด้วยชื่อของคุณและรหัส 6 หลักเดิมเพื่อดึงข้อมูลกลับมาได้ทุกเมื่อ"}
                  </p>
                </div>
              </div>

              {!showConfirmLogout ? (
                <button
                  onClick={() => setShowConfirmLogout(true)}
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all cursor-pointer flex items-center space-x-2"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>{isEn ? "Sign Out of Account" : "ยกเลิกการเข้าสู่ระบบ"}</span>
                </button>
              ) : (
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-800 space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 text-xs font-bold">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{isEn ? "Are you sure you want to sign out?" : "ยืนยันการยกเลิกการเข้าสู่ระบบหรือไม่?"}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isEn
                      ? "Your account data will be preserved. You can log in later to resume your progress."
                      : "ข้อมูลทั้งหมดของคุณจะถูกบันทึกไว้อย่างปลอดภัย และสามารถกลับมาเข้าสู่ระบบใหม่ได้ทุกเมื่อ"}
                  </p>
                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={onLogout}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      {isEn ? "Yes, Sign Out" : "ยืนยัน ยกเลิกการเข้าสู่ระบบ"}
                    </button>
                    <button
                      onClick={() => setShowConfirmLogout(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      {isEn ? "Cancel" : "ยกเลิก"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-3 text-center sm:text-left">
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              {isEn ? "You are currently not logged in" : "ขณะนี้คุณยังไม่ได้สมัครหรือเข้าสู่ระบบ"}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
              {isEn
                ? "Register or log in to automatically save your mood reflections, track streaks, earn certificates, and build your personalized profile."
                : "สมัครใช้งานหรือเข้าสู่ระบบ เพื่อให้ระบบจำชื่อและข้อมูล บันทึกสถิติต่อเนื่อง รับคะแนน XP และเกียรติบัตรส่วนบุคคล"}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
              <button
                onClick={() => onNavigate("landing")}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-xs font-bold shadow-md shadow-sky-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {isEn ? "Sign Up / Log In on Home" : "ไปที่หน้าหลักเพื่อ สมัครใช้งาน / เข้าสู่ระบบ"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Appearance & Language Preferences */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-5">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <Sun className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              {isEn ? "Language & Display Preferences" : "ภาษาและการแสดงผล"}
            </h2>
            <p className="text-[11px] text-slate-400">
              {isEn ? "Customize system language and color theme" : "ปรับแต่งภาษาของระบบและโหมดสีหน้าจอ"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Language Selector */}
          <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
              <span className="flex items-center space-x-1.5">
                <Languages className="h-4 w-4 text-sky-500" />
                <span>{isEn ? "System Language" : "ภาษาของระบบ"}</span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">{user.language}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChangeLanguage("th")}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                  user.language === "th"
                    ? "bg-sky-500 border-sky-500 text-white shadow-xs"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                }`}
              >
                <span>🇹🇭 ภาษาไทย</span>
              </button>
              <button
                onClick={() => onChangeLanguage("en")}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                  user.language === "en"
                    ? "bg-sky-500 border-sky-500 text-white shadow-xs"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                }`}
              >
                <span>🇬🇧 English</span>
              </button>
            </div>
          </div>

          {/* Theme Selector */}
          <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
              <span className="flex items-center space-x-1.5">
                <Moon className="h-4 w-4 text-purple-500" />
                <span>{isEn ? "Theme Appearance" : "โหมดสีหน้าจอ"}</span>
              </span>
              <span className="text-[10px] text-slate-400 capitalize">{user.theme}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChangeTheme("light")}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                  user.theme === "light"
                    ? "bg-amber-500 border-amber-500 text-white shadow-xs"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                }`}
              >
                <Sun className="h-3.5 w-3.5" />
                <span>{isEn ? "Light" : "สว่าง (Light)"}</span>
              </button>
              <button
                onClick={() => onChangeTheme("dark")}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                  user.theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-white shadow-xs"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                }`}
              >
                <Moon className="h-3.5 w-3.5" />
                <span>{isEn ? "Dark" : "มืด (Dark)"}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Privacy & PDPA Security */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              {isEn ? "Privacy & PDPA Security" : "ความเป็นส่วนตัวและความปลอดภัย"}
            </h2>
            <p className="text-[11px] text-slate-400">
              {isEn ? "Protect your identity and confidential health reflections" : "การรักษาความปลอดภัยของข้อมูลและนโยบายคุ้มครองข้อมูลส่วนบุคคล"}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isEn ? "Anonymous Community Mode" : "โหมดไม่ระบุตัวตนในชุมชน"}
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {isEn ? "Hide your real name and avatar when posting in public community" : "ซ่อนชื่อจริงและใช้นามแฝง 'บัดดี้ร่วมทาง' เมื่อพูดคุยในชุมชน"}
              </p>
            </div>
            <button
              onClick={() => onUpdateUser({ ...user, anonymousMode: !user.anonymousMode })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                user.anonymousMode
                  ? "bg-emerald-500 text-white shadow-xs"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              }`}
            >
              {user.anonymousMode ? (isEn ? "Enabled" : "เปิดใช้งาน") : (isEn ? "Disabled" : "ปิด")}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isEn ? "PDPA & Data Protection Consent" : "ความยินยอมตามนโยบาย PDPA"}
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {isEn ? "Your mental health records are encrypted and retained locally on your device" : "บันทึกสุขภาพจิตได้รับการเข้ารหัสและเก็บรักษาอย่างปลอดภัย"}
              </p>
            </div>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              <span>{isEn ? "Protected" : "ได้รับความคุ้มครอง"}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 5. Quick Navigation Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500">
        <button
          onClick={() => onNavigate("landing")}
          className="inline-flex items-center space-x-1.5 hover:text-sky-600 cursor-pointer font-bold transition-colors"
        >
          <Home className="h-4 w-4" />
          <span>{isEn ? "Back to Home Page" : "กลับสู่หน้าหลัก"}</span>
        </button>

        <button
          onClick={() => onNavigate("dashboard")}
          className="inline-flex items-center space-x-1.5 hover:text-sky-600 cursor-pointer font-bold transition-colors"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>{isEn ? "Return to Dashboard" : "กลับสู่แดชบอร์ด"}</span>
        </button>
      </div>

    </div>
  );
}
