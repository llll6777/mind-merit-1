import React, { useState, useRef } from "react";
import { 
  X, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Lock, 
  FileSpreadsheet, 
  Heart, 
  Award, 
  Mail, 
  ArrowRight,
  Maximize2,
  Minimize2,
  Eye,
  Check,
  Camera,
  ExternalLink,
  Flame,
  Smile,
  Meh,
  Frown,
  CloudSun,
  Activity,
  QrCode,
  CheckCircle,
  Database
} from "lucide-react";
import html2canvas from "html2canvas";

interface PrototypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
  language?: "en" | "th";
}

export default function PrototypeModal({
  isOpen,
  onClose,
  onNavigateTab,
  language = "th"
}: PrototypeModalProps) {
  const isEn = language === "en";
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"screenshot" | "live_mockup">("screenshot");
  const [isZoomed, setIsZoomed] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const mockupContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // 5 high-fidelity prototypes matching exact app UI & colors
  const prototypeScreens = [
    {
      id: "landing",
      tab: "landing",
      nameEn: "1. Landing Page (Home)",
      nameTh: "1. หน้าหลัก (Landing Page)",
      imageSrc: "/src/assets/images/landing_real_ui_1791918359236.jpg",
      fileName: "mind_merit_landing_page_prototype.jpg",
      taglineEn: "Safe Space for Mental Health & Growth",
      taglineTh: "พื้นที่ปลอดภัยเพื่อสุขภาพใจและการพัฒนาตนเอง",
      color: "from-sky-500 to-teal-500",
      components: [
        {
          name: "Top Navigation Bar (แถบเมนูด้านบน)",
          desc: "แสดงโลโก้ MIND MERIT โทนสีพาสเทลสดใส, เมนูนำทาง (Home, Features, Packages, About Us), ปุ่มสลับภาษา TH/EN, โหมดสว่าง/มืด และปุ่มสมัครใช้งาน/เข้าสู่ระบบ"
        },
        {
          name: "Hero Section & Call-to-Action (ส่วนเปิดตัวหลัก)",
          desc: "สโลแกนสร้างความอุ่นใจ พร้อมปุ่มหลัก 'สมัครใช้งาน (ฟรี)' สีเขียวมรกต และ 'เข้าสู่ระบบ' ที่เข้าถึงได้ทันทีโดยไม่ขอข้อมูลส่วนตัว"
        },
        {
          name: "4 Value Propositions Grid (จุดเด่นและคุณค่า 4 มิติ)",
          desc: "การ์ดสรุปจุดเด่น: 1. Sub-second Speed (ประมวลผลฉับไว), 2. 24/7 AI Counselor (คอยรับฟังตลอดเวลา), 3. PDPA Strict Privacy (ความปลอดภัยสูงสุด), 4. Digital Certificate (เกียรติบัตรรับรองฟรี)"
        },
        {
          name: "Choose Your Growth Plan (แพ็กเกจการใช้งาน 3 รูปแบบ)",
          desc: "1. B2C Free Basic (ฟรีตลอดชีพสำหรับทุกคน), 2. B2C Premium (490 บาท/เดือน สำหรับฟังก์ชันเชิงลึก), 3. B2B School & Enterprise (สำหรับโรงเรียน มหาวิทยาลัย และองค์กร)"
        },
        {
          name: "Strict Privacy Guarantee (การรับรองความเป็นส่วนตัว)",
          desc: "ระบบไม่ร้องขอหรือบันทึกข้อมูลส่วนตัว (Zero Personal Data) ใช้เฉพาะ 'อีเมล' สำหรับการยืนยันตัวตนเท่านั้น"
        }
      ]
    },
    {
      id: "dashboard",
      tab: "dashboard",
      nameEn: "2. Dashboard & Mental Health Tracker",
      nameTh: "2. หน้าแดชบอร์ด & การเช็คอินอารมณ์",
      imageSrc: "/src/assets/images/dashboard_real_ui_1791918379718.jpg",
      fileName: "mind_merit_dashboard_tracker_prototype.jpg",
      taglineEn: "Daily Mood Check-in, Gratitude Diary & AI Analysis",
      taglineTh: "บันทึกอารมณ์รายวัน, ไดอารี่ขอบคุณ & AI วิเคราะห์สุขภาพใจ",
      color: "from-teal-500 to-emerald-500",
      components: [
        {
          name: "Gamified Streak Counter & XP Bar (ไฟสถิติต่อเนื่องและเลเวล)",
          desc: "แสดงระดับเลเวล (Level 15), แถบหลอดสะสมแต้ม XP (650/800 XP) และไฟสถิติดูแลใจต่อเนื่อง '35 Days Streak' เพื่อส่งเสริมการดูแลสุขภาพใจเป็นประจำ"
        },
        {
          name: "Daily Mood Check-in (การ์ดประเมินอารมณ์ประจำวัน)",
          desc: "ไอคอนอารมณ์ 4 มิติ (Happy, Calm, Anxious, Sad) พร้อมแถบสเกลคะแนนความรู้สึก 1-10 (เช่น 8.5/10 - Positive & Motivated) บันทึกได้ง่ายในคลิกเดียว"
        },
        {
          name: "Gratitude Diary & Reflection (ไดอารี่แห่งความขอบคุณ)",
          desc: "กล่องข้อความบันทึกสิ่งดีๆ ที่เกิดขึ้นในวันนี้เพื่อฝึกกรอบความคิดเชิงบวก (Positive Psychology) พร้อมปุ่ม 'Save Entry' บันทึกประวัติอย่างปลอดภัยบนเครื่อง"
        },
        {
          name: "My Wellness Trends (กราฟแนวโน้มความเครียดและการนอนหลับ)",
          desc: "กราฟเส้นติดตามดัชนีระดับความเครียดรายสัปดาห์ (Weekly Stress Score 1-10) ควบคู่กับแผนภูมิแท่งชั่วโมงการนอนหลับ (Sleep Hours 6-8 ชม.)"
        },
        {
          name: "AI Counselor Insights (คำแนะนำประโลมใจจาก AI นักจิตวิทยา)",
          desc: "AI วิเคราะห์คะแนนอารมณ์และให้คำแนะนำเฉพาะบุคคลแบบอบอุ่น เช่น ให้หยุดพักชื่นชมความสำเร็จสั้นๆ หรือเทคนิคการฝึกหายใจ (Breathing exercise)"
        }
      ]
    },
    {
      id: "academy",
      tab: "academy",
      nameEn: "3. Merit Academy & Digital Certificates",
      nameTh: "3. คลังความรู้ & เกียรติบัตรดิจิทัล",
      imageSrc: "/src/assets/images/academy_real_ui_1791918401595.jpg",
      fileName: "mind_merit_academy_certificates_prototype.jpg",
      taglineEn: "Wellness Badges & Verified Completion Certificates",
      taglineTh: "เหรียญตราเกียรติยศ & ใบประกาศนียบัตรดิจิทัลมาตรฐาน",
      color: "from-amber-500 to-orange-500",
      components: [
        {
          name: "Digital Certificate Cabinet (ตู้แสดงเกียรติบัตรดิจิทัล)",
          desc: "ใบประกาศนียบัตร 'Certificate of Mental Wellness Completion' พร้อมตราประทับสีทอง รหัสประจำตัว (Unique ID: MM-2025-8849) และลายเซ็นดิจิทัล สามารถสั่งพิมพ์หรือดาวน์โหลดเก็บไว้ได้"
        },
        {
          name: "Scan to Verify (ระบบตรวจสอบความถูกต้องด้วย QR Code)",
          desc: "ระบบสร้าง QR Code และรหัสอ้างอิงของใบประกาศนียบัตร เพื่อให้สามารถนำไปแนบพอร์ตฟอลิโอ ยื่นสมัครเรียน หรือยืนยันการเข้าร่วมกิจกรรมได้จริง"
        },
        {
          name: "Milestone Badges Cabinet (ตู้สะสมเหรียญตราความสำเร็จ)",
          desc: "เหรียญตราเกียรติยศ 3 มิติ เช่น Consistency Master (ดูแลใจครบ 30 วัน), Gratitude Champion (บันทึกขอบคุณ 50 ครั้ง) และ Mindful Explorer (ฝึกสติครบ 20 ครั้ง)"
        },
        {
          name: "Learning Modules & Progress (คอร์สเรียนรู้เสริมสร้างทักษะใจ)",
          desc: "หลักสูตร เช่น Mindfulness Basics (เสร็จสิ้น 100%) และ Stress Management (คืบหน้า 65%) พร้อมแถบแสดงความก้าวหน้า"
        }
      ]
    },
    {
      id: "admin",
      tab: "admin",
      nameEn: "4. Cloud Admin Hub & Google Sheets",
      nameTh: "4. ศูนย์ควบคุมหลังบ้าน & Google Sheets",
      imageSrc: "/src/assets/images/admin_sheets_real_ui_1791918424714.jpg",
      fileName: "mind_merit_admin_sheets_prototype.jpg",
      taglineEn: "Simulated Backend with Admin-Only Access & Real-Time Sync",
      taglineTh: "จำลองหลังบ้าน & เชื่อมต่อ Drive Sheets จำกัดสิทธิ์เฉพาะผู้ดูแลระบบ (เรียลไทม์)",
      color: "from-emerald-600 to-teal-800",
      components: [
        {
          name: "Google Sheets Database Status & Real-Time Live Sync",
          desc: "แสดงสถานะ Active พร้อมเรดาร์สีเขียวกะพริบ '⚡ Real-Time Live Sync: Active' เมื่อมีผู้ใช้สมัครสมาชิกใหม่ ข้อมูลจะเด้งเข้าชีตทันทีแบบเรียลไทม์"
        },
        {
          name: "Strict Admin Authorization (จำกัดสิทธิ์เฉพาะ ผู้ดูแลระบบ)",
          desc: "ระบุชัดเจนว่า 'จำกัดสิทธิ์เฉพาะ ผู้ดูแลระบบ (Administrator Only)' ปฏิเสธการเข้าถึงของผู้ใช้ทั่วไป 100% เพื่อความปลอดภัยสูงสุด"
        },
        {
          name: "Strict Zero Personal Data Database (ตารางข้อมูลผู้ใช้ที่ปลอดภัย)",
          desc: "ตารางแสดงเฉพาะ Column A: Timestamp, Column B: User Email, และ Column C: OTP Verification Status ปลอดภัยไร้ข้อมูลส่วนตัว"
        },
        {
          name: "Single-Click 'Open in Google Drive' (ปุ่มเปิดสเปรดชีตจริง)",
          desc: "ปุ่มเปิดสเปรดชีตจริงบน Google Drive ตรวจดูข้อมูล ส่งออกเป็น Excel (.xlsx) ได้ทันที"
        }
      ]
    },
    {
      id: "master",
      tab: "landing",
      nameEn: "5. Master Architecture Blueprint",
      nameTh: "5. พิมพ์เขียวภาพรวมสถาปัตยกรรมทุกส่วน",
      imageSrc: "/src/assets/images/mind_merit_prototype_overview_1791916454947.jpg",
      fileName: "mind_merit_master_blueprint.jpg",
      taglineEn: "Complete Multi-Screen Architectural Overview",
      taglineTh: "ภาพรวมโครงสร้างและการเชื่อมโยงของระบบทั้ง 4 หน้าจอ",
      color: "from-indigo-600 to-purple-600",
      components: [
        {
          name: "Screen 1: Daily Mental Health Tracker",
          desc: "หน้าจอสำหรับการบันทึกและประเมินสภาวะทางอารมณ์รายวันของผู้ใช้งาน"
        },
        {
          name: "Screen 2: Interactive Gamified Dashboard",
          desc: "หน้าจอแดชบอร์ดหลักแสดงแต้ม สถิติไฟ Streak และตู้เก็บเกียรติบัตร"
        },
        {
          name: "Screen 3: Email Authentication Modal (Zero Personal Data)",
          desc: "หน้าต่างโมดอลสมัครสมาชิกด้วยอีเมล ยืนยันรหัส OTP 6 หลัก และเข้าสู่ระบบ"
        },
        {
          name: "Screen 4: Simulated Cloud Admin Hub & Google Sheets",
          desc: "หน้าจอระบบหลังบ้านควบคุมการซิงค์ข้อมูลลง Google Sheets จำกัดสิทธิ์เฉพาะผู้ดูแลระบบ (พร้อม Real-time Live Sync)"
        }
      ]
    }
  ];

  const currentScreen = prototypeScreens[activeScreenIndex];

  // Helper function to download prototype image directly
  const handleDownloadImage = (imgSrc: string, fileName: string) => {
    try {
      const link = document.createElement("a");
      link.href = imgSrc;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(fileName);
      setTimeout(() => setDownloadSuccess(null), 3500);
    } catch (e) {
      console.error("Failed to trigger download", e);
    }
  };

  // Helper function to capture live rendered DOM mockup to high-res PNG image
  const handleCaptureLiveUI = async () => {
    if (!mockupContainerRef.current) return;
    try {
      setIsCapturing(true);
      const canvas = await html2canvas(mockupContainerRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0f172a"
      });
      const dataUrl = canvas.toDataURL("image/png");
      const fileName = `mind_merit_${currentScreen.id}_live_ui_capture.png`;
      
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(fileName);
      setTimeout(() => setDownloadSuccess(null), 3500);
    } catch (e) {
      console.error("Failed to capture live UI", e);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Dialog Window */}
      <div className="relative w-full max-w-6xl max-h-[95vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-sky-50/60 via-teal-50/40 to-emerald-50/60 dark:from-slate-900 dark:to-slate-850">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-tr from-sky-500 via-teal-500 to-emerald-500 text-white shadow-sm shrink-0">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {isEn ? "MIND MERIT Prototype Showcase (Full Detail & Download)" : "ภาพจำลอง Prototype ครบทุกส่วนของระบบ MIND MERIT"}
                </h2>
                <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                  {isEn ? "Save Image Enabled" : "กดบันทึกรูปได้ทุกหน้า"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isEn 
                  ? "Authentic UI matching actual app colors & layouts: Landing, Dashboard, Academy, and Admin Hub" 
                  : "ดีไซน์ตรงตามตัวแอปจริงทุกสีและรูปแบบ พร้อมฟังก์ชันบันทึกภาพลงเครื่องได้ทันที"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* View Mode Toggle: Screenshot vs Live App Mockup */}
            <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-xs font-bold">
              <button
                onClick={() => setViewMode("screenshot")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === "screenshot"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                🖼️ ภาพสกรีนช็อต
              </button>
              <button
                onClick={() => setViewMode("live_mockup")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === "live_mockup"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                ✨ เรนเดอร์ UI จริง
              </button>
            </div>

            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isZoomed ? "ย่อขนาดรูปภาพ" : "ขยายขนาดรูปภาพ"}
            >
              {isZoomed ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              title="ปิดหน้าต่าง"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Screen Selector Tabs (5 ส่วนหลัก) */}
        <div className="px-3 sm:px-6 py-2.5 bg-slate-50 dark:bg-slate-850 border-b border-slate-200/70 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto scrollbar-none">
          {prototypeScreens.map((screen, idx) => {
            const isSelected = activeScreenIndex === idx;
            return (
              <button
                key={screen.id}
                onClick={() => setActiveScreenIndex(idx)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                  isSelected
                    ? "bg-slate-900 text-white dark:bg-teal-600 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900"
                }`}
              >
                <span>{isEn ? screen.nameEn : screen.nameTh}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
          
          {/* Main Visual Display Card */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-slate-950 group">
            
            {/* VIEW MODE 1: HIGH-RES SCREENSHOT IMAGE */}
            {viewMode === "screenshot" ? (
              <img 
                src={currentScreen.imageSrc} 
                alt={currentScreen.nameEn} 
                referrerPolicy="no-referrer"
                className={`w-full object-cover transition-all duration-300 ${
                  isZoomed ? "max-h-[75vh] object-contain bg-black" : "max-h-[460px] object-top"
                }`}
              />
            ) : (
              /* VIEW MODE 2: EXACT LIVE APP UI RENDER (Matching App Colors & Layout 100%) */
              <div 
                ref={mockupContainerRef}
                className="w-full bg-slate-950 p-4 sm:p-6 text-slate-100 min-h-[460px] overflow-x-auto font-sans"
              >
                {/* Browser-style Top Bar */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <span className="h-3 w-3 rounded-full bg-rose-500 inline-block"></span>
                    <span className="h-3 w-3 rounded-full bg-amber-500 inline-block"></span>
                    <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block"></span>
                    <span className="ml-2 font-mono text-[11px] text-slate-300">https://mindmerit.app/{currentScreen.tab}</span>
                  </div>
                  <span className="text-[11px] text-teal-400 font-bold bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-800">
                    Exact App UI Fidelity 100%
                  </span>
                </div>

                {/* Sub-Screen Mockup Content */}
                {currentScreen.id === "landing" && (
                  <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Mock Nav */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <div className="flex items-center space-x-2">
                        <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-sky-400 via-teal-400 to-emerald-400 flex items-center justify-center font-black text-slate-950 text-xs">
                          M
                        </div>
                        <span className="font-black text-sm tracking-wider bg-gradient-to-r from-sky-300 via-teal-200 to-emerald-300 bg-clip-text text-transparent">
                          MIND MERIT
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs">
                        <span className="text-slate-300 font-semibold">หน้าหลัก</span>
                        <span className="text-slate-400">ฟีเจอร์</span>
                        <span className="text-slate-400">แพ็กเกจ</span>
                        <span className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs">
                          สมัครใช้งาน (ฟรี)
                        </span>
                      </div>
                    </div>

                    {/* Mock Hero */}
                    <div className="text-center py-6 space-y-3">
                      <span className="px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/40 text-teal-300 text-xs font-bold inline-flex items-center space-x-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                        <span>พื้นที่ปลอดภัยเพื่อสุขภาพใจและการพัฒนาตนเอง</span>
                      </span>
                      <h1 className="text-2xl sm:text-3xl font-black text-white">
                        Safe Space for <span className="text-teal-400">Mental Health & Growth</span>
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                        บันทึกอารมณ์รายวัน ประเมินสุขภาพใจ และรับคำแนะนำประโลมใจจาก AI นักจิตวิทยา โดยไม่มีการเก็บข้อมูลส่วนตัวเด็ดขาด
                      </p>
                      <div className="flex items-center justify-center space-x-3 pt-2">
                        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-xs shadow-md">
                          สมัครใช้งาน (ฟรี)
                        </button>
                        <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700">
                          เข้าสู่ระบบ
                        </button>
                      </div>
                    </div>

                    {/* 4 Cards Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                      {[
                        { title: "1. Sub-second Speed", sub: "ประมวลผลไว ทันใจ", icon: "⚡", color: "from-sky-500/20 to-sky-600/10 border-sky-500/30" },
                        { title: "2. 24/7 AI Counselor", sub: "รับฟังและให้กำลังใจ", icon: "💬", color: "from-teal-500/20 to-teal-600/10 border-teal-500/30" },
                        { title: "3. PDPA Strict Privacy", sub: "ไม่ขอข้อมูลส่วนตัว", icon: "🔒", color: "from-purple-500/20 to-purple-600/10 border-purple-500/30" },
                        { title: "4. Digital Certificate", sub: "เกียรติบัตรรับรองฟรี", icon: "🏆", color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30" }
                      ].map((c, i) => (
                        <div key={i} className={`p-3 rounded-2xl bg-gradient-to-b ${c.color} border space-y-1`}>
                          <span className="text-lg">{c.icon}</span>
                          <h4 className="text-xs font-bold text-white">{c.title}</h4>
                          <p className="text-[10px] text-slate-300">{c.sub}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentScreen.id === "dashboard" && (
                  <div className="space-y-4 max-w-4xl mx-auto">
                    {/* User Profile Banner */}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-teal-500 flex items-center justify-center text-white font-bold">
                          YC
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-white">Chutipas Y.</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800 font-bold">
                              Level 15
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                            <span>650 / 800 XP</span>
                            <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                              <div className="w-4/5 h-full bg-teal-400"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold text-xs">
                        <Flame className="h-4 w-4 text-amber-400" />
                        <span>35 Days Streak 🔥</span>
                      </div>
                    </div>

                    {/* Mood & Diary Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Mood Check-in Card */}
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                        <h4 className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                          <Smile className="h-4 w-4 text-teal-400" />
                          <span>Daily Mood Check-in (อารมณ์วันนี้)</span>
                        </h4>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { name: "Happy", icon: "😊", active: true },
                            { name: "Calm", icon: "😌", active: false },
                            { name: "Anxious", icon: "😰", active: false },
                            { name: "Sad", icon: "😢", active: false }
                          ].map((m, i) => (
                            <div key={i} className={`p-2 rounded-xl text-center text-xs font-bold border transition-all ${
                              m.active ? "bg-teal-950/80 border-teal-500 text-teal-300" : "bg-slate-800/60 border-slate-700 text-slate-400"
                            }`}>
                              <div className="text-base">{m.icon}</div>
                              <span className="text-[10px]">{m.name}</span>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-slate-300">
                            <span>Feeling Score:</span>
                            <span className="font-bold text-teal-400">8.5 / 10 (Positive & Motivated)</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div className="w-[85%] h-full bg-gradient-to-r from-teal-400 to-emerald-400"></div>
                          </div>
                        </div>
                      </div>

                      {/* Gratitude Diary */}
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                        <h4 className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                          <Heart className="h-4 w-4 text-rose-400" />
                          <span>Gratitude Diary (ไดอารี่ขอบคุณ)</span>
                        </h4>
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 min-h-[60px]">
                          ขอบคุณวันนี้ที่สามารถจดจ่อกับการทำงานได้ดี และได้ใช้เวลาผ่อนคลายกับครอบครัว...
                        </div>
                        <div className="flex justify-end">
                          <button className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs">
                            บันทึกไดอารี่ (Save)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentScreen.id === "academy" && (
                  <div className="space-y-4 max-w-4xl mx-auto">
                    {/* Certificate Preview Card */}
                    <div className="p-5 rounded-3xl bg-gradient-to-b from-amber-950/40 to-slate-900 border-2 border-amber-500/50 shadow-xl space-y-4">
                      <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                        <div className="flex items-center space-x-2">
                          <Award className="h-5 w-5 text-amber-400" />
                          <span className="font-bold text-xs text-amber-300 tracking-wider">
                            MIND MERIT ACADEMY • OFFICIAL CREDENTIAL
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          ID: MM-2025-8849
                        </span>
                      </div>

                      <div className="text-center py-2 space-y-1">
                        <h3 className="text-lg font-black text-amber-100 uppercase tracking-widest">
                          Certificate of Mental Wellness Completion
                        </h3>
                        <p className="text-[11px] text-slate-300">
                          This certificate is proudly awarded to
                        </p>
                        <h4 className="text-base font-black text-white underline decoration-amber-400 underline-offset-4">
                          SARAH CHEN
                        </h4>
                        <p className="text-[10px] text-slate-400 max-w-md mx-auto pt-1">
                          For demonstrating dedication in daily mental health check-ins, mindful reflection, and building emotional resilience.
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-amber-500/20 text-[10px] text-slate-400">
                        <div className="flex items-center space-x-2">
                          <div className="p-1 rounded bg-white text-slate-950">
                            <QrCode className="h-6 w-6" />
                          </div>
                          <span>Scan to Verify Online</span>
                        </div>
                        <div className="text-right">
                          <span className="font-serif italic text-amber-200 block">Dr. Evelyn Reed</span>
                          <span>Director of Mindfulness</span>
                        </div>
                      </div>
                    </div>

                    {/* Milestone Badges */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { title: "Consistency Master", desc: "30 Days Daily Practice", icon: "🔥", badge: "Gold" },
                        { title: "Gratitude Champion", desc: "50 Gratitude Notes", icon: "✨", badge: "Gold" },
                        { title: "Mindful Explorer", desc: "10 Mindful Sessions", icon: "🧭", badge: "Emerald" }
                      ].map((b, i) => (
                        <div key={i} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
                          <span className="text-xl">{b.icon}</span>
                          <h5 className="text-xs font-bold text-white">{b.title}</h5>
                          <p className="text-[10px] text-slate-400">{b.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentScreen.id === "admin" && (
                  <div className="space-y-4 max-w-4xl mx-auto">
                    {/* Real-time Google Sheets Live Sync Header */}
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
                          <FileSpreadsheet className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs text-white">Google Sheets Database: Active</span>
                            <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold animate-pulse">
                              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                              <span>⚡ Real-Time Live Sync: Active (เมื่อมีคนสมัครข้อมูลเด้งเข้าชีตทันที)</span>
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            จำกัดสิทธิ์เฉพาะ: <strong className="text-emerald-300">ผู้ดูแลระบบ (Administrator Only)</strong>
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center space-x-1">
                        <ExternalLink className="h-3 w-3" />
                        <span>เปิดใน Drive</span>
                      </span>
                    </div>

                    {/* Google Sheets Live Database Table */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-800 text-slate-300 font-bold border-b border-slate-700">
                          <tr>
                            <th className="py-2.5 px-3">#</th>
                            <th className="py-2.5 px-3">Column A: Timestamp</th>
                            <th className="py-2.5 px-3">Column B: User Email (เฉพาะอีเมล)</th>
                            <th className="py-2.5 px-3">Column C: Verification Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                          <tr className="bg-emerald-950/40 text-emerald-200 animate-pulse">
                            <td className="py-2 px-3 font-bold text-emerald-400">1 (New!)</td>
                            <td className="py-2 px-3">2026-10-13 18:55:00</td>
                            <td className="py-2 px-3 font-bold text-white">new_member88@gmail.com</td>
                            <td className="py-2 px-3">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-300 font-sans text-[10px]">
                                Registered & Verified
                              </span>
                            </td>
                          </tr>
                          <tr className="text-slate-300">
                            <td className="py-2 px-3">2</td>
                            <td className="py-2 px-3">2026-10-13 18:40:12</td>
                            <td className="py-2 px-3">sarah.chen@company.org</td>
                            <td className="py-2 px-3">
                              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-sans text-[10px]">
                                Registered & Verified
                              </span>
                            </td>
                          </tr>
                          <tr className="text-slate-300">
                            <td className="py-2 px-3">3</td>
                            <td className="py-2 px-3">2026-10-13 18:32:05</td>
                            <td className="py-2 px-3">member2025@university.edu</td>
                            <td className="py-2 px-3">
                              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-sans text-[10px]">
                                Registered & Verified
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Strict Policy Guarantee */}
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                      <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Zero Personal Data Guarantee: เข้าถึงเฉพาะอีเมลผู้ใช้ ไม่เข้าถึงไม่บันทึกข้อมูลส่วนตัวเด็ดขาด</span>
                      </span>
                      <span className="text-slate-500 font-mono">Status: 200 OK • Latency: 32ms</span>
                    </div>
                  </div>
                )}

                {currentScreen.id === "master" && (
                  <div className="space-y-4 max-w-4xl mx-auto">
                    <div className="text-center py-2">
                      <h3 className="text-base font-bold text-white">ภาพรวมพิมพ์เขียวสถาปัตยกรรมทั้ง 4 หน้าจอของ MIND MERIT</h3>
                      <p className="text-xs text-slate-400">เชื่อมโยงระหว่างผู้ใช้งานทั่วไป และระบบหลังบ้าน Google Sheets แบบเรียลไทม์</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-xs font-bold text-sky-400">Screen 1: Landing Page</span>
                        <p className="text-[11px] text-slate-300">หน้าแรก แนะนำฟีเจอร์ จุดเด่น และสิทธิประโยชน์ของแพลตฟอร์ม</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-xs font-bold text-teal-400">Screen 2: Daily Wellness Tracker</span>
                        <p className="text-[11px] text-slate-300">แดชบอร์ดเช็คอินอารมณ์ ไดอารี่ขอบคุณ สถิติไฟ Streak และกราฟความเครียด</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-xs font-bold text-amber-400">Screen 3: Merit Academy & Badges</span>
                        <p className="text-[11px] text-slate-300">ตู้เก็บเกียรติบัตรดิจิทัลพร้อม QR Code ตรวจสอบความถูกต้อง และเหรียญตรา 3 มิติ</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-xs font-bold text-emerald-400">Screen 4: Cloud Admin & Live Sheets</span>
                        <p className="text-[11px] text-slate-300">ซิงค์ข้อมูลผู้ใช้ลง Google Sheets ทันทีที่สมัคร จำกัดสิทธิ์เฉพาะผู้ดูแลระบบ</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Float Action Overlay: Download and Live Navigation */}
            <div className="absolute top-3 right-3 flex items-center space-x-2 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-lg">
              
              {/* Button: Capture & Download Image */}
              {viewMode === "live_mockup" ? (
                <button
                  onClick={handleCaptureLiveUI}
                  disabled={isCapturing}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                  title="แคปรูปภาพหน้าจอ UI เสมือนจริงนี้เป็นไฟล์ภาพความละเอียดสูง"
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>{isCapturing ? "กำลังจับภาพ..." : "แคปบันทึกรูปภาพนี้ (PNG)"}</span>
                </button>
              ) : (
                <button
                  onClick={() => handleDownloadImage(currentScreen.imageSrc, currentScreen.fileName)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer active:scale-95"
                  title="กดเพื่อบันทึกรูปภาพนี้ลงอุปกรณ์ของคุณ"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{isEn ? "Save Image" : "บันทึกรูปภาพนี้"}</span>
                </button>
              )}

              {/* Button: Jump to Live Screen in App */}
              {onNavigateTab && (
                <button
                  onClick={() => {
                    onNavigateTab(currentScreen.tab);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
                  title="เปิดทดลองใช้งานหน้านี้จริงในระบบ"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>{isEn ? "Open Live Screen" : "ไปที่หน้านี้จริง"}</span>
                </button>
              )}

            </div>

            {/* Bottom Title Tag */}
            <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-white">
              <span className="text-xs font-black block">{isEn ? currentScreen.nameEn : currentScreen.nameTh}</span>
              <span className="text-[10px] text-slate-300">{isEn ? currentScreen.taglineEn : currentScreen.taglineTh}</span>
            </div>

          </div>

          {/* Download Success Banner */}
          {downloadSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>บันทึกไฟล์ <strong>{downloadSuccess}</strong> เรียบร้อยแล้ว! สามารถเปิดดูในโฟลเดอร์ดาวน์โหลดของคุณได้ทันที</span>
              </div>
              <button 
                onClick={() => setDownloadSuccess(null)}
                className="text-xs opacity-70 hover:opacity-100 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Detailed Component Breakdown (ในหน้านี้มีอะไรบ้าง และแต่ละอันเป็นยังไง) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center space-x-2.5">
                <div className={`p-2 rounded-xl bg-gradient-to-tr ${currentScreen.color} text-white shadow-xs`}>
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
                    {isEn ? `Components & Functions in ${currentScreen.nameEn}` : `รายละเอียดองค์ประกอบใน ${currentScreen.nameTh} (แต่ละอันเป็นยังไง)`}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isEn ? "Detailed functional explanation of each UI module" : "เจาะลึกทุกฟังก์ชันที่ปรากฏในหน้าจอนี้อย่างครบถ้วน"}
                  </p>
                </div>
              </div>

              {/* Quick Download Button inside card */}
              <button
                onClick={() => handleDownloadImage(currentScreen.imageSrc, currentScreen.fileName)}
                className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="h-3.5 w-3.5 text-emerald-600" />
                <span>ดาวน์โหลดรูปภาพส่วนนี้ (.jpg)</span>
              </button>
            </div>

            {/* List of components */}
            <div className="grid gap-3 sm:grid-cols-2">
              {currentScreen.components.map((comp, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/80 shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center space-x-2">
                    <span className="h-5 w-5 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100">
                      {comp.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed pl-7">
                    {comp.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* Quick Access to Download All 4 Prototype Images at Once */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black text-emerald-300 flex items-center space-x-1.5">
                  <Download className="h-4 w-4 text-emerald-400" />
                  <span>บันทึกภาพ Prototype ครบทั้ง 4 ส่วนหลักลงเครื่องของคุณ</span>
                </span>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  สามารถคลิกปุ่มดาวน์โหลดของแต่ละภาพด้านล่างนี้ เพื่อเซฟรูปภาพความละเอียดสูงเก็บไว้ในเครื่องได้ทันที:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {prototypeScreens.slice(0, 4).map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleDownloadImage(s.imageSrc, s.fileName)}
                  className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
                >
                  <span className="text-[11px] font-bold text-slate-100 line-clamp-1 group-hover:text-emerald-300">
                    {s.nameTh.split(". ")[1]}
                  </span>
                  <div className="flex items-center space-x-1 text-[10px] text-emerald-400 font-bold">
                    <Download className="h-3 w-3" />
                    <span>ดาวน์โหลดรูป 📥</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Strict Policy & Security Guarantee Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 to-slate-900 text-white border border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-emerald-300 block">
                  ยืนยันความปลอดภัยตามความต้องการ:
                </span>
                <span className="text-slate-300 text-[11px]">
                  1. เข้าถึง Google Sheets ได้เฉพาะ <strong className="text-emerald-300">ผู้ดูแลระบบ (Administrator Only)</strong> เท่านั้น พร้อมระบบเรียลไทม์ (เมื่อมีคนสมัครข้อมูลเด้งเข้าชีตทันที)
                  {" • "}
                  2. <strong>Zero Personal Data</strong>: บันทึกเฉพาะข้อมูลอีเมลผู้ใช้ ไม่เข้าถึงไม่เก็บข้อมูลส่วนตัวใดๆ ทั้งสิ้น
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Close */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            MIND MERIT Web Application Architecture • Version 2.5
          </span>
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            {isEn ? "Close" : "ปิด"}
          </button>
        </div>

      </div>

    </div>
  );
}
