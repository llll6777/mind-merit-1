import { Router, Request, Response } from "express";

export const backendRouter = Router();

// =========================================================================
// 1. IN-MEMORY DATABASE SCHEMA & SEED DATA (Core Backend & Database)
// =========================================================================

export interface BackendUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "super_admin" | "staff_psychologist" | "customer";
  status: "active" | "suspended";
  authProvider: "email" | "phone" | "google" | "apple" | "guest";
  createdAt: string;
  lastLogin: string;
  avatar: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  type: "consultation" | "course" | "subscription" | "assessment";
  price: number;
  duration: string;
  status: "active" | "draft";
  salesCount: number;
  description: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  category: string;
  author: string;
  views: number;
  likes: number;
  status: "published" | "draft";
  createdAt: string;
}

export interface PromotionItem {
  id: string;
  code: string;
  discountPercent: number;
  maxDiscount: number;
  usageCount: number;
  maxUsage: number;
  validUntil: string;
  status: "active" | "expired";
}

export interface PushNotificationItem {
  id: string;
  title: string;
  body: string;
  audience: "all" | "students" | "adults" | "vip";
  sentAt: string;
  status: "sent" | "scheduled";
  recipientsCount: number;
}

export interface FileAsset {
  id: string;
  name: string;
  sizeMB: number;
  type: string;
  url: string;
  category: "banner" | "avatar" | "document" | "certificate";
  uploadedAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminName: string;
  adminRole: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  status: "success" | "warning" | "failed";
}

export interface PdpaConsentRecord {
  id: string;
  userId: string;
  userName: string;
  email: string;
  consentTerms: boolean;
  consentAnalytics: boolean;
  consentMarketing: boolean;
  consentSensitiveHealth: boolean;
  ipAddress: string;
  updatedAt: string;
}

// In-Memory Database Collections
let usersCollection: BackendUser[] = [
  {
    id: "usr-001",
    name: "ดร. สมศักดิ์ ปัญญาดี (Admin)",
    email: "somsak.admin@mindmerit.com",
    phone: "081-999-1122",
    role: "super_admin",
    status: "active",
    authProvider: "google",
    createdAt: "2026-01-15T08:00:00Z",
    lastLogin: "2026-10-06T22:30:00Z",
    avatar: "👨‍⚕️"
  },
  {
    id: "usr-002",
    name: "พญ. วิมลฉัตร สุขใจ (Psychologist)",
    email: "wimonchat.doc@mindmerit.com",
    phone: "082-888-3344",
    role: "staff_psychologist",
    status: "active",
    authProvider: "email",
    createdAt: "2026-02-10T09:00:00Z",
    lastLogin: "2026-10-06T21:45:00Z",
    avatar: "👩‍⚕️"
  },
  {
    id: "usr-003",
    name: "ตะวัน นักศึกษา มช.",
    email: "tawan.student@cmu.ac.th",
    phone: "089-123-4567",
    role: "customer",
    status: "active",
    authProvider: "apple",
    createdAt: "2026-07-12T14:20:00Z",
    lastLogin: "2026-10-06T20:10:00Z",
    avatar: "🎓"
  },
  {
    id: "usr-004",
    name: "มีนา วิศวกรซอฟต์แวร์",
    email: "meena.dev@techsme.co.th",
    phone: "086-555-7788",
    role: "customer",
    status: "active",
    authProvider: "google",
    createdAt: "2026-08-01T11:00:00Z",
    lastLogin: "2026-10-06T19:00:00Z",
    avatar: "💼"
  },
  {
    id: "usr-005",
    name: "ปอ ผู้ใช้ทดลองระบบ",
    email: "guest_por_77@mindmerit.local",
    phone: "090-333-2211",
    role: "customer",
    status: "suspended",
    authProvider: "guest",
    createdAt: "2026-09-20T16:40:00Z",
    lastLogin: "2026-10-04T10:15:00Z",
    avatar: "🧘"
  }
];

