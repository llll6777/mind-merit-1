import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  BookOpen, 
  Bot, 
  ClipboardList, 
  GraduationCap, 
  Users, 
  ShieldAlert, 
  Settings, 
  FileText,
  Menu,
  X,
  Video,
  HelpCircle,
  Home
} from "lucide-react";

import Header from "./components/Header";
import DashboardView from "./components/DashboardView";
import MoodCheckInView from "./components/MoodCheckInView";
import ChatbotView from "./components/ChatbotView";
import AssessmentView from "./components/AssessmentView";
import LearningView from "./components/LearningView";
import CommunityView from "./components/CommunityView";
import SOSView from "./components/SOSView";
import AdminView from "./components/AdminView";
import DocsView from "./components/DocsView";
import VideosView from "./components/VideosView";
import UserGuideView from "./components/UserGuideView";
import UserProfileModal from "./components/UserProfileModal";
import LandingPageView from "./components/LandingPageView";
import LogoModal from "./components/LogoModal";

import { UserProfile, MoodCheckIn, Badge, Post, Certificate, ChatMessage } from "./types";
import { translations } from "./translations";

export default function App() {
  // 1. Core Profile State
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("mind_merit_profile_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          if (parsed.name) parsed.name = parsed.name.replace(/!+$/, '').trim();
          return parsed;
        }
      } catch (e) {
        console.error("Error parsing profile from local storage:", e);
      }
    }
    return {
      name: "ผู้ใช้ใหม่",
      age: 19,
      role: "student",
      xp: 0,
      level: 1,
      streak: 0, // Initial streak is 0 as requested!
      badges: ["welcome_badge"],
      language: "th", // default to Thai as requested
      theme: "light",
      pdpaConsent: true,
      anonymousMode: true,
      visitsToday: 0,
      lastVisitDate: ""
    };
  });

  const [activeTab, setActiveTab] = useState<string>("landing");
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState<boolean>(false);

  // Auto-dismiss Splash Screen after 1.8s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);


  const emojiList = [
    // Mood & Care
    "🧘", "😊", "🥰", "🌸", "☀️", "🌈", "💫", "💖", "🌻", "🍀", "🍓", "☕", "🕊️", "🌿", "🍵", "✨",
    // Animals
    "🐱", "🐶", "🦊", "🐼", "🐰", "🐨", "🐬", "🐧", "🦄", "🦖", "🦁", "🦉", "🐝", "🦥", "🦦", "🐢", "🦋",
    // Activities & Cool
    "🎨", "🎮", "🎵", "📚", "⚽", "🛹", "🎧", "🧗", "🚴", "🎸", "🚀", "⭐", "🔥", "⚡", "💎", "👑", "🛡️", "💡", "🪐"
  ];

  // Track daily visits and increase streak accordingly
  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    setUser(prev => {
      let updatedStreak = prev.streak;
      let updatedVisitsToday = prev.visitsToday || 0;
      
      if (prev.lastVisitDate === todayStr) {
        // Same day visit: increment visits today, and increment streak on each visit!
        updatedVisitsToday += 1;
        updatedStreak += 1; // streak increases according to visit count per day
      } else {
        // New day visit (or first-ever launch):
        updatedVisitsToday = 1;
        // On a new day, streak is also incremented by 1 for visiting
        updatedStreak += 1;
      }

      return {
        ...prev,
        visitsToday: updatedVisitsToday,
        streak: updatedStreak,
        lastVisitDate: todayStr
      };
    });
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem("mind_merit_profile_v1", JSON.stringify(user));
  }, [user]);

  // Apply Theme class directly to Document body/HTML
  useEffect(() => {
    const root = window.document.documentElement;
    if (user.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [user.theme]);

  // 2. Health & Mood check-in records state (starts empty until user inputs data)
  const [moodLogs, setMoodLogs] = useState<MoodCheckIn[]>(() => {
    const saved = localStorage.getItem("mind_merit_mood_logs_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out mock/seed logs so new users have no mock data
          return parsed.filter((l: any) => l.id && !l.id.startsWith("log-seed-"));
        }
      } catch (e) {
        console.error("Error parsing mood logs:", e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("mind_merit_mood_logs_v1", JSON.stringify(moodLogs));
  }, [moodLogs]);

  // 3. AI Counselor Chat History state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("mind_merit_chat_history_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing chat history:", e);
      }
    }
    return [
      {
        id: "chat-seed-1",
        sender: "ai",
        text: "สวัสดีครับ ยินดีต้อนรับสู่ MIND MERIT! ผมคือเพื่อนและนักจิตวิทยา AI ประจำตัวของคุณ วันนี้มีเรื่องราวอะไรที่คุณอยากเล่าให้ผมฟัง หรือมีจุดไหนที่คุณรู้สึกไม่สบายใจอยู่ไหมครับ? ผมพร้อมรับฟังและเคียงข้างคุณเสมอครับ",
        timestamp: "19:04"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("mind_merit_chat_history_v1", JSON.stringify(chatHistory));
  }, [chatHistory]);

  // 4. Community Support Posts state
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem("mind_merit_posts_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing posts:", e);
      }
    }
    return [
      {
        id: "post-1",
        author: "Student Explorer (บัดดี้สู้ชีวิต)",
        anonymous: false,
        content: "สู้ๆ นะครับทุกคนสำหรับสัปดาห์สอบมิดเทอมนี้! ถ้าเริ่มรู้สึกหัวตื้อหรือสมองล้า แนะนำให้ละสายตาจากตำราเรียนสัก 5 นาที แล้วทำ Box Breathing ลมหายใจเข้าลึกๆ ช่วยลดความวิตกกังวลได้เยอะมากจริงๆ ครับ 🌸",
        timestamp: "2 hours ago",
        likes: 12,
        likedByUser: false,
        comments: [
          { id: "comm-1", author: "Anonymous", anonymous: true, content: "ขอบคุณสำหรับพลังบวกและข้อคิดที่ดีมากๆ เลยค่ะ!", timestamp: "1 hour ago" }
        ]
      },
      {
        id: "post-2",
        author: "กระต่ายไม่ประสงค์ออกนาม",
        anonymous: true,
        content: "รู้สึกหมดไฟในการทำงานมากๆ เลยช่วงนี้ พองานกองเยอะก็เครียดจนหัวสมองตึงนอนไม่ค่อยหลับ มีใครมีคำแนะนำสำหรับอาการ Burnout บ้างไหมคะ? ☁️",
        timestamp: "5 hours ago",
        likes: 8,
        likedByUser: false,
        comments: []
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("mind_merit_posts_v1", JSON.stringify(posts));
  }, [posts]);

  // 5. Unlocked Certificates state
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem("mind_merit_certificates_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing certificates:", e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("mind_merit_certificates_v1", JSON.stringify(certificates));
  }, [certificates]);

  // System Badge Definitions
  const systemBadges: Badge[] = [
    { id: "welcome_badge", titleEn: "Mindful Starter", titleTh: "ผู้เริ่มต้นฝึกสมาธิ", descEn: "Triggered on starting MIND MERIT session.", descTh: "มอบให้เมื่อเริ่มต้นใช้งาน MIND MERIT", icon: "Zap" },
    { id: "streak_champion", titleEn: "Streak Champion", titleTh: "แชมป์บันทึกอารมณ์", descEn: "Unlocked for active wellness streak.", descTh: "มอบให้เมื่อเช็คอินสุขภาพใจติดต่อกัน", icon: "Award" },
    { id: "assessment_guru", titleEn: "Assessment Guru", titleTh: "ผู้รอบรู้สุขภาพใจ", descEn: "Earned on completing psychometric checks.", descTh: "มอบให้เมื่อผ่านการวัดระดับสุขภาพใจทางวิทยาศาสตร์", icon: "BookOpen" },
    { id: "stress_warrior", titleEn: "Stress Warrior", titleTh: "ผู้พิชิตความตึงเครียด", descEn: "Earned on stress course graduation.", descTh: "มอบให้เมื่อผ่านหลักสูตรจัดการความเครียด", icon: "ShieldAlert" }
  ];

  const t = translations[user.language];

  // Callback utilities
  const handleRewardXP = (amount: number) => {
    setUser((prev) => {
      const newXp = prev.xp + amount;
      const leveledUp = newXp >= prev.level * 100;
      return {
        ...prev,
        xp: leveledUp ? newXp - prev.level * 100 : newXp,
        level: leveledUp ? prev.level + 1 : prev.level
      };
    });
  };

  const handleUnlockBadge = (badgeId: string) => {
    if (user.badges.includes(badgeId)) return;
    setUser((prev) => ({
      ...prev,
      badges: [...prev.badges, badgeId]
    }));
  };

  const handleAddLog = (newLog: MoodCheckIn) => {
    setMoodLogs((prev) => [...prev, newLog]);
    // Auto unlock streak badge if logs count > 4
    if (moodLogs.length >= 4) {
      handleUnlockBadge("streak_champion");
    }
  };

  const handleAddChatMessage = (msg: ChatMessage) => {
    setChatHistory((prev) => [...prev, msg]);
  };

  const handleAddPost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleAddComment = (postId: string, text: string) => {
    setPosts((prev) => prev.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, {
            id: Math.random().toString(),
            author: user.anonymousMode ? (user.language === 'en' ? "Anonymous Buddy" : "บัดดี้ร่วมทาง") : user.name,
            anonymous: user.anonymousMode,
            content: text,
            timestamp: "Just now"
          }]
        };
      }
      return p;
    }));
  };

  const handleLikePost = (postId: string) => {
    setPosts((prev) => prev.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.likedByUser ? p.likes - 1 : p.likes + 1,
          likedByUser: !p.likedByUser
        };
      }
      return p;
    }));
  };

  const handleAddCertificate = (newCert: Certificate) => {
    setCertificates((prev) => [...prev, newCert]);
    
    // Auto-unlock specific badge depending on course name
    if (newCert.courseNameEn.includes("Stress")) {
      handleUnlockBadge("stress_warrior");
    }
  };

  // Nav items definitions (เอาหน้าหลักออกจากแดชบอร์ด ให้เหลือเฉพาะหน้าหลักที่อยู่ข้างบน)
  const sidebarNavItems = [
    { id: "dashboard", label: t.nav.dashboard, icon: LayoutDashboard, color: "sky" },
    { id: "moodCheck", label: t.nav.moodCheck, icon: BookOpen, color: "pink" },
    { id: "videos", label: t.nav.videos, icon: Video, color: "amber" },
    { id: "aiChat", label: t.nav.aiChat, icon: Bot, color: "emerald" },
    { id: "assessments", label: t.nav.assessments, icon: ClipboardList, color: "sky" },
    { id: "academy", label: t.nav.academy, icon: GraduationCap, color: "amber" },
    { id: "community", label: t.nav.community, icon: Users, color: "pink" },
    { id: "guide", label: t.nav.guide, icon: HelpCircle, color: "emerald" },
    { id: "admin", label: t.nav.admin, icon: Settings, color: "sky" },
    { id: "docs", label: t.nav.docs, icon: FileText, color: "emerald" }
  ];

  const getTabColorClasses = (id: string, isActive: boolean) => {
    if (!isActive) return 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800';
    switch (id) {
      case 'landing':
      case 'dashboard':
      case 'assessments':
      case 'admin':
        return 'bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-300 border-l-4 border-sky-500 font-bold shadow-2xs';
      case 'moodCheck':
      case 'community':
        return 'bg-pink-50 text-pink-700 dark:bg-pink-950/30 dark:text-pink-300 border-l-4 border-pink-500 font-bold shadow-2xs';
      case 'videos':
      case 'academy':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 border-l-4 border-amber-500 font-bold shadow-2xs';
      case 'aiChat':
      case 'guide':
      case 'docs':
      default:
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 border-l-4 border-emerald-500 font-bold shadow-2xs';
    }
  };

  const getMobileTabActiveColor = (id: string) => {
    switch (id) {
      case 'landing':
      case 'dashboard':
        return { text: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/50', dot: 'bg-sky-500' };
      case 'moodCheck':
        return { text: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-950/50', dot: 'bg-pink-500' };
      case 'videos':
        return { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/50', dot: 'bg-amber-500' };
      case 'aiChat':
      default:
        return { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/50', dot: 'bg-emerald-500' };
    }
  };

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300 pt-16">
      
      {/* 0. Brand Logo Splash Screen on Initial Link Open */}
      {showSplash && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-tr from-sky-50 via-teal-50/60 via-pink-50/50 to-amber-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-opacity duration-500 animate-in fade-in">
          <div className="flex flex-col items-center text-center p-6 space-y-6 max-w-sm">
            {/* Animated Logo with glowing rings */}
            <div 
              onClick={() => { setShowSplash(false); setIsLogoModalOpen(true); }}
              className="relative cursor-pointer group"
              title={user.language === 'en' ? "Click to view Logo" : "คลิกเพื่อดูโลโก้"}
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-sky-400 via-teal-400 via-pink-400 to-amber-300 rounded-full blur-xl opacity-60 animate-pulse"></div>
              
              <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-3xl bg-white dark:bg-slate-900 p-2 shadow-2xl border-2 border-white/90 dark:border-slate-800 flex items-center justify-center overflow-hidden hover:scale-105 transition-transform duration-300">
                <img 
                  src="/logo.png" 
                  alt="MIND MERIT" 
                  className="h-full w-full object-contain rounded-2xl"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.parentElement?.querySelector('.splash-fallback');
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
                <div className="splash-fallback hidden absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-sky-400 via-emerald-400 via-pink-400 to-amber-300">
                  <span className="font-sans text-4xl font-black text-white">M</span>
                </div>
              </div>
            </div>

            {/* Brand Title & Tagline */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                MIND MERIT
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user.language === 'en' 
                  ? "Mental Health & Productivity Ecosystem" 
                  : "แพลตฟอร์มดูแลสุขภาพใจและความสุขของคุณ"}
              </p>
            </div>

            {/* Subtle Progress Bar */}
            <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sky-500 via-teal-500 via-pink-500 to-amber-400 rounded-full animate-pulse w-full"></div>
            </div>

            {/* Skip / Enter Action button */}
            <button
              onClick={() => setShowSplash(false)}
              className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer pt-2"
            >
              {user.language === 'en' ? "Enter Home ➜" : "เข้าสู่หน้าหลัก ➜"}
            </button>
          </div>
        </div>
      )}

      {/* 1. Header Integration */}
      <Header 
        user={user} 
        onChangeLanguage={(lang) => setUser(prev => ({ ...prev, language: lang }))}
        onChangeTheme={(theme) => setUser(prev => ({ ...prev, theme: theme }))}
        onOpenSOS={() => setActiveTab("sos")}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenGuide={() => setActiveTab("guide")}
        onOpenLanding={() => setActiveTab("landing")}
        onViewLogo={() => setIsLogoModalOpen(true)}
        activeTab={activeTab}
      />

      {/* 2. Full-Stack Layout Canvas */}
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 pt-2 sm:pt-6 pb-24 md:pb-8">
        {activeTab === "landing" ? (
          <div className="w-full animate-in fade-in duration-300">
            <LandingPageView 
              user={user} 
              onEnterApp={() => setActiveTab("dashboard")} 
              onNavigateTab={(tab) => setActiveTab(tab)} 
              onUpdateUser={setUser}
              onViewLogo={() => setIsLogoModalOpen(true)}
            />
          </div>
        ) : (
          <div id="fullstack-grid" className="grid gap-6 md:grid-cols-4 items-start">
            
            {/* Left Navigation Menu (Desktop Sidebar) */}
            <nav id="desktop-sidebar-nav" className="hidden md:flex md:flex-col space-y-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-slate-800/80 rounded-3xl p-3 shadow-sm">
              {sidebarNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 text-left text-xs rounded-2xl transition-all cursor-pointer ${getTabColorClasses(item.id, isActive)}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Core Content viewport (Takes 3/4 space on desktop) */}
            <main id="main-content-viewport" className="md:col-span-3">
            {activeTab === "dashboard" && (
              <DashboardView 
                user={user} 
                moodLogs={moodLogs} 
                badges={systemBadges} 
                onNavigate={(tab) => setActiveTab(tab)}
                onUpdateUser={setUser}
                onOpenProfile={() => setIsProfileOpen(true)}
              />
            )}

            {activeTab === "moodCheck" && (
              <MoodCheckInView 
                user={user} 
                onAddLog={handleAddLog} 
                onRewardXP={handleRewardXP}
              />
            )}

            {activeTab === "videos" && (
              <VideosView 
                user={user} 
                onRewardXP={handleRewardXP} 
              />
            )}

            {activeTab === "aiChat" && (
              <ChatbotView 
                user={user} 
                chatHistory={chatHistory} 
                onAddChatMessage={handleAddChatMessage}
              />
            )}

            {activeTab === "assessments" && (
              <AssessmentView 
                user={user} 
                onRewardXP={handleRewardXP} 
                onUnlockBadge={handleUnlockBadge}
              />
            )}

            {activeTab === "academy" && (
              <LearningView 
                user={user} 
                onRewardXP={handleRewardXP} 
                onAddCertificate={handleAddCertificate}
                certificates={certificates}
              />
            )}

            {activeTab === "community" && (
              <CommunityView 
                user={user} 
                onRewardXP={handleRewardXP} 
                posts={posts} 
                onAddPost={handleAddPost} 
                onAddComment={handleAddComment} 
                onLikePost={handleLikePost}
              />
            )}

            {activeTab === "sos" && (
              <SOSView user={user} />
            )}

            {activeTab === "guide" && (
              <UserGuideView 
                user={user} 
                onNavigate={(tab) => setActiveTab(tab)} 
                onOpenProfile={() => setIsProfileOpen(true)} 
                onOpenSOS={() => setActiveTab("sos")} 
              />
            )}

            {activeTab === "admin" && (
              <AdminView user={user} certificates={certificates} />
            )}

            {activeTab === "docs" && (
              <DocsView user={user} />
            )}
          </main>

        </div>
        )}
      </div>

      {/* 3. Mobile Navigation Bottom Tab Bar (With Sky Blue, Pink, Yellow, and Mint Green accents) */}
      <nav id="mobile-tab-nav" className="fixed bottom-0 left-0 right-0 z-40 w-full border-t border-slate-100/70 bg-white/95 backdrop-blur-lg dark:border-slate-800/70 dark:bg-slate-900/95 md:hidden pb-safe pb-2.5 pt-1.5 px-1 flex justify-around shadow-lg transition-all duration-300">
        {sidebarNavItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const tabColor = getMobileTabActiveColor(item.id);
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setShowMobileMenu(false);
              }}
              className={`flex flex-col items-center justify-center text-[10px] font-bold w-16 py-1 cursor-pointer relative active:scale-90 transition-transform ${isActive ? tabColor.text : 'text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400'}`}
            >
              <div className={`p-1 rounded-xl transition-all duration-300 ${isActive ? `${tabColor.bg} scale-105` : ''}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="mt-1 scale-90 tracking-tight transition-all duration-200">{item.label.split(" ")[0]}</span>
              {isActive && (
                <span className={`absolute bottom-[-1px] h-1.5 w-1.5 rounded-full ${tabColor.dot} shadow-sm`} />
              )}
            </button>
          );
        })}
        {/* More Menu Button */}
        <button
          onClick={() => setShowMobileMenu(prev => !prev)}
          className={`flex flex-col items-center justify-center text-[10px] font-bold w-16 py-1 cursor-pointer relative active:scale-90 transition-transform ${showMobileMenu ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 hover:text-slate-500 dark:text-slate-500'}`}
        >
          <div className={`p-1 rounded-xl transition-all duration-300 ${showMobileMenu ? 'bg-sky-50 dark:bg-sky-950/50 scale-105' : ''}`}>
            <Menu className="h-5 w-5" />
          </div>
          <span className="mt-1 scale-90 tracking-tight">{user.language === 'en' ? "More" : "เพิ่มเติม"}</span>
          {showMobileMenu && (
            <span className="absolute bottom-[-1px] h-1.5 w-1.5 rounded-full bg-sky-500 dark:bg-sky-400 shadow-sm" />
          )}
        </button>
      </nav>

      {/* 3.1 Beautiful Mobile More Menu Bottom Sheet Drawer */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop Overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-350"
            onClick={() => setShowMobileMenu(false)}
          />
          
          {/* Bottom Sheet Drawer content */}
          <div className="relative z-50 w-full rounded-t-[32px] bg-white dark:bg-slate-900 p-6 shadow-2xl border-t border-sky-100/50 dark:border-slate-800 transition-all duration-350 animate-in slide-in-from-bottom">
            {/* Grabber handle indicator */}
            <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-200 dark:bg-slate-800 mb-5" />
            
            <div className="flex items-center justify-between mb-5 pb-2 border-b border-slate-100 dark:border-slate-800/60">
              <h3 className="text-xs font-black text-sky-600 dark:text-sky-400 uppercase tracking-widest">
                {user.language === 'en' ? "More Features" : "เมนูเพิ่มเติมและเครื่องมือ"}
              </h3>
              <button 
                onClick={() => setShowMobileMenu(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-300 hover:text-slate-600 dark:hover:text-white cursor-pointer active:scale-90 transition-transform"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Grid of extra menus */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {[
                { id: "guide", labelEn: "User Guide", labelTh: "วิธีใช้งาน", icon: HelpCircle, color: "emerald" },
                { id: "assessments", labelEn: "Assessments", labelTh: "ประเมินสุขภาพ", icon: ClipboardList, color: "sky" },
                { id: "academy", labelEn: "Academy", labelTh: "คลังความรู้ใจ", icon: GraduationCap, color: "amber" },
                { id: "community", labelEn: "Community", labelTh: "ชุมชนสนทนา", icon: Users, color: "pink" },
                { id: "sos", labelEn: "SOS Help", labelTh: "ช่วยเหลือด่วน", icon: ShieldAlert, highlight: true },
                { id: "docs", labelEn: "System Guide", labelTh: "คู่มือระบบ", icon: FileText, color: "emerald" },
                { id: "admin", labelEn: "Admin Hub", labelTh: "ศูนย์แอดมิน", icon: Settings, color: "sky" },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setShowMobileMenu(false);
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer active:scale-95 ${
                      isActive 
                        ? item.color === 'sky'
                          ? 'bg-sky-500 border-sky-500 text-white font-extrabold shadow-sm shadow-sky-500/20'
                          : item.color === 'pink'
                            ? 'bg-pink-500 border-pink-500 text-white font-extrabold shadow-sm shadow-pink-500/20'
                            : item.color === 'amber'
                              ? 'bg-amber-500 border-amber-500 text-white font-extrabold shadow-sm shadow-amber-500/20'
                              : 'bg-emerald-500 border-emerald-500 text-white font-extrabold shadow-sm shadow-emerald-500/20'
                        : item.highlight 
                          ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400 font-bold' 
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-800/80 dark:text-slate-300'
                    }`}
                  >
                    <div className={`p-1.5 rounded-xl mb-1.5 ${isActive ? 'bg-white/20' : ''}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold text-center line-clamp-1">
                      {user.language === 'en' ? item.labelEn : item.labelTh}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {/* Quick mini-profile card inside More drawer */}
            <div 
              id="mobile-drawer-profile-card"
              onClick={() => {
                setIsProfileOpen(true);
                setShowMobileMenu(false);
              }}
              title={user.language === 'en' ? "Open Profile" : "เปิดดูโปรไฟล์ของคุณ"}
              className="mt-5 p-3.5 rounded-2xl bg-gradient-to-tr from-purple-500/10 via-indigo-500/5 to-pink-500/5 dark:from-purple-950/20 dark:via-indigo-950/10 dark:to-pink-950/10 border border-purple-100/30 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-2xl h-10 w-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full aspect-square shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden">{user.avatar || "🧘"}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100">{user.name.replace(/!+$/, '')}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Lv. {user.level} • {user.xp} XP
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-orange-50 px-2.5 py-0.5 text-[10px] font-bold text-orange-600 dark:bg-orange-950/20 dark:text-orange-400 shadow-sm border border-orange-100 dark:border-orange-900/30">
                  🔥 {user.streak} {user.language === 'en' ? 'Days' : 'วัน'}
                </div>
                <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                  {user.language === 'en' ? "Profile ➜" : "โปรไฟล์ ➜"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Interactive User Profile Modal */}
      <UserProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        certificates={certificates}
        onUpdateUser={setUser}
        systemBadges={systemBadges}
      />

      {/* 6. Official Web Logo Viewer Modal */}
      <LogoModal 
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        language={user.language}
      />

    </div>
  );
}
