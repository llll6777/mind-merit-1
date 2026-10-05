import React, { useState } from "react";
import { BookOpen, FileCode, Landmark, Award, Shield, Layers, Server, Compass } from "lucide-react";
import { UserProfile } from "../types";

interface DocsViewProps {
  user: UserProfile;
}

export default function DocsView({ user }: DocsViewProps) {
  const [activeDocSection, setActiveDocSection] = useState<string>("summary");

  const docTabs = [
    { id: "summary", label: "1. Executive & PRD", icon: BookOpen },
    { id: "manual", label: "2. User Manual (คู่มือใช้งาน)", icon: Compass },
    { id: "ux", label: "3. UX & Personas", icon: Layers },
    { id: "db", label: "4. DB & ER Diagram", icon: Landmark },
    { id: "api", label: "5. API Schema", icon: FileCode },
    { id: "app", label: "6. Flutter & Clean Arch", icon: Server },
    { id: "security", label: "7. Security & Checklist", icon: Shield }
  ];

  return (
    <div id="prd-documentation-root" className="grid gap-6 md:grid-cols-4 items-start">
      
      {/* Sidebar navigation tabs */}
      <div className="md:col-span-1 space-y-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm">
        <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">Documentation Hub</h4>
        {docTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeDocSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveDocSection(tab.id)}
              className={`w-full flex items-center space-x-2 px-3 py-2 text-left text-xs font-semibold rounded-xl transition-all cursor-pointer ${isActive ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Primary document pane (Takes 3/4 space) */}
      <div className="md:col-span-3 rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm max-h-[70vh] overflow-y-auto space-y-6">
        
        {activeDocSection === "summary" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Executive Summary</h3>
              <p className="text-xs text-slate-400 mt-0.5">Mind Merit Mental Well-being Platform</p>
            </div>
            
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed border-t border-slate-50 dark:border-slate-800 pt-3">
              <p>
                <strong>MIND MERIT</strong> is an advanced, enterprise-ready mental wellness platform designed to bridge the gap in counseling accessibility for teenagers, students, and working adults. By pairing cognitive self-awareness logs, scientific psychometric assessments, and stateful AI-driven therapeutic coaching, Mind Merit acts as an empathetic digital first-responder, guiding users toward positivity, micro-habits, and local psychological clinics.
              </p>

              <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4 text-[13px]">Product Requirement Document (PRD)</h4>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Bilingual (Thai/English):</strong> High-fidelity localizations for all user-facing interactions.</li>
                <li><strong>Durable Mood Logging:</strong> Tracks sleep, stress index, physical activities, gratitude logs, and raw journaling with automatic AI-driven psychologist analysis.</li>
                <li><strong>Scientific Assessments:</strong> Evaluates mental states using the WHO-5 Index, Burnout scales, and Perceived Stress Scales. It feeds outcomes to the Gemini recommendation engine.</li>
                <li><strong>Bilingual AI Buddy:</strong> Integrates an empathetic AI persona (Psychologist + Coach + Best Friend) capable of context-awareness, conversation memory, and immediate crisis escalations.</li>
                <li><strong>Meditation Academy & E-Certificates:</strong> Gamified courses with certification exams issuing digital verifiable certificate assets.</li>
                <li><strong>Anonymous Support Forums:</strong> Public-private posting boards secured by real-time AI toxicity moderators.</li>
                <li><strong>Secure Buddy Matcher:</strong> Peer connection using stress levels, roles, and interest patterns.</li>
                <li><strong>Emergency SOS:</strong> High-risk detection, 24/7 hotline call interfaces, and 5-4-3-2-1 CBT anxiety-grounding modules.</li>
              </ul>
            </div>
          </div>
        )}

        {activeDocSection === "manual" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">User Manual & Operational Workflows</h3>
              <p className="text-xs text-slate-400 mt-0.5">คู่มือและขั้นตอนการใช้งานแพลตฟอร์มอย่างละเอียด</p>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed border-t border-slate-50 dark:border-slate-800 pt-3">
              <div className="space-y-2">
                <h4 className="font-bold text-purple-700 dark:text-purple-400 text-[13px]">1. การเริ่มต้นและตั้งค่าโปรไฟล์ (Getting Started)</h4>
                <p>
                  ผู้ใช้สามารถตั้งชื่อ นามแฝง เลือกรูปภาพ Avatar เป็นอิโมจิตัวแทนอารมณ์ และเลือกบทบาทระหว่าง "นักเรียน/นักศึกษา (Student)" หรือ "วัยทำงาน (Working Adult)" เพื่อปรับคำแนะนำให้ตรงกับบริบทชีวิต สามารถเปิด-ปิดโหมดไม่ระบุตัวตน (Anonymous Mode) ได้ตลอดเวลาเพื่อความสบายใจสูงสุด
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-purple-700 dark:text-purple-400 text-[13px]">2. การบันทึกอารมณ์รายวัน (Daily Mood Logging)</h4>
                <p>
                  ใช้เวลา 1-2 นาทีต่อวัน เลือกอารมณ์ 5 ระดับ (ดีเยี่ยม, ดี, ปกติ, แย่, แย่มาก) ปรับดัชนีความเครียดสเกล 1-10 บันทึกชั่วโมงการนอนหลับ การดื่มน้ำ การออกกำลังกาย เขียน 3 สิ่งที่รู้สึกขอบคุณ (Gratitude) และความรู้สึกส่วนตัวใน Journal จากนั้นกดปุ่ม "บันทึกและขอรับการวิเคราะห์จาก AI" เพื่อรับคำแนะนำเฉพาะบุคคลและรับ +30 XP ทันที
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-purple-700 dark:text-purple-400 text-[13px]">3. รับชมคลิปวิดีโอดูแลใจ (Care Videos)</h4>
                <p>
                  คลังวิดีโอคุณภาพสูงที่คัดสรรและทดสอบแล้วว่าเปิดเล่นได้จริง 100% ไม่มีปัญหาการติดลิขสิทธิ์ฝังเล่น แบ่งตามหมวดหมู่: ผ่อนคลาย/นอนหลับ, จัดการความเครียด, ฝึกสติและสมาธิ, และสร้างแรงบันดาลใจ สามารถรับชมและรับแต้มสะสม XP ได้
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-purple-700 dark:text-purple-400 text-[13px]">4. สนทนากับคู่หู AI (AI Psychologist & Buddy)</h4>
                <p>
                  เพื่อนคู่คิด AI ที่อบอุ่นและเข้าใจง่าย ตอบกลับด้วยหลักการจิตวิทยาการปรับความคิดและพฤติกรรม (CBT) ปรึกษาได้ตลอด 24 ชม. ทั้งภาษาไทยและอังกฤษ มีปุ่มตัวอย่างคำถาม เช่น เครียดเรื่องสอบ, รู้สึกเหงา, หมดไฟในการทำงาน
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-purple-700 dark:text-purple-400 text-[13px]">5. การทำแบบประเมินสุขภาพจิต (Psychometric Assessments)</h4>
                <p>
                  ทดสอบสุขภาพจิตตามมาตรฐานวิทยาศาสตร์ 3 ชุด: แบบวัดความเครียด PSS, ดัชนีสุขภาวะทั่วไป WHO-5, และแบบวัดภาวะหมดไฟ (Burnout Inventory) ทราบระดับความเสี่ยงและรับแผนพัฒนาตนเองรายบุคคลโดย AI พร้อมรับ +50 XP
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-purple-700 dark:text-purple-400 text-[13px]">6. สถาบันการเรียนรู้ & เกียรติบัตรดิจิทัล (Academy & Certificates)</h4>
                <p>
                  เรียนรู้หลักสูตรดูแลใจ ฝึกเทคนิคการหายใจแบบ Box Breathing (4-4-4-4) ด้วยแอนิเมชันขยาย-หดตัวตามจังหวะ ทำแบบทดสอบท้ายบทเรียนเพื่อรับใบประกาศนียบัตรอิเล็กทรอนิกส์ที่มีรหัสเฉพาะและ QR Code ยืนยันได้จริง
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-purple-700 dark:text-purple-400 text-[13px]">7. ชุมชนสนับสนุน & ระบบจับคู่บัดดี้ (Community & Buddy Matching)</h4>
                <p>
                  จับคู่เพื่อนหนุนใจตามระดับความเครียดและเป้าหมาย โพสต์ระบายหรือให้กำลังใจในกระดานสาธารณะแบบนิรนาม พร้อมระบบ AI ตรวจจับคำพูดไม่เหมาะสม (Toxicity Moderator) และโหวตโพลประจำวัน
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-rose-600 dark:text-rose-400 text-[13px]">8. เมนูช่วยเหลือฉุกเฉิน (SOS Emergency Directory)</h4>
                <p>
                  ปุ่ม SOS สีแดงที่เข้าถึงได้ตลอดเวลาจากแถบนำทางด้านบน ประกอบด้วยปุ่มระงับสติอารมณ์ด่วน เทคนิคดึงสติ 5-4-3-2-1 และเบอร์โทรสายด่วนสุขภาพจิตไทย (เช่น 1323) ที่สามารถโทรออกได้ทันที
                </p>
              </div>
            </div>
          </div>
        )}

        {activeDocSection === "ux" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">UX Research & User Journeys</h3>
              <p className="text-xs text-slate-400 mt-0.5">Empirical Insights & Personas</p>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed border-t border-slate-50 dark:border-slate-800 pt-3">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-[13px]">User Persona A: Alisa (Sophomore Student)</h4>
                <p className="mt-1">
                  <strong>Age:</strong> 19 | <strong>Problem:</strong> Exam anxiety, overthinking, social media fatigue, and loneliness.
                  <br />
                  <strong>Journey:</strong> Alisa feels severe stress during final exam week. She logs her sleep (4 Hrs) and mood on Mind Merit. The system prompts her to try the Box Breathing guide and matches her with Pete (a support buddy). She takes a 5-minute breathing break, reducing her anxiety instantly.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-[13px]">User Persona B: Pete (Working Adult)</h4>
                <p className="mt-1">
                  <strong>Age:</strong> 27 | <strong>Problem:</strong> Career pressure, burnout, low motivation, and insomnia.
                  <br />
                  <strong>Journey:</strong> Pete feels drained and takes the Mind Merit Burnout Questionnaire. His score is Moderate-High. The platform loads custom AI suggestions recommending the "Inner Critic" academy course. He passes the quiz, receives his verified E-Certificate, and regains an active, mindful sense of accomplishment.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-[13px]">Information Architecture</h4>
                <p className="mt-1">
                  Single-view central gateway serving modular tabs: Dashboard &rarr; Mood Log &rarr; AI Buddy Chat &rarr; Assessments Center &rarr; Learning Academy &rarr; Support Community &rarr; Admin Panel &rarr; SOS Portal.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeDocSection === "db" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Database Schema & Relational DDL</h3>
              <p className="text-xs text-slate-400 mt-0.5">PostgreSQL Database Architecture</p>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed border-t border-slate-50 dark:border-slate-800 pt-3">
              <p>Below is the structured relational SQL database schema optimized with appropriate constraints and indexing for Mind Merit:</p>
              
              <pre className="p-4 bg-slate-900 text-purple-300 rounded-xl overflow-x-auto font-mono text-[10px] leading-relaxed">
{`-- Users Table
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('student', 'adult')),
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak INTEGER DEFAULT 0,
    language VARCHAR(5) DEFAULT 'en',
    theme VARCHAR(10) DEFAULT 'light',
    pdpa_consent BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mood Check-ins
CREATE TABLE mood_checkins (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL,
    mood VARCHAR(20) NOT NULL,
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    sleep_hours DECIMAL(4,2),
    exercise_mins INTEGER,
    water_ml INTEGER,
    study_work_status VARCHAR(50),
    gratitude_statement TEXT,
    journal_text TEXT,
    ai_analysis_feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certificates Issued
CREATE TABLE certificates (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    course_name_en VARCHAR(200) NOT NULL,
    course_name_th VARCHAR(200) NOT NULL,
    date_issued TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    certificate_hash VARCHAR(64) UNIQUE NOT NULL,
    verification_url VARCHAR(255) NOT NULL,
    digital_signature TEXT NOT NULL
);

-- Indexes for fast analytics queries
CREATE INDEX idx_mood_checkins_user_date ON mood_checkins(user_id, checkin_date);
CREATE INDEX idx_users_xp ON users(xp DESC);`}
              </pre>
            </div>
          </div>
        )}

        {activeDocSection === "api" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">API Gateway Architecture</h3>
              <p className="text-xs text-slate-400 mt-0.5">REST API Design Specs</p>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed border-t border-slate-50 dark:border-slate-800 pt-3">
              <p>Mind Merit FastAPI and Express backends expose standard, clean RESTful endpoints:</p>

              <div className="space-y-3">
                <div className="p-3 border border-slate-50 rounded-lg dark:border-slate-800">
                  <span className="px-2 py-0.5 bg-purple-500 text-white rounded text-[10px] font-bold">POST</span>
                  <span className="ml-2 font-mono font-bold text-slate-700 dark:text-slate-200">/api/gemini/chat</span>
                  <p className="mt-1 text-slate-400 text-[10px]">Exposes stateful proxy conversational gateway to gemini-3.5-flash with psychologist cognitive instructions.</p>
                </div>

                <div className="p-3 border border-slate-50 rounded-lg dark:border-slate-800">
                  <span className="px-2 py-0.5 bg-purple-500 text-white rounded text-[10px] font-bold">POST</span>
                  <span className="ml-2 font-mono font-bold text-slate-700 dark:text-slate-200">/api/gemini/analyze-mood</span>
                  <p className="mt-1 text-slate-400 text-[10px]">Takes user raw mood, stress levels, exercise, and journal text, returning a structured therapeutic analysis.</p>
                </div>

                <div className="p-3 border border-slate-50 rounded-lg dark:border-slate-800">
                  <span className="px-2 py-0.5 bg-purple-500 text-white rounded text-[10px] font-bold">POST</span>
                  <span className="ml-2 font-mono font-bold text-slate-700 dark:text-slate-200">/api/gemini/recommendations</span>
                  <p className="mt-1 text-slate-400 text-[10px]">Accepts psychometric scores, returning three bulleted actionable daily goals with custom titles.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeDocSection === "app" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Flutter Mobile Clean Architecture</h3>
              <p className="text-xs text-slate-400 mt-0.5">Enterprise Mobile Framework Code Pattern</p>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed border-t border-slate-50 dark:border-slate-800 pt-3">
              <p>Mind Merit's Flutter frontend is organized using strict Clean Architecture + MVVM guidelines:</p>

              <pre className="p-4 bg-slate-900 text-purple-300 rounded-xl overflow-x-auto font-mono text-[10px] leading-relaxed">
{`lib/
├── core/                  # Share services, themes, localizations
│   ├── network/           # API interceptors & JWT handling
│   ├── errors/            # Custom Exceptions
│   └── constants/         # Pastel color schemes & Assets
├── data/                  # Data Layer (Repositoy implementations)
│   ├── models/            # JSON mapping models
│   ├── datasources/       # Remote (FastAPI) & Local (SQLite)
│   └── repositories/      # Concrete repository mappings
├── domain/                # Domain Layer (Pure business logic)
│   ├── entities/          # Pure entities models
│   ├── repositories/      # Repository Interfaces
│   └── usecases/          # GetMoodLogs, SubmitAssessment, GetAIChat
└── presentation/          # UI Layer (MVVM)
    ├── views/             # Screens (Dashboard, ChatView, SOSView)
    ├── viewmodels/        # ChangeNotifiers / BLoC state managers
    └── widgets/           # Resusable custom buttons & charts`}
              </pre>
            </div>
          </div>
        )}

        {activeDocSection === "security" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Security Architecture & Deployment Checklist</h3>
              <p className="text-xs text-slate-400 mt-0.5">Production Launch Security Framework</p>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed border-t border-slate-50 dark:border-slate-800 pt-3">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-[13px]">Security protocols</h4>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li><strong>JWT Token Expiry:</strong> Standard OAuth 2.0 bearers on FastAPI with automatic 15-minute token expiry.</li>
                  <li><strong>PDPA Consent Management:</strong> Full control for Thai users to clear their mood history or audit trails.</li>
                  <li><strong>Toxicity Filters:</strong> Automated regex and Gemini analysis on shared posts to prevent online bullying.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-[13px]">Production Checklist</h4>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>[✔] Validate dual-language translation bindings in EN and TH.</li>
                  <li>[✔] Implement Gemini API key lazy-loading to secure the development server.</li>
                  <li>[✔] Ensure perfect responsive rendering for desktop, tablet, and phone sizes.</li>
                  <li>[✔] Verify verifiable QR codes and digital certificates on completed quizzes.</li>
                  <li>[✔] Configure quick SOS hotlines and immediate panic cycle fail-safes.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