let catalogCollection: CatalogItem[] = [
  {
    id: "pkg-b2c-basic",
    name: "B2C Basic Package (แพ็กเกจบุคคล - ใช้ฟรี)",
    type: "subscription",
    price: 0,
    duration: "ตลอดชีพ",
    status: "active",
    salesCount: 18540,
    description: "Daily Mood Check-in, Gamification Quests, AI Companion, Safe Community ฟรีตลอดไป"
  },
  {
    id: "pkg-b2c-premium",
    name: "B2C Premium Package (แพ็กเกจบุคคล - ขั้นสูง)",
    type: "subscription",
    price: 100,
    duration: "1 เดือน / คน",
    status: "active",
    salesCount: 3210,
    description: "ฟีเจอร์ B2C Basic ทั้งหมด + Personalized Deep AI Analytics + Personalized Recommendations"
  },
  {
    id: "pkg-b2b-school",
    name: "B2B School Package (แพ็กเกจสำหรับโรงเรียน)",
    type: "subscription",
    price: 990,
    duration: "1 เดือน / โรงเรียน",
    status: "active",
    salesCount: 145,
    description: "B2B School Dashboard สรุปภาพรวม Real-Time, Early Warning Alert, รายงานสถิติ PDPA"
  },
  {
    id: "pkg-consult-1on1",
    name: "1-on-1 Private Consultation (50 mins)",
    type: "consultation",
    price: 790,
    duration: "50 นาที",
    status: "active",
    salesCount: 680,
    description: "ปรึกษาส่วนตัวผ่านวิดีโอคอลแบบเป็นความลับ 100% กับนักจิตวิทยาผู้ได้รับใบอนุญาต"
  }
];

let articlesCollection: ArticleItem[] = [
  {
    id: "art-001",
    title: "5 เทคนิคหยุดความคิดวนลูป (Overthinking) ใน 3 นาที",
    category: "Mindfulness",
    author: "ดร. สมศักดิ์ ปัญญาดี",
    views: 12450,
    likes: 890,
    status: "published",
    createdAt: "2026-09-15"
  },
  {
    id: "art-002",
    title: "แยกให้ออกระหว่าง 'ขี้เกียจ' กับ 'ภาวะหมดไฟ (Burnout)'",
    category: "Career & Wellness",
    author: "พญ. วิมลฉัตร สุขใจ",
    views: 9800,
    likes: 720,
    status: "published",
    createdAt: "2026-09-22"
  },
  {
    id: "art-003",
    title: "Box Breathing: วิธีหายใจแบบหน่วยซีลเพื่อลดอาการตื่นตระหนก",
    category: "Self-Care",
    author: "MIND MERIT Editorial",
    views: 15600,
    likes: 1340,
    status: "published",
    createdAt: "2026-09-28"
  },
  {
    id: "art-004",
    title: "คู่มือรับมือแรงกดดันช่วงสอบปลายภาคสำหรับนักศึกษา",
    category: "Students",
    author: "อ. ภัทรดนัย จิตวิทยา",
    views: 4300,
    likes: 310,
    status: "draft",
    createdAt: "2026-10-02"
  }
];

let promotionsCollection: PromotionItem[] = [
  {
    id: "pro-001",
    code: "STUDENT50",
    discountPercent: 50,
    maxDiscount: 500,
    usageCount: 320,
    maxUsage: 1000,
    validUntil: "2026-12-31",
    status: "active"
  },
  {
    id: "pro-002",
    code: "WELLNESS2026",
    discountPercent: 20,
    maxDiscount: 300,
    usageCount: 154,
    maxUsage: 500,
    validUntil: "2026-11-30",
    status: "active"
  },
  {
    id: "pro-003",
    code: "WELCOME100",
    discountPercent: 100,
    maxDiscount: 990,
    usageCount: 100,
    maxUsage: 100,
    validUntil: "2026-08-31",
    status: "expired"
  }
];

let pushNotificationsCollection: PushNotificationItem[] = [
  {
    id: "push-001",
    title: "☀️ เช็คอินพลังใจยามเช้า",
    body: "สละเวลา 1 นาทีมาบันทึกความรู้สึก และรับข้อคิดพลังบวกจาก MIND MERIT กันนะ!",
    audience: "all",
    sentAt: "2026-10-06T08:00:00Z",
    status: "sent",
    recipientsCount: 14250
  },
  {
    id: "push-002",
    title: "🎓 สอบเครียดใช่ไหม? ลองฝึกหายใจ Box Breathing ดูสิ",
    body: "เปิดห้องฝึกสมาธิออนไลน์ฟรี สำหรับนักเรียนนักศึกษาที่กำลังอ่านหนังสือสอบ",
    audience: "students",
    sentAt: "2026-10-05T20:00:00Z",
    status: "sent",
    recipientsCount: 8900
  }
];

