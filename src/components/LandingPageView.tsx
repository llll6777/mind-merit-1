import React, { useState } from "react";
import { 
  Zap, 
  ShieldCheck, 
  Smile, 
  Headphones, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Lock, 
  Sparkles, 
  Phone, 
  Mail, 
  Globe, 
  Building2, 
  Users, 
  ExternalLink,
  Play,
  X,
  Compass,
  LayoutDashboard,
  Shield,
  HelpCircle,
  Calendar,
  UserCheck,
  GraduationCap,
  Briefcase
} from "lucide-react";
import { UserProfile } from "../types";

import LogoModal from "./LogoModal";
import AuthModal from "./AuthModal";

interface LandingPageViewProps {
  user: UserProfile;
  onEnterApp: () => void;
  onNavigateTab: (tab: string) => void;
  onUpdateUser?: (updated: UserProfile) => void;
  onViewLogo?: () => void;
}

export default function LandingPageView({ user, onEnterApp, onNavigateTab, onUpdateUser, onViewLogo }: LandingPageViewProps) {
  const isEn = user.language === "en";

  // Modals state
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactFormSubmitted, setContactFormSubmitted] = useState(false);
  const [localLogoModalOpen, setLocalLogoModalOpen] = useState(false);

  // Auth Modal State (Register & Login with 6-digit alphanumeric code)
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("register");
  const [authSelectedPackage, setAuthSelectedPackage] = useState<"basic" | "premium" | "b2b">("basic");

  const openRegister = (pkg: "basic" | "premium" | "b2b" = "basic") => {
    setAuthSelectedPackage(pkg);
    setAuthModalMode("register");
    setAuthModalOpen(true);
  };

  const openLogin = () => {
    setAuthModalMode("login");
    setAuthModalOpen(true);
  };
  
  // Private Expert Consultation Modal State
  const [expertConsultModalOpen, setExpertConsultModalOpen] = useState(false);
  const [consultSubmitted, setConsultSubmitted] = useState(false);
  const [consultName, setConsultName] = useState("");
  const [consultRole, setConsultRole] = useState<'student' | 'adult'>("student");
  const [consultDoctor, setConsultDoctor] = useState("dr_wimonchat");
  const [consultTopic, setConsultTopic] = useState("");

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactFormSubmitted(true);
    setTimeout(() => {
      setContactFormSubmitted(false);
      setContactModalOpen(false);
    }, 2500);
  };

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultSubmitted(true);
    setTimeout(() => {
      setConsultSubmitted(false);
      setExpertConsultModalOpen(false);
    }, 2500);
  };


  const openLogoView = () => {
    if (onViewLogo) {
      onViewLogo();
    } else {
      setLocalLogoModalOpen(true);
    }
  };


  return (
    <div className="w-full space-y-8 sm:space-y-14 pb-12 font-sans transition-colors duration-300">
      
      {/* =========================================================================
          SECTION 1: Header / Navigation Bar (แถบเมนูด้านบนของหน้าหลัก)
          ========================================================================= */}
      <header className="relative w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-sky-100/60 dark:border-slate-800/80 transition-all rounded-2xl sm:rounded-3xl shadow-sm px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between mb-4 sm:mb-8">
        
        {/* ฝั่งซ้าย: โลโก้แบรนด์ และปุ่มดูโลโก้ */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <div 
            onClick={openLogoView}
            className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl overflow-hidden shadow-md shadow-sky-500/10 hover:scale-110 active:scale-95 transition-transform bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 cursor-pointer group"
            title={isEn ? "Click to view full Logo" : "คลิกเพื่อดูโลโก้เว็บขนาดเต็ม"}
          >
            <img 
              src="/logo.png" 
              alt="MIND MERIT" 
              className="h-full w-full object-cover rounded-xl sm:rounded-2xl"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = parent.querySelector('.brand-fallback');
                  if (fallback) fallback.classList.remove('hidden');
                }
              }}
            />
            <div className="brand-fallback hidden absolute inset-0 items-center justify-center bg-gradient-to-tr from-sky-400 via-emerald-400 via-pink-400 to-amber-300">
              <span className="font-sans text-base sm:text-xl font-black text-white tracking-wider">M</span>
            </div>
            <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
          
          <div 
            onClick={openLogoView}
            className="cursor-pointer group"
            title={isEn ? "Click to view brand logo" : "คลิกเพื่อดูโลโก้เว็บ"}
          >
            <div className="flex items-center space-x-2">
              <span className="font-black text-sm sm:text-lg text-slate-800 dark:text-slate-100 tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                MIND MERIT
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/40 text-[9px] font-bold text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/40 hidden sm:inline-block">
                {isEn ? "View Logo" : "ดูโลโก้"}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden md:block">Mental Health & Productivity Ecosystem</p>
          </div>
        </div>

        {/* ตรงกลาง: ลิงก์เมนู (หน้าแรก, ฟีเจอร์/บริการ, Packages, เกี่ยวกับเรา, ติดต่อเรา) */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-xs font-bold text-slate-600 dark:text-slate-300">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
          >
            {isEn ? "Home" : "หน้าแรก"}
          </button>
          <button 
            onClick={() => scrollToSection("landing-features")}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
          >
            {isEn ? "Features & Services" : "ฟีเจอร์ / บริการ"}
          </button>
          <button 
            onClick={() => scrollToSection("landing-packages")}
            className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer flex items-center space-x-1"
          >
            <span>Packages</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">3 แบบ</span>
          </button>
          <button 
            onClick={() => scrollToSection("landing-testimonials")}
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
          >
            {isEn ? "About Us" : "เกี่ยวกับเรา"}
          </button>
          <button 
            onClick={() => setContactModalOpen(true)}
            className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
          >
            {isEn ? "Contact Us" : "ติดต่อเรา"}
          </button>
        </nav>

        {/* ฝั่งขวา: ปุ่ม เข้าสู่ระบบ (Login) และปุ่มเด่น สมัครใช้งาน (Sign Up / Register) */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          <button
            onClick={openLogin}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            {isEn ? "Log In" : "เข้าสู่ระบบ"}
          </button>

          <button
            onClick={() => openRegister("basic")}
            className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white rounded-xl sm:rounded-2xl bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 shadow-md shadow-sky-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center space-x-1 sm:space-x-1.5"
          >
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>{isEn ? "Sign Up Free" : "สมัครใช้งาน"}</span>
          </button>

          {/* Quick jump directly into live app */}
          <button
            onClick={onEnterApp}
            title={isEn ? "Launch App" : "เข้าสู่แอป"}
            className="p-2 text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-2xl hover:bg-sky-100 transition-all cursor-pointer hidden md:flex items-center space-x-1"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="text-[11px]">{isEn ? "Dashboard" : "แดชบอร์ด"}</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          SECTION 2: Hero Section (ส่วนแรกสุดบนหน้าจอ - จัดกึ่งกลาง สง่างาม เรียบง่าย)
          ========================================================================= */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-sky-50/90 via-pink-50/70 via-amber-50/60 to-emerald-50/70 dark:from-slate-900/90 dark:via-sky-950/30 dark:to-slate-900/90 border border-white/70 dark:border-slate-800 p-6 sm:p-10 md:p-14 shadow-sm transition-all text-center">
        
        {/* Floating background decorative aura */}
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-200/40 dark:bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-pink-200/40 dark:bg-pink-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-amber-200/30 dark:bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-5 sm:space-y-7">
          
          {/* Tagline Badge with Logo Preview link */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-sky-200/70 dark:border-slate-700 shadow-2xs">
            <span 
              onClick={openLogoView} 
              className="cursor-pointer flex items-center space-x-1 text-sky-600 dark:text-sky-400 hover:underline font-bold text-[10px] sm:text-[11px]"
              title={isEn ? "View Official Logo" : "ดูโลโก้ทางการ"}
            >
              <span>🧘</span>
              <span>MIND MERIT</span>
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              {isEn ? "Holistic Mental Well-being Ecosystem" : "แพลตฟอร์มดูแลสุขภาพจิตอัจฉริยะ"}
            </span>
          </div>

          {/* ข้อความพาดหัวหลัก (Headline) */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
            {isEn 
              ? "Empower Your Mind, Elevate Your Daily Peace" 
              : "ดูแลสุขภาพใจและความสุขของคุณให้เป็นเรื่องง่ายในทุกวัน"}
          </h1>

          {/* ข้อความรอง (Sub-headline) */}
          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {isEn 
              ? "The smart mental wellness companion for students and professionals. Automatic mood tracking, 24/7 AI psychologist listening, certified mindfulness breathing, and scientifically validated assessments."
              : "แพลตฟอร์มดูแลสุขภาพจิตอัจฉริยะสำหรับนักเรียน นักศึกษา และคนทำงาน ช่วยวิเคราะห์ความรู้สึกและตรวจจับความเครียดอัตโนมัติ แม่นยำ ปลอดภัย พร้อมคู่หู AI และเกียรติบัตรรับรอง"}
          </p>

          {/* ปุ่ม Call-to-Action (CTA) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => openRegister("basic")}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>{isEn ? "Sign Up Free" : "สมัครใช้งาน (ฟรี)"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={openLogin}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl sm:rounded-2xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/50 text-sky-700 dark:text-sky-300 font-bold text-xs sm:text-sm border border-sky-200/80 dark:border-sky-800 shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <UserCheck className="h-4 w-4 text-sky-500" />
              <span>{isEn ? "Log In" : "เข้าสู่ระบบ"}</span>
            </button>
          </div>

          {/* 4 Feature Highlights */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-1.5 bg-white/60 dark:bg-slate-800/60 px-3 py-1.5 rounded-full border border-white/80 dark:border-slate-700/60 shadow-2xs">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-500 shrink-0" />
              <span>{isEn ? "No Card Needed" : "ไม่มีค่าใช้จ่าย"}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white/60 dark:bg-slate-800/60 px-3 py-1.5 rounded-full border border-white/80 dark:border-slate-700/60 shadow-2xs">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500 shrink-0" />
              <span>{isEn ? "24/7 AI Buddy" : "AI คอยรับฟัง 24 ชม."}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white/60 dark:bg-slate-800/60 px-3 py-1.5 rounded-full border border-white/80 dark:border-slate-700/60 shadow-2xs">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-pink-500 shrink-0" />
              <span>{isEn ? "PDPA Encrypted" : "ปลอดภัยตาม PDPA"}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white/60 dark:bg-slate-800/60 px-3 py-1.5 rounded-full border border-white/80 dark:border-slate-700/60 shadow-2xs">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 shrink-0" />
              <span>{isEn ? "E-Certificates" : "รับเกียรติบัตรฟรี"}</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: Key Features / Value Proposition (ฟีเจอร์เด่นหรือคุณค่าของเว็บ 4 คอลัมน์)
          ========================================================================= */}
      <section id="landing-features" className="space-y-6 sm:space-y-8 scroll-mt-24">
        
        <div className="text-center space-y-2 max-w-2xl mx-auto px-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-900/40">
            {isEn ? "CORE VALUES" : "คุณค่าที่คุณจะได้รับ"}
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {isEn ? "Why Choose MIND MERIT Platform?" : "ทำไมต้องเลือกใช้บริการของเรา?"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isEn 
              ? "Designed for human wellness with state-of-the-art security, speed, and simplicity."
              : "ออกแบบมาเพื่อส่งเสริมสุขภาวะที่ดีที่สุดสำหรับคนไทย ใช้งานง่าย รวดเร็ว ปลอดภัย และมีทีมงานเคียงข้างเสมอ"}
          </p>
        </div>

        {/* 4 คอลัมน์ Grid Layout */}
        <div className="grid gap-3.5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* คอลัมน์ 1: ไอคอนความเร็ว - ประมวลผลไว เรียลไทม์ (ฟ้า / Sky Blue) */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-sky-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-sky-300 transition-all space-y-3 sm:space-y-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 shadow-2xs border border-sky-100">
              <Zap className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="space-y-1 sm:space-y-1.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
                {isEn ? "Real-time Fast Processing" : "ประมวลผลไว เรียลไทม์"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {isEn 
                  ? "Instant mood trends, immediate AI psychological feedback, and sub-second data synchronization."
                  : "บันทึกอารมณ์และรับการวิเคราะห์ผลทางจิตวิทยาได้ทันที แสดงกราฟดัชนีสุขภาวะแบบสดๆ ไม่ต้องรอนาน"}
              </p>
            </div>
            <div className="pt-1 text-[11px] font-bold text-sky-600 dark:text-sky-400 flex items-center space-x-1">
              <span>{isEn ? "Sub-second speed" : "เร็วทันใจในเสี้ยววินาที"}</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {/* คอลัมน์ 2: ไอคอนความปลอดภัย - ระบบล็อกรหัส 2 ชั้น มาตรฐานสากล (เขียว / Mint Green) */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-emerald-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all space-y-3 sm:space-y-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 shadow-2xs border border-emerald-100">
              <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="space-y-1 sm:space-y-1.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
                {isEn ? "Bank-Grade Security" : "ระบบความปลอดภัย 2 ชั้น"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {isEn 
                  ? "Standard 2FA multi-factor authentication, end-to-end encryption, and full PDPA compliance."
                  : "ระบบล็อกรหัส 2 ชั้น มาตรฐานสากล เข้ารหัสข้อมูลส่วนบุคคล 100% สอดคล้องตามกฎหมาย PDPA ทุกประการ"}
              </p>
            </div>
            <div className="pt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
              <span>{isEn ? "PDPA & 2FA Protected" : "มาตรฐานระดับสากล"}</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {/* คอลัมน์ 3: ไอคอนความง่าย - ใช้งานง่าย ไม่ต้องมีพื้นฐานก็ทำได้ (ชมพู / Blossom Pink) */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-pink-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-pink-300 transition-all space-y-3 sm:space-y-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400 shadow-2xs border border-pink-100">
              <Smile className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="space-y-1 sm:space-y-1.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
                {isEn ? "Intuitive & Effortless" : "ใช้งานง่าย ไม่ต้องมีพื้นฐาน"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {isEn 
                  ? "Clean ergonomic UI, gentle pastel colors, zero learning curve for students, staff, and seniors."
                  : "หน้าจอสบายตา ไม่ซับซ้อน ใช้งานได้ทันทีโดยไม่ต้องผ่านการอบรม ตอบโจทย์ทั้งวัยเรียนและคนทำงาน"}
              </p>
            </div>
            <div className="pt-1 text-[11px] font-bold text-pink-600 dark:text-pink-400 flex items-center space-x-1">
              <span>{isEn ? "Designed for Everyone" : "เข้าใจง่ายใน 1 นาที"}</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {/* คอลัมน์ 4: ไอคอนซัพพอร์ต - ทีมงานดูแลช่วยเหลือตลอด 24 ชั่วโมง (เหลือง / Sunlight Yellow) */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-amber-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-300 transition-all space-y-3 sm:space-y-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 shadow-2xs border border-amber-100">
              <Headphones className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="space-y-1 sm:space-y-1.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
                {isEn ? "24/7 Dedicated Support" : "ทีมงานช่วยเหลือตลอด 24 ชม."}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {isEn 
                  ? "Round-the-clock live support, emergency hotlines, and certified wellness psychologists always on stand-by."
                  : "ทีมงานและผู้เชี่ยวชาญพร้อมให้คำแนะนำตลอด 24 ชั่วโมง พร้อมปุ่ม SOS ฉุกเฉินสำหรับสถานการณ์เร่งด่วน"}
              </p>
            </div>
            <div className="pt-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1">
              <span>{isEn ? "Always by your side" : "ดูแลคุณตลอดเวลา"}</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>

        </div>

      </section>

      {/* =========================================================================
          SECTION 5: How It Works (ขั้นตอนการใช้งานย่อๆ 3 ขั้นตอน แนวนอน)
          ========================================================================= */}
      <section className="rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-sky-100/70 dark:border-slate-800 p-5 sm:p-10 shadow-sm space-y-6 sm:space-y-8">
        
        <div className="text-center space-y-2 max-w-xl mx-auto px-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-100">
            {isEn ? "SIMPLE ONBOARDING" : "ขั้นตอนแสนง่าย"}
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {isEn ? "Get Started in 3 Simple Steps" : "เริ่มต้นง่ายๆ ใน 3 ขั้นตอน"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isEn ? "Ready in under 60 seconds without complex configurations." : "พร้อมใช้งานได้ทันทีในเวลาไม่ถึง 1 นาที ไม่ยุ่งยาก"}
          </p>
        </div>

        {/* 3 ขั้นตอน แนวนอน */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3 relative">
          
          {/* Step 1 */}
          <div className="relative p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-sky-50/70 to-transparent dark:from-sky-950/20 border border-sky-100/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-sky-500 text-white font-extrabold text-sm sm:text-lg shadow-md shadow-sky-500/20">
                1
              </span>
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">Step 01</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
              {isEn ? "Sign Up & Create Your Profile" : "สมัครสมาชิกและสร้างโปรไฟล์ของคุณ"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isEn 
                ? "Enter your preferred name, student/adult role, and customize your personal wellness avatar."
                : "กรอกชื่อที่ต้องการ กำหนดสถานะวัยเรียนหรือคนทำงาน และเลือกอิโมจิโปรไฟล์ของคุณเพื่อเริ่มต้นสะสมแต้ม"}
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-emerald-50/70 to-transparent dark:from-emerald-950/20 border border-emerald-100/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-500 text-white font-extrabold text-sm sm:text-lg shadow-md shadow-emerald-500/20">
                2
              </span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Step 02</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
              {isEn ? "Connect Data or Choose Templates" : "เชื่อมต่อข้อมูลหรือเลือกเทมเพลตที่ต้องการ"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isEn 
                ? "Choose your focus: daily mood check-in, stress reduction courses, or peer buddy pairing."
                : "เลือกเป้าหมายที่ต้องการ เช่น เช็คอินอารมณ์รายวัน, ฝึกหายใจคลายเครียด หรือจับคู่บัดดี้เพื่อแลกเปลี่ยนกำลังใจ"}
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-pink-50/70 to-transparent dark:from-pink-950/20 border border-pink-100/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-pink-500 text-white font-extrabold text-sm sm:text-lg shadow-md shadow-pink-500/20">
                3
              </span>
              <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider">Step 03</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
              {isEn ? "Start Using & See Instant Results" : "เริ่มต้นใช้งานและดูผลลัพธ์ผ่านแดชบอร์ดทันที"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isEn 
                ? "View real-time wellness charts, talk with your AI psychologist, and earn certificates immediately."
                : "ติดตามสถิติสุขภาวะผ่านแดชบอร์ดสดๆ ปรึกษาคู่หู AI และรับเกียรติบัตรรับรองความก้าวหน้าได้ทันที"}
            </p>
          </div>

        </div>

        {/* CTA below steps */}
        <div className="text-center pt-1">
          <button
            onClick={onEnterApp}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl sm:rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-md"
          >
            <span>{isEn ? "Try The 3 Steps Now" : "ทดลองใช้งาน 3 ขั้นตอนนี้เลย"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </section>

      {/* =========================================================================
          SECTION 6: Service Packages (โครงสร้าง Package สำหรับบุคคลและโรงเรียน)
          ========================================================================= */}
      <section id="landing-packages" className="space-y-8 sm:space-y-10 scroll-mt-20">
        
        <div className="text-center space-y-3 max-w-2xl mx-auto px-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-sky-50 to-emerald-50 dark:from-slate-800 dark:to-slate-800 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-slate-700 uppercase tracking-widest">
            <Sparkles className="h-3 w-3 text-amber-500 fill-current" />
            <span>MIND MERIT Service Packages</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {isEn ? "Choose Your Package for Mental Well-being" : "เลือก Package ที่ตอบโจทย์การดูแลสุขภาพใจ"}
          </h2>
        </div>

        {/* 3 Packages Grid */}
        <div className="grid gap-6 lg:grid-cols-3 items-stretch">
          
          {/* Package 1: B2C Basic Package (แพ็กเกจบุคคล - ฟรี) */}
          <div className="relative rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {isEn ? "FREE" : "ฟรี"}
                </span>
                <span className="text-xs text-slate-400 font-medium">B2C Basic</span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  B2C Basic Package
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  {isEn ? "(Individual - Free)" : "(แพ็กเกจบุคคล - ฟรี)"}
                </p>
              </div>

              {/* Price */}
              <div className="py-2 border-y border-slate-100 dark:border-slate-800">
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">0 บาท</span>
                  <span className="text-xs text-slate-400">/ ฟรี</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-300 bg-emerald-50/50 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40 leading-relaxed">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">เงื่อนไข: </span>
                  สำหรับนักเรียนและเยาวชนทั่วไป ไม่มีค่าใช้จ่าย (ฟรี)
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  {isEn ? "WHAT'S INCLUDED:" : "สิ่งที่จะได้รับ:"}
                </p>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-800 dark:text-slate-200">Daily Mood Check-in:</strong> ระบบบันทึกและติดตามอารมณ์รายวัน</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-800 dark:text-slate-200">Gamification Quests:</strong> ระบบภารกิจสะสมแต้ม XP</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-800 dark:text-slate-200">AI Companion:</strong> ระบบพูดคุยให้คำปรึกษาเบื้องต้น</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-800 dark:text-slate-200">Safe Community:</strong> พื้นที่ปลอดภัยสำหรับการแบ่งปันและแลกเปลี่ยนประสบการณ์</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => openRegister("basic")}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{isEn ? "Apply B2C Basic (Free)" : "สมัครใช้งาน B2C Basic (ฟรี)"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Package 2: B2C Premium Package (แพ็กเกจบุคคล - ขั้นสูง) [FEATURED] */}
          <div className="relative rounded-3xl bg-gradient-to-b from-sky-50/90 via-white to-pink-50/40 dark:from-slate-800/90 dark:via-slate-900/90 dark:to-slate-900/90 backdrop-blur-md border-2 border-sky-400 dark:border-sky-500 p-6 sm:p-7 shadow-lg shadow-sky-500/10 hover:shadow-xl transition-all flex flex-col justify-between space-y-6 lg:-translate-y-2">
            
            {/* Recommended Ribbon */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-pink-500 text-white text-[10px] font-black tracking-wider uppercase shadow-md shadow-sky-500/25 flex items-center space-x-1">
              <Sparkles className="h-3 w-3 fill-current" />
              <span>RECOMMENDED FOR INDIVIDUALS</span>
            </div>

            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  {isEn ? "DEEP AI ANALYTICS" : "วิเคราะห์เจาะลึกเฉพาะบุคคล"}
                </span>
                <span className="text-xs text-sky-600 dark:text-sky-400 font-bold">B2C Premium</span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  B2C Premium Package
                </h3>
                <p className="text-xs text-sky-600 dark:text-sky-400 font-bold mt-1">
                  (แพ็กเกจบุคคล - ขั้นสูง)
                </p>
              </div>

              {/* Price */}
              <div className="py-2 border-y border-sky-100 dark:border-slate-800">
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">100 บาท</span>
                  <span className="text-xs text-slate-400">/ เดือน / คน</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-300 bg-sky-50/80 dark:bg-sky-950/40 p-2.5 rounded-xl border border-sky-100 dark:border-sky-900/40 leading-relaxed">
                  <span className="font-bold text-sky-700 dark:text-sky-300">เงื่อนไข: </span>
                  ชำระค่าบริการเป็นรายเดือนต่อผู้ใช้งาน สำหรับผู้ที่ต้องการระบบวิเคราะห์และคำแนะนำเฉพาะบุคคล
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  {isEn ? "WHAT'S INCLUDED:" : "สิ่งที่จะได้รับ:"}
                </p>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-800 dark:text-slate-200">ฟีเจอร์ B2C Basic ทั้งหมด:</strong> Mood Check-in, Gamification, AI Companion และ Safe Community</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-800 dark:text-slate-200">Personalized Deep AI Analytics:</strong> ระบบ AI วิเคราะห์แนวโน้มอารมณ์ย้อนหลังเชิงลึก</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-800 dark:text-slate-200">Personalized Recommendations:</strong> คำแนะนำและการประเมินสุขภาพจิตที่ปรับให้เข้ากับสภาวะอารมณ์ส่วนบุคคล</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => openRegister("premium")}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-pink-500 hover:from-sky-600 hover:to-pink-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/25 transition-all cursor-pointer flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{isEn ? "Apply B2C Premium (100 THB/mo)" : "สมัคร B2C Premium Package"}</span>
              <Sparkles className="h-4 w-4" />
            </button>
          </div>

          {/* Package 3: B2B School Package (แพ็กเกจสำหรับโรงเรียน) */}
          <div className="relative rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-indigo-200 dark:border-indigo-900/60 p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {isEn ? "FOR SCHOOLS & EDU" : "สำหรับสถาบันการศึกษา"}
                </span>
                <span className="text-xs text-indigo-500 font-bold">B2B School</span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  B2B School Package
                </h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mt-1">
                  (แพ็กเกจสำหรับโรงเรียน)
                </p>
              </div>

              {/* Price */}
              <div className="py-2 border-y border-slate-100 dark:border-slate-800">
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">990 บาท</span>
                  <span className="text-xs text-slate-400">/ เดือน / โรงเรียน</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-300 bg-indigo-50/60 dark:bg-indigo-950/30 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/40 leading-relaxed">
                  <span className="font-bold text-indigo-700 dark:text-indigo-300">เงื่อนไข: </span>
                  ชำระบริการเป็นรายเดือนต่อ 1 โรงเรียน
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {isEn ? "WHAT'S INCLUDED:" : "สิ่งที่จะได้รับ:"}
                </p>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-800 dark:text-slate-200">B2B School Dashboard:</strong> หน้าปัดสรุปภาพรวมสภาวะสุขภาพจิตของนักเรียนทั้งโรงเรียนแบบ Real-Time</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-800 dark:text-slate-200">Early Warning Alert:</strong> ระบบแจ้งเตือนอัตโนมัติเมื่อพบเคสเสี่ยงระดับกลางถึงระดับสูง เพื่อให้ครูเข้าช่วยเหลือได้ทันเวลา</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-800 dark:text-slate-200">Anonymized Data Insight Report:</strong> รายงานสรุปสถิติภาพรวมรายเทอม ถูกต้องตามกฎหมาย PDPA สำหรับใช้วางนโยบายส่งเสริมสุขภาพจิตในโรงเรียน</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setContactModalOpen(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{isEn ? "Inquire B2B School Package" : "ติดต่อฝ่ายวิชาการ / สนใจ B2B School Package"}</span>
              <Building2 className="h-4 w-4" />
            </button>
          </div>

        </div>

      </section>

      {/* =========================================================================
          SECTION 7: Testimonials (เสียงสะท้อนจากผู้ใช้งานจริง 3 กล่อง)
          ========================================================================= */}
      <section id="landing-testimonials" className="space-y-6 sm:space-y-8 scroll-mt-24">
        
        <div className="text-center space-y-2 max-w-xl mx-auto px-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border border-pink-100">
            {isEn ? "COMMUNITY LOVE" : "รีวิวและความประทับใจ"}
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {isEn ? "Voices from Our Real Users" : "เสียงสะท้อนจากผู้ใช้งานจริงของเรา"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isEn ? "See how MIND MERIT is making a real difference in people's everyday lives." : "สัมผัสประสบการณ์จริงจากผู้ใช้งานที่ชีวิตและความสุขเปลี่ยนไปในทางที่ดีขึ้น"}
          </p>
        </div>

        {/* 3 Review Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
          
          {/* Review Card 1 */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 sm:space-y-4">
            <div className="space-y-2.5">
              <div className="flex text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                {isEn 
                  ? "“The mood check-in with AI analysis helped me manage intense final exam anxiety. The pastel colors are so relaxing, and receiving the certified certificate boosted my resume!”"
                  : "“ระบบเช็คอินอารมณ์และคู่หู AI ช่วยให้ผมผ่านช่วงอ่านหนังสือสอบที่เครียดหนักมาได้ดีมากครับ โทนสีสบายตาสุดๆ แถมคอร์สฝึกหายใจยังมีเกียรติบัตรไว้ใส่พอร์ตได้จริงด้วย”"}
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-3 border-t border-slate-50 dark:border-slate-800">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-sky-100 text-sky-700 font-bold text-xs sm:text-sm shrink-0">
                ธน
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">ธนกร รัตนวงศ์</h4>
                <p className="text-[10px] text-slate-400">นักศึกษาคณะวิศวกรรมศาสตร์ มหาวิทยาลัยเชียงใหม่</p>
              </div>
            </div>
          </div>

          {/* Review Card 2 */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 sm:space-y-4">
            <div className="space-y-2.5">
              <div className="flex text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                {isEn 
                  ? "“Our whole company team uses MIND MERIT for wellness check-ins. It is fast, 100% private under PDPA, and cut down workplace burnout remarkably.”"
                  : "“ทีมงานในบริษัทเราใช้ MIND MERIT ในการเช็คอินพลังใจทุกเช้า ระบบเร็วมาก มั่นใจได้ในความปลอดภัยของข้อมูล PDPA ช่วยลดภาวะหมดไฟในที่ทำงานได้อย่างเห็นผลชัดเจน”"}
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-3 border-t border-slate-50 dark:border-slate-800">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-pink-100 text-pink-700 font-bold text-xs sm:text-sm shrink-0">
                วร
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">วรัทยา ศิริจันทร์</h4>
                <p className="text-[10px] text-slate-400">Head of People & HR, Tech SME Bangkok</p>
              </div>
            </div>
          </div>

          {/* Review Card 3 */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 sm:space-y-4">
            <div className="space-y-2.5">
              <div className="flex text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                {isEn 
                  ? "“The curated videos library works seamlessly without unplayable errors. Whenever I feel down, the 24/7 AI psychologist provides warm, non-judgmental advice.”"
                  : "“คลังวิดีโอดูได้จริง 100% ไม่มีปัญหาคลิปดูไม่ได้เลยครับ วันไหนที่รู้สึกโดดเดี่ยวหรือเหนื่อยล้า แค่เปิดมาคุยกับคู่หู AI ก็ได้รับพลังบวกและข้อคิดดีๆ กลับมาสู้ต่อเสมอ”"}
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-3 border-t border-slate-50 dark:border-slate-800">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-100 text-emerald-700 font-bold text-xs sm:text-sm shrink-0">
                กม
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">กมลพรรณ วัฒนากุล</h4>
                <p className="text-[10px] text-slate-400">Content Creator & Freelance Designer</p>
              </div>
            </div>
          </div>

        </div>

      </section>



      {/* =========================================================================
          SECTION 8: Footer (ส่วนท้ายของเว็บไซต์)
          ========================================================================= */}
      <footer className="rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-100 dark:border-slate-800 p-5 sm:p-10 space-y-6 sm:space-y-8">
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 shadow-2xs">
                <img 
                  src="/logo.png" 
                  alt="MIND MERIT" 
                  className="h-full w-full object-cover rounded-xl"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallback = parent.querySelector('.brand-fallback');
                      if (fallback) fallback.classList.remove('hidden');
                    }
                  }}
                />
                <div className="brand-fallback hidden absolute inset-0 items-center justify-center bg-gradient-to-tr from-sky-400 to-emerald-400 text-white font-extrabold text-base">
                  M
                </div>
              </div>
              <span className="font-extrabold text-base text-slate-800 dark:text-slate-100">MIND MERIT</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isEn 
                ? "Empowering human potential through modern mental fitness, thoughtful technology, and psychological support."
                : "สร้างเสริมพลังใจและยกระดับศักยภาพมนุษย์ ด้วยเทคโนโลยีการดูแลใจที่เข้าถึงง่ายและปลอดภัยสำหรับทุกคน"}
            </p>
          </div>

          {/* ลิงก์เมนูด่วน */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {isEn ? "Quick Navigation" : "เมนูด่วน"}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-sky-600 cursor-pointer">
                  {isEn ? "Home" : "หน้าแรก"}
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("landing-features")} className="hover:text-sky-600 cursor-pointer">
                  {isEn ? "Features & Values" : "ฟีเจอร์และคุณค่า"}
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("landing-packages")} className="hover:text-sky-600 cursor-pointer">
                  <span>Packages</span>
                </button>
              </li>
              <li>
                <button onClick={onEnterApp} className="hover:text-sky-600 cursor-pointer">
                  {isEn ? "Live App Dashboard" : "แดชบอร์ดระบบ"}
                </button>
              </li>
            </ul>
          </div>

          {/* ช่องทางติดต่อ (เบอร์โทร, อีเมล, โซเชียลมีเดีย) */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {isEn ? "Contact Channels" : "ช่องทางติดต่อ"}
            </h4>
            <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-2">
                <Phone className="h-3.5 w-3.5 text-sky-500" />
                <span>02-888-9999 (สายด่วนสุขภาพใจ)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-3.5 w-3.5 text-emerald-500" />
                <span>contact@mindmerit.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-3.5 w-3.5 text-pink-500" />
                <span>www.mindmerit.app</span>
              </div>
              <div className="flex items-center space-x-2 pt-1 text-slate-600 dark:text-slate-300 font-bold">
                <span>Social: @MindMeritOfficial</span>
              </div>
            </div>
          </div>

          {/* กฎหมายและนโยบายความเป็นส่วนตัว (Privacy Policy) */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {isEn ? "Legal & Privacy" : "กฎหมาย & ความปลอดภัย"}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-center space-x-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-500" />
                <span>PDPA Certified Compliant</span>
              </li>
              <li>
                <button onClick={() => setContactModalOpen(true)} className="hover:text-sky-600 text-left cursor-pointer">
                  {isEn ? "Privacy Policy (MIND MERIT PDPA Protected)" : "นโยบายความเป็นส่วนตัว (MIND MERIT PDPA 100%)"}
                </button>
              </li>
              <li>
                <button onClick={() => setContactModalOpen(true)} className="hover:text-sky-600 text-left cursor-pointer">
                  {isEn ? "Terms of Service" : "ข้อกำหนดการให้บริการ MIND MERIT"}
                </button>
              </li>
              <li>
                <button onClick={() => setContactModalOpen(true)} className="hover:text-sky-600 text-left cursor-pointer">
                  {isEn ? "Cookie Preferences" : "การจัดการคุกกี้ (เฉพาะที่จำเป็น)"}
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* ข้อความ Copyright ของบริษัท */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 space-y-2 sm:space-y-0">
          <p>© {new Date().getFullYear()} MIND MERIT Corporation Co., Ltd. All rights reserved.</p>
        </div>

      </footer>

      {/* =========================================================================
          INTERACTIVE MODALS: Login / Sign Up, Pricing, Contact
          ========================================================================= */}
      
      {/* 2. Pricing Modal (Free Starter vs Private Expert Consultation) */}
      {pricingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            
            <button
              onClick={() => setPricingModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-1.5">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200">
                MIND MERIT SERVICE PACKAGES
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                {isEn ? "Select Your MIND MERIT Package" : "เลือก Package ที่เหมาะกับคุณ"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                {isEn 
                  ? "Fair, transparent packages for students, individuals, and educational institutions."
                  : "โครงสร้าง Package โปร่งใส ครอบคลุมทั้งนักเรียน บุคคลทั่วไป และโรงเรียน"}
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              
              {/* Package 1: B2C Basic Package */}
              <div className="p-5 rounded-3xl border-2 border-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/20 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50 px-2.5 py-0.5 rounded-full">
                      {isEn ? "FREE" : "ฟรี"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">B2C Basic</span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">B2C Basic Package</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{isEn ? "(Individual - Free)" : "(แพ็กเกจบุคคล - ฟรี)"}</p>
                  </div>

                  <div className="text-2xl font-black text-emerald-600">
                    0 บาท <span className="text-xs font-normal text-slate-400">/ ฟรี</span>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-100 dark:border-slate-700">
                    <span className="font-bold text-slate-700 dark:text-slate-300">เงื่อนไข: </span>
                    สำหรับนักเรียนและเยาวชนทั่วไป ไม่มีค่าใช้จ่าย (ฟรี)
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Daily Mood Check-in:</strong> ระบบบันทึกและติดตามอารมณ์รายวัน</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Gamification Quests:</strong> ระบบภารกิจสะสมแต้ม XP</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>AI Companion:</strong> ระบบพูดคุยให้คำปรึกษาเบื้องต้น</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Safe Community:</strong> พื้นที่ปลอดภัยแลกเปลี่ยนประสบการณ์</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => { setPricingModalOpen(false); openRegister("basic"); }}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isEn ? "Apply B2C Basic (Free)" : "สมัครใช้งาน B2C Basic (ฟรี)"}</span>
                </button>
              </div>

              {/* Package 2: B2C Premium Package */}
              <div className="p-5 rounded-3xl border-2 border-sky-400 bg-sky-50/30 dark:bg-sky-950/20 flex flex-col justify-between space-y-4 shadow-md">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-100 dark:bg-sky-900/50 px-2.5 py-0.5 rounded-full">
                      POPULAR
                    </span>
                    <span className="text-[10px] text-sky-600 font-bold">B2C Premium</span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">B2C Premium Package</h4>
                    <p className="text-[11px] text-sky-600 dark:text-sky-400 font-bold">(แพ็กเกจบุคคล - ขั้นสูง)</p>
                  </div>

                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                    100 บาท <span className="text-xs font-normal text-slate-400">/ เดือน / คน</span>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-800/60 p-2 rounded-xl border border-sky-100 dark:border-sky-900/40">
                    <span className="font-bold text-sky-700 dark:text-sky-300">เงื่อนไข: </span>
                    ชำระเป็นรายเดือนต่อผู้ใช้งาน สำหรับผู้ที่ต้องการวิเคราะห์เฉพาะบุคคล
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
                      <span><strong>ฟีเจอร์ B2C Basic ทั้งหมด:</strong> Mood Check-in, Gamification, AI Companion, Safe Community</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
                      <span><strong>Personalized Deep AI Analytics:</strong> ระบบ AI วิเคราะห์แนวโน้มอารมณ์ย้อนหลังเชิงลึก</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
                      <span><strong>Personalized Recommendations:</strong> คำแนะนำและประเมินสุขภาพจิตตรงสภาวะอารมณ์</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => { setPricingModalOpen(false); openRegister("premium"); }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-pink-500 hover:from-sky-600 hover:to-pink-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isEn ? "Apply B2C Premium" : "สมัคร B2C Premium Package"}</span>
                </button>
              </div>

              {/* Package 3: B2B School Package */}
              <div className="p-5 rounded-3xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/20 dark:bg-indigo-950/20 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 dark:bg-indigo-900/50 px-2.5 py-0.5 rounded-full">
                      FOR SCHOOLS
                    </span>
                    <span className="text-[10px] text-indigo-600 font-bold">B2B School</span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">B2B School Package</h4>
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">(แพ็กเกจสำหรับโรงเรียน)</p>
                  </div>

                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    990 บาท <span className="text-xs font-normal text-slate-400">/ เดือน / โรงเรียน</span>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-800/60 p-2 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                    <span className="font-bold text-indigo-700 dark:text-indigo-300">เงื่อนไข: </span>
                    ชำระบริการเป็นรายเดือนต่อ 1 โรงเรียน
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                      <span><strong>B2B School Dashboard:</strong> สรุปภาพรวมสุขภาพจิตทั้งโรงเรียน Real-Time</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                      <span><strong>Early Warning Alert:</strong> ระบบแจ้งเตือนอัตโนมัติเมื่อพบเคสเสี่ยงเพื่อช่วยเหลือทันเวลา</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                      <span><strong>Anonymized Data Insight Report:</strong> รายงานสรุปสถิติรายเทอมตามกฎหมาย PDPA</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => { setPricingModalOpen(false); setContactModalOpen(true); }}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Building2 className="h-4 w-4" />
                  <span>ติดต่อฝ่ายวิชาการ / สนใจ Package</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 2.5 Auth Modal (Register & Login with 6-digit alphanumeric code) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        selectedPackage={authSelectedPackage}
        language={user.language}
        onLoginSuccess={(updatedUser) => {
          if (onUpdateUser) onUpdateUser(updatedUser);
          onEnterApp();
        }}
      />

      {/* 2.6 Official Logo Viewer Modal */}
      <LogoModal 
        isOpen={localLogoModalOpen} 
        onClose={() => setLocalLogoModalOpen(false)} 
        language={user.language} 
      />

      {/* 3. Private Expert Consultation Booking Modal */}
      {expertConsultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            
            <button
              onClick={() => setExpertConsultModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200">
                1-ON-1 PRIVATE COUNSELING
              </span>
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                {isEn ? "Book Private Expert Session" : "นัดหมายปรึกษาผู้เชี่ยวชาญเป็นการส่วนตัว"}
              </h3>
              <p className="text-xs text-slate-500">
                {isEn ? "Personalized counseling with certified psychologists" : "เลือกผู้เชี่ยวชาญและเวลาที่สะดวกเพื่อรับการดูแลเป็นพิเศษ"}
              </p>
            </div>

            {consultSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                  {isEn ? "Booking Request Received!" : "รับคำขอนัดหมายเรียบร้อยแล้ว!"}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {isEn 
                    ? "Our counseling coordinator will contact you to confirm your session slot shortly." 
                    : "เจ้าหน้าที่ผู้ประสานงานนัดหมายจะติดต่อกลับเพื่อยืนยันเวลาและส่งลิงก์ห้องสนทนาส่วนตัวให้คุณครับ"}
                </p>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="space-y-4">
                
                {/* Select Expert */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isEn ? "Select Specialist / Psychologist" : "เลือกผู้เชี่ยวชาญที่ต้องการปรึกษา"}
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: "dr_wimonchat", name: "ดร. นรินทร์ วิมลฉัตร", role: "นักจิตวิทยาคลินิก (เชี่ยวชาญ: ความเครียด, วัยเรียน, Burnout)", fee: "฿790" },
                      { id: "dr_sasithorn", name: "พญ. ศศิธร พัฒนากุล", role: "จิตแพทย์ผู้เชี่ยวชาญ (เชี่ยวชาญ: การนอนหลับ, วิตกกังวล, สุขภาวะจิต)", fee: "฿990" },
                      { id: "dr_thanapoom", name: "อ. ธนภูมิ เมตตาธรรม", role: "ผู้เชี่ยวชาญการปรับสมดุลชีวิต & ความสัมพันธ์ในการทำงาน", fee: "฿790" },
                    ].map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => setConsultDoctor(doc.id)}
                        className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between ${consultDoctor === doc.id ? "border-sky-500 bg-sky-50/70 dark:bg-sky-950/40 shadow-xs" : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                      >
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800 dark:text-slate-100">{doc.name}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{doc.role}</p>
                        </div>
                        <span className="font-extrabold text-xs text-sky-600 dark:text-sky-400">{doc.fee}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Name / Nickname */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">ชื่อหรือชื่อเล่นสำหรับเรียก</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ตะวัน หรือชื่อเล่นของคุณ"
                    value={consultName || user.name}
                    onChange={(e) => setConsultName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-400"
                  />
                </div>

                {/* Topic / Concerns */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">เรื่องที่ต้องการปรึกษาคร่าวๆ (เป็นความลับ 100%)</label>
                  <textarea
                    rows={2}
                    placeholder="เช่น เครียดเรื่องสอบ, หมดไฟในการทำงาน, ต้องการคำแนะนำการจัดการอารมณ์..."
                    value={consultTopic}
                    onChange={(e) => setConsultTopic(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-400"
                  />
                </div>

                {/* Preferred time */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-sky-500 shrink-0" />
                  <span>มีรอบเวลาให้เลือก: จันทร์-เสาร์ 18:00 - 21:00 น. หรือตามนัดหมาย</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>ยืนยันการขอจองเวลานัดหมาย</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* 3. Contact Us Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-4">
            
            <button
              onClick={() => setContactModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                GET IN TOUCH
              </span>
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                {isEn ? "Contact Our Support Team" : "ติดต่อทีมงาน MIND MERIT"}
              </h3>
              <p className="text-xs text-slate-400">
                {isEn ? "We reply within 15 minutes 24/7" : "เราพร้อมตอบกลับทุกข้อซักถามอย่างรวดเร็ว"}
              </p>
            </div>

            {contactFormSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {isEn ? "Message Sent Successfully!" : "ส่งข้อความเรียบร้อยแล้ว!"}
                </h4>
                <p className="text-xs text-slate-500">
                  {isEn ? "Our team will contact you shortly." : "เจ้าหน้าที่จะติดต่อกลับไปยังอีเมลของคุณอย่างเร็วที่สุดครับ"}
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">ชื่อของคุณ</label>
                  <input
                    type="text"
                    required
                    placeholder="กรุณากรอกชื่อ"
                    className="w-full mt-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">อีเมลติดต่อกลับ</label>
                  <input
                    type="email"
                    required
                    placeholder="yourname@domain.com"
                    className="w-full mt-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">ข้อความที่ต้องการสอบถาม</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="พิมพ์ข้อความของคุณที่นี่..."
                    className="w-full mt-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  ส่งข้อความถึงทีมงาน
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
