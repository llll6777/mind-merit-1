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
  Check,
  FileSpreadsheet,
  AlertTriangle,
  Mail
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
  PdpaConsentRecord,
  MoodCheckIn 
} from "../types";
import { initAuth, googleSignIn, logoutGoogle } from "../services/googleAuth";
import { 
  createDatabaseSpreadsheet, 
  syncAllUsersToSheet, 
  syncMoodLogsToSheet,
  appendSingleUserToSheet,
  getSavedSpreadsheetId, 
  getSpreadsheetUrl,
  isAuthorizedSheetsEmail
} from "../services/googleSheetsService";

interface AdminViewProps {
  user: UserProfile;
  certificates: Certificate[];
  moodLogs?: MoodCheckIn[];
}

export default function AdminView({ user, certificates, moodLogs }: AdminViewProps) {
  const isEn = user.language === "en";

  // Tab navigation including dedicated Google Sheets Database section
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "sheets" | "data" | "security">("overview");
  const [dataSubTab, setDataSubTab] = useState<"catalog" | "articles" | "promotions" | "reports">("catalog");
  const [securitySubTab, setSecuritySubTab] = useState<"push" | "files" | "audit" | "pdpa">("push");
  const [sheetPreviewTab, setSheetPreviewTab] = useState<"users" | "moods" | "certs">("users");

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

  // Google Sheets Private Database for Owner
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [sheetsSyncMsg, setSheetsSyncMsg] = useState("");
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(getSavedSpreadsheetId());

  // Strict single-email authorization check (Authorized Administrator)
  const isGoogleAuthorized = Boolean(googleUser && isAuthorizedSheetsEmail(googleUser.email));

  // Real-time Live Google Sheet row interface
  interface LiveSheetRow {
    id: string;
    timestamp: string;
    email: string;
    status: string;
    policy: string;
    isNew?: boolean;
  }

  // Real-time live Google Sheets rows state
  const [realtimeSheetRows, setRealtimeSheetRows] = useState<LiveSheetRow[]>(() => {
    const list: LiveSheetRow[] = [];
    try {
      const stored = localStorage.getItem("mind_merit_registered_users_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          parsed.forEach((u: any, idx: number) => {
            const em = u.email || (u.emailOrPhone?.includes("@") ? u.emailOrPhone : null);
            if (em) {
              list.push({
                id: u.id || `row-${idx}`,
                timestamp: u.emailVerifiedAt ? new Date(u.emailVerifiedAt).toLocaleString("th-TH") : (u.createdAt ? new Date(u.createdAt).toLocaleString("th-TH") : new Date().toLocaleString("th-TH")),
                email: em,
                status: u.isEmailVerified ? "Verified (ยืนยันแล้ว)" : "Unverified (รอการยืนยัน)",
                policy: "Zero Personal Data Policy Enforced (คุ้มครอง 100%)",
                isNew: false
              });
            }
          });
        }
      }
    } catch (e) {}

    const curEmail = user.email || (user.emailOrPhone?.includes("@") ? user.emailOrPhone : null);
    if (curEmail && !list.some(r => r.email === curEmail)) {
      list.unshift({
        id: "cur-user",
        timestamp: new Date().toLocaleString("th-TH"),
        email: curEmail,
        status: user.isEmailVerified ? "Verified (ยืนยันแล้ว)" : "Unverified (รอการยืนยัน)",
        policy: "Zero Personal Data Policy Enforced (คุ้มครอง 100%)",
        isNew: false
      });
    }

    if (list.length === 0) {
      list.push(
        {
          id: "seed-1",
          timestamp: new Date().toLocaleString("th-TH"),
          email: "somchai.mind@gmail.com",
          status: "Verified (ยืนยันแล้ว)",
          policy: "Zero Personal Data Policy Enforced (คุ้มครอง 100%)",
          isNew: false
        },
        {
          id: "seed-2",
          timestamp: new Date(Date.now() - 3600000).toLocaleString("th-TH"),
          email: "member.student01@chula.ac.th",
          status: "Verified (ยืนยันแล้ว)",
          policy: "Zero Personal Data Policy Enforced (คุ้มครอง 100%)",
          isNew: false
        }
      );
    }
    return list;
  });

  const [realtimeAlert, setRealtimeAlert] = useState<{ email: string; timestamp: string } | null>(null);

  // Listen to real-time registrations and update Google Sheets live
  useEffect(() => {
    const handleRealtimeReg = (e: any) => {
      const data = e.detail;
      if (!data || !data.email) return;

      const newRow: LiveSheetRow = {
        id: data.id || `live-${Date.now()}`,
        timestamp: data.timestamp || new Date().toLocaleString("th-TH"),
        email: data.email,
        status: data.status || (data.isEmailVerified ? "Verified (ยืนยันแล้ว)" : "Unverified (รอการยืนยัน)"),
        policy: "Zero Personal Data Policy Enforced (คุ้มครอง 100%)",
        isNew: true
      };

      setRealtimeSheetRows(prev => [newRow, ...prev]);
      setRealtimeAlert({ email: data.email, timestamp: newRow.timestamp });

      setTimeout(() => {
        setRealtimeAlert(null);
      }, 7000);
    };

    window.addEventListener("mind_merit_realtime_registration", handleRealtimeReg);
    return () => {
      window.removeEventListener("mind_merit_realtime_registration", handleRealtimeReg);
    };
  }, []);

  const handleSimulateRealtimeUser = () => {
    const domains = ["gmail.com", "outlook.com", "chula.ac.th", "ku.th", "hotmail.com"];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const mockEmail = `member.live${randomNum}@${randomDomain}`;
    
    const entry = {
      id: `live-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString("th-TH") + " (" + new Date().toLocaleDateString("th-TH") + ")",
      email: mockEmail,
      isEmailVerified: true,
      status: "Verified (ยืนยันแล้ว)",
      policy: "Zero Personal Data Policy Enforced (คุ้มครอง 100%)",
      isNew: true
    };

    window.dispatchEvent(
      new CustomEvent("mind_merit_realtime_registration", { detail: entry })
    );

    if (isGoogleAuthorized && spreadsheetId) {
      appendSingleUserToSheet({
        email: mockEmail,
        isEmailVerified: true
      } as any).catch(() => {});
    }
  };

  useEffect(() => {
    const unsub = initAuth(
      (u) => setGoogleUser(u),
      () => setGoogleUser(null)
    );
    return () => unsub();
  }, []);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setSheetsSyncMsg("");
    try {
      const res = await googleSignIn();
      if (res) {
        if (!isAuthorizedSheetsEmail(res.user.email)) {
          setGoogleUser(null);
          setSheetsSyncMsg("⛔ การเข้าถึงถูกปฏิเสธ: ระบบจำกัดสิทธิ์เฉพาะ ผู้ดูแลระบบ เท่านั้น");
          return;
        }
        setGoogleUser(res.user);
        setSheetsSyncMsg(isEn ? "Administrator verified successfully! (Full Access)" : "ยืนยันสิทธิ์ถูกต้อง: ยินดีต้อนรับผู้ดูแลระบบ (เข้าถึงและซิงค์ข้อมูลได้)");
      }
    } catch (e: any) {
      setSheetsSyncMsg(e.message || "Failed to sign in with Google");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleCreateOrSyncSheet = async () => {
    if (!isGoogleAuthorized) {
      setSheetsSyncMsg("⛔ การเข้าถึงถูกปฏิเสธ: ระบบจำกัดสิทธิ์เฉพาะ ผู้ดูแลระบบ เท่านั้น");
      return;
    }
    setIsSyncingSheets(true);
    setSheetsSyncMsg("");
    try {
      let targetId = spreadsheetId;
      if (!targetId) {
        const created = await createDatabaseSpreadsheet();
        targetId = created.spreadsheetId;
        setSpreadsheetId(targetId);
      }
      let allUsers: UserProfile[] = [user];
      try {
        const stored = localStorage.getItem("mind_merit_registered_users_v1");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) allUsers = parsed;
        }
      } catch (e) {}

      const syncRes = await syncAllUsersToSheet(allUsers, targetId);
      setSheetsSyncMsg(
        isEn 
          ? `Synced ${syncRes.count} user emails to your Google Sheet successfully!` 
          : `ซิงค์อีเมลผู้ใช้ ${syncRes.count} รายการลงใน Google Sheet เรียบร้อยแล้ว!`
      );
    } catch (e: any) {
      setSheetsSyncMsg(e.message || "Error syncing to Google Sheet");
    } finally {
      setIsSyncingSheets(false);
    }
  };

  const handleSyncMoodLogs = async () => {
    if (!isGoogleAuthorized) {
      setSheetsSyncMsg("⛔ การเข้าถึงถูกปฏิเสธ: ระบบจำกัดสิทธิ์เฉพาะ ผู้ดูแลระบบ เท่านั้น");
      return;
    }
    setIsSyncingSheets(true);
    setSheetsSyncMsg("");
    try {
      let targetId = spreadsheetId;
      if (!targetId) {
        const created = await createDatabaseSpreadsheet();
        targetId = created.spreadsheetId;
        setSpreadsheetId(targetId);
      }
      const logs = moodLogs || [];
      const res = await syncMoodLogsToSheet(logs, user.name, targetId);
      setSheetsSyncMsg(
        isEn
          ? res.message
          : `🔒 ตรวจสอบแล้ว: ${res.message}`
      );
    } catch (e: any) {
      setSheetsSyncMsg(e.message || "Error checking privacy policy");
    } finally {
      setIsSyncingSheets(false);
    }
  };

  const handleCreateNewSheet = async () => {
    if (!isGoogleAuthorized) {
      setSheetsSyncMsg("⛔ การเข้าถึงถูกปฏิเสธ: ระบบจำกัดสิทธิ์เฉพาะ ผู้ดูแลระบบ เท่านั้น");
      return;
    }
    setIsSyncingSheets(true);
    setSheetsSyncMsg("");
    try {
      const created = await createDatabaseSpreadsheet();
      setSpreadsheetId(created.spreadsheetId);
      let allUsers: UserProfile[] = [user];
      try {
        const stored = localStorage.getItem("mind_merit_registered_users_v1");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) allUsers = parsed;
        }
      } catch (e) {}
      await syncAllUsersToSheet(allUsers, created.spreadsheetId);
      setSheetsSyncMsg(
        isEn
          ? `Created new Google Spreadsheet in Google Drive and synced ${allUsers.length} user records!`
          : `สร้างไฟล์ Google Spreadsheet ใหม่ใน Google Drive และซิงค์ข้อมูลผู้ใช้ ${allUsers.length} รายการเรียบร้อยแล้ว!`
      );
    } catch (e: any) {
      setSheetsSyncMsg(e.message || "Error creating new Google Sheet");
    } finally {
      setIsSyncingSheets(false);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await logoutGoogle();
      setGoogleUser(null);
      setSheetsSyncMsg(isEn ? "Disconnected Google account." : "ยกเลิกการเชื่อมต่อบัญชี Google เรียบร้อยแล้ว");
    } catch (e: any) {
      console.error(e);
    }
  };

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
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
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
          <div 
            onClick={() => setActiveTab("sheets")}
            className="flex items-center space-x-2 cursor-pointer hover:opacity-85 transition-opacity"
            title="คลิกเพื่อไปที่ฐานข้อมูล Google Sheets"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Google Sheets DB</span>
              <span className="font-bold text-emerald-300">
                {googleUser ? "🟢 ซิงค์แล้ว (Drive)" : "⚪ รอเชื่อมต่อ"}
              </span>
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
          MAIN NAVIGATION TABS (โครงสร้างหลักของระบบหลังบ้าน)
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

        {/* Tab 3: ฐานข้อมูล Google Sheets (Private Cloud Database) */}
        <button
          onClick={() => setActiveTab("sheets")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "sheets"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
          <span>{isEn ? "3. Google Sheets Database" : "3. ฐานข้อมูล Google Sheets"}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
            Drive Cloud
          </span>
        </button>

        {/* Tab 4: จัดการข้อมูล & รายงาน */}
        <button
          onClick={() => setActiveTab("data")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "data"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>{isEn ? "4. Data Management & Export" : "4. จัดการข้อมูลแอป & ส่งออกรายงาน"}</span>
        </button>

        {/* Tab 5: ระบบเสริมและความปลอดภัย */}
        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "security"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>{isEn ? "5. Security, Push & PDPA" : "5. แจ้งเตือน, ไฟล์, บันทึก & PDPA"}</span>
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

          {/* Quick Access Card to Google Sheets Database in Admin Simulation */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-200/80 dark:border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 shrink-0">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100">
                    {isEn ? "Private Google Sheets Cloud Database" : "ฐานข้อมูล Google Sheets ใน Google Drive ส่วนตัว"}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                    {googleUser ? "🟢 เชื่อมต่อแล้ว" : "⚪ พร้อมซิงค์"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isEn
                    ? "Manage and sync user records, mood logs, and certificates to Google Drive."
                    : "ข้อมูลผู้ใช้และประวัติอารมณ์ถูกจัดเก็บในชีตบน Google Drive เฉพาะเจ้าของระบบ (ไม่อยู่ในหน้าจอผู้ใช้)"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setActiveTab("sheets")}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
              >
                <span>จัดการ Google Sheets ➜</span>
              </button>
              {spreadsheetId && (
                <a
                  href={getSpreadsheetUrl(spreadsheetId)}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 text-xs font-bold transition-all cursor-pointer"
                  title="เปิดดูใน Google Drive"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
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
          TAB 3: ฐานข้อมูล GOOGLE SHEETS (PRIVATE CLOUD DATABASE FOR ADMIN)
          ========================================================================= */}
      {activeTab === "sheets" && (
        <div className="space-y-6">

          {/* Banner: Google Sheets Database Hub */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 p-6 sm:p-8 text-white shadow-lg">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-bold border border-white/20 backdrop-blur-xs">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>{isEn ? "Google Sheets Cloud Database" : "ระบบฐานข้อมูล Google Sheets ใน Google Drive"}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {isEn ? "Private Google Sheets Database" : "ฐานข้อมูล Google Sheets (จำลองระบบหลังบ้าน)"}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  {isEn
                    ? "Store strictly user emails and verification statuses in your personal Google Drive spreadsheet. Absolutely zero personal data, journals, or private logs are ever accessed or stored. Strictly restricted exclusively to your authorized email."
                    : "จัดเก็บเฉพาะ 'อีเมลผู้ใช้' และสถานะการยืนยันตัวตนลงใน Google Sheets บน Google Drive ส่วนตัวของคุณ ปลอดภัย 100% ไม่เข้าถึงและไม่เก็บข้อมูลส่วนตัว ชื่อจริง หรือบันทึกไดอารี่อารมณ์ของผู้ใช้เด็ดขาด"}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-semibold text-emerald-200">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-400/40 text-emerald-200 font-bold flex items-center space-x-1.5">
                    <Lock className="h-3.5 w-3.5 text-emerald-300" />
                    <span>จำกัดสิทธิ์เฉพาะ: ผู้ดูแลระบบ (Administrator Only)</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-black/20 border border-white/10">🛡️ Zero Personal Data (บันทึกเฉพาะอีเมลเท่านั้น)</span>
                  <span className="px-2.5 py-1 rounded-lg bg-black/20 border border-white/10">⚡ แสดงผลแบบเรียลไทม์ (Live Sync)</span>
                </div>
              </div>

              {/* Action Link to Open Sheet (Only if authorized) */}
              {spreadsheetId && isGoogleAuthorized && (
                <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-3 shrink-0">
                  <a
                    href={getSpreadsheetUrl(spreadsheetId)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 font-black text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>{isEn ? "Open in Google Drive ↗" : "เปิดดูใน Google Drive ของคุณ ↗"}</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Sync & Connection Status Messages */}
          {sheetsSyncMsg && (
            <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs animate-in fade-in ${
              sheetsSyncMsg.startsWith("⛔") || sheetsSyncMsg.toLowerCase().includes("fail") || sheetsSyncMsg.toLowerCase().includes("error")
                ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200"
                : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
            }`}>
              <div className="flex items-center space-x-2.5">
                {sheetsSyncMsg.startsWith("⛔") ? (
                  <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                )}
                <span>{sheetsSyncMsg}</span>
              </div>
              <button 
                onClick={() => setSheetsSyncMsg("")}
                className="text-xs opacity-70 hover:opacity-100 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Single-Email Whitelist Access Notice Box */}
          {/* Admin-Only Access Notice Box */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center space-x-3.5">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                <Lock className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="font-black text-sm text-slate-100">
                    นโยบายความปลอดภัย: ระบบจำกัดสิทธิ์เฉพาะ ผู้ดูแลระบบ เท่านั้น
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    ผู้ดูแลระบบเท่านั้น (Admin Only)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30 flex items-center space-x-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                    </span>
                    <span>Real-time Live Sync</span>
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  ระบบจำกัดสิทธิ์เฉพาะ <span className="font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/60">ผู้ดูแลระบบ (Administrator)</span> เท่านั้นที่สามารถสร้าง เชื่อมต่อ ดู หรือซิงค์ข้อมูล Google Sheets นี้ได้ พร้อมแสดงผลแบบเรียลไทม์ทันทีที่มีคนสมัคร
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center space-x-2">
              {isGoogleAuthorized ? (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>ยืนยันสิทธิ์ถูกต้อง (ผู้ดูแลระบบ)</span>
                </span>
              ) : (
                <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center space-x-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span>จำกัดสิทธิ์เฉพาะ ผู้ดูแลระบบ</span>
                </span>
              )}
            </div>
          </div>

          {/* Main Control Cards Grid */}
          <div className="grid gap-6 lg:grid-cols-12">
            
            {/* Left Card: Account & Connection Status (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                      <Key className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100">
                        {isEn ? "Google Account Status" : "สถานะบัญชี Google & สิทธิ์"}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {isEn ? "Linked admin account for Sheets storage" : "บัญชี Google สำหรับบันทึกข้อมูล (เฉพาะผู้ดูแลระบบ)"}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    isGoogleAuthorized 
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 border border-emerald-200" 
                      : googleUser
                      ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 border border-rose-200"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800"
                  }`}>
                    {isGoogleAuthorized ? "🟢 ได้รับอนุญาต (Admin)" : googleUser ? "🔴 สิทธิ์ไม่ถูกต้อง" : "⚪ ยังไม่เชื่อมต่อ"}
                  </span>
                </div>

                {/* Account Details Box */}
                {googleUser ? (
                  <div className={`p-4 rounded-2xl border space-y-3 ${
                    isGoogleAuthorized 
                      ? "bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700"
                      : "bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900"
                  }`}>
                    <div className="flex items-center space-x-3">
                      {googleUser.photoURL ? (
                        <img src={googleUser.photoURL} alt="Google" className="h-10 w-10 rounded-full border border-slate-300" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                          {googleUser.email ? googleUser.email[0].toUpperCase() : "G"}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 truncate">
                          {googleUser.displayName || "Administrator"}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono truncate font-bold">
                          {googleUser.email}
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">สิทธิ์การเข้าถึงข้อมูล:</span>
                      {isGoogleAuthorized ? (
                        <span className="text-emerald-600 font-bold flex items-center space-x-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>อนุญาตเต็มรูปแบบ (ผู้ดูแลระบบ)</span>
                        </span>
                      ) : (
                        <span className="text-rose-600 font-bold flex items-center space-x-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>ปฏิเสธ (ไม่ใช่ผู้ดูแลระบบ)</span>
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-3 text-center">
                    <div className="text-xs text-amber-800 dark:text-amber-200 font-medium">
                      {isEn 
                        ? "Connect with Administrator Google account to access and sync spreadsheets in Google Drive." 
                        : "เชื่อมต่อด้วยบัญชี Google ของผู้ดูแลระบบ เพื่อเข้าถึงและซิงค์ข้อมูลลงใน Google Drive"}
                    </div>
                    <button
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleLoading}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>{isGoogleLoading ? "กำลังเชื่อมต่อ..." : "เชื่อมต่อบัญชี Google (เฉพาะผู้ดูแลระบบ)"}</span>
                    </button>
                  </div>
                )}

                {/* Spreadsheet ID Information */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Google Spreadsheet ID:</span>
                    {spreadsheetId && isGoogleAuthorized && (
                      <span className="text-[10px] text-emerald-600 font-normal">Active Link</span>
                    )}
                  </div>
                  {spreadsheetId && isGoogleAuthorized ? (
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 break-all select-all border border-slate-200 dark:border-slate-700">
                      {spreadsheetId}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic">
                      {!isGoogleAuthorized 
                        ? "ระบบจำกัดสิทธิ์เฉพาะ ผู้ดูแลระบบ เท่านั้น"
                        : "ยังไม่ได้สร้างไฟล์ชีตใน Drive (กดปุ่มสร้างหรือซิงค์เพื่อเริ่มสร้างทันที)"}
                    </div>
                  )}
                </div>

                {/* Disconnect or switch button */}
                {googleUser && (
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={handleGoogleLogout}
                      className="text-xs text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      ยกเลิกการเชื่อมต่อบัญชีนี้
                    </button>
                    {spreadsheetId && isGoogleAuthorized && (
                      <a
                        href={getSpreadsheetUrl(spreadsheetId)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
                      >
                        <span>เปิด Drive</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Card: Sync Operations & Live Actions (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
                <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="p-2 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/40">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100">
                      {isEn ? "Database Synchronization Actions" : "คำสั่งซิงค์ข้อมูลลง Google Sheets"}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {isEn ? "Trigger sync for registered user emails (Administrator Only)" : "อัปเดตและซิงค์ข้อมูลอีเมลเข้าสู่ตารางชีต (จำกัดสิทธิ์เฉพาะผู้ดูแลระบบ)"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons Grid */}
                <div className="grid gap-3 sm:grid-cols-2">
                  
                  {/* Action 1: Sync Users Email Directory */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                      <Users className="h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{isEn ? "Sync User Emails (Email Only)" : "ซิงค์เฉพาะอีเมลผู้ใช้ (Email Directory)"}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                      {isEn 
                        ? "Exports strictly user emails and verification statuses into the Users sheet. Zero personal data." 
                        : "ส่งเฉพาะข้อมูลอีเมลผู้ใช้และสถานะการยืนยันตัวตนเข้าชีต Users (ไม่ส่งออกชื่อจริง เบอร์โทร หรือประวัติส่วนตัวเด็ดขาด)"}
                    </p>
                    <button
                      onClick={handleCreateOrSyncSheet}
                      disabled={isSyncingSheets || !isGoogleAuthorized}
                      title={!isGoogleAuthorized ? "จำกัดสิทธิ์เฉพาะ ผู้ดูแลระบบ เท่านั้น" : undefined}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isSyncingSheets ? 'animate-spin' : ''}`} />
                      <span>{isSyncingSheets ? "กำลังซิงค์..." : !isGoogleAuthorized ? "ล็อกสิทธิ์เฉพาะผู้ดูแลระบบ" : "ซิงค์เฉพาะอีเมลทันที"}</span>
                    </button>
                  </div>

                  {/* Action 2: Zero Personal Data & Privacy Guarantee */}
                  <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800/60 space-y-2">
                    <div className="flex items-center space-x-2 text-sky-800 dark:text-sky-300 font-bold text-xs">
                      <ShieldCheck className="h-4 w-4 shrink-0 text-sky-600" />
                      <span>{isEn ? "Zero Personal Data Policy" : "การคุ้มครองข้อมูลส่วนบุคคล (Zero Personal Data)"}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                      {isEn 
                        ? "Mood logs and personal diaries are strictly locked to the user device and NEVER uploaded to external sheets." 
                        : "บันทึกอารมณ์และไดอารี่ส่วนตัวของผู้ใช้ได้รับการล็อกความเป็นส่วนตัวสูงสุด ไม่ถูกส่งออกไปยัง Google Sheets ภายนอก"}
                    </p>
                    <button
                      onClick={handleSyncMoodLogs}
                      disabled={isSyncingSheets}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-sky-300 text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Lock className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{isEn ? "Check Privacy Policy" : "ตรวจสอบการคุ้มครองข้อมูล"}</span>
                    </button>
                  </div>

                  {/* Action 3: Create Brand New Sheet */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-2">
                    <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
                      <Plus className="h-4 w-4 shrink-0 text-amber-600" />
                      <span>สร้าง Google Sheet ไฟล์ใหม่</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                      สร้างสเปรดชีตเล่มใหม่บน Drive ของ ผู้ดูแลระบบ สำหรับบันทึกเฉพาะอีเมลผู้ใช้
                    </p>
                    <button
                      onClick={handleCreateNewSheet}
                      disabled={isSyncingSheets || !isGoogleAuthorized}
                      title={!isGoogleAuthorized ? "จำกัดสิทธิ์เฉพาะ ผู้ดูแลระบบ เท่านั้น" : undefined}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>{!isGoogleAuthorized ? "ล็อกสิทธิ์เฉพาะผู้ดูแลระบบ" : "สร้างชีตใหม่ใน Drive"}</span>
                    </button>
                  </div>

                  {/* Action 4: Direct Link */}
                  <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/60 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-purple-800 dark:text-purple-300 font-bold text-xs">
                        <FileSpreadsheet className="h-4 w-4 shrink-0 text-purple-600" />
                        <span>เปิดใช้งานผ่าน Google Drive</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight mt-1">
                        เปิดสเปรดชีตเพื่อแก้ไข กรองข้อมูล หรือดาวน์โหลดเป็นไฟล์ Excel (.xlsx) / CSV
                      </p>
                    </div>
                    {spreadsheetId && isGoogleAuthorized ? (
                      <a
                        href={getSpreadsheetUrl(spreadsheetId)}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full mt-2 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>เปิดดูบน Google Sheets ↗</span>
                      </a>
                    ) : (
                      <div className="text-[11px] text-slate-400 italic">
                        {!isGoogleAuthorized ? "🔒 ล็อกสิทธิ์เฉพาะ ผู้ดูแลระบบ" : "สร้างหรือซิงค์ข้อมูลก่อนเปิดดู"}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>

          </div>

          {/* Section 2: Real-time Live Google Sheets Database & Data Preview */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            
            {/* Header with Real-time status & Simulate button */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 flex-wrap">
                  <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                    <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                    <span>ตารางฐานข้อมูล Google Sheets (แสดงผลสดแบบเรียลไทม์)</span>
                  </h4>
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>LIVE Real-time Sync Active</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-200 font-bold">
                    Zero Personal Data (เฉพาะอีเมล 100%)
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isEn
                    ? "Real-time sync active: when someone registers, their email record immediately pops into Google Sheets."
                    : "แสดงผลแบบเรียลไทม์: เมื่อมีคนสมัครสมาชิกปึ้บ ข้อมูลอีเมลจะเด้งเข้าสู่ Google Sheet ทันที พร้อมระบบความปลอดภัยล็อกสิทธิ์เฉพาะผู้ดูแลระบบ"}
                </p>
              </div>

              {/* Action buttons: Simulate Real-time Register & Tabs */}
              <div className="flex items-center space-x-2 flex-wrap">
                <button
                  onClick={handleSimulateRealtimeUser}
                  className="px-3.5 py-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center space-x-2 cursor-pointer"
                  title="ทดสอบจำลองคนสมัครสมาชิกใหม่ ข้อมูลจะเด้งเข้าตาราง Google Sheet ด้านล่างทันที"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-spin" />
                  <span>⚡ ทดสอบคนสมัครใหม่ (ข้อมูลเด้งทันที)</span>
                </button>
              </div>
            </div>

            {/* Real-time Event Toast / Notification Banner */}
            {realtimeAlert && (
              <div className="p-3.5 rounded-2xl bg-linear-to-r from-emerald-500/20 via-teal-500/20 to-sky-500/20 border-2 border-emerald-500 text-slate-800 dark:text-slate-100 flex items-center justify-between shadow-lg animate-pulse transition-all">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm shrink-0">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-emerald-700 dark:text-emerald-400 flex items-center space-x-1.5">
                      <span>⚡ [REAL-TIME EVENT] มีผู้ใช้เพิ่งสมัครสมาชิกใหม่ ข้อมูลเด้งเข้า Google Sheet แล้ว!</span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                      อีเมล: <span className="font-mono font-bold text-emerald-600 dark:text-emerald-300">{realtimeAlert.email}</span> • เวลาที่บันทึก: {realtimeAlert.timestamp} • ข้อมูลส่วนตัวอื่นถูกคุ้มครอง 100%
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-emerald-600 text-white shrink-0">
                  Real-time Synced ✓
                </span>
              </div>
            )}

            {/* Sub-tabs for Preview */}
            <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-fit">
              <button
                onClick={() => setSheetPreviewTab("users")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  sheetPreviewTab === "users" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>⚡ Live Users Sheet (อีเมลเรียลไทม์)</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-500 text-white font-bold">
                  {realtimeSheetRows.length}
                </span>
              </button>
              <button
                onClick={() => setSheetPreviewTab("moods")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  sheetPreviewTab === "moods" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>🔒 Privacy Architecture (การคุ้มครองข้อมูล)</span>
              </button>
            </div>

            {/* Preview Table: Live Users Sheet (Real-Time Email Only) */}
            {sheetPreviewTab === "users" && (
              <div className="space-y-2">
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-extrabold uppercase text-[10px] border-b border-emerald-100 dark:border-emerald-900">
                      <tr>
                        <th className="p-3 w-12 text-center">#</th>
                        <th className="p-3">A: Registered At (วัน-เวลาที่สมัคร)</th>
                        <th className="p-3">B: User Email (อีเมลผู้ใช้ - ข้อมูลเดียวที่จัดเก็บ)</th>
                        <th className="p-3">C: Verification Status (สถานะยืนยันตัวตน)</th>
                        <th className="p-3">D: Privacy Policy (การคุ้มครองข้อมูลส่วนบุคคล)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      {realtimeSheetRows.map((row, idx) => (
                        <tr 
                          key={row.id || idx} 
                          className={`transition-colors duration-500 ${
                            row.isNew 
                              ? "bg-emerald-100/90 dark:bg-emerald-950/70 border-l-4 border-emerald-500 font-bold" 
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                          }`}
                        >
                          <td className="p-3 text-center text-slate-400 font-mono text-[10px]">
                            {idx + 1}
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-300">
                            {row.timestamp}
                          </td>
                          <td className="p-3 font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                            {row.isNew && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-600 text-white font-bold animate-bounce inline-block">
                                NEW ⚡
                              </span>
                            )}
                            <Mail className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>{row.email}</span>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 inline-flex items-center space-x-1">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              <span>{row.status}</span>
                            </span>
                          </td>
                          <td className="p-3 text-emerald-700 dark:text-emerald-400 text-[10px]">
                            🔒 {row.policy}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
                  <span>* ข้อมูลแสดงผลแบบ 2-way live sync เชื่อมต่อโดยตรงกับตาราง Users บน Google Drive</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    รวมทั้งสิ้น {realtimeSheetRows.length} รายการ (บันทึกเฉพาะอีเมล)
                  </span>
                </div>
              </div>
            )}

            {/* Privacy Architecture Notice */}
            {sheetPreviewTab === "moods" && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="h-5 w-5" />
                  <span>หลักการคุ้มครองข้อมูลส่วนบุคคลสูงสุด (Strict Zero Personal Data Policy)</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-600">✓ ข้อมูลที่ส่งเข้า Google Sheets:</span>
                    <p className="text-[11px] text-slate-500">
                      มีเพียง 1. วัน-เวลาที่ลงทะเบียน, 2. อีเมลผู้ใช้ และ 3. สถานะยืนยันตัวตนเท่านั้น (เอาแค่อีเมลเฉยๆ 100%)
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-rose-600">✗ ข้อมูลส่วนตัวที่ถูกล็อกเด็ดขาด:</span>
                    <p className="text-[11px] text-slate-500">
                      ไดอารี่อารมณ์, คะแนนความเครียด, บันทึกความรู้สึก, ชื่อจริง, เบอร์โทรศัพท์ จะถูกเก็บเฉพาะบนเครื่องผู้ใช้เท่านั้น ไม่ส่งออกไปยังคลาวด์ภายนอก
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  ระบบจำกัดสิทธิ์เฉพาะ ผู้ดูแลระบบ (Administrator Only) เท่านั้นที่มีสิทธิ์เข้าถึงหรือเชื่อมต่อกับ Google Sheets
                </p>
              </div>
            )}

          </div>

          {/* Section 3: Privacy & Security Guarantee FAQ */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100 flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <span>ความปลอดภัยและความเป็นส่วนตัวของข้อมูลผู้ใช้ (PDPA & Privacy)</span>
            </h4>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                  <span>🔒 ไม่อยู่ในหน้าจอผู้ใช้</span>
                </span>
                <p className="text-[11px]">
                  ตาราง Google Sheets จะไม่ปรากฏในหน้าเว็บของผู้ใช้ทั่วไป ผู้ใช้อื่นจะไม่สามารถเปิดดูหรือค้นหาข้อมูลของผู้อื่นได้
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                  <span>🔐 ล็อกสิทธิ์เฉพาะผู้ดูแลระบบ</span>
                </span>
                <p className="text-[11px]">
                  กำหนดสิทธิ์เข้มงวดให้เฉพาะ <span className="text-emerald-600 dark:text-emerald-400 font-bold">ผู้ดูแลระบบ (Administrator Only)</span> เท่านั้นที่มีสิทธิ์เข้าถึงข้อมูล
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                  <span>📱 ดูผ่านแอปมือถือได้</span>
                </span>
                <p className="text-[11px]">
                  เจ้าของระบบสามารถติดตั้งแอป Google Sheets หรือ Google Drive บนมือถือ แล้วล็อกอินดูข้อมูลสดได้ตลอดเวลา
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                  <span>📥 ส่งออกไฟล์ Excel ได้</span>
                </span>
                <p className="text-[11px]">
                  สามารถดาวน์โหลดข้อมูลเป็นไฟล์ .xlsx, .csv, หรือแชร์ลิงก์ให้เฉพาะทีมงานที่ได้รับอนุญาตได้ทันที
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 4: จัดการข้อมูล & รายงาน (DATA MANAGEMENT & EXPORT)
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

              {/* Google Sheets Private Cloud Database Card (เฉพาะเจ้าของระบบ) */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-white dark:from-slate-900 dark:via-emerald-950/20 dark:to-slate-900 border border-emerald-200/80 dark:border-emerald-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100 dark:border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20 shrink-0">
                      <FileSpreadsheet className="h-6 w-6" />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100 flex items-center space-x-2 flex-wrap">
                        <span>Google Sheets Private Database (สำหรับผู้ดูแลระบบ)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                          Administrator Only
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-emerald-400 font-bold">
                          🔒 เฉพาะผู้ดูแลระบบ
                        </span>
                      </h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        จัดเก็บข้อมูลสมาชิก (เฉพาะอีเมล) ลงใน Google Sheets บน Google Drive ส่วนตัว ไม่อยู่ในหน้าจอผู้ใช้ และจำกัดสิทธิ์เฉพาะ ผู้ดูแลระบบ
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-start sm:self-auto">
                    <button
                      onClick={() => setActiveTab("sheets")}
                      className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
                      <span>แท็บฐานข้อมูลชีต ➜</span>
                    </button>
                    {spreadsheetId && isGoogleAuthorized && (
                      <a
                        href={getSpreadsheetUrl(spreadsheetId)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>เปิดใน Drive ↗</span>
                      </a>
                    )}
                  </div>
                </div>

                {sheetsSyncMsg && (
                  <div className={`p-3 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
                    sheetsSyncMsg.startsWith("⛔")
                      ? "bg-rose-100/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200"
                      : "bg-emerald-100/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200"
                  }`}>
                    {sheetsSyncMsg.startsWith("⛔") ? (
                      <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    )}
                    <span>{sheetsSyncMsg}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">สถานะบัญชี Google:</span>
                      {isGoogleAuthorized ? (
                        <span className="text-emerald-600 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>สิทธิ์ถูกต้อง ({googleUser.email})</span>
                        </span>
                      ) : googleUser ? (
                        <span className="text-rose-500 font-semibold flex items-center space-x-1">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>ไม่ใช่บัญชีที่ได้รับอนุญาต ({googleUser.email})</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">ยังไม่ได้เชื่อมต่อ (จำกัดสิทธิ์เฉพาะผู้ดูแลระบบ)</span>
                      )}
                    </div>
                    {spreadsheetId && isGoogleAuthorized && (
                      <div className="text-[11px] text-slate-400 font-mono">
                        Spreadsheet ID: {spreadsheetId}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {!googleUser ? (
                      <button
                        onClick={handleGoogleSignIn}
                        disabled={isGoogleLoading}
                        className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {isGoogleLoading ? "กำลังเชื่อมต่อ..." : "เข้าสู่ระบบด้วย Google (เฉพาะผู้ดูแลระบบ)"}
                      </button>
                    ) : (
                      <button
                        onClick={handleCreateOrSyncSheet}
                        disabled={isSyncingSheets || !isGoogleAuthorized}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${isSyncingSheets ? 'animate-spin' : ''}`} />
                        <span>{isSyncingSheets ? "กำลังส่งข้อมูลเข้าชีต..." : !isGoogleAuthorized ? "ล็อกสิทธิ์เฉพาะผู้ดูแลระบบ" : "ซิงค์ข้อมูลผู้ใช้เข้า Google Sheet ทันที"}</span>
                      </button>
                    )}
                  </div>
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