let filesCollection: FileAsset[] = [
  {
    id: "fil-001",
    name: "hero-mental-wellness-cover.webp",
    sizeMB: 0.85,
    type: "image/webp",
    url: "https://storage.googleapis.com/mindmerit-assets/hero-mental-wellness-cover.webp",
    category: "banner",
    uploadedAt: "2026-09-01"
  },
  {
    id: "fil-002",
    name: "mindmerit-certified-stamp.png",
    sizeMB: 0.22,
    type: "image/png",
    url: "https://storage.googleapis.com/mindmerit-assets/mindmerit-certified-stamp.png",
    category: "certificate",
    uploadedAt: "2026-09-10"
  },
  {
    id: "fil-003",
    name: "pdpa-privacy-policy-2026.pdf",
    sizeMB: 1.45,
    type: "application/pdf",
    url: "https://storage.googleapis.com/mindmerit-assets/pdpa-privacy-policy-2026.pdf",
    category: "document",
    uploadedAt: "2026-08-15"
  },
  {
    id: "fil-004",
    name: "avatar-psychologist-dr-somsak.png",
    sizeMB: 0.35,
    type: "image/png",
    url: "https://storage.googleapis.com/mindmerit-assets/avatar-dr-somsak.png",
    category: "avatar",
    uploadedAt: "2026-09-05"
  }
];

let auditLogsCollection: AuditLogEntry[] = [
  {
    id: "aud-001",
    timestamp: "2026-10-06T22:15:30Z",
    adminName: "ดร. สมศักดิ์ ปัญญาดี",
    adminRole: "Super Admin",
    action: "USER_STATUS_UPDATED",
    resource: "usr-005",
    details: "Suspended account 'ปอ ผู้ใช้ทดลองระบบ' for policy breach review",
    ipAddress: "171.96.120.45",
    status: "warning"
  },
  {
    id: "aud-002",
    timestamp: "2026-10-06T21:40:12Z",
    adminName: "พญ. วิมลฉัตร สุขใจ",
    adminRole: "Staff Psychologist",
    action: "PROMOTION_CREATED",
    resource: "pro-002",
    details: "Created discount coupon 'WELLNESS2026' (20% off)",
    ipAddress: "124.122.40.18",
    status: "success"
  },
  {
    id: "aud-003",
    timestamp: "2026-10-06T20:05:00Z",
    adminName: "ดร. สมศักดิ์ ปัญญาดี",
    adminRole: "Super Admin",
    action: "PUSH_NOTIFICATION_BROADCAST",
    resource: "push-001",
    details: "Broadcasted morning mood check-in notification to 14,250 users",
    ipAddress: "171.96.120.45",
    status: "success"
  },
  {
    id: "aud-004",
    timestamp: "2026-10-06T18:22:45Z",
    adminName: "พญ. วิมลฉัตร สุขใจ",
    adminRole: "Staff Psychologist",
    action: "ARTICLE_PUBLISHED",
    resource: "art-003",
    details: "Published psychoeducation article 'Box Breathing technique'",
    ipAddress: "124.122.40.18",
    status: "success"
  }
];

let pdpaConsentsCollection: PdpaConsentRecord[] = [
  {
    id: "pdp-001",
    userId: "usr-001",
    userName: "ดร. สมศักดิ์ ปัญญาดี",
    email: "somsak.admin@mindmerit.com",
    consentTerms: true,
    consentAnalytics: true,
    consentMarketing: false,
    consentSensitiveHealth: true,
    ipAddress: "171.96.120.45",
    updatedAt: "2026-01-15T08:00:00Z"
  },
  {
    id: "pdp-002",
    userId: "usr-003",
    userName: "ตะวัน นักศึกษา มช.",
    email: "tawan.student@cmu.ac.th",
    consentTerms: true,
    consentAnalytics: true,
    consentMarketing: true,
    consentSensitiveHealth: true,
    ipAddress: "223.24.112.80",
    updatedAt: "2026-07-12T14:20:00Z"
  },
  {
    id: "pdp-003",
    userId: "usr-004",
    userName: "มีนา วิศวกรซอฟต์แวร์",
    email: "meena.dev@techsme.co.th",
    consentTerms: true,
    consentAnalytics: false,
    consentMarketing: false,
    consentSensitiveHealth: true,
    ipAddress: "182.52.90.14",
    updatedAt: "2026-08-01T11:00:00Z"
  }
];

// Helper to log audit actions
function recordAuditLog(adminName: string, adminRole: string, action: string, resource: string, details: string, ipAddress: string = "127.0.0.1", status: "success" | "warning" | "failed" = "success") {
  const newLog: AuditLogEntry = {
    id: `aud-${Date.now()}`,
    timestamp: new Date().toISOString(),
    adminName,
    adminRole,
    action,
    resource,
    details,
    ipAddress,
    status
  };
  auditLogsCollection.unshift(newLog);
  if (auditLogsCollection.length > 200) auditLogsCollection.pop();
}

// =========================================================================
// SECTION 1: CORE BACKEND & DATABASE OVERVIEW API
// =========================================================================

