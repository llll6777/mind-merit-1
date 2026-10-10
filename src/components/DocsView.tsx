import React, { useState } from "react";
import { BookOpen, FileCode, Landmark, Award, Shield, Layers, Server, Compass, CheckCircle2 } from "lucide-react";
import { UserProfile } from "../types";

interface DocsViewProps {
  user: UserProfile;
}

export default function DocsView({ user }: DocsViewProps) {
  const [activeDocSection, setActiveDocSection] = useState<string>("summary");
  const isEn = user.language === "en";

  const docTabs = [
    { 
      id: "summary", 
      label: "1. ภาพรวมผู้บริหาร & PRD", 
      icon: BookOpen 
    },
    { 
      id: "manual", 
      label: "2. คู่มือการใช้งานระบบ", 
      icon: Compass 
    },
    { 
      id: "ux", 
      label: "3. การออกแบบ UX & เส้นทางผู้ใช้", 
      icon: Layers 
    },
    { 
      id: "db", 
      label: "4. โครงสร้างฐานข้อมูล & DDL", 
      icon: Landmark 
    },
    { 
      id: "api", 
      label: "5. สถาปัตยกรรม API Gateway", 
      icon: FileCode 
    },
    { 
      id: "app", 
      label: "6. โครงสร้างระบบ (Architecture)", 
      icon: Server 
    },
    { 
      id: "security", 
      label: "7. ความปลอดภัย & เช็กลิสต์", 
      icon: Shield 
    }
  ];

  return (
    <div id="prd-documentation-root" className="grid gap-6 md:grid-cols-4 items-start animate-fadeIn">
      
      {/* Sidebar navigation tabs (Desktop sidebar / Mobile horizontal strip) */}
      <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-2.5 sm:p-3.5 shadow-sm">
        <h4 className="hidden md:block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
          {isEn ? "Documentation Hub" : "ศูนย์เอกสารระบบ (Docs Hub)"}
        </h4>
        <div className="flex md:flex-col overflow-x-auto md:overflow-visible gap-1.5 pb-1 md:pb-0 scrollbar-none">
          {docTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeDocSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDocSection(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-left text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap md:whitespace-normal shrink-0 md:shrink md:w-full ${
                  isActive 
                    ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-300 font-bold border-l-0 md:border-l-3 border-purple-500 ring-1 ring-purple-400/40 md:ring-0' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary document pane (Takes 3/4 space) */}
      <div className="md:col-span-3 rounded-2xl border border-slate-100 bg-white p-3.5 sm:p-7 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm max-h-[75vh] overflow-y-auto space-y-5 sm:space-y-6">
        
        {/* =========================================================================
            SECTION 1: Executive Summary & PRD (ภาษาไทยสมบูรณ์แบบ)
            ========================================================================= */}
        {activeDocSection === "summary" && (
          <div className="space-y-4">
            <div>
              <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 mb-1">
                <span>เอกสาร PRD และโครงสร้างระบบ (ภาษาไทย)</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100">
                บทสรุปสำหรับผู้บริหาร & เอกสารกำหนดความต้องการผลิตภัณฑ์ (PRD)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                แพลตฟอร์มดูแลสุขภาพจิตและส่งเสริมสุขภาวะ MIND MERIT
              </p>
            </div>
            
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3.5 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3.5">
              <p>
                <strong>MIND MERIT (มายด์ เมอริท)</strong> คือแพลตฟอร์มดิจิทัลเพื่อการดูแลสุขภาวะทางจิตวิทยาและการพัฒนาศักยภาพเชิงบวก ออกแบบมาเพื่อปิดช่องว่างในการเข้าถึงคำปรึกษาทางใจสำหรับนักเรียน นิสิต นักศึกษา บุคลากร และองค์กร ด้วยการผสานเครื่องมือสร้างการตระหนักรู้ในตนเอง (Cognitive Self-Awareness), แบบประเมินทางจิตวิทยามาตรฐานสากล และระบบปัญญาประดิษฐ์ (AI Psychologist Buddy) ที่คอยรับฟัง ให้กำลังใจ และวิเคราะห์แนวโน้มอารมณ์ตลอด 24 ชั่วโมง โดยไม่ตัดสิน พร้อมระบบส่งต่อความช่วยเหลือฉุกเฉิน
              </p>

              <h4 className="font-bold text-slate-800 dark:text-slate-100 mt-4 text-[13px] flex items-center space-x-1.5">
                <span>📋 เอกสารข้อกำหนดของผลิตภัณฑ์ (Product Requirement Document - PRD)</span>
              </h4>
              
              <ul className="space-y-2.5 pl-1">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>รองรับ 2 ภาษาแบบสมบูรณ์ (Bilingual EN/TH):</strong> รองรับการสลับภาษาไทยและภาษาอังกฤษได้ทุกหน้าจอแบบ Real-Time คำศัพท์เหมาะสมตามหลักจิตวิทยา
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>ระบบบันทึกอารมณ์และสุขภาวะประจำวัน (Durable Mood Logging):</strong> บันทึกอารมณ์ 5 ระดับ, ดัชนีความเครียด (1-10), ชั่วโมงการนอนหลับ, การออกกำลังกาย, การดื่มน้ำ, สิ่งที่รู้สึกขอบคุณ (Gratitude) และไดอารี่ พร้อม AI วิเคราะห์ผลเชิงลึกทันที
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>แบบประเมินสุขภาพจิตตามมาตรฐานวิทยาศาสตร์ (Scientific Assessments):</strong> ได้แก่ แบบวัดความเครียด PSS, ดัชนีสุขภาวะ WHO-5, และแบบคัดกรองภาวะหมดไฟ (Burnout Inventory) แสดงระดับความเสี่ยงและคำแนะนำเฉพาะบุคคล
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>คู่หู AI ให้คำปรึกษาตลอด 24 ชั่วโมง (Bilingual AI Companion):</strong> พัฒนาบนพื้นฐานจิตวิทยาความคิดและพฤติกรรม (CBT) รับฟังอย่างเข้าใจ จดจำบริบท และมีระบบดักจับคำพูดวิกฤตเพื่อส่งต่อความช่วยเหลือ
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>สถาบันฝึกสติ & เกียรติบัตรรับรองดิจิทัล (Meditation Academy & E-Certificates):</strong> หลักสูตรฝึกหายใจ Box Breathing (4-4-4-4) แบบโต้ตอบ แอนิเมชันนำทาง พร้อมแบบทดสอบเพื่อรับใบประกาศนียบัตรที่มีรหัสตรวจสอบได้จริง
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>พื้นที่ชุมชนปลอดภัย & ระบบจับคู่เพื่อนหนุนใจ (Safe Community & Buddy Matcher):</strong> กระดานแลกเปลี่ยนกำลังใจแบบนิรนาม พร้อมระบบ AI คัดกรองคำพูดสร้างความเกลียดชัง (Toxicity Filter)
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>ระบบช่วยเหลือฉุกเฉิน (Emergency SOS Hub):</strong> ปุ่มกดโทรสายด่วนสุขภาพจิตไทย (เช่น 1323) ได้ทันที เทคนิคดึงสติสัมปชัญญะ 5-4-3-2-1 และคู่มือผ่อนคลายวิกฤต
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 2: User Manual (คู่มือการใช้งานระบบ)
            ========================================================================= */}
        {activeDocSection === "manual" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100">
                {isEn ? "User Manual & Operational Workflows" : "คู่มือและขั้นตอนการใช้งานแพลตฟอร์มอย่างละเอียด"}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn ? "Step-by-step operation guide" : "ขั้นตอนและแนวทางการใช้งานแต่ละโมดูลของระบบ"}
              </p>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3.5">
              <div className="space-y-1.5 p-3.5 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100/60 dark:border-sky-900/40">
                <h4 className="font-bold text-sky-700 dark:text-sky-300 text-[13px]">1. การเริ่มต้นและตั้งค่าโปรไฟล์ (Getting Started)</h4>
                <p>
                  ผู้ใช้สามารถตั้งชื่อ นามแฝง เลือกรูปภาพ Avatar เป็นอิโมจิตัวแทนอารมณ์ และเลือกบทบาทระหว่าง "นักเรียน/นักศึกษา (Student)" หรือ "วัยทำงาน (Working Adult)" เพื่อปรับคำแนะนำให้ตรงกับบริบทชีวิต สามารถเปิด-ปิดโหมดไม่ระบุตัวตน (Anonymous Mode) ได้ตลอดเวลาเพื่อความสบายใจสูงสุด
                </p>
              </div>

              <div className="space-y-1.5 p-3.5 rounded-xl bg-pink-50/50 dark:bg-pink-950/20 border border-pink-100/60 dark:border-pink-900/40">
                <h4 className="font-bold text-pink-700 dark:text-pink-300 text-[13px]">2. การบันทึกอารมณ์รายวัน (Daily Mood Logging)</h4>
                <p>
                  ใช้เวลาเพียง 1-2 นาทีต่อวัน เลือกอารมณ์ 5 ระดับ ปรับดัชนีความเครียดสเกล 1-10 บันทึกชั่วโมงนอน การดื่มน้ำ การออกกำลังกาย เขียน 3 สิ่งที่รู้สึกขอบคุณ (Gratitude) และความรู้สึกส่วนตัวใน Journal จากนั้นกดปุ่ม "บันทึกและขอรับการวิเคราะห์จาก AI" เพื่อรับคำแนะนำเฉพาะบุคคลและรับ +30 XP ทันที
                </p>
              </div>

              <div className="space-y-1.5 p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100/60 dark:border-amber-900/40">
                <h4 className="font-bold text-amber-700 dark:text-amber-300 text-[13px]">3. รับชมคลิปวิดีโอดูแลใจ (Care Videos)</h4>
                <p>
                  คลังวิดีโอคุณภาพสูงที่คัดสรรและทดสอบแล้วว่าเปิดเล่นได้จริง 100% ไม่มีปัญหาการติดลิขสิทธิ์ฝังเล่น แบ่งตามหมวดหมู่: ผ่อนคลาย/นอนหลับ, จัดการความเครียด, ฝึกสติและสมาธิ, และสร้างแรงบันดาลใจ สามารถรับชมและรับแต้มสะสม XP ได้
                </p>
              </div>

              <div className="space-y-1.5 p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-900/40">
                <h4 className="font-bold text-emerald-700 dark:text-emerald-300 text-[13px]">4. สนทนากับคู่หู AI (AI Psychologist & Buddy)</h4>
                <p>
                  เพื่อนคู่คิด AI ที่อบอุ่นและเข้าใจง่าย ตอบกลับด้วยหลักการจิตวิทยาการปรับความคิดและพฤติกรรม (CBT) ปรึกษาได้ตลอด 24 ชม. ทั้งภาษาไทยและอังกฤษ มีปุ่มตัวอย่างคำถาม เช่น เครียดเรื่องสอบ, รู้สึกเหงา, หมดไฟในการทำงาน
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 3: UX Research & Personas (การออกแบบ UX ภาษาไทย)
            ========================================================================= */}
        {activeDocSection === "ux" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100">
                {isEn ? "UX Research & User Journeys" : "การวิจัยประสบการณ์ผู้ใช้ (UX Research) & กลุ่มผู้ใช้งานจำลอง (Personas)"}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn ? "Empirical Insights & Personas" : "การวิเคราะห์พฤติกรรมเชิงประจักษ์และการออกแบบเส้นทางผู้ใช้งาน"}
              </p>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3.5">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-[13px]">
                  กลุ่มผู้ใช้จำลองที่ 1: อลิสา (นักศึกษาชั้นปีที่ 2 วัย 19 ปี)
                </h4>
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                  <strong>ปัญหาที่พบ:</strong> วิตกกังวลช่วงสอบปลายภาค, นอนไม่หลับ, คิดวนซ้ำ, และรู้สึกโดดเดี่ยว<br />
                  <strong>เส้นทางการใช้งาน (Journey):</strong> อลิสาเปิดเข้าเว็บ MIND MERIT บันทึกการนอนหลับ 4 ชม. และระดับความเครียด ระบบวิเคราะห์แนะนำให้ฝึกหายใจ Box Breathing 3 นาที และจับคู่กับเพื่อนหนุนใจ อลิสารู้สึกผ่อนคลายและลดความตื่นตระหนกลงได้อย่างรวดเร็ว
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-[13px]">
                  กลุ่มผู้ใช้จำลองที่ 2: พีท (พนักงานออฟฟิศ วัย 27 ปี)
                </h4>
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                  <strong>ปัญหาที่พบ:</strong> ภาวะหมดไฟ (Burnout), แรงกดดันจากเป้าหมายงาน, หมดพลังใจในการใช้ชีวิต<br />
                  <strong>เส้นทางการใช้งาน (Journey):</strong> พีททำแบบประเมินภาวะหมดไฟ ผลคะแนนระบุว่าอยู่ในระดับปานกลาง-สูง AI แนะนำคอร์ส "การเอาชนะเสียงวิพากษ์วิจารณ์ในหัว (Inner Critic)" พีทเรียนจบ ทำแบบทดสอบ และได้รับใบประกาศนียบัตรดิจิทัล สร้างความมั่นใจและพลังบวกในการทำงาน
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
                <h4 className="font-bold text-purple-700 dark:text-purple-300 text-[13px]">
                  สถาปัตยกรรมข้อมูล (Information Architecture)
                </h4>
                <p className="mt-1 text-slate-600 dark:text-slate-300">
                  จัดวางโครงสร้างแบบ Modular Tabs ที่เข้าถึงง่าย: หน้าหลัก (Landing/Home) &rarr; แดชบอร์ด (Dashboard) &rarr; เช็คอินอารมณ์ &rarr; วิดีโอดูแลใจ &rarr; AI คุยใจ &rarr; ประเมินสุขภาพ &rarr; สถาบัน & เกียรติบัตร &rarr; ชุมชน &rarr; ศูนย์แอดมิน &rarr; ช่วยเหลือฉุกเฉิน (SOS)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 4: Database Architecture (โครงสร้างฐานข้อมูลภาษาไทย)
            ========================================================================= */}
        {activeDocSection === "db" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100">
                {isEn ? "Database Schema & Relational DDL" : "สถาปัตยกรรมฐานข้อมูล & แผนภาพความสัมพันธ์ (Database Schema)"}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn ? "PostgreSQL Database Architecture" : "โครงสร้างฐานข้อมูลเชิงสัมพันธ์ PostgreSQL พร้อม Indexing และข้อจำกัดความปลอดภัย"}
              </p>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3.5">
              <p>
                ฐานข้อมูลของ MIND MERIT ออกแบบให้สอดคล้องตามมาตรฐานความปลอดภัย PDPA 100% โดยเข้ารหัสฟิลด์ข้อมูลส่วนบุคคล และจัดเก็บข้อมูลบันทึกอารมณ์และใบประกาศนียบัตรแบบ Relational Schema:
              </p>
              
              <pre className="p-4 bg-slate-900 text-purple-300 rounded-xl overflow-x-auto font-mono text-[10px] leading-relaxed border border-slate-800">
{`-- ตารางผู้ใช้งาน (Users Table)
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('student', 'adult')),
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak INTEGER DEFAULT 0,
    language VARCHAR(5) DEFAULT 'th',
    theme VARCHAR(10) DEFAULT 'light',
    pdpa_consent BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตารางบันทึกอารมณ์และสุขภาวะรายวัน (Mood Check-ins)
CREATE TABLE mood_checkins (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL,
    mood VARCHAR(20) NOT NULL,
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    sleep_hours DECIMAL(4,2),
    exercise_mins INTEGER,
    water_ml INTEGER,
    gratitude_statement TEXT,
    journal_text TEXT,
    ai_analysis_feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตารางเกียรติบัตรรับรองดิจิทัล (Certificates)
CREATE TABLE certificates (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    course_name_th VARCHAR(200) NOT NULL,
    course_name_en VARCHAR(200) NOT NULL,
    certificate_hash VARCHAR(64) UNIQUE NOT NULL,
    date_issued TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
              </pre>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 5: API Gateway Architecture (สถาปัตยกรรม API ภาษาไทย)
            ========================================================================= */}
        {activeDocSection === "api" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100">
                {isEn ? "API Gateway Architecture" : "สถาปัตยกรรม API Gateway & เอนด์พอยต์เชื่อมต่อ"}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn ? "REST API Design Specs" : "สเปกการเชื่อมต่อ RESTful API ระหว่าง Frontend, Backend และ AI Engine"}
              </p>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3.5">
              <p>ระบบเชื่อมต่อผ่าน REST API ที่มีความปลอดภัยสูง พร้อมการตรวจสอบความถูกต้องของข้อมูล (Validation):</p>

              <div className="space-y-3">
                <div className="p-3.5 border border-slate-200/60 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[10px] font-bold">POST</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">/api/gemini/chat</span>
                  </div>
                  <p className="mt-1 text-slate-500 dark:text-slate-400 text-[11px]">
                    ช่องทางสนทนากับ AI Psychologist Buddy โดยส่งคำสั่ง System Prompt เชิงจิตวิทยา CBT พร้อมการตรวจจับภาวะวิกฤต
                  </p>
                </div>

                <div className="p-3.5 border border-slate-200/60 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[10px] font-bold">POST</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">/api/gemini/analyze-mood</span>
                  </div>
                  <p className="mt-1 text-slate-500 dark:text-slate-400 text-[11px]">
                    รับข้อมูลอารมณ์, สถิติการนอน, ระดับความเครียด และบันทึกไดอารี่ เพื่อส่งกลับบทวิเคราะห์ทางจิตวิทยาเชิงบวกแบบ Real-Time
                  </p>
                </div>

                <div className="p-3.5 border border-slate-200/60 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-sky-500 text-white rounded text-[10px] font-bold">POST</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">/api/gemini/recommendations</span>
                  </div>
                  <p className="mt-1 text-slate-500 dark:text-slate-400 text-[11px]">
                    ประมวลผลคะแนนแบบประเมินสุขภาพจิต (PSS / WHO-5 / Burnout) เพื่อสังเคราะห์เป็นแผนพัฒนาตนเอง 3 ข้อย่อย
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 6: System Architecture (โครงสร้างระบบคลีนอาคิเทคเจอร์ ภาษาไทย)
            ========================================================================= */}
        {activeDocSection === "app" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100">
                {isEn ? "System Architecture & Flutter Mobile" : "โครงสร้างระบบ (Architecture) & การออกแบบระดับ Enterprise"}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn ? "Enterprise Clean Architecture Pattern" : "การจัดระเบียบโมดูลตามหลัก Clean Architecture และการแยกชั้นการทำงานอย่างมีระเบียบ"}
              </p>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3.5">
              <p>
                โครงสร้างระบบของ MIND MERIT จัดแบ่งออกเป็น 4 ชั้นหลัก (Layered Clean Architecture) เพื่อให้บำรุงรักษาง่าย ขยายระบบได้ไม่จำกัด:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40">
                  <h4 className="font-bold text-sky-700 dark:text-sky-300 text-xs">1. Presentation Layer (UI/UX)</h4>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    หน้าจอส่วนติดต่อผู้ใช้ React + Tailwind CSS โทนสีพาสเทล 4 สี, แอนิเมชันนำทาง, ระบบสลับภาษา และคอมโพเนนต์ย่อยที่ตอบสนองไว
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                  <h4 className="font-bold text-emerald-700 dark:text-emerald-300 text-xs">2. Domain Layer (Business Logic)</h4>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    กฎทางธุรกิจ: การคำนวณคะแนน XP, การเลื่อนระดับเลเวล, การตรวจสอบเกณฑ์เกียรติบัตร, และการประเมินความเสี่ยงสุขภาพจิต
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-pink-50/50 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900/40">
                  <h4 className="font-bold text-pink-700 dark:text-pink-300 text-xs">3. Data Layer (Repository & State)</h4>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    การจัดการข้อมูล LocalStorage Persistence พร้อมแคช และระบบซิงก์ข้อมูลออฟไลน์เพื่อความต่อเนื่องในการใช้งาน
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
                  <h4 className="font-bold text-amber-700 dark:text-amber-300 text-xs">4. AI & Integration Layer</h4>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    โมเดลปัญญาประดิษฐ์ Gemini 3.5, ระบบแปลงเสียง, ระบบสร้างเกียรติบัตรพร้อม QR Code ดิจิทัล
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 7: Security & Deployment Checklist (ความปลอดภัยภาษาไทย)
            ========================================================================= */}
        {activeDocSection === "security" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100">
                {isEn ? "Security Architecture & Production Checklist" : "สถาปัตยกรรมความปลอดภัย & รายการตรวจสอบขึ้นระบบจริง"}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn ? "Production Launch Security Framework" : "มาตรฐานการคุ้มครองข้อมูลส่วนบุคคล PDPA และความปลอดภัยระดับสากล"}
              </p>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3.5">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-[13px]">
                  🛡️ โปรโตคอลความปลอดภัย (Security Protocols)
                </h4>
                <ul className="space-y-2 pl-1">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>การคุ้มครองข้อมูล PDPA 100%:</strong> ผู้ใช้มีสิทธิ์ลบประวัติการบันทึกอารมณ์และข้อมูลตนเองได้ตลอดเวลาตามกฎหมาย</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>การกรองคำพูดสร้างความเกลียดชัง (AI Toxicity Moderator):</strong> ตรวจจับคำพูดไม่เหมาะสมในชุมชนสาธารณะอัตโนมัติ</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>ความปลอดภัยในการสื่อสาร (End-to-End Encryption):</strong> เข้ารหัสการส่งข้อมูลคำปรึกษาและไดอารี่</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-[13px]">
                  ✅ รายการตรวจสอบความพร้อมของระบบ (Production Checklist)
                </h4>
                <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700">
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>[✔]</span>
                    <span>ระบบรองรับ 2 ภาษา (ไทย-อังกฤษ) ครอบคลุม 100%</span>
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>[✔]</span>
                    <span>หน้าหลัก (Home) อยู่ก่อนหน้าแดชบอร์ด (Dashboard) ในเมนูนำทาง</span>
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>[✔]</span>
                    <span>ระบบ Splash Screen โลโก้เมื่อเข้าเว็บ และสามารถกดดูโลโก้ได้ตลอดเวลา</span>
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>[✔]</span>
                    <span>การจัดวาง UI คู่มือและวิธีใช้งานรองรับสมาร์ทโฟน ไม่ล้นจอ</span>
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>[✔]</span>
                    <span>เกียรติบัตรดิจิทัลมี QR Code และรหัส Hash ตรวจสอบได้จริง</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
