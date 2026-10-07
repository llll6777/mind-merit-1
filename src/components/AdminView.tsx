import React, { useState, useEffect } from "react";
import { 
  Database, 
  Server, 
  Cpu, 
  Activity, 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  Lock, 
  Layers, 
  DollarSign, 
  TrendingUp, 
  Package, 
  FileText, 
  Tag, 
  Download, 
  Bell, 
  Send, 
  HardDrive, 
  UploadCloud, 
  History, 
  FileCheck2, 
  UserCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  Search, 
  Filter, 
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  UserPlus,
  Eye,
  Check
} from "lucide-react";
import { 
  UserProfile, 
  Certificate, 
  AdminUserRecord, 
  CatalogItem, 
  ArticleItem, 
  PromotionItem, 
  PushNotificationItem, 
  FileAsset, 
  AuditLogEntry, 
  PdpaConsentRecord 
} from "../types";

interface AdminViewProps {
  user: UserProfile;
  certificates: Certificate[];
}

export default function AdminView({ user }: AdminViewProps) {
  const isEn = user.language === "en";

  // Tab navigation for the 4 core sections
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "data" | "security">("overview");
  const [dataSubTab, setDataSubTab] = useState<"catalog" | "articles" | "promotions" | "reports">("catalog");
  const [securitySubTab, setSecuritySubTab] = useState<"push" | "files" | "audit" | "pdpa">("push");

  // State for simulated backend data
  const [loading, setLoading] = useState(false);
  const [serverStats, setServerStats] = useState<any>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<AdminUserRecord[]>([]);
  const [catalogList, setCatalogList] = useState<CatalogItem[]>([]);
  const [articlesList, setArticlesList] = useState<ArticleItem[]>([]);
  const [promotionsList, setPromotionsList] = useState<PromotionItem[]>([]);
  const [notificationsList, setNotificationsList] = useState<PushNotificationItem[]>([]);
  const [filesList, setFilesList] = useState<FileAsset[]>([]);
  const [filesStats, setFilesStats] = useState<any>(null);
  const [auditLogsList, setAuditLogsList] = useState<AuditLogEntry[]>([]);
  const [pdpaList, setPdpaList] = useState<PdpaConsentRecord[]>([]);

  // Filter states
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userStatusFilter, setUserStatusFilter] = useState("all");

  // Modal & Form States
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserRole, setNewUserRole] = useState<"super_admin" | "staff_psychologist" | "customer">("customer");
  const [newUserProvider, setNewUserProvider] = useState<"email" | "google" | "apple" | "phone">("email");

  // New Catalog Item Modal
  const [showAddCatalogModal, setShowAddCatalogModal] = useState(false);
  const [newCatalogName, setNewCatalogName] = useState("");
  const [newCatalogPrice, setNewCatalogPrice] = useState(490);
  const [newCatalogType, setNewCatalogType] = useState<"consultation" | "course" | "subscription" | "assessment">("consultation");
  const [newCatalogDuration, setNewCatalogDuration] = useState("30 วัน");
  const [newCatalogDesc, setNewCatalogDesc] = useState("");

  // New Promotion Modal
  const [showAddPromoModal, setShowAddPromoModal] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState("");
  const [newPromoDiscount, setNewPromoDiscount] = useState(20);
  const [newPromoMax, setNewPromoMax] = useState(500);

  // Push Notification Form
  const [pushTitle, setPushTitle] = useState("");
  const [pushBody, setPushBody] = useState("");
  const [pushAudience, setPushAudience] = useState<"all" | "students" | "adults" | "vip">("all");
  const [pushSuccessMsg, setPushSuccessMsg] = useState("");

  // Upload File Simulation Form
  const [newFileName, setNewFileName] = useState("");
  const [newFileCategory, setNewFileCategory] = useState<"banner" | "avatar" | "document" | "certificate">("document");
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState("");

  // Role Permissions Matrix View
  const [showRolesMatrix, setShowRolesMatrix] = useState(false);

  // Active Admin Persona Simulator (allows testing UI as Super Admin vs Staff)
  const [currentAdminPersona, setCurrentAdminPersona] = useState<"super_admin" | "staff_psychologist">("super_admin");

  // Fetch initial data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Core Overview
      const resOverview = await fetch("/api/backend/overview");
      if (resOverview.ok) {
        const data = await resOverview.json();
        setServerStats(data);
      }

      // 2. Dashboard KPIs
      const resStats = await fetch("/api/admin/dashboard-stats");
      if (resStats.ok) {
        const data = await resStats.json();
        setDashboardStats(data);
      }

      // 3. Users
      const resUsers = await fetch("/api/admin/users");
      if (resUsers.ok) {
        const data = await resUsers.json();
        setUsersList(data.users || []);
      }

      // 4. Catalog
      const resCat = await fetch("/api/admin/catalog");
      if (resCat.ok) {
        const data = await resCat.json();
        setCatalogList(data.catalog || []);
      }

      // 5. Articles
      const resArt = await fetch("/api/admin/articles");
      if (resArt.ok) {
        const data = await resArt.json();
        setArticlesList(data.articles || []);
      }

      // 6. Promotions
      const resPromo = await fetch("/api/admin/promotions");
      if (resPromo.ok) {
        const data = await resPromo.json();
        setPromotionsList(data.promotions || []);
      }

      // 7. Notifications
      const resNotif = await fetch("/api/admin/notifications/history");
      if (resNotif.ok) {
        const data = await resNotif.json();
        setNotificationsList(data.notifications || []);
      }

      // 8. Files
      const resFiles = await fetch("/api/admin/files");
      if (resFiles.ok) {
        const data = await resFiles.json();
        setFilesList(data.files || []);
        setFilesStats(data.stats || null);
      }

      // 9. Audit Logs
      const resAudit = await fetch("/api/admin/audit-logs");
      if (resAudit.ok) {
        const data = await resAudit.json();
        setAuditLogsList(data.logs || []);
      }

      // 10. PDPA
      const resPdpa = await fetch("/api/admin/pdpa/consents");
      if (resPdpa.ok) {
        const data = await resPdpa.json();
        setPdpaList(data.consents || []);
      }
    } catch (e) {
      console.error("Failed to load admin backend data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Filtered Users
  const filteredUsers = usersList.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.phone.includes(userSearch);
    const matchRole = userRoleFilter === "all" || u.role === userRoleFilter;
    const matchStatus = userStatusFilter === "all" || u.status === userStatusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  // Handler: Add User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail || `${newUserName.toLowerCase().replace(/\s+/g, '')}@mindmerit.com`,
          phone: newUserPhone || "08x-xxx-xxxx",
          role: newUserRole,
          authProvider: newUserProvider
        })
      });
      if (res.ok) {
        await fetchAllData();
        setShowAddUserModal(false);
        setNewUserName("");
        setNewUserEmail("");
        setNewUserPhone("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Update User Role & Status
  const handleUpdateUser = async (id: string, updates: Partial<AdminUserRecord>) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        setUsersList((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Delete User
  const handleDeleteUser = async (id: string) => {
    if (!confirm(isEn ? "Are you sure you want to delete this user?" : "คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้ออกจากระบบ?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsersList((prev) => prev.filter((u) => u.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Add Catalog Package
  const handleCreateCatalog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatalogName.trim()) return;
    try {
      const res = await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatalogName,
          price: newCatalogPrice,
          type: newCatalogType,
          duration: newCatalogDuration,
          description: newCatalogDesc
        })
      });
      if (res.ok) {
        await fetchAllData();
        setShowAddCatalogModal(false);
        setNewCatalogName("");
        setNewCatalogDesc("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Delete Catalog Package
  const handleDeleteCatalog = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/catalog/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCatalogList((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Add Promotion Code
  const handleCreatePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    try {
      const res = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newPromoCode,
          discountPercent: newPromoDiscount,
          maxDiscount: newPromoMax
        })
      });
      if (res.ok) {
        await fetchAllData();
        setShowAddPromoModal(false);
        setNewPromoCode("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Delete Promotion
  const handleDeletePromo = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/promotions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPromotionsList((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Send Push Notification
  const handleSendPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle.trim() || !pushBody.trim()) return;
    try {
      const res = await fetch("/api/admin/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: pushTitle,
          body: pushBody,
          audience: pushAudience
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPushSuccessMsg(isEn ? `Successfully sent to ${data.deliveredCount} devices!` : `ส่งการแจ้งเตือนสำเร็จไปยัง ${data.deliveredCount.toLocaleString()} อุปกรณ์เรียบร้อยแล้ว!`);
        setTimeout(() => setPushSuccessMsg(""), 4000);
        setPushTitle("");
        setPushBody("");
        await fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Upload File Simulation
  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    try {
      const res = await fetch("/api/admin/files/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newFileName,
          category: newFileCategory,
          sizeMB: Number((Math.random() * 2 + 0.2).toFixed(2))
        })
      });
      if (res.ok) {
        setUploadSuccessMsg(isEn ? "File uploaded to Cloud Storage successfully!" : "อัปโหลดไฟล์ขึ้น Cloud Storage Bucket สำเร็จ!");
        setTimeout(() => setUploadSuccessMsg(""), 3000);
        setNewFileName("");
        await fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Delete File
  const handleDeleteFile = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/files/${id}`, { method: "DELETE" });
      if (res.ok) {
        setFilesList((prev) => prev.filter((f) => f.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Trigger CSV Download
  const handleDownloadReport = (type: "users" | "sales" | "audit" | "pdpa") => {
    const link = document.createElement("a");
    link.href = `/api/admin/export/${type}`;
    link.setAttribute("download", `mindmerit_${type}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler: PDPA Action
  const handlePdpaAction = async (userId: string, action: "erase" | "withdraw_marketing") => {
    const confirmMsg = action === "erase" 
      ? (isEn ? "Execute Right to Erasure? This permanently removes all user records." : "ยืนยันการลบข้อมูลตามสิทธิ PDPA หรือไม่? ข้อมูลของผู้ใช้จะถูกลบถาวร")
      : (isEn ? "Withdraw marketing consent for this user?" : "ถอนความยินยอมการรับข้อมูลการตลาดสำหรับผู้ใช้นี้?");
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch("/api/admin/pdpa/process-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action })
      });
      if (res.ok) {
        await fetchAllData();
        alert(isEn ? "PDPA action executed successfully." : "ดำเนินการตามสิทธิ PDPA เรียบร้อยแล้ว");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="admin-hub-main" className="space-y-6 animate-in fade-in duration-300 pb-16">
      
      {/* =========================================================================
          TOP BANNER: System Architecture Status & Role Switcher
          ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-sky-800/40">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest text-sky-400 font-bold uppercase">
                MIND MERIT CLOUD ECOSYSTEM • BACKEND & ADMIN SUITE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>{isEn ? "Backend & Admin Control Center" : "ระบบบริหารจัดการหลังบ้านและโครงสร้างพื้นฐาน"}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isEn 
                ? "Full-stack enterprise administration: Cloud hosting, database clusters, multi-channel user identity, product catalogs, automated push notifications, and PDPA compliance."
                : "ศูนย์ควบคุมหลังบ้านระดับองค์กร: ตรวจสอบเซิร์ฟเวอร์ คลัสเตอร์ฐานข้อมูล จัดการสิทธิ์ผู้ใช้งาน สินค้าและบทความ ระบบแจ้งเตือน และกำกับดูแลความปลอดภัยตามกฎหมาย PDPA"}
            </p>
          </div>

          {/* Quick Admin Persona Switcher & Live Ping */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shrink-0">
            <div className="text-left">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Operator Role:</span>
              <div className="flex items-center space-x-2 mt-1">
                <button
                  onClick={() => setCurrentAdminPersona("super_admin")}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    currentAdminPersona === "super_admin" 
                      ? "bg-amber-400 text-slate-950 shadow-sm" 
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  ⚡ Super Admin
                </button>
                <button
                  onClick={() => setCurrentAdminPersona("staff_psychologist")}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    currentAdminPersona === "staff_psychologist" 
                      ? "bg-sky-400 text-slate-950 shadow-sm" 
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  👩‍⚕️ Staff Psychologist
                </button>
              </div>
            </div>

            <button
              onClick={fetchAllData}
              disabled={loading}
              title="Refresh telemetry & database records"
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-sky-400' : ''}`} />
            </button>
          </div>

        </div>

        {/* Live Infrastructure Quick Ticker */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Server className="h-4 w-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Hosting Platform</span>
              <span className="font-bold text-slate-200">{serverStats?.server?.platform?.split("/")[0] || "Google Cloud Run"}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4 text-sky-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Database Engine</span>
              <span className="font-bold text-slate-200">PostgreSQL 16 & Redis</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">API Response Time</span>
              <span className="font-bold text-emerald-400">{serverStats?.apiGateway?.avgLatencyMs || 34} ms (Optimal)</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-pink-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Security & PDPA</span>
              <span className="font-bold text-slate-200">2FA • Encrypted (PDPA)</span>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          MAIN NAVIGATION TABS (โครงสร้าง 4 องค์ประกอบหลักตามคำขอ)
          ========================================================================= */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        
        {/* Tab 1: โครงสร้างพื้นฐาน & แดชบอร์ด */}
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>{isEn ? "1. Infrastructure & Dashboard" : "1. โครงสร้างพื้นฐาน & แดชบอร์ดสรุปผล"}</span>
        </button>

        {/* Tab 2: ฟังก์ชันระบบผู้ใช้งาน & สิทธิ์ */}
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "users"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>{isEn ? "2. User Management & Roles" : "2. จัดการผู้ใช้งาน & กำหนดสิทธิ์ (RBAC)"}</span>
        </button>

        {/* Tab 3: จัดการข้อมูล & รายงาน */}
        <button
          onClick={() => setActiveTab("data")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "data"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>{isEn ? "3. Data Management & Export" : "3. จัดการข้อมูลแอป & ส่งออกรายงาน"}</span>
        </button>

        {/* Tab 4: ระบบเสริมและความปลอดภัย */}
        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "security"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>{isEn ? "4. Security, Push & PDPA" : "4. แจ้งเตือน, ไฟล์, บันทึก & PDPA"}</span>
        </button>

      </div>

      {/* =========================================================================
          TAB 1: โครงสร้างพื้นฐาน & แดชบอร์ดสรุปผล (INFRASTRUCTURE & DASHBOARD)
          ========================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          
          {/* SECTION 1.1: Core Infrastructure Metrics (Server / DB / API) */}
          <div className="grid gap-4 sm:grid-cols-3">
            
            {/* 1. Server / Hosting */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 font-bold">
                  <Server className="h-5 w-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200">
                  Healthy • Uptime {Math.floor((serverStats?.server?.uptimeSeconds || 120) / 60)}m
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">เซิร์ฟเวอร์ (Server / Hosting)</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Google Cloud Run • asia-southeast1</p>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-500">
                <span>Memory Heap: <strong>{serverStats?.server?.memoryUsageMB || 124} MB</strong></span>
                <span>Port: <strong>3000 (HTTPS)</strong></span>
              </div>
            </div>

            {/* 2. Database */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold">
                  <Database className="h-5 w-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200">
                  Cluster Online
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">ฐานข้อมูล (PostgreSQL & Redis)</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">7 ตารางหลัก • 18/100 Active Pool</p>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-500">
                <span>ความหน่วง (Latency): <strong>1.2 ms</strong></span>
                <span>ขนาดข้อมูล: <strong>48.6 MB</strong></span>
              </div>
            </div>

            {/* 3. API Gateway */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400 font-bold">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 border border-sky-200">
                  Rate Limit 600 req/m
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">ระบบ API (RESTful Endpoints)</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ตัวกลางรับส่งข้อมูล Web & Mobile App</p>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-500">
                <span>ปริมาณเรียกวันนี้: <strong>142,890 ครั้ง</strong></span>
                <span>Error Rate: <strong>0.01%</strong></span>
              </div>
            </div>

          </div>

          {/* SECTION 1.2: Admin Dashboard KPIs (ยอดขาย & ผู้ใช้งานรายวัน) */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            
            {/* KPI 1: Total Users */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-sky-500/10 via-white to-white dark:from-sky-950/20 dark:via-slate-900 dark:to-slate-900 border border-sky-100 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-sky-600 dark:text-sky-400 tracking-wider">
                จำนวนผู้ใช้งานทั้งหมด (Total Users)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                19,670 <span className="text-xs font-bold text-emerald-500">+14%</span>
              </div>
              <p className="text-[11px] text-slate-400">สมัครสมาชิกใหม่วันนี้ +94 คน</p>
            </div>

            {/* KPI 2: Daily Active Users */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-white to-white dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900 border border-emerald-100 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                ผู้ใช้งานรายวัน (DAU)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                3,420 <span className="text-xs font-bold text-emerald-500">+8.2%</span>
              </div>
              <p className="text-[11px] text-slate-400">เช็คอินอารมณ์และฝึกสมาธิสด</p>
            </div>

            {/* KPI 3: Monthly Revenue */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-white to-white dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 border border-amber-100 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                ยอดขายบริการสะสม (Revenue)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                ฿284,500
              </div>
              <p className="text-[11px] text-slate-400">จากการปรึกษา 1-on-1 และคอร์ส</p>
            </div>

            {/* KPI 4: 1-on-1 Bookings */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-pink-500/10 via-white to-white dark:from-pink-950/20 dark:via-slate-900 dark:to-slate-900 border border-pink-100 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-pink-600 dark:text-pink-400 tracking-wider">
                การปรึกษากับผู้เชี่ยวชาญ (Consults)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                148 <span className="text-xs font-bold text-sky-500">เคส</span>
              </div>
              <p className="text-[11px] text-slate-400">ความพึงพอใจเฉลี่ย 4.9/5 ดาว ⭐</p>
            </div>

          </div>

          {/* SECTION 1.3: Interactive Weekly Sales & Active Users Trend Chart */}
          <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  แนวโน้มยอดขายและผู้ใช้งานรายวัน (7-Day Revenue & User Activity)
                </h3>
                <p className="text-xs text-slate-400">เปรียบเทียบยอดขายสุทธิ (บาท) กับจำนวนผู้เข้าใช้งานระบบสด</p>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <span className="flex items-center space-x-1.5 text-sky-600 font-bold">
                  <span className="h-3 w-3 rounded-full bg-sky-500" />
                  <span>ผู้ใช้งานรายวัน</span>
                </span>
                <span className="flex items-center space-x-1.5 text-emerald-600 font-bold">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span>ยอดขายบริการ (฿)</span>
                </span>
              </div>
            </div>

            {/* SVG Visual Chart */}
            <div className="h-44 w-full flex items-end justify-between px-2 pt-6 pb-2 gap-2 border-b border-slate-100 dark:border-slate-800">
              {[
                { day: "30 ก.ย.", revH: 60, userH: 70, revText: "฿32k", userText: "2.9k" },
                { day: "1 ต.ค.", revH: 72, userH: 78, revText: "฿38k", userText: "3.1k" },
                { day: "2 ต.ค.", revH: 82, userH: 85, revText: "฿41k", userText: "3.3k" },
                { day: "3 ต.ค.", revH: 75, userH: 81, revText: "฿39k", userText: "3.2k" },
                { day: "4 ต.ค.", revH: 92, userH: 88, revText: "฿45k", userText: "3.4k" },
                { day: "5 ต.ค.", revH: 86, userH: 84, revText: "฿43k", userText: "3.4k" },
                { day: "6 ต.ค.", revH: 95, userH: 94, revText: "฿44k", userText: "3.5k" },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer">
                  <div className="text-[9px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {item.revText}
                  </div>
                  <div className="w-full flex justify-center items-end gap-1.5 h-full">
                    {/* User bar */}
                    <div 
                      className="w-3 sm:w-4 rounded-t-md bg-sky-400 dark:bg-sky-500 hover:brightness-110 transition-all"
                      style={{ height: `${item.userH}%` }}
                      title={`Active Users: ${item.userText}`}
                    />
                    {/* Revenue bar */}
                    <div 
                      className="w-3 sm:w-4 rounded-t-md bg-emerald-400 dark:bg-emerald-500 hover:brightness-110 transition-all"
                      style={{ height: `${item.revH}%` }}
                      title={`Revenue: ${item.revText}`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-2">{item.day}</span>
                </div>
              ))}
            </div>

            {/* Sub-breakdowns (Roles & Concerns) */}
            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">สัดส่วนผู้ใช้งานตามบทบาท</span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>🎓 นักเรียน / นักศึกษา</span>
                    <span className="font-bold">63% (12,450 คน)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-400 rounded-full" style={{ width: "63%" }} />
                  </div>

                  <div className="flex justify-between text-slate-600 dark:text-slate-300 pt-1">
                    <span>💼 วัยทำงาน / องค์กร</span>
                    <span className="font-bold">34% (6,750 คน)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: "34%" }} />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">ปัญหาทางใจที่พบมากที่สุด</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400">ความเครียดสะสม</p>
                    <p className="font-bold text-sky-600 text-sm">38% (สูงสุด)</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400">หมดไฟทำงาน (Burnout)</p>
                    <p className="font-bold text-emerald-600 text-sm">27%</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 2: ฟังก์ชันระบบผู้ใช้งาน & กำหนดสิทธิ์ (USER MANAGEMENT & ROLES)
          ========================================================================= */}
      {activeTab === "users" && (
        <div className="space-y-6">
          
          {/* Header controls & Multi-channel Auth info */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
                  {isEn ? "User Management & Role-Based Access Control" : "ระบบจัดการผู้ใช้งานและกำหนดสิทธิ์ (User & RBAC)"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  รองรับการเข้าสู่ระบบผ่าน อีเมล, เบอร์โทร OTP, Google, Apple ID และกำหนดสิทธิ์ 3 ระดับ
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowRolesMatrix(true)}
                  className="px-3.5 py-2 rounded-xl border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/30 text-xs font-bold hover:bg-sky-100 transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Key className="h-3.5 w-3.5" />
                  <span>ตารางสิทธิ์ (Permissions Matrix)</span>
                </button>

                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>+ เพิ่มผู้ใช้ใหม่</span>
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="grid gap-3 sm:grid-cols-3 pt-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อ, อีเมล หรือเบอร์โทร..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
              </div>

              <div>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
                >
                  <option value="all">ระดับสิทธิ์ทั้งหมด (All Roles)</option>
                  <option value="super_admin">⚡ แอดมินสูงสุด (Super Admin)</option>
                  <option value="staff_psychologist">👩‍⚕️ ผู้เชี่ยวชาญ/พนักงาน (Staff)</option>
                  <option value="customer">🎓 ลูกค้า/ผู้ใช้ทั่วไป (Customer)</option>
                </select>
              </div>

              <div>
                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
                >
                  <option value="all">สถานะบัญชีทั้งหมด (All Status)</option>
                  <option value="active">🟢 ใช้งานปกติ (Active)</option>
                  <option value="suspended">🔴 ระงับชั่วคราว (Suspended)</option>
                </select>
              </div>
            </div>

          </div>

          {/* User Table */}
          <div className="overflow-x-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-extrabold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-4">ผู้ใช้งาน</th>
                  <th className="p-4">ช่องทางล็อกอิน</th>
                  <th className="p-4">ระดับสิทธิ์ (Role)</th>
                  <th className="p-4">สถานะบัญชี</th>
                  <th className="p-4">เข้าสู่ระบบล่าสุด</th>
                  <th className="p-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      ไม่พบข้อมูลผู้ใช้ที่ตรงกับเงื่อนไขการค้นหา
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      
                      {/* Name & avatar */}
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl h-8 w-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl">{u.avatar || "🧘"}</span>
                          <div>
                            <div className="font-extrabold text-slate-800 dark:text-slate-100">{u.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{u.email} • {u.phone}</div>
                          </div>
                        </div>
                      </td>

                      {/* Login Channel */}
                      <td className="p-4">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.authProvider === 'google' 
                            ? 'bg-red-50 text-red-600 dark:bg-red-950/30' 
                            : u.authProvider === 'apple' 
                              ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200' 
                              : u.authProvider === 'phone'
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30'
                                : 'bg-sky-50 text-sky-700 dark:bg-sky-950/30'
                        }`}>
                          <span>{u.authProvider === 'google' ? '🌐 Google' : u.authProvider === 'apple' ? '🍎 Apple' : u.authProvider === 'phone' ? '📱 เบอร์โทร' : '✉️ อีเมล'}</span>
                        </span>
                      </td>

                      {/* Role selection dropdown */}
                      <td className="p-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateUser(u.id, { role: e.target.value as any })}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border focus:outline-none ${
                            u.role === 'super_admin'
                              ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300'
                              : u.role === 'staff_psychologist'
                                ? 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/30 dark:text-sky-300'
                                : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          <option value="super_admin">⚡ Super Admin</option>
                          <option value="staff_psychologist">👩‍⚕️ Staff Psychologist</option>
                          <option value="customer">🎓 Customer</option>
                        </select>
                      </td>

                      {/* Status toggle */}
                      <td className="p-4">
                        <button
                          onClick={() => handleUpdateUser(u.id, { status: u.status === 'active' ? 'suspended' : 'active' })}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer ${
                            u.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40'
                              : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40'
                          }`}
                        >
                          {u.status === 'active' ? '🟢 ปกติ (Active)' : '🔴 ระงับ (Suspended)'}
                        </button>
                      </td>

                      {/* Last login */}
                      <td className="p-4 text-[10px] text-slate-400 font-mono">
                        {new Date(u.lastLogin).toLocaleDateString()} {new Date(u.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      {/* Action buttons */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                          title="ลบผู้ใช้"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 3: จัดการข้อมูล & รายงาน (DATA MANAGEMENT & EXPORT)
          ========================================================================= */}
      {activeTab === "data" && (
        <div className="space-y-6">
          
          {/* Sub-nav for Data Management */}
          <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <button
              onClick={() => setDataSubTab("catalog")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                dataSubTab === "catalog" ? "bg-slate-800 text-white dark:bg-white dark:text-slate-900" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              📦 สินค้า & แพ็กเกจการให้คำปรึกษา ({catalogList.length})
            </button>
            <button
              onClick={() => setDataSubTab("articles")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                dataSubTab === "articles" ? "bg-slate-800 text-white dark:bg-white dark:text-slate-900" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              ✍️ บทความ & สาระน่ารู้ ({articlesList.length})
            </button>
            <button
              onClick={() => setDataSubTab("promotions")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                dataSubTab === "promotions" ? "bg-slate-800 text-white dark:bg-white dark:text-slate-900" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              🏷️ โปรโมชัน & คูปองส่วนลด ({promotionsList.length})
            </button>
            <button
              onClick={() => setDataSubTab("reports")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                dataSubTab === "reports" ? "bg-emerald-600 text-white" : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
              }`}
            >
              📥 ระบบส่งออกรายงาน (Export CSV)
            </button>
          </div>

          {/* Sub-tab 1: Catalog & Packages */}
          {dataSubTab === "catalog" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">จัดการแพ็กเกจการให้คำปรึกษา คอร์สฟื้นฟูจิตใจ และราคาในแอป</p>
                <button
                  onClick={() => setShowAddCatalogModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-sky-500 text-white text-xs font-bold hover:bg-sky-600 transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>เพิ่มสินค้า/แพ็กเกจ</span>
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {catalogList.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-sky-50 text-sky-700 uppercase">
                          {item.type}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mt-1">{item.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-emerald-600">฿{item.price.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400">{item.duration}</div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
                      <span>ยอดซื้อสะสม: <strong>{item.salesCount.toLocaleString()} ครั้ง</strong></span>
                      <button
                        onClick={() => handleDeleteCatalog(item.id)}
                        className="text-rose-500 hover:text-rose-700 text-xs font-bold cursor-pointer"
                      >
                        ลบออก
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-tab 2: Articles */}
          {dataSubTab === "articles" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">จัดการบทความจิตวิทยาเพื่อการศึกษาและดูแลตนเอง</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {articlesList.map((art) => (
                  <div key={art.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-50 text-purple-700">
                        {art.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${art.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {art.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{art.title}</h4>
                    <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span>ผู้เขียน: {art.author}</span>
                      <span>👁️ {art.views.toLocaleString()} • ❤️ {art.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-tab 3: Promotions */}
          {dataSubTab === "promotions" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">จัดการโค้ดส่วนลดและแคมเปญโปรโมชัน</p>
                <button
                  onClick={() => setShowAddPromoModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>สร้างโค้ดส่วนลด</span>
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {promotionsList.map((pro) => (
                  <div key={pro.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-base font-black text-amber-600">{pro.code}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${pro.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {pro.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      ลดทันที <strong>{pro.discountPercent}%</strong> (สูงสุด ฿{pro.maxDiscount})
                    </div>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-400">
                      <span>ใช้แล้ว {pro.usageCount}/{pro.maxUsage}</span>
                      <button onClick={() => handleDeletePromo(pro.id)} className="text-rose-500 hover:text-rose-700 cursor-pointer">ลบ</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-tab 4: Reports & Export */}
          {dataSubTab === "reports" && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  ระบบดึงข้อมูลและส่งออกรายงาน (Data Export & Analysis)
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  ดาวน์โหลดข้อมูลจากระบบออกเป็นไฟล์ CSV (พร้อมรหัส UTF-8 BOM) สามารถนำไปเปิดใช้งานใน Microsoft Excel, Google Sheets หรือเครื่องมือวิเคราะห์ BI ได้ทันที
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                
                <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-3">
                  <div className="flex items-center space-x-2 text-sky-600">
                    <Users className="h-5 w-5" />
                    <span className="font-extrabold text-sm">ข้อมูลผู้ใช้งาน (Users)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">รายชื่อ, อีเมล, เบอร์โทร, สิทธิ์, ช่องทางล็อกอิน และเวลาเข้าสู่ระบบ</p>
                  <button
                    onClick={() => handleDownloadReport("users")}
                    className="w-full py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>ดาวน์โหลด Users CSV</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-600">
                    <DollarSign className="h-5 w-5" />
                    <span className="font-extrabold text-sm">ยอดขายและบริการ (Sales)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">ยอดจำหน่ายแพ็กเกจปรึกษา, ราคา, รายได้รวม และสถิติบริการ</p>
                  <button
                    onClick={() => handleDownloadReport("sales")}
                    className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>ดาวน์โหลด Sales CSV</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-600">
                    <History className="h-5 w-5" />
                    <span className="font-extrabold text-sm">ประวัติการทำงาน (Audit)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">บันทึกการกระทำของแอดมิน, IP Address, วันเวลา และรายละเอียด</p>
                  <button
                    onClick={() => handleDownloadReport("audit")}
                    className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>ดาวน์โหลด Audit CSV</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-3">
                  <div className="flex items-center space-x-2 text-purple-600">
                    <ShieldCheck className="h-5 w-5" />
                    <span className="font-extrabold text-sm">ความยินยอม PDPA</span>
                  </div>
                  <p className="text-[11px] text-slate-500">บันทึกการยอมรับข้อตกลงความเป็นส่วนตัวและสิทธิผู้ใช้งาน</p>
                  <button
                    onClick={() => handleDownloadReport("pdpa")}
                    className="w-full py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>ดาวน์โหลด PDPA CSV</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          TAB 4: ระบบเสริมและความปลอดภัย (SECURITY, PUSH, FILES & PDPA)
          ========================================================================= */}
      {activeTab === "security" && (
        <div className="space-y-6">
          
          {/* Sub-nav */}
          <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <button
              onClick={() => setSecuritySubTab("push")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                securitySubTab === "push" ? "bg-slate-800 text-white dark:bg-white dark:text-slate-900" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              🔔 การแจ้งเตือน (Push Notification)
            </button>
            <button
              onClick={() => setSecuritySubTab("files")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                securitySubTab === "files" ? "bg-slate-800 text-white dark:bg-white dark:text-slate-900" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              📁 จัดการไฟล์และรูปภาพ ({filesList.length})
            </button>
            <button
              onClick={() => setSecuritySubTab("audit")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                securitySubTab === "audit" ? "bg-slate-800 text-white dark:bg-white dark:text-slate-900" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              📜 บันทึกการใช้งาน (Audit Log)
            </button>
            <button
              onClick={() => setSecuritySubTab("pdpa")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                securitySubTab === "pdpa" ? "bg-emerald-600 text-white" : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
              }`}
            >
              🛡️ การกำกับดูแล PDPA
            </button>
          </div>

          {/* 4.1 Push Notification Composer & Phone Preview */}
          {securitySubTab === "push" && (
            <div className="grid gap-6 lg:grid-cols-12 items-start">
              
              {/* Left: Push Form */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div>
                  <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                    ส่งข้อความแจ้งเตือนหาผู้ใช้ผ่านมือถือ (Push Notification)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">กระจายการแจ้งเตือนไปยังแอปพลิเคชันบนมือถือแบบเรียลไทม์</p>
                </div>

                {pushSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{pushSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSendPush} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">หัวข้อข้อความแจ้งเตือน</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น ☀️ เริ่มต้นวันใหม่อย่างสดใส เช็คอินอารมณ์กันเถอะ"
                      value={pushTitle}
                      onChange={(e) => setPushTitle(e.target.value)}
                      className="w-full mt-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">เนื้อหาข้อความ</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="เช่น สละเวลา 1 นาทีมาคุยกับ AI Companion และฝึกหายใจคลายเครียดก่อนสอบ..."
                      value={pushBody}
                      onChange={(e) => setPushBody(e.target.value)}
                      className="w-full mt-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">กลุ่มผู้รับเป้าหมาย (Target Audience)</label>
                    <select
                      value={pushAudience}
                      onChange={(e) => setPushAudience(e.target.value as any)}
                      className="w-full mt-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
                    >
                      <option value="all">📢 สมาชิกทุกคนในระบบ (~14,250 อุปกรณ์)</option>
                      <option value="students">🎓 เฉพาะกลุ่มนักเรียน / นักศึกษา (~8,900 อุปกรณ์)</option>
                      <option value="adults">💼 เฉพาะกลุ่มคนทำงาน / บริษัท (~5,300 อุปกรณ์)</option>
                      <option value="vip">⭐ เฉพาะสมาชิกระดับ VIP / ผู้รับการปรึกษา (~480 อุปกรณ์)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-extrabold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>ส่ง Push Notification ทันที</span>
                  </button>
                </form>

                {/* History list */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">ประวัติการส่งล่าสุด</span>
                  <div className="space-y-2">
                    {notificationsList.map((n) => (
                      <div key={n.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">{n.title}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{n.body}</div>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-600 shrink-0 font-bold">
                          ✓ {n.recipientsCount.toLocaleString()} devices
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right: Live Mobile Lock Screen Preview */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <span className="text-xs font-bold text-slate-500 mb-2">ตัวอย่างการแสดงผลบนหน้าจอมือถือ (Live Mobile Preview)</span>
                <div className="relative w-64 rounded-[36px] border-4 border-slate-800 bg-slate-900 p-3 shadow-2xl text-white overflow-hidden aspect-[9/18] flex flex-col justify-between">
                  {/* Speaker Notch */}
                  <div className="mx-auto h-4 w-24 bg-black rounded-full" />
                  
                  {/* Lock Screen Time */}
                  <div className="text-center pt-6 space-y-1">
                    <div className="text-[10px] opacity-75">วันอังคารที่ 6 ตุลาคม</div>
                    <div className="text-4xl font-extrabold">09:41</div>
                  </div>

                  {/* Simulated Notification Card */}
                  <div className="my-auto p-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 text-slate-900 dark:text-white shadow-lg space-y-1">
                    <div className="flex items-center justify-between text-[9px] text-slate-300">
                      <div className="flex items-center space-x-1">
                        <span className="font-extrabold text-sky-400">MIND MERIT</span>
                        <span>• ตอนนี้</span>
                      </div>
                    </div>
                    <div className="text-xs font-extrabold text-white">
                      {pushTitle || "☀️ เช็คอินพลังใจยามเช้า"}
                    </div>
                    <div className="text-[10px] text-slate-200 line-clamp-2 leading-relaxed">
                      {pushBody || "สละเวลา 1 นาทีมาบันทึกความรู้สึก และรับข้อคิดพลังบวกจาก MIND MERIT กันนะ!"}
                    </div>
                  </div>

                  {/* Bottom bar */}
                  <div className="mx-auto h-1 w-24 bg-white/40 rounded-full mb-1" />
                </div>
              </div>

            </div>
          )}

          {/* 4.2 File Management */}
          {securitySubTab === "files" && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                    จัดการไฟล์และรูปภาพ (Cloud Storage & Assets)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    พื้นที่จัดเก็บรูปภาพแบนเนอร์, ตราประทับเกียรติบัตร, และเอกสารทางการแพทย์
                  </p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <span>พื้นที่ใช้งาน: <strong>{filesStats?.usedStorageMB || 1242} MB</strong> / 50 GB</span>
                </div>
              </div>

              {uploadSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  {uploadSuccessMsg}
                </div>
              )}

              {/* Upload simulator form */}
              <form onSubmit={handleUploadFile} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  required
                  placeholder="ชื่อไฟล์ (เช่น banner-mindfulness-2026.png)"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
                />
                <select
                  value={newFileCategory}
                  onChange={(e) => setNewFileCategory(e.target.value as any)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
                >
                  <option value="banner">🖼️ รูปแบนเนอร์ (Banner)</option>
                  <option value="certificate">📜 ตราประทับ (Certificate)</option>
                  <option value="avatar">🧑 รูปโปรไฟล์ (Avatar)</option>
                  <option value="document">📄 เอกสาร PDF (Document)</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shrink-0"
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>อัปโหลดขึ้น Cloud</span>
                </button>
              </form>

              {/* Files Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-extrabold border-b border-slate-100">
                    <tr>
                      <th className="p-3">ชื่อไฟล์</th>
                      <th className="p-3">หมวดหมู่</th>
                      <th className="p-3">ขนาด</th>
                      <th className="p-3">วันที่อัปโหลด</th>
                      <th className="p-3 text-right">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filesList.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-200">{f.name}</td>
                        <td className="p-3 text-slate-500 uppercase text-[10px]">{f.category}</td>
                        <td className="p-3 text-slate-500">{f.sizeMB} MB</td>
                        <td className="p-3 text-slate-400 font-mono text-[10px]">{f.uploadedAt}</td>
                        <td className="p-3 text-right">
                          <button onClick={() => handleDeleteFile(f.id)} className="text-rose-500 hover:text-rose-700 cursor-pointer">
                            ลบ
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* 4.3 Audit Log */}
          {securitySubTab === "audit" && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div>
                <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                  ระบบบันทึกการใช้งานและความปลอดภัย (Audit Log)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  บันทึกประวัติว่าแอดมินคนไหนเข้ามาแก้ไข หรือทำธุรกรรมใดในระบบ เพื่อความโปร่งใสและตรวจสอบย้อนหลังได้
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-extrabold border-b border-slate-100">
                    <tr>
                      <th className="p-3">วันเวลา</th>
                      <th className="p-3">ผู้ดำเนินการ</th>
                      <th className="p-3">คำสั่งการทำงาน (Action)</th>
                      <th className="p-3">รายละเอียด</th>
                      <th className="p-3">IP Address</th>
                      <th className="p-3">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {auditLogsList.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="p-3 text-slate-400 font-mono text-[10px]">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{log.adminName}</span>
                          <span className="text-[10px] text-slate-400 block">{log.adminRole}</span>
                        </td>
                        <td className="p-3 font-mono text-[10px] text-sky-600 font-bold">{log.action}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">{log.details}</td>
                        <td className="p-3 text-slate-400 font-mono text-[10px]">{log.ipAddress}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            log.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4.4 PDPA Compliance */}
          {securitySubTab === "pdpa" && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                    ระบบกำกับดูแลกฎหมาย PDPA (Personal Data Protection Act)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ตรวจสอบบันทึกความยินยอม (Consent) และดำเนินการตามคำร้องขอของเจ้าของข้อมูล (Data Subject Rights)
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 self-start sm:self-auto">
                  ✓ มาตรฐาน PDPA พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
                </span>
              </div>

              {/* Consent table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-extrabold border-b border-slate-100">
                    <tr>
                      <th className="p-3">ผู้ใช้งาน</th>
                      <th className="p-3">ยินยอมเงื่อนไข</th>
                      <th className="p-3">วิเคราะห์ข้อมูล</th>
                      <th className="p-3">การตลาด</th>
                      <th className="p-3">ข้อมูลสุขภาพอ่อนไหว</th>
                      <th className="p-3 text-right">สิทธิของเจ้าของข้อมูล (Actions)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {pdpaList.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="p-3">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{p.userName}</span>
                          <span className="text-[10px] text-slate-400 block">{p.email}</span>
                        </td>
                        <td className="p-3">
                          {p.consentTerms ? <span className="text-emerald-600 font-bold">✓ ยินยอม</span> : <span className="text-rose-500">✗ ไม่ยินยอม</span>}
                        </td>
                        <td className="p-3">
                          {p.consentAnalytics ? <span className="text-emerald-600 font-bold">✓ ยินยอม</span> : <span className="text-slate-400">✗ ปฏิเสธ</span>}
                        </td>
                        <td className="p-3">
                          {p.consentMarketing ? <span className="text-emerald-600 font-bold">✓ ยินยอม</span> : <span className="text-slate-400">✗ ปฏิเสธ</span>}
                        </td>
                        <td className="p-3">
                          {p.consentSensitiveHealth ? <span className="text-emerald-600 font-bold">✓ ยินยอม</span> : <span className="text-rose-500">✗ ไม่ยินยอม</span>}
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handlePdpaAction(p.userId, "withdraw_marketing")}
                            className="text-amber-600 hover:underline text-[11px] font-bold cursor-pointer"
                          >
                            ถอนการตลาด
                          </button>
                          <button
                            onClick={() => handlePdpaAction(p.userId, "erase")}
                            className="text-rose-600 hover:underline text-[11px] font-bold cursor-pointer"
                          >
                            ลบข้อมูลถาวร
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          MODAL 1: ADD USER MODAL
          ========================================================================= */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">เพิ่มผู้ใช้งานใหม่เข้าสู่ระบบ</h3>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">ชื่อ-นามสกุล / ชื่อเรียก</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น สมชาย ใจดี"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">อีเมล</label>
                <input
                  type="email"
                  placeholder="somchai@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">เบอร์โทรศัพท์</label>
                <input
                  type="text"
                  placeholder="081-xxx-xxxx"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">ระดับสิทธิ์ (Role)</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full mt-1 px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="customer">Customer</option>
                    <option value="staff_psychologist">Staff / Doctor</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">ช่องทางเข้าสู่ระบบ</label>
                  <select
                    value={newUserProvider}
                    onChange={(e) => setNewUserProvider(e.target.value as any)}
                    className="w-full mt-1 px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="email">Email</option>
                    <option value="google">Google</option>
                    <option value="apple">Apple</option>
                    <option value="phone">Phone SMS</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-600 cursor-pointer"
                >
                  บันทึกผู้ใช้
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: ADD CATALOG PACKAGE MODAL
          ========================================================================= */}
      {showAddCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">เพิ่มสินค้า / แพ็กเกจบริการ</h3>
            <form onSubmit={handleCreateCatalog} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">ชื่อแพ็กเกจหรือบริการ</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น Sleep Therapy 1-on-1 Session"
                  value={newCatalogName}
                  onChange={(e) => setNewCatalogName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">ราคา (บาท)</label>
                  <input
                    type="number"
                    required
                    value={newCatalogPrice}
                    onChange={(e) => setNewCatalogPrice(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">ระยะเวลา / รูปแบบ</label>
                  <input
                    type="text"
                    value={newCatalogDuration}
                    onChange={(e) => setNewCatalogDuration(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">ประเภทบริการ</label>
                <select
                  value={newCatalogType}
                  onChange={(e) => setNewCatalogType(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="consultation">ปรึกษาผู้เชี่ยวชาญ 1-on-1 (Consultation)</option>
                  <option value="course">คอร์สบำบัดจิตใจ (Course)</option>
                  <option value="subscription">สมาชิกรายเดือน (Subscription)</option>
                  <option value="assessment">แบบประเมินสุขภาพจิตเชิงลึก (Assessment)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">คำอธิบายสั้นๆ</label>
                <textarea
                  rows={2}
                  value={newCatalogDesc}
                  onChange={(e) => setNewCatalogDesc(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddCatalogModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-600 cursor-pointer"
                >
                  บันทึกสินค้า
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: ADD PROMOTION MODAL
          ========================================================================= */}
      {showAddPromoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">สร้างโค้ดส่วนลดใหม่</h3>
            <form onSubmit={handleCreatePromotion} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">รหัสโค้ด (Code)</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น HEAL2026"
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">เปอร์เซ็นต์ส่วนลด (%)</label>
                  <input
                    type="number"
                    required
                    value={newPromoDiscount}
                    onChange={(e) => setNewPromoDiscount(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">ลดสูงสุด (บาท)</label>
                  <input
                    type="number"
                    required
                    value={newPromoMax}
                    onChange={(e) => setNewPromoMax(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddPromoModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 cursor-pointer"
                >
                  บันทึกโค้ด
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: ROLES & PERMISSION MATRIX MODAL
          ========================================================================= */}
      {showRolesMatrix && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  โครงสร้างระดับสิทธิ์และการเข้าถึง (Role & Permission Matrix)
                </h3>
                <p className="text-xs text-slate-500">กำหนดสิทธิ์ตามหลักการความปลอดภัย RBAC (Role-Based Access Control)</p>
              </div>
              <button onClick={() => setShowRolesMatrix(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer">
                ✕ ปิด
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Role 1 */}
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 space-y-2">
                <div className="flex items-center space-x-2 font-extrabold text-amber-800 dark:text-amber-300 text-sm">
                  <span>⚡ แอดมินสูงสุด (Super Admin)</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  มีสิทธิ์สูงสุดในการควบคุมเซิร์ฟเวอร์ จัดการฐานข้อมูล ผู้ใช้ บทบาท การเงิน รายงานความปลอดภัย และคำร้องขอ PDPA
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["ALL_ACCESS", "USER_MANAGEMENT", "CATALOG_MANAGEMENT", "PROMOTIONS", "PUSH_NOTIFICATIONS", "AUDIT_VIEW", "PDPA_ADMIN", "EXPORT_DATA"].map((perm) => (
                    <span key={perm} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-300 text-[10px] font-mono font-bold border border-amber-200">
                      ✓ {perm}
                    </span>
                  ))}
                </div>
              </div>

              {/* Role 2 */}
              <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-900/30 space-y-2">
                <div className="flex items-center space-x-2 font-extrabold text-sky-800 dark:text-sky-300 text-sm">
                  <span>👩‍⚕️ พนักงานทั่วไป & ผู้เชี่ยวชาญ (Staff / Psychologist)</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  ดูแลเคสการปรึกษา 1-on-1 ตรวจสอบความถูกต้องของบทความจิตวิทยา สถิติการประเมิน และตอบคำถามผู้ใช้
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["USER_VIEW", "CATALOG_VIEW", "ARTICLES_MANAGEMENT", "AUDIT_VIEW", "CONSULTATION_MANAGE"].map((perm) => (
                    <span key={perm} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 text-[10px] font-mono font-bold border border-sky-200">
                      ✓ {perm}
                    </span>
                  ))}
                </div>
              </div>

              {/* Role 3 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center space-x-2 font-extrabold text-slate-800 dark:text-slate-200 text-sm">
                  <span>🎓 ลูกค้า & ผู้ใช้งานทั่วไป (Customer / User)</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  เข้าใช้งานเช็คอินอารมณ์ ปรึกษาคู่หู AI เรียนคอร์สสะสมเกียรติบัตร และจองเวลาปรึกษานักจิตวิทยา
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["CUSTOMER_PORTAL", "CONSULTATION_BOOK", "ASSESSMENT_TAKE", "E_CERTIFICATES", "PDPA_SELF_RIGHTS"].map((perm) => (
                    <span key={perm} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-[10px] font-mono font-bold border border-slate-200">
                      ✓ {perm}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