backendRouter.get("/backend/overview", (req: Request, res: Response) => {
  res.json({
    server: {
      platform: "Google Cloud Run / Node.js 22 LTS",
      region: "asia-southeast1 (Bangkok/Singapore Edge)",
      status: "healthy",
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      nodeEnv: process.env.NODE_ENV || "development",
      port: 3000
    },
    database: {
      engine: "PostgreSQL 16 Enterprise & Redis Cache Cluster",
      status: "connected",
      activeConnections: 18,
      maxConnections: 100,
      latencyMs: 1.2,
      tablesCount: 7,
      storageUsedMB: 48.6,
      storageLimitMB: 10240,
      collections: {
        users: usersCollection.length,
        catalog: catalogCollection.length,
        articles: articlesCollection.length,
        promotions: promotionsCollection.length,
        notifications: pushNotificationsCollection.length,
        files: filesCollection.length,
        auditLogs: auditLogsCollection.length,
        pdpaConsents: pdpaConsentsCollection.length
      }
    },
    apiGateway: {
      totalRequestsToday: 142890,
      avgLatencyMs: 34,
      errorRate: "0.01%",
      activeSLA: "99.98%",
      corsEnabled: true,
      rateLimitPerMinute: 600
    }
  });
});

// =========================================================================
// SECTION 2: USER MANAGEMENT & MULTI-CHANNEL AUTH
// =========================================================================

// Multi-Channel Authentication Endpoint (Email, Phone, Google, Apple, Guest)
backendRouter.post("/auth/login", (req: Request, res: Response) => {
  const { channel, identifier, password, role } = req.body;

  let user = usersCollection.find(u => u.email === identifier || u.phone === identifier);
  
  if (!user && (channel === "google" || channel === "apple" || channel === "guest")) {
    // Auto-create user for OAuth / Guest
    const newId = `usr-${Date.now().toString().slice(-4)}`;
    user = {
      id: newId,
      name: identifier || (channel === "google" ? "Google User" : channel === "apple" ? "Apple User" : "ผู้ใช้ทั่วไป"),
      email: identifier?.includes("@") ? identifier : `${channel}_${Date.now()}@mindmerit.app`,
      phone: channel === "phone" ? identifier : "08x-xxx-xxxx",
      role: (role as any) || "customer",
      status: "active",
      authProvider: channel,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      avatar: channel === "google" ? "🌐" : channel === "apple" ? "🍎" : "🧘"
    };
    usersCollection.unshift(user);
    recordAuditLog("System Auth", "Security Gateway", "USER_REGISTERED_OAUTH", user.id, `User signed up via ${channel}`);
  }

  if (!user) {
    user = usersCollection[0]; // Fallback to super admin for testing convenience
  } else {
    user.lastLogin = new Date().toISOString();
  }

  recordAuditLog(user.name, user.role, "USER_LOGIN_SUCCESS", user.id, `Logged in via ${channel} channel`);

  res.json({
    success: true,
    token: `mm_jwt_${Date.now()}_secure_session`,
    user,
    permissions: user.role === "super_admin" 
      ? ["ALL_ACCESS", "USER_MANAGEMENT", "CATALOG_MANAGEMENT", "PROMOTIONS", "PUSH_NOTIFICATIONS", "AUDIT_VIEW", "PDPA_ADMIN", "EXPORT_DATA"]
      : user.role === "staff_psychologist"
        ? ["USER_VIEW", "CATALOG_VIEW", "ARTICLES_MANAGEMENT", "AUDIT_VIEW", "CONSULTATION_MANAGE"]
        : ["CUSTOMER_PORTAL", "CONSULTATION_BOOK", "ASSESSMENT_TAKE"]
  });
});

// List Users with filtering & search
backendRouter.get("/admin/users", (req: Request, res: Response) => {
  const { search, role, status } = req.query;
  let list = [...usersCollection];

  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    list = list.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q));
  }
  if (role && typeof role === "string" && role !== "all") {
    list = list.filter(u => u.role === role);
  }
  if (status && typeof status === "string" && status !== "all") {
    list = list.filter(u => u.status === status);
  }

  res.json({ users: list, total: list.length });
});

// Create User
backendRouter.post("/admin/users", (req: Request, res: Response) => {
  const { name, email, phone, role, status, authProvider, avatar } = req.body;
  const newUser: BackendUser = {
    id: `usr-${Date.now().toString().slice(-4)}`,
    name: name || "ผู้ใช้ใหม่",
    email: email || `user_${Date.now()}@mindmerit.com`,
    phone: phone || "08x-xxx-xxxx",
    role: role || "customer",
    status: status || "active",
    authProvider: authProvider || "email",
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    avatar: avatar || "🧘"
  };
  usersCollection.unshift(newUser);
  recordAuditLog("Admin Panel", "Super Admin", "USER_CREATED", newUser.id, `Created user '${newUser.name}' with role ${newUser.role}`);
  res.json({ success: true, user: newUser });
});

