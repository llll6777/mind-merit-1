export type Language = 'en' | 'th';
export type Theme = 'light' | 'dark';

export interface UserProfile {
  name: string;
  age: number;
  role: 'student' | 'adult';
  xp: number;
  level: number;
  streak: number;
  badges: string[]; // Badge IDs
  language: Language;
  theme: Theme;
  pdpaConsent: boolean;
  anonymousMode: boolean;
  visitsToday?: number;
  lastVisitDate?: string;
  avatar?: string;
  password?: string;
  isRegistered?: boolean;
}

export type MoodType = 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';

export interface MoodCheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  mood: MoodType;
  stress: number; // 1-10
  sleep: number; // hours
  exercise: number; // minutes
  water: number; // ml
  food?: string; // description or tag
  studyWork: string; // 'focused' | 'procrastinated' | 'balanced' | 'overwhelmed'
  gratitude: string; // text
  journal: string; // text
  aiAnalysis?: string; // AI feedback
}

export interface AssessmentQuestion {
  id: number;
  textEn: string;
  textTh: string;
  optionsEn: string[];
  optionsTh: string[];
  scores: number[];
}

export interface AssessmentResult {
  category: 'wellbeing' | 'stress' | 'burnout' | 'selfesteem';
  score: number;
  maxScore: number;
  riskScore: 'low' | 'moderate' | 'high';
  date: string;
  recommendations: string[];
}

export interface Badge {
  id: string;
  titleEn: string;
  titleTh: string;
  descEn: string;
  descTh: string;
  icon: string; // Lucide icon name
  unlockedAt?: string;
}

export interface Lesson {
  id: string;
  titleEn: string;
  titleTh: string;
  duration: string;
  type: 'video' | 'podcast' | 'article' | 'meditation' | 'breathing';
  contentEn: string;
  contentTh: string;
  mediaUrl?: string;
}

export interface QuizQuestion {
  questionEn: string;
  questionTh: string;
  optionsEn: string[];
  optionsTh: string[];
  answerIndex: number;
}

export interface Course {
  id: string;
  titleEn: string;
  titleTh: string;
  descEn: string;
  descTh: string;
  category: 'mindfulness' | 'stress-management' | 'motivation' | 'emotional-resilience';
  duration: string;
  lessons: Lesson[];
  quiz: QuizQuestion[];
  xpReward: number;
  badgeReward: string;
}

export interface Certificate {
  id: string;
  userName: string;
  courseNameEn: string;
  courseNameTh: string;
  date: string;
  certificateId: string;
  qrCodeUrl: string;
  verificationUrl: string;
  digitalSignature: string;
}

export interface Post {
  id: string;
  author: string;
  authorAvatar?: string;
  anonymous: boolean;
  content: string;
  timestamp: string;
  likes: number;
  likedByUser?: boolean;
  comments: Comment[];
  poll?: Poll;
}

export interface Comment {
  id: string;
  author: string;
  anonymous: boolean;
  content: string;
  timestamp: string;
}

export interface Poll {
  question: string;
  options: {
    textEn: string;
    textTh: string;
    votes: number;
  }[];
  votedIndex?: number;
}

export interface Buddy {
  id: string;
  name: string;
  age: number;
  role: 'student' | 'adult';
  wellbeingScore: number;
  stressLevel: number; // 1-10
  interestsEn: string[];
  interestsTh: string[];
  languages: string[];
  streak: number;
  lastMood?: MoodType;
  avatarUrl: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  category?: string; // e.g. stress, overthinking
}

export type AdminRole = "super_admin" | "staff_psychologist" | "customer";

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AdminRole;
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

