import React, { useState } from "react";
import {
  BookOpen,
  LayoutDashboard,
  Video,
  Bot,
  ClipboardList,
  GraduationCap,
  Users,
  ShieldAlert,
  Search,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
  Zap,
  HelpCircle,
  Shield,
  ChevronDown,
  ChevronUp,
  HeartHandshake,
  Smile,
  Compass,
  FileCheck
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
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const categories = [
    { id: "all", label: isTh ? "ทั้งหมด" : "All Topics" },
    { id: "start", label: isTh ? "เริ่มต้นใช้งาน" : "Getting Started" },
    { id: "wellness", label: isTh ? "เครื่องมือดูแลใจ" : "Mind Tools" },
    { id: "academy", label: isTh ? "คอร์ส & เกียรติบัตร" : "Academy & Certs" },
    { id: "community", label: isTh ? "ชุมชน & บัดดี้" : "Community & Buddy" },
    { id: "safety", label: isTh ? "ความปลอดภัย & SOS" : "Safety & SOS" },
    { id: "xp", label: isTh ? "เลเวล & XP" : "Levels & XP" },
    { id: "faq", label: isTh ? "คำถามพบบ่อย" : "FAQs" },
  ];

  const quickShortcuts = [
    {
      title: isTh ? "บันทึกอารมณ์รายวัน" : "Daily Mood Log",
      desc: isTh ? "สะท้อนความรู้สึก รับวิเคราะห์จาก AI" : "Reflect & get AI feedback",
      icon: BookOpen,
      color: "from-pink-500 to-rose-400",
      tab: "moodCheck"
    },
    {
      title: isTh ? "วิดีโอเสริมพลังใจ" : "Care Videos",
      desc: isTh ? "คัดสรรคลิปดูได้จริง 100%" : "Curated watchable videos",
      icon: Video,
      color: "from-amber-400 to-yellow-500",
      tab: "videos"
    },
    {
      title: isTh ? "คุยกับคู่หู AI" : "AI Psychologist Buddy",
      desc: isTh ? "ปรึกษาได้ 24 ชม. ไม่ตัดสิน" : "24/7 empathetic listener",
      icon: Bot,
      color: "from-emerald-400 to-teal-500",
      tab: "aiChat"
    },
    {
      title: isTh ? "แบบประเมินสุขภาพจิต" : "Scientific Assessments",
      desc: isTh ? "PSS, WHO-5, วัดภาวะหมดไฟ" : "WHO-5, Stress & Burnout",
      icon: ClipboardList,
      color: "from-sky-400 to-blue-500",
      tab: "assessments"
    },
    {
      title: isTh ? "ฝึกหายใจ & เกียรติบัตร" : "Academy & Certificates",
      desc: isTh ? "Box Breathing & E-Cert" : "Interactive breathing & Certs",
      icon: GraduationCap,
      color: "from-amber-500 to-orange-400",
      tab: "academy"
    },
    {
      title: isTh ? "ช่วยเหลือฉุกเฉิน (SOS)" : "Emergency SOS",
      desc: isTh ? "เทคนิค 5-4-3-2-1 และสายด่วน" : "5-4-3-2-1 grounding & hotlines",
      icon: ShieldAlert,
      color: "from-rose-500 to-red-500",
      action: onOpenSOS
    },
  ];

  const getStepColorTheme = (stepNumber: string) => {
    switch (stepNumber) {
      case "01": // Profile Setup (Sky Blue)
      case "05": // Assessments (Sky Blue)
        return {
          bg: "bg-sky-50 dark:bg-sky-950/30",
          text: "text-sky-600 dark:text-sky-400",
          border: "border-sky-100 dark:border-sky-900/30",
          badge: "bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200/60",
          hoverBorder: "hover:border-sky-200 dark:hover:border-sky-800/50",
          btn: "bg-sky-50 hover:bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300"
        };
      case "02": // Mood Check (Blossom Pink)
      case "07": // Community (Blossom Pink)
        return {
          bg: "bg-pink-50 dark:bg-pink-950/30",
          text: "text-pink-600 dark:text-pink-400",
          border: "border-pink-100 dark:border-pink-900/30",
          badge: "bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 border border-pink-200/60",
          hoverBorder: "hover:border-pink-200 dark:hover:border-pink-800/50",
          btn: "bg-pink-50 hover:bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300"
        };
      case "03": // Videos (Sunlight Yellow)
      case "06": // Academy & Breathing (Sunlight Yellow)
        return {
          bg: "bg-amber-50 dark:bg-amber-950/30",
          text: "text-amber-600 dark:text-amber-400",
          border: "border-amber-100 dark:border-amber-900/30",
          badge: "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/60",
          hoverBorder: "hover:border-amber-200 dark:hover:border-amber-800/50",
          btn: "bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
        };
      case "04": // AI Buddy (Mint Green)
      case "08": // SOS / Safety (Rose)
      default:
        return stepNumber === "08" ? {
          bg: "bg-rose-50 dark:bg-rose-950/30",
          text: "text-rose-600 dark:text-rose-400",
          border: "border-rose-100 dark:border-rose-900/30",
          badge: "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200/60",
          hoverBorder: "hover:border-rose-200 dark:hover:border-rose-800/50",
          btn: "bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
        } : {
          bg: "bg-emerald-50 dark:bg-emerald-950/30",
          text: "text-emerald-600 dark:text-emerald-400",
          border: "border-emerald-100 dark:border-emerald-900/30",
          badge: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60",
          hoverBorder: "hover:border-emerald-200 dark:hover:border-emerald-800/50",
          btn: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
        };
    }
  };

  const steps = [
    {
      number: "01",
      category: "start",
      icon: Smile,
      badge: isTh ? "เริ่มต้นใช้งาน" : "Step 1",
      title: isTh ? "ตั้งค่าโปรไฟล์และเลือกอวตารของคุณ" : "Set Up Your Profile & Avatar",
      desc: isTh 
        ? "ปรับแต่งชื่อ นามแฝง เลือกรูปอิโมจิอวตาร และระบุบทบาทของคุณ (นักเรียน/นักศึกษา หรือ วัยทำงาน) เพื่อให้ระบบแนะนำเนื้อหาและแบบประเมินได้ตรงกับสภาวะชีวิตของคุณมากที่สุด พร้อมเปิดโหมดไม่เปิดเผยตัวตน (Anonymous Mode) ได้ตลอดเวลา"
        : "Customize your nickname, choose an expressive emoji avatar, and set your role (Student or Working Adult). This helps MIND MERIT tailor recommendations and assessments to your lifestyle.",
      tips: [
        isTh ? "คลิกที่รูปโปรไฟล์มุมขวาบน หรือที่การ์ดโปรไฟล์ในหน้าแดชบอร์ดเพื่อแก้ไข" : "Click your avatar in the top-right header or dashboard banner to edit.",
        isTh ? "สามารถสลับภาษาไทย / English ได้ง่ายๆ เพียงกดปุ่มรูปโลกที่เมนูด้านบน" : "Switch between Thai and English anytime using the language toggle.",
        isTh ? "รองรับโหมดกลางคืน (Dark Mode) เพื่อความสบายตาในเวลากลางคืน" : "Toggle Dark Mode for gentle night viewing."
      ],
      actionLabel: isTh ? "ไปตั้งค่าโปรไฟล์" : "Open Profile Settings",
      onAction: onOpenProfile
    },
    {
      number: "02",
      category: "wellness",
      icon: BookOpen,
      badge: isTh ? "บันทึกอารมณ์" : "Step 2",
      title: isTh ? "เช็คอินอารมณ์รายวัน & รับการวิเคราะห์จาก AI" : "Daily Mood Check-in & AI Counselor Analysis",
      desc: isTh
        ? "การตระหนักรู้ในตนเองเป็นก้าวแรกของสุขภาพจิตที่ดี เพียงใช้เวลา 1-2 นาทีในแต่ละวัน บันทึกระดับอารมณ์ ความเครียด (สเกล 1-10) ชั่วโมงนอนหลับ การดื่มน้ำ และการออกกำลังกาย พร้อมฝึกเขียน 3 สิ่งที่รู้สึกขอบคุณ (Gratitude) และความในใจ"
        : "Self-awareness is the cornerstone of mental resilience. Spend 1-2 minutes daily logging your mood, stress level (1-10), sleep hours, water intake, gratitude reflections, and private journal notes.",
      tips: [
        isTh ? "กดปุ่ม 'บันทึกข้อมูลและขอรับการวิเคราะห์จาก AI' เพื่อรับคำแนะนำเชิงบวกเฉพาะบุคคลทันที" : "Click 'Log Check-in & Request AI Analysis' to receive custom psychologist feedback.",
        isTh ? "รับทันที +30 XP ต่อการบันทึกแต่ละครั้ง ช่วยสะสมเลเวลและเหรียญรางวัล" : "Earn +30 XP per log, advancing your level and unlocking streak badges.",
        isTh ? "ระบบจะนำข้อมูลมาพล็อตกราฟแนวโน้มอารมณ์และความเครียดในหน้าแดชบอร์ดให้คุณเห็นภาพรวม" : "Check the dashboard to visualize your weekly stress and mood trend line."
      ],
      actionLabel: isTh ? "เริ่มบันทึกอารมณ์วันนี้" : "Log Today's Mood",
      tab: "moodCheck"
    },
    {
      number: "03",
      category: "wellness",
      icon: Video,
      badge: isTh ? "วิดีโอเสริมใจ" : "Step 3",
      title: isTh ? "ชมวิดีโอดูแลใจและฝึกสมาธิ (เล่นได้จริง 100%)" : "Watch Curated Mental Health & Meditation Videos",
      desc: isTh
        ? "รวบรวมคลิปวิดีโอคุณภาพสูงที่คัดสรรมาแล้วว่าสามารถเปิดรับชมได้อย่างราบรื่น 100% ไม่มีปัญหาการติดลิขสิทธิ์ฝังเล่น แบ่งเป็นหมวดหมู่: ผ่อนคลายก่อนนอน, จัดการความเครียด, ฝึกสติและสมาธิ, และสร้างแรงบันดาลใจ"
        : "A hand-curated library of 100% playable, embed-verified mental wellness videos, organized into Sleep & Calm, Stress Relief, Mindfulness, and Inspiration categories.",
      tips: [
        isTh ? "เลือกฟิลเตอร์หมวดหมู่เพื่อค้นหาวิดีโอที่ตรงกับความรู้สึกในขณะนั้น" : "Filter by category to find content matching your current mood.",
        isTh ? "สามารถขยายเต็มจอเพื่อสร้างบรรยากาศสงบไร้สิ่งรบกวน" : "Expand to fullscreen for an immersive relaxation experience.",
        isTh ? "กดปุ่ม 'รับ +20 XP จากการชมคลิป' เพื่อรับคะแนนสะสมพัฒนาตนเอง" : "Earn +20 XP upon watching to reinforce healthy mindfulness habits."
      ],
      actionLabel: isTh ? "ดูวิดีโอดูแลใจ" : "Browse Care Videos",
      tab: "videos"
    },
    {
      number: "04",
      category: "wellness",
      icon: Bot,
      badge: isTh ? "คู่หู AI" : "Step 4",
      title: isTh ? "ปรึกษาคู่หู AI นักจิตวิทยาใจดี (อบอุ่น ไม่ตัดสิน 24 ชม.)" : "Chat with Your AI Psychologist & Caring Buddy",
      desc: isTh
        ? "หากมีเรื่องไม่สบายใจ เครียดเรื่องเรียน การสอบ การทำงาน หรือรู้สึกโดดเดี่ยว คุณสามารถระบายหรือปรึกษาคู่หู AI ของเราได้ตลอดเวลา โดย AI จะตอบด้วยความเข้าใจ อบอุ่น และใช้หลักจิตวิทยาปรับความคิดและพฤติกรรม (CBT) ที่สร้างสรรค์"
        : "Whenever you feel overwhelmed, anxious about exams, lonely, or burnt out, chat with our empathetic AI Buddy. It blends supportive friendship with cognitive behavioral coaching.",
      tips: [
        isTh ? "มีปุ่มตัวอย่างคำถาม เช่น 'เครียดเรื่องสอบ', 'รู้สึกเหงา', 'หมดไฟ' ให้กดเริ่มต้นได้ทันที" : "Use one-click prompt suggestions like exam stress or feeling lonely.",
        isTh ? "พิมพ์คุยได้อย่างเป็นธรรมชาติทั้งภาษาไทยและภาษาอังกฤษ" : "Converses fluently in both Thai and English.",
        isTh ? "มีระบบตรวจจับข้อความวิกฤต พร้อมเชื่อมต่อไปยังเมนูช่วยเหลือฉุกเฉิน SOS อัตโนมัติ" : "Includes safety triggers that direct high-distress messages to 24/7 crisis hotlines."
      ],
      actionLabel: isTh ? "เริ่มคุยกับคู่หู AI" : "Start Conversation",
      tab: "aiChat"
    },
    {
      number: "05",
      category: "wellness",
      icon: ClipboardList,
      badge: isTh ? "ประเมินสุขภาพจิต" : "Step 5",
      title: isTh ? "ทำแบบประเมินสุขภาพจิตมาตรฐานทางวิทยาศาสตร์" : "Take Standardized Psychometric Assessments",
      desc: isTh
        ? "ประเมินสุขภาพจิตอย่างแม่นยำด้วย 3 เครื่องมือวัดที่ได้รับการยอมรับระดับสากล: แบบวัดความเครียด PSS, ดัชนีสุขภาวะทั่วไป WHO-5, และแบบประเมินภาวะหมดไฟ (Burnout Inventory) เพื่อทราบระดับความเสี่ยงของตนเอง"
        : "Evaluate your mental state with gold-standard psychological surveys: Perceived Stress Scale (PSS), WHO-5 Well-Being Index, and Burnout Inventory.",
      tips: [
        isTh ? "ตอบคำถามตามความเป็นจริงในช่วง 1-2 สัปดาห์ที่ผ่านมา" : "Answer honestly based on how you felt over the past 1-2 weeks.",
        isTh ? "ระบบจะคำนวณคะแนน ระดับความเสี่ยง (ต่ำ/ปานกลาง/สูง) พร้อมสร้างแผนพัฒนาตนเองรายบุคคลโดย AI" : "Receive instant score calculation, risk level, and AI-tailored daily micro-goals.",
        isTh ? "ทำแบบประเมินสำเร็จได้รับ +50 XP และปลดล็อคเหรียญตราพิเศษ" : "Completing an assessment rewards +50 XP and unlocks achievement badges."
      ],
      actionLabel: isTh ? "ทำแบบประเมินสุขภาพจิต" : "Take an Assessment",
      tab: "assessments"
    },
    {
      number: "06",
      category: "academy",
      icon: GraduationCap,
      badge: isTh ? "เรียนรู้ & เกียรติบัตร" : "Step 6",
      title: isTh ? "ฝึกหายใจ Box Breathing และรับเกียรติบัตรดิจิทัล" : "Box Breathing & Earn Verified E-Certificates",
      desc: isTh
        ? "เข้าเรียนคอร์สสุขภาพจิต เช่น 'การเอาชนะความเครียดและการปรับความคิด', 'การรับมือภาวะหมดไฟ' พร้อมใช้งานเครื่องมือนำฝึกหายใจ Box Breathing (4 วินาทีเข้า - 4 วินาทีกลั้น - 4 วินาทีออก - 4 วินาทีพัก) และทำแบบทดสอบเพื่อรับเกียรติบัตรยืนยันได้จริง"
        : "Enroll in structured wellness courses, utilize the interactive Box Breathing rhythm animator, pass the certification quiz, and generate verifiable digital completion certificates.",
      tips: [
        isTh ? "ฝึกหายใจตามวงกลมแอนิเมชันเพื่อปรับอัตราการเต้นของหัวใจและลดฮอร์โมนความเครียดใน 3 นาที" : "Follow the pulsating visual breathing guide to quickly soothe your nervous system.",
        isTh ? "ทำแบบทดสอบให้ได้คะแนนเต็มเพื่อดาวน์โหลดเกียรติบัตรที่มีรหัสเฉพาะและ QR Code ตรวจสอบได้" : "Score 100% on the quiz to claim your credential with unique ID and digital verification stamp.",
        isTh ? "เกียรติบัตรสามารถนำไปแนบแฟ้มสะสมผลงาน (Portfolio) ได้" : "Use earned certificates for academic and professional portfolios."
      ],
      actionLabel: isTh ? "เข้าสู่สถาบันการเรียนรู้" : "Explore Academy",
      tab: "academy"
    },
    {
      number: "07",
      category: "community",
      icon: Users,
      badge: isTh ? "ชุมชน & บัดดี้" : "Step 7",
      title: isTh ? "เชื่อมต่อกับเพื่อนคู่หูบัดดี้ & แลกเปลี่ยนกำลังใจ" : "Anonymous Support Community & Peer Buddy Matching",
      desc: isTh
        ? "คุณไม่ต้องเผชิญปัญหาเพียงลำพัง! ระบบจับคู่บัดดี้จะค้นหาเพื่อนที่มีระดับความเครียดและเป้าหมายใกล้เคียงกัน เพื่อคอยส่งพลังใจให้แก่กัน พร้อมกระดานชุมชนที่โพสต์ข้อความสนับสนุนกันได้แบบไม่เปิดเผยตัวตน"
        : "You are not alone. Our intelligent buddy matching connects you with peers sharing similar stress profiles and roles. Share uplifting thoughts on our AI-moderated anonymous board.",
      tips: [
        isTh ? "กดปุ่ม 'ค้นหาคู่หูบัดดี้คอยหนุนใจ' เพื่อเริ่มจับคู่เพื่อน" : "Click 'Find a Support Buddy' to find a supportive companion.",
        isTh ? "มีระบบ AI ตรวจจับคำหยาบและข้อความกลั่นแกล้ง (Toxicity Moderator) เพื่อให้พื้นที่นี้ปลอดภัย 100%" : "Equipped with AI content moderation to keep interactions kind, constructive, and safe.",
        isTh ? "ร่วมโหวตโพลประจำวันเพื่อดูความคิดเห็นของเพื่อนๆ ในคอมมูนิตี้" : "Participate in daily well-being polls to reflect together."
      ],
      actionLabel: isTh ? "ไปยังหน้าชุมชน" : "Visit Community",
      tab: "community"
    },
    {
      number: "08",
      category: "safety",
      icon: ShieldAlert,
      badge: isTh ? "ช่วยเหลือฉุกเฉิน" : "Step 8",
      title: isTh ? "เมนูช่วยเหลือฉุกเฉิน (SOS) และเทคนิคดึงสติ 5-4-3-2-1" : "Emergency SOS Support & 5-4-3-2-1 Grounding Method",
      desc: isTh
        ? "หากคุณหรือคนใกล้ชิดกำลังรู้สึกดิ่ง วิตกกังวลอย่างรุนแรง หรือมีภาวะตื่นตระหนก (Panic Attack) สามารถกดปุ่ม SOS สีแดงที่แถบด้านบนได้ตลอดเวลา เพื่อใช้ปุ่มช่วยสงบใจ หรือปฏิบัติตามแบบฝึกหัด 5-4-3-2-1 และดูเบอร์สายด่วนโทรฟรี 24 ชม."
        : "If you experience severe distress or panic, click the red SOS button at any time. Access the quick calming panic sequence, the 5-4-3-2-1 sensory grounding exercise, and 24/7 crisis hotline directory.",
      tips: [
        isTh ? "ปุ่ม SOS อยู่มุมขวาบนของทุกหน้า เข้าถึงได้ในคลิกเดียวตลอดเวลา" : "The red SOS button is permanently anchored in the top header for instant access.",
        isTh ? "เทคนิค 5-4-3-2-1 ช่วยดึงสมองกลับมาสู่ปัจจุบันขณะได้อย่างรวดเร็ว" : "The 5-4-3-2-1 technique anchors your mind by engaging your 5 physical senses.",
        isTh ? "รวบรวมเบอร์สายด่วนสุขภาพจิตไทย (1323, 1667, สะมาริตันส์ ฯลฯ) ที่กดโทรออกได้ทันที" : "One-tap direct calling to accredited mental health hotlines and hospitals."
      ],
      actionLabel: isTh ? "เปิดเมนูช่วยเหลือฉุกเฉิน" : "Open SOS Portal",
      action: onOpenSOS
    },
  ];

  const xpRules = [
    { activity: isTh ? "เช็คอินอารมณ์ประจำวัน" : "Daily Mood Check-in", xp: "+30 XP", icon: "📝" },
    { activity: isTh ? "ทำแบบประเมินสุขภาพจิต (PSS / WHO-5 / Burnout)" : "Complete Psychometric Assessment", xp: "+50 XP", icon: "📋" },
    { activity: isTh ? "ฝึกหายใจ Box Breathing ครบ 5 นาที" : "5-min Box Breathing Session", xp: "+50 XP", icon: "🫁" },
    { activity: isTh ? "สอบผ่านคอร์ส & รับเกียรติบัตรดิจิทัล" : "Pass Course Quiz & Earn Certificate", xp: "+100 XP", icon: "🎓" },
    { activity: isTh ? "รับชมวิดีโอดูแลใจจนจบ" : "Watch Care / Meditation Video", xp: "+20 XP", icon: "🎬" },
    { activity: isTh ? "สนทนากับคู่หู AI และสะท้อนความคิด" : "Reflective AI Chat Session", xp: "+15 XP", icon: "🤖" },
    { activity: isTh ? "เข้าใช้งานแพลตฟอร์มเพิ่มสถิติ Streak" : "Daily Login & Streak Bonus", xp: "+10 XP", icon: "🔥" },
  ];

  const faqs = [
    {
      q: isTh ? "ข้อมูลส่วนตัวและการบันทึกอารมณ์ของฉันปลอดภัยหรือไม่?" : "Is my personal data and mood history private and secure?",
      a: isTh 
        ? "ปลอดภัยอย่างยิ่งครับ ข้อมูลทั้งหมดถูกจัดเก็บบนอุปกรณ์ของคุณอย่างเป็นส่วนตัว และเมื่อคุณโพสต์ในชุมชนหรือจับคู่บัดดี้ คุณสามารถเปิด 'โหมดไม่เปิดเผยตัวตน (Anonymous Mode)' ได้เสมอ เพื่อไม่ให้ใครเห็นชื่อจริงของคุณ"
        : "Yes, completely secure. Your check-in records are kept on your personal client storage. When using the community or buddy matching, Anonymous Mode conceals your real name."
    },
    {
      q: isTh ? "MIND MERIT สามารถใช้วินิจฉัยโรคทางจิตเวชแทนแพทย์ได้หรือไม่?" : "Can MIND MERIT diagnose mental illnesses in place of a doctor?",
      a: isTh 
        ? "ไม่ได้ครับ MIND MERIT เป็นเครื่องมือส่งเสริมสุขภาพจิต การตระหนักรู้ในตนเอง และการดูแลตนเองเบื้องต้น (Self-Care & Cognitive Coaching) ไม่สามารถทดแทนการวินิจฉัยหรือการรักษาทางการแพทย์ หากคุณมีอาการรุนแรง ขอแนะนำให้ใช้เมนู SOS เพื่อปรึกษาแพทย์หรือโทรสายด่วน 1323"
        : "No. MIND MERIT is a self-care companion and psychoeducational tool, not a clinical diagnostic system. For severe distress, please consult licensed medical specialists or call 1323 via our SOS page."
    },
    {
      q: isTh ? "เกียรติบัตรอิเล็กทรอนิกส์ (E-Certificate) นำไปใช้อะไรได้บ้าง?" : "How can I use the digital completion E-Certificate?",
      a: isTh 
        ? "เกียรติบัตรที่ได้รับหลังผ่านแบบทดสอบในสถาบันการเรียนรู้ มาพร้อมรหัสตรวจสอบเฉพาะ (Certificate ID) และตราประทับดิจิทัล คุณสามารถดาวน์โหลด แคปหน้าจอ หรือนำไปแนบเป็นหลักฐานการพัฒนาตนเองในแฟ้มสะสมผลงาน (Portfolio) หรือ CV ได้"
        : "Certificates come with verifiable unique IDs and digital stamps. You can print them or attach them as evidence of soft-skill & wellness development in your academic portfolio or resume."
    },
    {
      q: isTh ? "หากเปิดคลิปวิดีโอดูแลใจไม่ได้ ต้องทำอย่างไร?" : "What if a video doesn't play?",
      a: isTh 
        ? "ทีมงานได้อัปเดตและคัดกรองลิงก์วิดีโอทั้งหมดให้เป็นคลิปที่อนุญาตให้ฝังเล่นผ่านเว็บไซต์ได้ 100% เรียบร้อยแล้ว หากพบปัญหาการเชื่อมต่อ ให้ตรวจสอบสัญญาณอินเทอร์เน็ต หรือกดรีเฟรชหน้าเว็บหนึ่งครั้ง"
        : "All videos in the library have been embed-verified for seamless playback. If an issue occurs, please verify your internet connection or reload the page."
    },
    {
      q: isTh ? "จะเพิ่มเลเวลและปลดล็อคเหรียญรางวัล (Badges) ได้อย่างไร?" : "How do I level up and unlock achievement badges?",
      a: isTh 
        ? "คุณจะได้รับแต้ม XP ทุกครั้งที่บันทึกอารมณ์ ทำแบบประเมิน ฝึกหายใจ หรือเรียนจบคอร์ส เมื่อสะสม XP ครบตามเกณฑ์ เลเวลของคุณจะเพิ่มขึ้นโดยอัตโนมัติ และจะได้รับเหรียญตรา เช่น 'ผู้พิชิตความเครียด', 'นักเช็คอินต่อเนื่อง' เป็นต้น"
        : "You earn XP for every wellness activity. As XP accumulates, your Level advances automatically, unlocking special milestone badges like Streak Champion and Stress Warrior."
    }
  ];

  const filteredSteps = steps.filter((step) => {
    const matchesCategory = activeCategory === "all" || step.category === activeCategory;
    const matchesSearch = searchQuery === "" || 
      step.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      step.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredFaqs = faqs.filter((faq) => {
    return searchQuery === "" || 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div id="user-guide-root" className="space-y-8 animate-fadeIn">
      
      {/* 1. Hero Banner (Sky Blue, Teal, Indigo pastel harmony) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-sky-600 via-teal-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl shadow-sky-900/10">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-semibold text-sky-100 border border-white/20">
            <Compass className="h-3.5 w-3.5" />
            <span>{isTh ? "คู่มือการใช้งานแพลตฟอร์มฉบับสมบูรณ์" : "Complete MIND MERIT User Manual"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.guide.title}
          </h2>

          <p className="text-sm sm:text-base text-sky-100 leading-relaxed max-w-2xl">
            {t.guide.subtitle} {isTh 
              ? "ไม่ว่าคุณจะต้องการคลายเครียดจากการสอบ ปรึกษาคู่หู AI หรือฝึกสมาธิเพื่อความสงบใจ เราพร้อมอยู่เคียงข้างคุณทุกช่วงเวลา" 
              : "Whether you need to relieve stress, talk to an AI buddy, or practice guided breathing, we've got you covered."}
          </p>

          {/* Search Bar */}
          <div className="pt-2">
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.guide.searchPlaceholder}
                className="w-full rounded-2xl bg-white/95 dark:bg-slate-900/95 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />
        <div className="absolute right-20 top-0 h-48 w-48 rounded-full bg-teal-400/20 blur-2xl pointer-events-none" />
      </div>

      {/* 2. Quick Jump Grid (Shortcuts to main modules) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {t.guide.quickStartTitle}
          </h3>
          <span className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">
            {isTh ? "คลิกเพื่อไปยังฟีเจอร์ทันที" : "Click to jump directly"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickShortcuts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  if (item.action) item.action();
                  else if (item.tab) onNavigate(item.tab);
                }}
                className="flex flex-col items-center text-center p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer group"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr ${item.color} text-white shadow-sm mb-2 group-hover:rotate-6 transition-transform`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-2 mt-0.5">
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Filter Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-sky-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 4. Step-by-Step Instructions */}
      {activeCategory !== "faq" && activeCategory !== "xp" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-sky-500" />
              <span>{isTh ? "ขั้นตอนการใช้งานทีละสเต็ป" : "Step-by-Step Guide"}</span>
            </h3>
            <span className="text-xs text-slate-400">
              {filteredSteps.length} {isTh ? "หัวข้อ" : "topics"}
            </span>
          </div>

          <div className="space-y-4">
            {filteredSteps.map((step, index) => {
              const StepIcon = step.icon;
              const theme = getStepColorTheme(step.number);
              return (
                <div
                  key={index}
                  className={`rounded-3xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm ${theme.hoverBorder} transition-all`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    
                    {/* Left Icon & Content */}
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex flex-col items-center shrink-0">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${theme.bg} ${theme.text} font-extrabold text-sm border ${theme.border} shadow-xs`}>
                          <StepIcon className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 mt-1.5 font-mono">
                          {step.number}
                        </span>
                      </div>

                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full ${theme.badge} text-[10px] font-bold`}>
                            {step.badge}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
                            {step.title}
                          </h4>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {step.desc}
                        </p>

                        {/* Tips list */}
                        <div className="mt-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-3.5 space-y-1.5 border border-slate-100/60 dark:border-slate-800/60">
                          <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
                            💡 {isTh ? "เกร็ดเคล็ดลับการใช้งาน:" : "Pro Tips:"}
                          </span>
                          {step.tips.map((tip, tipIdx) => (
                            <div key={tipIdx} className="flex items-start space-x-2 text-xs text-slate-600 dark:text-slate-400">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="leading-snug">{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Action Button */}
                    <div className="shrink-0 flex md:flex-col justify-end pt-2 md:pt-0">
                      <button
                        onClick={() => {
                          if (step.onAction) step.onAction();
                          else if (step.action) step.action();
                          else if (step.tab) onNavigate(step.tab);
                        }}
                        className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-2xl ${theme.btn} px-4 py-2.5 text-xs font-bold transition-all cursor-pointer shadow-2xs`}
                      >
                        <span>{step.actionLabel}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. XP & Gamification Rules (Shown when 'all' or 'xp' selected) */}
      {(activeCategory === "all" || activeCategory === "xp") && (
        <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-950/30">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {t.guide.gamificationTitle}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {isTh ? "สะสมค่าประสบการณ์ (XP) เพื่อเลื่อนระดับและปลดล็อคเหรียญรางวัลพิเศษ" : "Earn XP through healthy mindfulness habits to level up"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                {isTh ? "เลเวลปัจจุบันของคุณ:" : "Your Current Level:"} Lv. {user.level} ({user.xp} XP)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {xpRules.map((rule, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80"
              >
                <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                  <span className="text-lg">{rule.icon}</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                    {rule.activity}
                  </span>
                </div>
                <span className="shrink-0 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full font-mono">
                  {rule.xp}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 p-4 border border-orange-100 dark:border-orange-900/30 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔥</span>
              <div>
                <h4 className="text-xs font-bold text-orange-800 dark:text-orange-300">
                  {t.guide.streakTitle}
                </h4>
                <p className="text-[11px] text-orange-700 dark:text-orange-400 mt-0.5">
                  {isTh
                    ? "เข้าใช้งาน MIND MERIT เป็นประจำอย่างต่อเนื่องเพื่อรักษาสถิติ Streak และปลดล็อคเหรียญ Streak Champion!"
                    : "Visit daily to protect your streak count and claim the prestigious Streak Champion badge!"}
                </p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 font-bold text-xs shadow-xs">
              {user.streak} {isTh ? "วันต่อเนื่อง" : "Days Streak"}
            </div>
          </div>
        </div>
      )}

      {/* 6. Frequently Asked Questions (FAQ) */}
      {(activeCategory === "all" || activeCategory === "faq") && (
        <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/30">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {t.guide.faqTitle}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isTh ? "ข้อสงสัยที่พบบ่อยเกี่ยวกับการใช้งานแพลตฟอร์ม" : "Common questions about using MIND MERIT"}
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-100 dark:border-slate-800/80 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-800/30 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 pr-4">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-purple-500 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-4 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Need Help / Urgent Crisis Support Footer */}
      <div className="rounded-3xl bg-slate-900 dark:bg-slate-900/90 text-white p-6 sm:p-7 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold">
            <ShieldAlert className="h-4 w-4 animate-pulse" />
            <span>{isTh ? "สายด่วนสุขภาพจิตพร้อมช่วยเหลือ 24 ชั่วโมง" : "24/7 Mental Health Emergency Directory"}</span>
          </div>
          <h4 className="text-base font-bold">
            {t.guide.supportTitle}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.guide.supportText}
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => onNavigate("aiChat")}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            {isTh ? "คุยกับ AI Buddy" : "Chat with AI"}
          </button>
          <button
            onClick={onOpenSOS}
            className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-900/20 transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <ShieldAlert className="h-4 w-4" />
            <span>{isTh ? "เปิดเมนู SOS" : "Open SOS"}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