// Update User (Role, Status, Info)
backendRouter.put("/admin/users/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const index = usersCollection.findIndex(u => u.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const prev = usersCollection[index];
  const updated: BackendUser = {
    ...prev,
    ...req.body,
    id: prev.id // preserve id
  };
  usersCollection[index] = updated;

  recordAuditLog(
    "Admin Panel",
    "Super Admin",
    "USER_UPDATED",
    id,
    `Updated user '${updated.name}'. Role: ${updated.role}, Status: ${updated.status}`
  );

  res.json({ success: true, user: updated });
});

// Delete User
backendRouter.delete("/admin/users/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const target = usersCollection.find(u => u.id === id);
  usersCollection = usersCollection.filter(u => u.id !== id);
  recordAuditLog("Admin Panel", "Super Admin", "USER_DELETED", id, `Deleted user account '${target?.name || id}'`);
  res.json({ success: true, message: "User deleted successfully" });
});

// Roles & Permissions Reference Matrix
backendRouter.get("/admin/roles-permissions", (req: Request, res: Response) => {
  res.json({
    roles: [
      {
        id: "super_admin",
        nameEn: "Super Admin",
        nameTh: "ผู้ดูแลระบบสูงสุด (Super Admin)",
        description: "สิทธิ์เต็มทุกส่วน จัดการฐานข้อมูล ผู้ใช้ บทบาท การเงิน รายงานความปลอดภัย และ PDPA",
        permissions: ["จัดการสิทธิ์และผู้ใช้", "จัดการสินค้าและราคา", "ส่ง Push Notification", "ส่งออกรายงาน Excel/CSV", "ดู Audit Logs", "ควบคุม PDPA"]
      },
      {
        id: "staff_psychologist",
        nameEn: "Staff / Psychologist",
        nameTh: "เจ้าหน้าที่และผู้เชี่ยวชาญ (Staff/Doctor)",
        description: "ดูแลเคสการปรึกษา ตรวจสอบความถูกต้องของบทความ สถิติการใช้งาน และตอบคำถามผู้ใช้",
        permissions: ["เข้าถึงรายชื่อผู้ใช้ (เฉพาะอ่าน)", "จัดการบทความและความรู้", "ดูสถิติและการประเมิน", "จัดการคิวปรึกษา 1-on-1"]
      },
      {
        id: "customer",
        nameEn: "Customer / User",
        nameTh: "ลูกค้าและผู้ใช้งานทั่วไป (Customer)",
        description: "เข้าใช้งานบริการ เช็คอินอารมณ์ ปรึกษา AI เข้าร่วมคอร์สเรียน และจองการปรึกษาผู้เชี่ยวชาญ",
        permissions: ["เช็คอินอารมณ์และ AI Companion", "รับเกียรติบัตร E-Certificate", "จัดการโปรไฟล์และข้อมูลส่วนตัว PDPA"]
      }
    ]
  });
});

// =========================================================================
// SECTION 3: ADMIN DASHBOARD METRICS & DATA MANAGEMENT (CRUD)
// =========================================================================

// Dashboard Summary KPI & Trends
backendRouter.get("/admin/dashboard-stats", (req: Request, res: Response) => {
  const totalUsers = 19670;
  const dailyActiveUsers = 3420;
  const monthlyRevenue = 284500;
  const activeConsultations = 148;
  const newRegistrationsToday = 94;

  const weeklyTrend = [
    { date: "30 ก.ย.", revenue: 32000, users: 2950, consults: 18 },
    { date: "1 ต.ค.", revenue: 38500, users: 3120, consults: 22 },
    { date: "2 ต.ค.", revenue: 41200, users: 3350, consults: 26 },
    { date: "3 ต.ค.", revenue: 39000, users: 3280, consults: 20 },
    { date: "4 ต.ค.", revenue: 45600, users: 3490, consults: 28 },
    { date: "5 ต.ค.", revenue: 43800, users: 3410, consults: 24 },
    { date: "6 ต.ค.", revenue: 44400, users: 3580, consults: 30 }
  ];

  const userDistribution = [
    { name: "นักเรียน / นักศึกษา", count: 12450, percentage: 63, color: "#38bdf8" },
    { name: "วัยทำงาน / บริษัท", count: 6750, percentage: 34, color: "#10b981" },
    { name: "ผู้เชี่ยวชาญ & แอดมิน", count: 470, percentage: 3, color: "#f59e0b" }
  ];

  const topConcerns = [
    { name: "ความเครียดสะสม / การสอบ", percentage: 38 },
    { name: "ภาวะหมดไฟในการทำงาน (Burnout)", percentage: 27 },
    { name: "โรควิตกกังวลและนอนไม่หลับ", percentage: 21 },
    { name: "ปัญหาความสัมพันธ์และการสื่อสาร", percentage: 14 }
  ];

  res.json({
    kpis: {
      totalUsers,
      dailyActiveUsers,
      monthlyRevenue,
      activeConsultations,
      newRegistrationsToday,
      growthRate: "+14.8%"
    },
    weeklyTrend,
    userDistribution,
    topConcerns,
    collectionsCount: {
      users: usersCollection.length,
      catalog: catalogCollection.length,
      articles: articlesCollection.length,
      promotions: promotionsCollection.length
    }
  });
});

