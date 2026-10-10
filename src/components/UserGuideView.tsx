import React, { useState } from "react";
import {
  BookOpen,
  Video,
  Bot,
  ClipboardList,
  GraduationCap,
  Users,
  ShieldAlert,
  Search,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Award,
  Zap,
  HelpCircle,
  Shield,
  ChevronDown,
  ChevronUp,
  Smile,
  Compass,
  SlidersHorizontal,
  ChevronRight,
  Lightbulb
} from "lucide-react";
import { UserProfile } from "../types";
import { translations } from "../translations";

interface UserGuideViewProps {
  user: UserProfile;
  onNavigate: (tab: string) => void;
  onOpenProfile: () => void;
  onOpenSOS: () => void;
}

export default function UserGuideView({ user, onNavigate, onOpenProfile, onOpenSOS }: UserGuideViewProps) {
  const t = translations[user.language];
  const isTh = user.language === "th";

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "step">("list");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [expandedTips, setExpandedTips] = useState<{ [key: number]: boolean }>({});

  const toggleTips = (stepIdx: number) => {
    setExpandedTips((prev) => ({
      ...prev,
      [stepIdx]: !prev[stepIdx]
    }));
  };

  const categories = [
    { id: "all", label: isTh ? "ทั้งหมด" : "All" },
    { id: "start", label: isTh ? "เริ่มต้น" : "Start" },
    { id: "wellness", label: isTh ? "ดูแลใจ" : "Mind Tools" },
    { id: "academy", label: isTh ? "คอร์ส & วุฒิบัตร" : "Academy" },
    { id: "safety", label: isTh ? "ความปลอดภัย" : "Safety" },
    { id: "xp", label: isTh ? "เลเวล & XP" : "XP & Levels" },
    { id: "faq", label: isTh ? "คำถามพบบ่อย" : "FAQs" },
  ];

  const quickShortcuts = [
    {
      title: isTh ? "บันทึกอารมณ์" : "Mood Log",
      shortTitle: isTh ? "บันทึกอารมณ์" : "Mood",
      desc: isTh ? "สะท้อนความรู้สึก รับวิเคราะห์ AI" : "Daily check-in & AI feedback",
      icon: BookOpen,
      color: "from-pink-500 to-rose-400",
      tab: "moodCheck"
    },
    {
      title: isTh ? "คุยกับคู่หู AI" : "AI Buddy",
      shortTitle: isTh ? "คู่หู AI" : "AI Buddy",
      desc: isTh ? "ปรึกษาได้ 24 ชม. ไม่ตัดสิน" : "24/7 empathetic friend",
      icon: Bot,
      color: "from-emerald-400 to-teal-500",
      tab: "aiChat"
    },
    {
      title: isTh ? "วิดีโอผ่อนคลาย" : "Videos",
      shortTitle: isTh ? "คลังวิดีโอ" : "Videos",
      desc: isTh ? "คลิปคัดสรรเสริมพลังใจ" : "Mindfulness & calm videos",
      icon: Video,
      color: "from-amber-400 to-yellow-500",
      tab: "videos"
    },
    {
      title: isTh ? "แบบประเมินใจ" : "Assessments",
      shortTitle: isTh ? "แบบประเมิน" : "Checks",
      desc: isTh ? "วัดความเครียด & ภาวะหมดไฟ" : "PSS & WHO-5 checks",
      icon: ClipboardList,
      color: "from-sky-400 to-blue-500",
      tab: "assessments"
    },
    {
      title: isTh ? "ฝึกหายใจ & คอร์ส" : "Academy",
      shortTitle: isTh ? "ฝึกหายใจ" : "Breathing",
      desc: isTh ? "Box Breathing & เกียรติบัตร" : "Breathing & Certificates",
      icon: GraduationCap,
      color: "from-purple-500 to-indigo-500",
      tab: "academy"
    },
    {
      title: isTh ? "ช่วยเหลือด่วน SOS" : "SOS Help",
      shortTitle: isTh ? "สายด่วน SOS" : "SOS Help",
      desc: isTh ? "เทคนิค 5-4-3-2-1 และสายด่วน" : "Emergency hotlines",
      icon: ShieldAlert,
      color: "from-rose-500 to-red-500",
      action: onOpenSOS
    },
  ];

  const steps = [
    {
      number: "01",
      category: "start",
      icon: Smile,
      color: "sky",
      badge: isTh ? "ขั้นตอนที่ 1" : "Step 1",
      title: isTh ? "ตั้งค่าโปรไฟล์และเลือกอวตาร" : "Set Up Profile & Role",
      desc: isTh 
        ? "เลือกชื่อ นามแฝง และอวตารอิโมจิที่ชอบ พร้อมระบุสถานะ เช่น นักเรียน หรือ วัยทำงาน เพื่อให้ AI และเนื้อหาปรับให้เข้ากับคุณที่สุด"
        : "Set your display name, choose a cute avatar, and pick your role so the AI tailors its guidance directly to your daily life.",
      tips: isTh
        ? ["เปิดโหมดไม่ระบุตัวตน (Anonymous Mode) ได้ตลอดเวลา", "เปลี่ยนชื่อและรูปอวตารได้ทันทีจากเมนูโปรไฟล์"]
        : ["Enable Anonymous Mode anytime for extra privacy", "Update your avatar anytime in profile settings"],
      actionLabel: isTh ? "ตั้งค่าโปรไฟล์" : "Edit Profile",
      action: onOpenProfile
    },
    {
      number: "02",
      category: "wellness",
      icon: BookOpen,
      color: "pink",
      badge: isTh ? "ขั้นตอนที่ 2" : "Step 2",
      title: isTh ? "เช็คอินอารมณ์รายวัน & รับคำแนะนำ AI" : "Daily Mood Check-in & AI Insight",
      desc: isTh 
        ? "เลือกอารมณ์ 5 ระดับ ระบุระดับความเครียด ชั่วโมงการนอน และเขียนบันทึกสั้นๆ AI จะประมวลผลและให้คำแนะนำสุขภาพใจทันที"
        : "Select your mood, log stress and sleep hours, and get immediate personalized wellness insights powered by AI.",
      tips: isTh
        ? ["เช็คอินทุกวันเพื่อสะสมสถิติ Streak และรับ +30 XP", "ดูกราฟแนวโน้มอารมณ์ย้อนหลังในหน้าแดชบอร์ด"]
        : ["Log daily to protect your streak count and earn +30 XP", "View your mood trends chart in the Dashboard"],
      actionLabel: isTh ? "บันทึกอารมณ์" : "Check In Now",
      tab: "moodCheck"
    },
    {
      number: "03",
      category: "wellness",
      icon: Bot,
      color: "emerald",
      badge: isTh ? "ขั้นตอนที่ 3" : "Step 3",
      title: isTh ? "ปรึกษาคู่หู AI และรับชมคลิปดูแลใจ" : "Chat with AI Buddy & Care Videos",
      desc: isTh 
        ? "พูดคุยระบายความรู้สึกกับ AI Buddy ได้ตลอด 24 ชั่วโมง โดยไม่ตัดสิน พร้อมเลือกชมคลิปวิดีโอฝึกสมาธิ ผ่อนคลายก่อนนอน หรือเสียงธรรมชาติ"
        : "Talk to your empathetic AI companion 24/7 without judgment, or unwind with curated relaxation and meditation videos.",
      tips: isTh
        ? ["คลิกเลือกหัวข้อแนะนำด่วนเพื่อเริ่มบทสนทนาได้ทันที", "รับชมวิดีโอจบรับแต้ม +30 XP ต่อคลิป"]
        : ["Use quick starter prompts to begin chatting easily", "Earn +30 XP for each completed video"],
      actionLabel: isTh ? "คุยกับ AI" : "Open Chat",
      tab: "aiChat"
    },
    {
      number: "04",
      category: "academy",
      icon: GraduationCap,
      color: "amber",
      badge: isTh ? "ขั้นตอนที่ 4" : "Step 4",
      title: isTh ? "ประเมินสุขภาพใจ & ฝึกหายใจรับวุฒิบัตร" : "Assessments & E-Certificates",
      desc: isTh 
        ? "ทำแบบทดสอบมาตรฐานสากล (PSS, WHO-5, ภาวะหมดไฟ) และฝึกการหายใจแบบ 4-4-4-4 เพื่อรับใบประกาศนียบัตรดิจิทัลพร้อมรหัสตรวจสอบ"
        : "Take standardized self-checks and practice guided Box Breathing (4-4-4-4) to earn verifiable completion certificates.",
      tips: isTh
        ? ["ฝึกหายใจพร้อมแอนิเมชันนำทางการขยายปอด", "เกียรติบัตรมีรหัสเฉพาะ ใช้แนบแฟ้มผลงานได้"]
        : ["Guided breathing animation helps regulate your nervous system", "Digital certificates include verification hashes"],
      actionLabel: isTh ? "ไปที่คลังความรู้" : "Start Learning",
      tab: "academy"
    },
    {
      number: "05",
      category: "safety",
      icon: ShieldAlert,
      color: "rose",
      badge: isTh ? "ขั้นตอนที่ 5" : "Step 5",
      title: isTh ? "สายด่วนฉุกเฉิน (SOS) & ชุมชนปลอดภัย" : "Emergency SOS & Safe Community",
      desc: isTh 
        ? "เมื่อรู้สึกไม่ไหว สามารถกดปุ่ม SOS ได้ทันทีเพื่อเข้าถึงเทคนิคดึงสติ 5-4-3-2-1 และสายด่วนสุขภาพจิต 1323 หรือแวะไปแบ่งปันกำลังใจในชุมชน"
        : "If you feel overwhelmed, use SOS for 5-4-3-2-1 grounding exercises and emergency hotline numbers, or find comfort in our safe community.",
      tips: isTh
        ? ["ปุ่ม SOS อยู่มุมบนขวาในทุกหน้าจอ เข้าถึงได้ทันใจ", "ชุมชนมีระบบคัดกรองคำพูดสร้างความเกลียดชังอย่างปลอดภัย"]
        : ["Quick SOS button is always available at top-right", "Community enforces friendly positive communication"],
      actionLabel: isTh ? "เปิดหน้า SOS" : "Open SOS",
      action: onOpenSOS
    }
  ];

  const xpRules = [
    { icon: "📝", activity: isTh ? "บันทึกอารมณ์รายวัน" : "Daily Mood Check", xp: "+30 XP" },
    { icon: "💬", activity: isTh ? "ปรึกษาคู่หู AI" : "AI Counselor Chat", xp: "+15 XP" },
    { icon: "🎬", activity: isTh ? "รับชมคลิปดูแลใจ" : "Watch Care Video", xp: "+30 XP" },
    { icon: "📊", activity: isTh ? "ทำแบบประเมินสุขภาพ" : "Complete Assessment", xp: "+40 XP" },
    { icon: "🌬️", activity: isTh ? "ฝึกหายใจ Box Breathing" : "Breathing Session", xp: "+25 XP" },
    { icon: "🎓", activity: isTh ? "สอบผ่านคอร์สรับเกียรติบัตร" : "Pass Course Exam", xp: "+100 XP" },
  ];

  const faqs = [
    {
      q: isTh ? "ข้อมูลส่วนตัวและการบันทึกอารมณ์ปลอดภัยหรือไม่?" : "Is my personal data and mood history secure?",
      a: isTh 
        ? "ปลอดภัยอย่างยิ่ง ข้อมูลทั้งหมดบันทึกอยู่บนอุปกรณ์ของคุณอย่างเป็นส่วนตัว และคุณสามารถเปิด 'โหมดไม่เปิดเผยตัวตน (Anonymous Mode)' ได้เสมอเมื่อใช้งานชุมชน"
        : "Yes, completely secure. Your records are stored privately on your device. Anonymous Mode conceals your real name in the community."
    },
    {
      q: isTh ? "MIND MERIT สามารถใช้วินิจฉัยโรคแทนแพทย์ได้หรือไม่?" : "Can MIND MERIT diagnose illnesses instead of a doctor?",
      a: isTh 
        ? "ไม่ได้ครับ MIND MERIT เป็นเครื่องมือดูแลใจเบื้องต้นและการฝึกสติ (Self-Care & Psychoeducation) หากท่านมีภาวะวิกฤต สามารถกดปุ่ม SOS เพื่อติดต่อสายด่วน 1323 หรือพบแพทย์ผู้เชี่ยวชาญทันที"
        : "No. MIND MERIT is a self-care companion and educational tool. For clinical diagnosis or emergencies, use SOS to call 1323."
    },
    {
      q: isTh ? "เกียรติบัตรอิเล็กทรอนิกส์ (E-Certificate) นำไปใช้อะไรได้บ้าง?" : "How can I use the digital completion certificate?",
      a: isTh 
        ? "เกียรติบัตรมีรหัสตรวจสอบเฉพาะ (Certificate ID) และตราประทับ สามารถแคปหน้าจอ พิมพ์ หรือแนบเป็นผลงานพัฒนาตนเองใน Portfolio หรือ CV ได้"
        : "Certificates feature unique verifiable IDs. You can save, print, or attach them to your resume and portfolio."
    },
    {
      q: isTh ? "ทำอย่างไรให้เลเวลเพิ่มและปลดล็อคเหรียญรางวัล?" : "How do I level up and unlock achievement badges?",
      a: isTh 
        ? "สะสมแต้ม XP จากกิจกรรมดูแลสุขภาพใจ เช่น บันทึกอารมณ์ ฝึกหายใจ หรือเรียนจบคอร์ส เมื่อครบเกณฑ์เลเวลจะเพิ่มอัตโนมัติและปลดล็อคเหรียญรางวัล"
        : "Earn XP across mindfulness activities. As XP grows, your level advances automatically and unlocks milestone badges."
    }
  ];

  const filteredSteps = steps.filter((step) => {
    const matchesCategory = activeCategory === "all" || step.category === activeCategory;
    const matchesSearch = searchQuery === "" || 
      step.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      step.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStepColorClasses = (color: string) => {
    switch (color) {
      case "sky":
        return {
          iconBg: "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
          border: "border-sky-200 dark:border-sky-900/40",
          btn: "bg-sky-600 text-white hover:bg-sky-700 shadow-xs",
          badge: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200/60",
          accent: "text-sky-600 dark:text-sky-400"
        };
      case "pink":
        return {
          iconBg: "bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300",
          border: "border-pink-200 dark:border-pink-900/40",
          btn: "bg-pink-600 text-white hover:bg-pink-700 shadow-xs",
          badge: "bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 border border-pink-200/60",
          accent: "text-pink-600 dark:text-pink-400"
        };
      case "emerald":
        return {
          iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
          border: "border-emerald-200 dark:border-emerald-900/40",
          btn: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs",
          badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60",
          accent: "text-emerald-600 dark:text-emerald-400"
        };
      case "amber":
        return {
          iconBg: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
          border: "border-amber-200 dark:border-amber-900/40",
          btn: "bg-amber-600 text-white hover:bg-amber-700 shadow-xs",
          badge: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60",
          accent: "text-amber-600 dark:text-amber-400"
        };
      case "rose":
      default:
        return {
          iconBg: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
          border: "border-rose-200 dark:border-rose-900/40",
          btn: "bg-rose-600 text-white hover:bg-rose-700 shadow-xs",
          badge: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60",
          accent: "text-rose-600 dark:text-rose-400"
        };
    }
  };

  const currentFocusedStep = steps[currentStepIndex] || steps[0];
  const focusedTheme = getStepColorClasses(currentFocusedStep.color);
  const FocusedIcon = currentFocusedStep.icon;

  return (
    <div id="user-guide-root" className="w-full space-y-3.5 sm:space-y-5 max-w-5xl mx-auto pb-12 px-0.5 sm:px-0">
      
      {/* 1. Header Banner - Perfectly Proportioned for Mobile Screens */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-sky-600 via-teal-600 to-indigo-700 p-3.5 sm:p-6 text-white shadow-md">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-white/10 blur-lg pointer-events-none" />

        <div className="relative z-10 space-y-1.5 sm:space-y-2.5">
          <div className="inline-flex items-center space-x-1.5 rounded-full bg-white/20 backdrop-blur-md px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-sky-100">
            <Compass className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>{isTh ? "คู่มือและวิธีการใช้งาน" : "User Guide & Manual"}</span>
          </div>

          <h2 className="text-base sm:text-2xl font-black tracking-tight leading-tight">
            {isTh ? "เริ่มต้นใช้งาน MIND MERIT อย่างง่ายดาย" : "Getting Started with MIND MERIT"}
          </h2>

          <p className="text-[11px] sm:text-xs md:text-sm text-sky-100/90 leading-relaxed max-w-2xl">
            {isTh 
              ? "รวมคำแนะนำและขั้นตอนการใช้งานเครื่องมือดูแลใจ เพื่อความสุขและสุขภาพจิตที่ดีของคุณ"
              : "Step-by-step instructions to get the most out of your mental well-being companion."}
          </p>

          {/* Quick Search - Compact on mobile */}
          <div className="pt-1 max-w-sm w-full">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isTh ? "ค้นหาขั้นตอนหรือคำแนะนำ..." : "Search topics..."}
                className="w-full rounded-xl bg-white/95 dark:bg-slate-900/95 py-1.5 sm:py-2 pl-8 pr-7 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Jump Grid - Compact 3-col on Mobile with Short Non-Overflow Labels */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {isTh ? "ทางลัดฟีเจอร์หลัก" : "Quick Shortcuts"}
          </h3>
          <span className="text-[9px] sm:text-[10px] text-sky-600 dark:text-sky-400 font-semibold">
            {isTh ? "แตะเพื่อเปิดใช้งานทันที" : "Tap to open"}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2.5">
          {quickShortcuts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  if (item.action) item.action();
                  else if (item.tab) onNavigate(item.tab);
                }}
                className="flex flex-col items-center text-center p-2 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-sm hover:scale-[1.02] active:scale-95 transition-all cursor-pointer group"
              >
                <div className={`flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-tr ${item.color} text-white shadow-2xs mb-1 group-hover:rotate-6 transition-transform`}>
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <h4 className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 truncate w-full">
                  {item.shortTitle}
                </h4>
                <p className="text-[8px] sm:text-[9px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5 hidden sm:block">
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Category Filter Pills - Touch friendly scrolling */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
                isActive
                  ? "bg-sky-600 text-white shadow-2xs"
                  : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 4. Step-by-Step Guide with View Switcher (Perfect for Mobile) */}
      {activeCategory !== "faq" && activeCategory !== "xp" && (
        <div className="space-y-2.5">
          
          {/* Section Subheader & Mobile View Mode Switcher */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-1.5">
              <Sparkles className="h-3.5 w-3.5 text-sky-500" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                {isTh ? "ขั้นตอนการใช้งาน" : "Step-by-Step Instructions"}
              </h3>
            </div>

            {/* View Mode Toggle: Cards vs Focus Stepper */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-semibold">
              <button
                onClick={() => setViewMode("list")}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-2xs font-bold"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {isTh ? "รายการทั้งหมด" : "List"}
              </button>
              <button
                onClick={() => setViewMode("step")}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "step"
                    ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-2xs font-bold"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {isTh ? "ทีละขั้นตอน" : "Step Focus"}
              </button>
            </div>
          </div>

          {/* MODE A: Interactive Stepper (Single-Screen Mobile Focus) */}
          {viewMode === "step" && (
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 sm:p-5 shadow-2xs space-y-3.5 transition-all">
              
              {/* Stepper Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  <span>
                    {isTh ? `ขั้นตอนที่ ${currentStepIndex + 1} จาก ${steps.length}` : `Step ${currentStepIndex + 1} of ${steps.length}`}
                  </span>
                  <span className="font-mono text-sky-600 dark:text-sky-400">
                    {Math.round(((currentStepIndex + 1) / steps.length) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Step Detail Card */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center space-x-2.5">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${focusedTheme.iconBg} shadow-2xs shrink-0`}>
                    <FocusedIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`inline-block px-2 py-0.2 rounded-full text-[9px] font-bold ${focusedTheme.badge} mb-0.5`}>
                      {currentFocusedStep.badge}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
                      {currentFocusedStep.title}
                    </h4>
                  </div>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  {currentFocusedStep.desc}
                </p>

                {/* Tips */}
                <div className="space-y-1.5 pt-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {isTh ? "💡 เคล็ดลับแนะนำ" : "Pro Tips"}
                  </span>
                  <div className="space-y-1">
                    {currentFocusedStep.tips.map((tip, idx) => (
                      <div key={idx} className="flex items-start space-x-1.5 text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Action Button */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (currentFocusedStep.action) currentFocusedStep.action();
                      else if (currentFocusedStep.tab) onNavigate(currentFocusedStep.tab);
                    }}
                    className={`w-full inline-flex items-center justify-center space-x-2 rounded-xl ${focusedTheme.btn} py-2.5 px-4 text-xs font-bold transition-all cursor-pointer active:scale-98`}
                  >
                    <span>{currentFocusedStep.actionLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Prev / Next controls & Jump Dots */}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                <button
                  disabled={currentStepIndex === 0}
                  onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                  className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    currentStepIndex === 0 
                      ? "text-slate-300 dark:text-slate-700 cursor-not-allowed" 
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  }`}
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>{isTh ? "ก่อนหน้า" : "Back"}</span>
                </button>

                {/* Dots indicator */}
                <div className="flex items-center space-x-1">
                  {steps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentStepIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentStepIndex === idx 
                          ? "w-4 bg-sky-600" 
                          : "w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300"
                      }`}
                    />
                  ))}
                </div>

                <button
                  disabled={currentStepIndex === steps.length - 1}
                  onClick={() => setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
                  className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    currentStepIndex === steps.length - 1
                      ? "text-slate-300 dark:text-slate-700 cursor-not-allowed" 
                      : "text-sky-600 dark:text-sky-400 font-bold hover:bg-sky-50 dark:hover:bg-sky-950/40 cursor-pointer"
                  }`}
                >
                  <span>{isTh ? "ถัดไป" : "Next"}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

            </div>
          )}

          {/* MODE B: List View (Compact Mobile Cards that never overflow) */}
          {viewMode === "list" && (
            <div className="space-y-2 sm:space-y-2.5">
              {filteredSteps.map((step, idx) => {
                const StepIcon = step.icon;
                const theme = getStepColorClasses(step.color);
                const isTipsOpen = expandedTips[idx] ?? false;

                return (
                  <div
                    key={idx}
                    className="rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-4 shadow-2xs transition-all"
                  >
                    {/* Compact Card Header */}
                    <div className="flex items-start justify-between gap-2.5">
                      
                      <div className="flex items-start space-x-2.5 flex-1 min-w-0">
                        {/* Icon */}
                        <div className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl ${theme.iconBg} shadow-2xs shrink-0 mt-0.5`}>
                          <StepIcon className="h-4 w-4" />
                        </div>

                        {/* Title and Badge */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-1.5 flex-wrap mb-0.5">
                            <span className={`px-1.5 py-0.2 rounded-full text-[8px] sm:text-[9px] font-bold ${theme.badge}`}>
                              {step.badge}
                            </span>
                            <span className="text-[9px] font-mono font-bold text-slate-400">
                              #{step.number}
                            </span>
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
                            {step.title}
                          </h4>

                          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                            {step.desc}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Action Row (Fitted for Mobile without large empty gaps) */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      
                      {/* Tips Expander Button */}
                      <button
                        onClick={() => toggleTips(idx)}
                        className="inline-flex items-center space-x-1 text-[10px] text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                      >
                        <Lightbulb className="h-3 w-3 text-amber-500" />
                        <span>{isTipsOpen ? (isTh ? "ซ่อนเคล็ดลับ" : "Hide Tips") : (isTh ? `ดูเคล็ดลับ (${step.tips.length})` : `Tips (${step.tips.length})`)}</span>
                        {isTipsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>

                      {/* Direct CTA Button */}
                      <button
                        onClick={() => {
                          if (step.action) step.action();
                          else if (step.tab) onNavigate(step.tab);
                        }}
                        className={`inline-flex items-center space-x-1 rounded-lg ${theme.btn} px-2.5 py-1.5 text-[11px] font-bold transition-all cursor-pointer active:scale-95 shrink-0`}
                      >
                        <span>{step.actionLabel}</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>

                    </div>

                    {/* Collapsible Tips Drawer */}
                    {isTipsOpen && (
                      <div className="mt-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 p-2 sm:p-2.5 space-y-1 border border-slate-100/60 dark:border-slate-800/60 animate-in fade-in duration-200">
                        {step.tips.map((tip, tipIdx) => (
                          <div key={tipIdx} className="flex items-start space-x-1.5 text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-400">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="leading-snug">{tip}</span>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* 5. XP Gamification Summary Card - Compact & Clean for Mobile */}
      {(activeCategory === "all" || activeCategory === "xp") && (
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-4 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <div className="flex items-center space-x-1.5">
              <Award className="h-4 w-4 text-amber-500" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                {isTh ? "การสะสมค่าประสบการณ์ (XP & เลเวล)" : "XP & Leveling System"}
              </h3>
            </div>
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 px-2 py-0.5 rounded-full">
              Lv. {user.level} ({user.xp} XP)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
            {xpRules.map((rule, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-1.5 sm:p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center space-x-1.5 min-w-0 pr-1">
                  <span className="text-xs sm:text-sm">{rule.icon}</span>
                  <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-200 truncate">
                    {rule.activity}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-mono shrink-0">
                  {rule.xp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Frequently Asked Questions (Accordion) */}
      {(activeCategory === "all" || activeCategory === "faq") && (
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-4 shadow-2xs space-y-2">
          <div className="flex items-center space-x-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
            <HelpCircle className="h-4 w-4 text-sky-500" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
              {isTh ? "คำถามที่พบบ่อย (FAQs)" : "Frequently Asked Questions"}
            </h3>
          </div>

          <div className="space-y-1.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-2.5 text-left text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <span className="pr-2">{faq.q}</span>
                    {isOpen ? <ChevronUp className="h-3.5 w-3.5 shrink-0 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-2.5 pb-2.5 pt-1 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/20">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