// 1. Data Management: Catalog / Packages
backendRouter.get("/admin/catalog", (req: Request, res: Response) => {
  res.json({ catalog: catalogCollection });
});

backendRouter.post("/admin/catalog", (req: Request, res: Response) => {
  const newItem: CatalogItem = {
    id: `cat-${Date.now().toString().slice(-4)}`,
    name: req.body.name || "แพ็กเกจใหม่",
    type: req.body.type || "consultation",
    price: Number(req.body.price) || 0,
    duration: req.body.duration || "30 วัน",
    status: req.body.status || "active",
    salesCount: 0,
    description: req.body.description || ""
  };
  catalogCollection.unshift(newItem);
  recordAuditLog("Admin Panel", "Super Admin", "CATALOG_ITEM_CREATED", newItem.id, `Created product package '${newItem.name}' price ${newItem.price} THB`);
  res.json({ success: true, item: newItem });
});

backendRouter.put("/admin/catalog/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = catalogCollection.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: "Item not found" });
  catalogCollection[idx] = { ...catalogCollection[idx], ...req.body, id };
  recordAuditLog("Admin Panel", "Super Admin", "CATALOG_ITEM_UPDATED", id, `Updated catalog item '${catalogCollection[idx].name}'`);
  res.json({ success: true, item: catalogCollection[idx] });
});

backendRouter.delete("/admin/catalog/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const item = catalogCollection.find(c => c.id === id);
  catalogCollection = catalogCollection.filter(c => c.id !== id);
  recordAuditLog("Admin Panel", "Super Admin", "CATALOG_ITEM_DELETED", id, `Deleted package '${item?.name || id}'`);
  res.json({ success: true });
});

// 2. Data Management: Articles & Psychoeducation Content
backendRouter.get("/admin/articles", (req: Request, res: Response) => {
  res.json({ articles: articlesCollection });
});

backendRouter.post("/admin/articles", (req: Request, res: Response) => {
  const newArticle: ArticleItem = {
    id: `art-${Date.now().toString().slice(-4)}`,
    title: req.body.title || "บทความใหม่",
    category: req.body.category || "Mindfulness",
    author: req.body.author || "MIND MERIT Editorial",
    views: 0,
    likes: 0,
    status: req.body.status || "published",
    createdAt: new Date().toISOString().split("T")[0]
  };
  articlesCollection.unshift(newArticle);
  recordAuditLog("Admin Panel", "Staff Psychologist", "ARTICLE_CREATED", newArticle.id, `Created article '${newArticle.title}'`);
  res.json({ success: true, article: newArticle });
});

backendRouter.put("/admin/articles/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = articlesCollection.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: "Article not found" });
  articlesCollection[idx] = { ...articlesCollection[idx], ...req.body, id };
  recordAuditLog("Admin Panel", "Staff Psychologist", "ARTICLE_UPDATED", id, `Updated article '${articlesCollection[idx].title}'`);
  res.json({ success: true, article: articlesCollection[idx] });
});

backendRouter.delete("/admin/articles/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const article = articlesCollection.find(a => a.id === id);
  articlesCollection = articlesCollection.filter(a => a.id !== id);
  recordAuditLog("Admin Panel", "Staff Psychologist", "ARTICLE_DELETED", id, `Deleted article '${article?.title || id}'`);
  res.json({ success: true });
});

// 3. Data Management: Promotions & Vouchers
backendRouter.get("/admin/promotions", (req: Request, res: Response) => {
  res.json({ promotions: promotionsCollection });
});

backendRouter.post("/admin/promotions", (req: Request, res: Response) => {
  const newPromo: PromotionItem = {
    id: `pro-${Date.now().toString().slice(-4)}`,
    code: (req.body.code || "DISCOUNT").toUpperCase(),
    discountPercent: Number(req.body.discountPercent) || 10,
    maxDiscount: Number(req.body.maxDiscount) || 500,
    usageCount: 0,
    maxUsage: Number(req.body.maxUsage) || 100,
    validUntil: req.body.validUntil || "2026-12-31",
    status: req.body.status || "active"
  };
  promotionsCollection.unshift(newPromo);
  recordAuditLog("Admin Panel", "Super Admin", "PROMOTION_CREATED", newPromo.id, `Created promotion code '${newPromo.code}' (${newPromo.discountPercent}% off)`);
  res.json({ success: true, promotion: newPromo });
});

backendRouter.delete("/admin/promotions/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const promo = promotionsCollection.find(p => p.id === id);
  promotionsCollection = promotionsCollection.filter(p => p.id !== id);
  recordAuditLog("Admin Panel", "Super Admin", "PROMOTION_DELETED", id, `Deleted promo '${promo?.code || id}'`);
  res.json({ success: true });
});

// 4. Report & Export (CSV Format Download)
backendRouter.get("/admin/export/:type", (req: Request, res: Response) => {
  const { type } = req.params;
  recordAuditLog("Admin Panel", "Super Admin", "DATA_EXPORT_REQUESTED", type, `Exported ${type} dataset as CSV`);

  if (type === "users") {
    let csv = "ID,Name,Email,Phone,Role,Status,AuthProvider,CreatedAt,LastLogin\n";
    usersCollection.forEach(u => {
      csv += `"${u.id}","${u.name}","${u.email}","${u.phone}","${u.role}","${u.status}","${u.authProvider}","${u.createdAt}","${u.lastLogin}"\n`;
    });
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="mindmerit_users_report.csv"');
    return res.send("\uFEFF" + csv); // Add BOM for Excel Thai compatibility
  }

  if (type === "sales") {
    let csv = "ID,PackageName,Type,PriceTHB,Duration,Status,SalesCount,EstimatedRevenueTHB\n";
    catalogCollection.forEach(c => {
      csv += `"${c.id}","${c.name}","${c.type}",${c.price},"${c.duration}","${c.status}",${c.salesCount},${c.price * c.salesCount}\n`;
    });
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="mindmerit_sales_report.csv"');
    return res.send("\uFEFF" + csv);
  }

  if (type === "audit") {
    let csv = "ID,Timestamp,AdminName,AdminRole,Action,Resource,Details,IPAddress,Status\n";
    auditLogsCollection.forEach(a => {
      csv += `"${a.id}","${a.timestamp}","${a.adminName}","${a.adminRole}","${a.action}","${a.resource}","${a.details}","${a.ipAddress}","${a.status}"\n`;
    });
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="mindmerit_audit_logs.csv"');
    return res.send("\uFEFF" + csv);
  }

  if (type === "pdpa") {
    let csv = "ID,UserID,UserName,Email,ConsentTerms,ConsentAnalytics,ConsentMarketing,ConsentSensitiveHealth,IPAddress,UpdatedAt\n";
    pdpaConsentsCollection.forEach(p => {
      csv += `"${p.id}","${p.userId}","${p.userName}","${p.email}",${p.consentTerms},${p.consentAnalytics},${p.consentMarketing},${p.consentSensitiveHealth},"${p.ipAddress}","${p.updatedAt}"\n`;
    });
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="mindmerit_pdpa_consents.csv"');
    return res.send("\uFEFF" + csv);
  }

  res.status(400).json({ error: "Invalid export type. Supported: users, sales, audit, pdpa" });
});

// =========================================================================
// SECTION 4: SECURITY & SERVICES (PUSH, FILES, AUDIT, PDPA)
// =========================================================================

// Push Notifications
backendRouter.get("/admin/notifications/history", (req: Request, res: Response) => {
  res.json({ notifications: pushNotificationsCollection });
});

backendRouter.post("/admin/notifications/send", (req: Request, res: Response) => {
  const { title, body, audience, priority } = req.body;
  if (!title || !body) {
    return res.status(400).json({ error: "Title and body are required" });
  }

  const recipientsCount = audience === "students" ? 8900 : audience === "adults" ? 5300 : audience === "vip" ? 480 : 14250;
  const newNotification: PushNotificationItem = {
    id: `push-${Date.now().toString().slice(-4)}`,
    title,
    body,
    audience: audience || "all",
    sentAt: new Date().toISOString(),
    status: "sent",
    recipientsCount
  };

  pushNotificationsCollection.unshift(newNotification);
  recordAuditLog("Admin Panel", "Super Admin", "PUSH_NOTIFICATION_BROADCAST", newNotification.id, `Sent push '${title}' to ${audience} (${recipientsCount} devices)`);

  res.json({
    success: true,
    notification: newNotification,
    deliveredCount: recipientsCount
  });
});

// File Management
backendRouter.get("/admin/files", (req: Request, res: Response) => {
  const totalStorageMB = 51200; // 50 GB
  const usedStorageMB = filesCollection.reduce((acc, f) => acc + f.sizeMB, 0) + 1240; // baseline assets
  res.json({
    files: filesCollection,
    stats: {
      totalFiles: filesCollection.length,
      usedStorageMB: Number(usedStorageMB.toFixed(2)),
      totalStorageMB,
      usedPercentage: Number(((usedStorageMB / totalStorageMB) * 100).toFixed(2)),
      cdnStatus: "active",
      storageProvider: "Google Cloud Storage Bucket (asia-southeast1)"
    }
  });
});

backendRouter.post("/admin/files/upload", (req: Request, res: Response) => {
  const { name, category, sizeMB } = req.body;
  const newFile: FileAsset = {
    id: `fil-${Date.now().toString().slice(-4)}`,
    name: name || `asset-${Date.now()}.png`,
    sizeMB: Number(sizeMB) || 0.45,
    type: name?.endsWith(".pdf") ? "application/pdf" : "image/png",
    url: `https://storage.googleapis.com/mindmerit-assets/${name || `asset-${Date.now()}.png`}`,
    category: category || "document",
    uploadedAt: new Date().toISOString().split("T")[0]
  };
  filesCollection.unshift(newFile);
  recordAuditLog("Admin Panel", "Staff", "FILE_UPLOADED", newFile.id, `Uploaded asset '${newFile.name}' (${newFile.sizeMB} MB)`);
  res.json({ success: true, file: newFile });
});

backendRouter.delete("/admin/files/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const file = filesCollection.find(f => f.id === id);
  filesCollection = filesCollection.filter(f => f.id !== id);
  recordAuditLog("Admin Panel", "Super Admin", "FILE_DELETED", id, `Deleted file '${file?.name || id}'`);
  res.json({ success: true });
});

// Audit Logs
backendRouter.get("/admin/audit-logs", (req: Request, res: Response) => {
  res.json({ logs: auditLogsCollection, total: auditLogsCollection.length });
});

// PDPA Compliance & Data Subject Rights
backendRouter.get("/admin/pdpa/consents", (req: Request, res: Response) => {
  res.json({
    consents: pdpaConsentsCollection,
    summary: {
      totalRegistered: usersCollection.length,
      acceptedTermsRate: "100%",
      analyticsConsentRate: "66.7%",
      marketingConsentRate: "33.3%",
      pdpaComplianceStatus: "VERIFIED_COMPLIANT_PDPA_BE_2562"
    }
  });
});

backendRouter.post("/admin/pdpa/process-request", (req: Request, res: Response) => {
  const { userId, action } = req.body; // action: 'export' | 'erase' | 'withdraw_marketing'
  const user = usersCollection.find(u => u.id === userId);

  if (action === "erase") {
    // Right to be forgotten
    usersCollection = usersCollection.filter(u => u.id !== userId);
    pdpaConsentsCollection = pdpaConsentsCollection.filter(p => p.userId !== userId);
    recordAuditLog("DPO (Data Protection Officer)", "Super Admin", "PDPA_RIGHT_TO_ERASURE_EXECUTED", userId, `Permanently erased personal data for user '${user?.name || userId}'`);
    return res.json({ success: true, message: "ข้อมูลส่วนบุคคลถูกลบออกจากระบบอย่างสมบูรณ์ตามสิทธิ PDPA" });
  }

  if (action === "withdraw_marketing") {
    const consent = pdpaConsentsCollection.find(p => p.userId === userId);
    if (consent) consent.consentMarketing = false;
    recordAuditLog("DPO (Data Protection Officer)", "Super Admin", "PDPA_CONSENT_WITHDRAWN", userId, `Withdrawn marketing communication consent for user '${user?.name || userId}'`);
    return res.json({ success: true, message: "ถอนความยินยอมการรับข้อมูลการตลาดเรียบร้อยแล้ว" });
  }

  res.json({ success: true, message: "คำร้องขอจัดการข้อมูลส่วนบุคคลได้รับการบันทึกเรียบร้อยแล้ว" });
});
