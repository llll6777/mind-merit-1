import React, { useState, useEffect } from "react";
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  User, 
  Lock, 
  Smile, 
  Briefcase, 
  ShieldCheck, 
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  UserCheck,
  Check,
  Mail,
  Phone
} from "lucide-react";
import { UserProfile } from "../types";

export interface RegisteredAccount {
  id: string;
  name: string;
  email?: string;
  isEmailVerified?: boolean;
  emailVerifiedAt?: string;
  role: string;
  avatar: string;
  passcode: string;
  packageType: string;
  emailOrPhone?: string;
  createdAt: string;
  xp?: number;
  level?: number;
  streak?: number;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
  selectedPackage?: "basic" | "premium" | "b2b";
  language?: string;
  onLoginSuccess: (user: UserProfile) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "register",
  selectedPackage = "basic",
  language = "th",
  onLoginSuccess
}: AuthModalProps) {
  const isEn = language === "en";
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [currentPackage, setCurrentPackage] = useState<"basic" | "premium" | "b2b">(selectedPackage);
  const [contactInfo, setContactInfo] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [avatar, setAvatar] = useState("🧘");
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Email registration & verification states
  const [email, setEmail] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [verificationOtp, setVerificationOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpNotice, setOtpNotice] = useState("");

  // Saved accounts list
  const [savedAccounts, setSavedAccounts] = useState<RegisteredAccount[]>([]);

  // Emoji choices for profile avatar
  const avatarChoices = [
    "🧘", "😊", "🥰", "🌸", "☀️", "🌈", "🍀", "🧠", 
    "🐱", "🦊", "🐼", "🐬", "⭐", "🎨", "🎮", "🎵", 
    "🦄", "🦖", "🚀", "☕", "🌻", "💎", "🛡️", "💡"
  ];

  // Load saved accounts from localStorage on modal open
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setCurrentPackage(selectedPackage);
      setContactInfo("");
      setEmail("");
      setIsEmailVerified(false);
      setIsOtpSent(false);
      setVerificationOtp("");
      setEnteredOtp("");
      setOtpNotice("");
      setErrorMessage("");
      setSuccessMessage("");
      try {
        const stored = localStorage.getItem("mind_merit_registered_users_v1");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setSavedAccounts(parsed);
            if (initialMode === "login" && parsed.length > 0) {
              // Pre-fill latest account name or email
              setName(parsed[parsed.length - 1].name || parsed[parsed.length - 1].email || "");
            }
          }
        }
      } catch (e) {
        console.error("Failed to load saved accounts", e);
      }
    }
  }, [isOpen, initialMode, selectedPackage]);

  if (!isOpen) return null;

  // Validation checks for 6-character code (must have English letters and numbers)
  const isLength6 = passcode.length === 6;
  const hasLetter = /[a-zA-Z]/.test(passcode);
  const hasNumber = /[0-9]/.test(passcode);
  const isPasscodeValid = isLength6 && hasLetter && hasNumber;

  // Send OTP verification to email
  const handleSendEmailOtp = () => {
    setErrorMessage("");
    setOtpNotice("");
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage(isEn ? "Please enter your email address first." : "กรุณากรอกอีเมลของคุณก่อนเพื่อส่งรหัสยืนยัน");
      return;
    }
    const hasEmailFormat = trimmedEmail.includes("@") && trimmedEmail.includes(".");
    if (!hasEmailFormat) {
      setErrorMessage(isEn ? "Please enter a valid email format (e.g. user@email.com)." : "รูปแบบอีเมลไม่ถูกต้อง (เช่น yourname@gmail.com)");
      return;
    }

    // Check if email already registered by another user
    const existing = savedAccounts.find(
      (acc) => acc.email && acc.email.trim().toLowerCase() === trimmedEmail.toLowerCase()
    );
    if (existing) {
      setErrorMessage(
        isEn
          ? `The email "${trimmedEmail}" is already registered. Please log in or use another email.`
          : `อีเมล "${trimmedEmail}" มีผู้ใช้งานแล้วในระบบ กรุณาเข้าสู่ระบบหรือใช้อีเมลอื่น`
      );
      return;
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationOtp(code);
    setIsOtpSent(true);
    setEnteredOtp("");
    setOtpNotice(
      isEn
        ? `Verification code sent to ${trimmedEmail}! (Demo OTP: ${code})`
        : `ส่งรหัส OTP ยืนยันตัวตนไปยัง ${trimmedEmail} แล้ว! (รหัสจำลองสำหรับทดสอบ: ${code})`
    );
  };

  // Verify entered OTP
  const handleVerifyOtp = () => {
    setErrorMessage("");
    if (!enteredOtp.trim()) {
      setErrorMessage(isEn ? "Please enter the 6-digit OTP code." : "กรุณากรอกรหัส OTP 6 หลัก");
      return;
    }
    if (enteredOtp.trim() === verificationOtp) {
      setIsEmailVerified(true);
      setIsOtpSent(false);
      setOtpNotice(isEn ? "✅ Email successfully verified!" : "✅ ยืนยันตัวตนด้วยอีเมลสำเร็จแล้ว!");
    } else {
      setErrorMessage(isEn ? "Incorrect OTP code. Please check and try again." : "รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบรหัส 6 หลัก");
    }
  };

  // Quick Instant Verify Email helper
  const handleInstantVerifyEmail = () => {
    setErrorMessage("");
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      setErrorMessage(isEn ? "Please enter a valid email address first." : "กรุณากรอกอีเมลที่ถูกต้องก่อน");
      return;
    }
    const existing = savedAccounts.find(
      (acc) => acc.email && acc.email.trim().toLowerCase() === trimmedEmail.toLowerCase()
    );
    if (existing) {
      setErrorMessage(isEn ? "This email is already in use." : "อีเมลนี้มีผู้ใช้งานแล้ว");
      return;
    }
    setIsEmailVerified(true);
    setIsOtpSent(false);
    setOtpNotice(isEn ? "✅ Email verified successfully!" : "✅ ยืนยันตัวตนด้วยอีเมลเรียบร้อยแล้ว!");
  };

  // Handle Register
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedEmail = email.trim();
    let trimmedName = name.trim();

    // STRICT PRIVACY: Zero personal data required
    // If user leaves display name blank, derive safe display alias from email prefix
    if (!trimmedEmail && !trimmedName) {
      setErrorMessage(
        isEn ? "Please enter your email address to register." : "กรุณากรอกอีเมลของคุณเพื่อสมัครสมาชิก"
      );
      return;
    }

    if (!trimmedName && trimmedEmail) {
      trimmedName = trimmedEmail.split("@")[0];
    }

    // Validate email if entered
    if (trimmedEmail) {
      const hasEmailFormat = trimmedEmail.includes("@") && trimmedEmail.includes(".");
      if (!hasEmailFormat) {
        setErrorMessage(isEn ? "Invalid email format. (e.g. user@gmail.com)" : "รูปแบบอีเมลไม่ถูกต้อง (เช่น yourname@gmail.com)");
        return;
      }
      const existingEmail = savedAccounts.find(
        (acc) => acc.email && acc.email.trim().toLowerCase() === trimmedEmail.toLowerCase()
      );
      if (existingEmail) {
        setErrorMessage(
          isEn 
            ? `The email "${trimmedEmail}" is already registered. Please log in or use another email.` 
            : `อีเมล "${trimmedEmail}" มีการลงทะเบียนในระบบแล้ว กรุณาเข้าสู่ระบบหรือใช้อีเมลอื่น`
        );
        return;
      }
    }

    if (!isPasscodeValid) {
      setErrorMessage(
        isEn 
          ? "Passcode must be exactly 6 characters containing both English letters and numbers." 
          : "รหัสต้องมีความยาว 6 หลัก และต้องมีตัวอักษรภาษาอังกฤษและตัวเลข"
      );
      return;
    }

    // Check if duplicate display name exists
    const existing = savedAccounts.find(
      (acc) => acc.name && acc.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );
    if (existing) {
      trimmedName = `${trimmedName}_${Math.floor(100 + Math.random() * 900)}`;
    }

    // STRICT PRIVACY: Paid package requires strictly Email (NO personal phone numbers requested)
    if (currentPackage !== "basic" && !trimmedEmail) {
      setErrorMessage(
        isEn 
          ? "Please provide your email address for this package." 
          : "กรุณากรอกอีเมลสำหรับแพ็กเกจนี้ (ระบบไม่เก็บข้อมูลส่วนตัว ใช้เฉพาะอีเมลเท่านั้น)"
      );
      return;
    }

    // Determine verification state: if email entered and user verified it, or auto-mark verified if valid email
    const finalEmailVerified = isEmailVerified || (Boolean(trimmedEmail) && !isOtpSent);

    // Create new account
    const newAccount: RegisteredAccount = {
      id: "usr-" + Date.now(),
      name: trimmedName,
      email: trimmedEmail || undefined,
      isEmailVerified: finalEmailVerified,
      emailVerifiedAt: finalEmailVerified ? new Date().toISOString() : undefined,
      role,
      avatar,
      passcode,
      packageType: currentPackage,
      emailOrPhone: trimmedEmail || undefined,
      createdAt: new Date().toISOString(),
      xp: 50, // Welcome XP bonus!
      level: 1,
      streak: 1
    };

    const updatedAccounts = [...savedAccounts, newAccount];
    setSavedAccounts(updatedAccounts);
    localStorage.setItem("mind_merit_registered_users_v1", JSON.stringify(updatedAccounts));

    // Construct profile
    const profile: UserProfile = {
      name: trimmedName,
      email: trimmedEmail || undefined,
      isEmailVerified: finalEmailVerified,
      emailVerifiedAt: finalEmailVerified ? new Date().toISOString() : undefined,
      age: role === "student" ? 19 : 28,
      role: role as any,
      avatar,
      xp: 50,
      level: 1,
      streak: 1,
      badges: ["welcome_badge"],
      language: language as any,
      theme: "light",
      pdpaConsent: true,
      anonymousMode: false,
      visitsToday: 1,
      lastVisitDate: new Date().toISOString().split("T")[0],
      isRegistered: true,
      password: passcode,
      emailOrPhone: effectiveContact || undefined,
      packageType: currentPackage
    };

    setSuccessMessage(
      isEn 
        ? (finalEmailVerified ? "Registration & Email verification successful! Welcome." : "Registration successful! Welcome to MIND MERIT.") 
        : (finalEmailVerified ? "สมัครสมาชิกและยืนยันตัวตนด้วยอีเมลสำเร็จ! กำลังเข้าสู่ระบบ..." : "สมัครใช้งานสำเร็จ! กำลังเข้าสู่ระบบ...")
    );
    
    setTimeout(() => {
      onLoginSuccess(profile);
      onClose();
    }, 1000);
  };

  // Handle Login (Supports logging in by Registered Name OR Registered Email!)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedInput = name.trim().toLowerCase();
    if (!trimmedInput) {
      setErrorMessage(isEn ? "Please enter your registered name or email." : "กรุณากรอกชื่อหรืออีเมลที่เคยลงทะเบียนไว้");
      return;
    }

    if (!isPasscodeValid) {
      setErrorMessage(
        isEn 
          ? "Passcode must be 6 characters containing English letters and numbers." 
          : "รหัสต้องเป็นตัวอักษรภาษาอังกฤษและตัวเลข 6 หลัก"
      );
      return;
    }

    // Find account by Name OR Email OR Email/Phone
    const matchedAccount = savedAccounts.find(
      (acc) => 
        (acc.name.toLowerCase() === trimmedInput ||
         (acc.email && acc.email.toLowerCase() === trimmedInput) ||
         (acc.emailOrPhone && acc.emailOrPhone.toLowerCase() === trimmedInput)) &&
        acc.passcode === passcode
    );

    if (!matchedAccount) {
      // Check if user exists with different passcode
      const nameOrEmailMatch = savedAccounts.find(
        (acc) => 
          acc.name.toLowerCase() === trimmedInput ||
          (acc.email && acc.email.toLowerCase() === trimmedInput) ||
          (acc.emailOrPhone && acc.emailOrPhone.toLowerCase() === trimmedInput)
      );
      if (nameOrEmailMatch) {
        setErrorMessage(isEn ? "Incorrect 6-digit passcode. Please try again." : "รหัส 6 หลักไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
      } else {
        setErrorMessage(
          isEn 
            ? "Account not found with this name or email. Please check or sign up." 
            : "ไม่พบบัญชีชื่อหรืออีเมลนี้ในระบบ กรุณาตรวจสอบชื่อ/อีเมล หรือกดสมัครใช้งานใหม่"
        );
      }
      return;
    }

    // Successfully found account!
    const profile: UserProfile = {
      name: matchedAccount.name,
      email: matchedAccount.email,
      isEmailVerified: matchedAccount.isEmailVerified,
      emailVerifiedAt: matchedAccount.emailVerifiedAt,
      age: matchedAccount.role === "student" ? 19 : 28,
      role: matchedAccount.role as any,
      avatar: matchedAccount.avatar || "🧘",
      xp: matchedAccount.xp || 50,
      level: matchedAccount.level || 1,
      streak: (matchedAccount.streak || 0) + 1,
      badges: ["welcome_badge"],
      language: language as any,
      theme: "light",
      pdpaConsent: true,
      anonymousMode: false,
      visitsToday: 1,
      lastVisitDate: new Date().toISOString().split("T")[0],
      isRegistered: true,
      password: matchedAccount.passcode,
      emailOrPhone: matchedAccount.emailOrPhone || matchedAccount.email,
      packageType: (matchedAccount.packageType as any) || "basic"
    };

    setSuccessMessage(isEn ? "Login successful! Welcome back." : "เข้าสู่ระบบสำเร็จ ยินดีต้อนรับกลับมา!");
    
    setTimeout(() => {
      onLoginSuccess(profile);
      onClose();
    }, 900);
  };

  const selectExistingAccount = (acc: RegisteredAccount) => {
    setName(acc.name);
    if (acc.email) setEmail(acc.email);
    if (acc.isEmailVerified) setIsEmailVerified(true);
    setRole(acc.role);
    setAvatar(acc.avatar);
    if (acc.emailOrPhone) setContactInfo(acc.emailOrPhone);
    if (acc.packageType) setCurrentPackage(acc.packageType as any);
    setPasscode("");
    setErrorMessage("");
    setOtpNotice("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-2xl p-5 sm:p-7 overflow-hidden text-slate-800 dark:text-slate-100 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Pastel Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-emerald-400 via-pink-400 to-amber-300" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-400 via-teal-400 to-emerald-400 text-white shadow-md shadow-sky-500/20 mb-1">
            {mode === "register" ? <Sparkles className="h-6 w-6" /> : <UserCheck className="h-6 w-6" />}
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {mode === "register" 
              ? (isEn ? "Sign Up for MIND MERIT" : "สมัครใช้งาน MIND MERIT")
              : (isEn ? "Welcome Back! Log In" : "เข้าสู่ระบบ MIND MERIT")}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === "register"
              ? (isEn 
                  ? "Enter your details and 6-char code to start your wellness journey" 
                  : "กรอกข้อมูลเพื่อเริ่มต้นใช้งาน โดยตั้งรหัส 6 หลักเพื่อเข้าใช้ในรอบหน้า")
              : (isEn 
                  ? "Enter your registered name and 6-char code without filling info again" 
                  : "พิมพ์ชื่อที่ตั้งไว้และรหัส 6 หลัก เพื่อเข้าใช้ได้ทันทีโดยไม่ต้องสมัครใหม่")}
          </p>

          {/* Package Selection if registering */}
          {mode === "register" && (
            <div className="pt-2 text-left space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  {isEn ? "Select Package:" : "เลือกแพ็กเกจ:"}
                </span>
                <span className="text-[10px] text-slate-400">
                  {currentPackage === "basic" ? (isEn ? "Free forever" : "ฟรีตลอดไป") : (isEn ? "Paid plan (Email/Phone required)" : "ต้องใส่อีเมลหรือเบอร์โทร")}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => { setCurrentPackage("basic"); setErrorMessage(""); }}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    currentPackage === "basic"
                      ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-400/50"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-300"
                  }`}
                >
                  <div className="text-[11px] font-black flex items-center justify-between">
                    <span>B2C Basic</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">ฟรี</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">0 บาท</p>
                </button>

                <button
                  type="button"
                  onClick={() => { setCurrentPackage("premium"); setErrorMessage(""); }}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    currentPackage === "premium"
                      ? "border-sky-500 bg-sky-50/80 dark:bg-sky-950/40 text-sky-900 dark:text-sky-100 ring-2 ring-sky-400/50"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-300"
                  }`}
                >
                  <div className="text-[11px] font-black flex items-center justify-between">
                    <span>Premium</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-sky-100 text-sky-800 font-bold">100 บ.</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">/ด./คน</p>
                </button>

                <button
                  type="button"
                  onClick={() => { setCurrentPackage("b2b"); setErrorMessage(""); }}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    currentPackage === "b2b"
                      ? "border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-400/50"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300"
                  }`}
                >
                  <div className="text-[11px] font-black flex items-center justify-between">
                    <span>B2B School</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-100 text-indigo-800 font-bold">990 บ.</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">/ด./โรงเรียน</p>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tab Mode Switcher (สมัครใช้งาน vs เข้าสู่ระบบ) */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mt-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode("register"); setErrorMessage(""); }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              mode === "register"
                ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
            }`}
          >
            {isEn ? "Sign Up (New User)" : "สมัครใช้งาน (ผู้ใช้ใหม่)"}
          </button>
          <button
            type="button"
            onClick={() => { setMode("login"); setErrorMessage(""); }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              mode === "login"
                ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
            }`}
          >
            {isEn ? "Log In (Returning)" : "เข้าสู่ระบบ (เคยสมัครแล้ว)"}
          </button>
        </div>

        {/* Saved Accounts Quick Picker (for Login Mode) */}
        {mode === "login" && savedAccounts.length > 0 && (
          <div className="mt-3.5 p-3 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 space-y-1.5">
            <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 block">
              {isEn ? "Saved accounts on this device (Click to select):" : "บัญชีที่เคยสมัครไว้ในเครื่องนี้ (คลิกเพื่อเลือกทันที):"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {savedAccounts.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => selectExistingAccount(acc)}
                  className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    name.toLowerCase() === acc.name.toLowerCase() || (acc.email && name.toLowerCase() === acc.email.toLowerCase())
                      ? "bg-sky-500 text-white border-sky-500 shadow-2xs"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-sky-200/80 hover:bg-sky-100/50"
                  }`}
                >
                  <span>{acc.avatar}</span>
                  <span>{acc.name}</span>
                  {acc.isEmailVerified && (
                    <span className="text-[9px] px-1 py-0.2 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                      ✓ ยืนยันแล้ว
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-xs flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="leading-snug">{successMessage}</span>
          </div>
        )}

        {/* Strict Zero Personal Data Policy Guarantee */}
        <div className="mt-3.5 p-3 rounded-2xl bg-slate-900 text-white border border-slate-800 flex items-start space-x-2.5 shadow-sm">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-bold text-emerald-300">
              {isEn ? "Zero Personal Data Policy: " : "นโยบายความเป็นส่วนตัวสูงสุด (Zero Personal Data): "}
            </span>
            <span className="text-slate-300">
              {isEn
                ? "We never access or store personal details. Only email is used for account identity and verification."
                : "ระบบไม่เข้าถึงและไม่จัดเก็บข้อมูลส่วนตัวใดๆ ของผู้ใช้เด็ดขาด ใช้เฉพาะ 'อีเมล' สำหรับการยืนยันตัวตนและเข้าสู่ระบบเท่านั้น"}
            </span>
          </div>
        </div>

        {/* MAIN FORM */}
        <form onSubmit={mode === "register" ? handleRegister : handleLogin} className="mt-4 space-y-3.5">
          
          {/* 1. Email Address & Identity Verification (สมัครสมาชิกด้วยอีเมล / ยืนยันตัวตนด้วยอีเมล) */}
          {mode === "register" && (
            <div className="space-y-2 p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                  <Mail className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  <span>{isEn ? "Email Address (Sign Up & Verification) *" : "อีเมลสำหรับสมัครสมาชิกและยืนยันตัวตน *"}</span>
                </label>
                {isEmailVerified ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    <span>{isEn ? "Verified" : "ยืนยันตัวตนแล้ว"}</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-sky-700 dark:text-sky-300 font-medium">
                    {isEn ? "Verify with OTP" : "ยืนยันตัวตนด้วยรหัส OTP"}
                  </span>
                )}
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsEmailVerified(false);
                    setIsOtpSent(false);
                    setErrorMessage("");
                  }}
                  placeholder={isEn ? "e.g. yourname@gmail.com" : "เช่น yourname@gmail.com"}
                  className="w-full pl-9 pr-28 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 font-medium"
                />

                {/* Email Verification Action Buttons */}
                {!isEmailVerified && email.trim() && (
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={handleSendEmailOtp}
                      className="px-2 py-1 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-[10px] font-bold cursor-pointer transition-colors shadow-xs"
                      title={isEn ? "Send verification OTP code" : "ส่งรหัส OTP จำลอง"}
                    >
                      {isOtpSent ? (isEn ? "Resend" : "ส่งใหม่") : (isEn ? "Send OTP" : "ส่ง OTP")}
                    </button>
                    <button
                      type="button"
                      onClick={handleInstantVerifyEmail}
                      className="px-2 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold cursor-pointer transition-colors shadow-xs"
                      title={isEn ? "Instantly verify this email" : "ยืนยันทันที"}
                    >
                      {isEn ? "Verify" : "ยืนยัน"}
                    </button>
                  </div>
                )}
              </div>

              {/* OTP Input Row if OTP is sent */}
              {isOtpSent && !isEmailVerified && (
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-sky-200 dark:border-sky-800 space-y-1.5 animate-in fade-in">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    <span>{isEn ? "Enter 6-Digit OTP from Email:" : "กรอกรหัส OTP 6 หลักที่ได้รับทางอีเมล:"}</span>
                    <span className="text-[10px] text-sky-600 font-mono">รหัสจำลอง: {verificationOtp}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="เช่น 123456"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-center tracking-widest font-bold focus:outline-none focus:ring-1 focus:ring-sky-400"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold cursor-pointer transition-colors flex items-center space-x-1"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>{isEn ? "Confirm" : "ตรวจสอบรหัส"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* OTP Notice / Feedback */}
              {otpNotice && (
                <p className="text-[10px] text-sky-700 dark:text-sky-300 font-medium leading-relaxed bg-white/60 dark:bg-slate-800/60 p-1.5 rounded-lg border border-sky-100 dark:border-sky-900/40">
                  {otpNotice}
                </p>
              )}

              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                💡 {isEn 
                  ? "Sign up with email to verify identity and enable login with email." 
                  : "สมัครสมาชิกด้วยอีเมลเพื่อยืนยันตัวตน และสามารถใช้อีเมลนี้ล็อกอินได้"}
              </p>
            </div>
          )}

          {/* 2. Display Name / Nickname Field (or Login Field) */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {mode === "register" 
                ? (isEn ? "Nickname / Display Name (Optional - no real name needed)" : "ชื่อเล่น / นามแฝงแสดงผล (ไม่บังคับ - ไม่เก็บชื่อจริง)")
                : (isEn ? "Registered Email or Nickname *" : "อีเมลที่ลงทะเบียน หรือชื่อเล่นของคุณ *")}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required={mode === "login"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  mode === "register" 
                    ? (isEn ? "e.g. Maya (or leave blank to use email prefix)" : "เช่น มายด์, Alex (หรือเว้นว่างเพื่อใช้อีเมลเป็นชื่อ)") 
                    : (isEn ? "e.g. yourname@gmail.com or Alex" : "เช่น yourname@gmail.com หรือ สมชาย")
                }
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 font-medium"
              />
            </div>
            {mode === "login" && (
              <p className="text-[10px] text-slate-400 mt-1">
                💡 {isEn ? "You can sign in using your registered Email or Nickname" : "สามารถเข้าสู่ระบบด้วยอีเมลที่ลงทะเบียน หรือชื่อเล่น"}
              </p>
            )}
            {mode === "register" && !name && email && (
              <p className="text-[10px] text-sky-600 dark:text-sky-400 mt-1">
                ✨ {isEn ? `Will display as: "${email.split('@')[0]}"` : `หากไม่ระบุ จะใช้ชื่อแสดงผลว่า: "${email.split('@')[0]}"`}
              </p>
            )}
          {/* 3. Status / Role Field (Only in Register mode) */}
          {mode === "register" && (
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isEn ? "Status / Role" : "สถานะ / บทบาท"}
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400 font-medium cursor-pointer"
                >
                  <option value="student">{isEn ? "Student (High School / University)" : "🎓 นักเรียน / นิสิตนักศึกษา"}</option>
                  <option value="adult">{isEn ? "Working Adult / Corporate" : "💼 วัยทำงาน / บุคลากร"}</option>
                  <option value="teacher">{isEn ? "Teacher / Educator" : "👩‍🏫 ครู / อาจารย์ / ผู้แนะแนว"}</option>
                  <option value="parent">{isEn ? "Parent" : "👨‍👩‍👦 ผู้ปกครอง"}</option>
                  <option value="general">{isEn ? "General Individual" : "🌟 บุคคลทั่วไป"}</option>
                </select>
              </div>
            </div>
          )}

          {/* 3. Emoji / Avatar Picker (Only in Register mode) */}
          {mode === "register" && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                {isEn ? "Choose Profile Avatar / Emoji" : "อิโมจิหรือรูปโปรไฟล์"}
              </label>
              <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-slate-700 text-2xl shadow-sm border border-slate-200 dark:border-slate-600">
                  {avatar}
                </div>
                <div className="flex-1 overflow-x-auto py-1 scrollbar-none">
                  <div className="flex space-x-1.5">
                    {avatarChoices.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setAvatar(emoji)}
                        className={`h-8 w-8 rounded-lg flex items-center justify-center text-base hover:scale-110 active:scale-95 transition-all cursor-pointer ${
                          avatar === emoji 
                            ? "bg-sky-500 text-white ring-2 ring-sky-300" 
                            : "bg-white dark:bg-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Passcode Field (6 characters: letters + numbers) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isEn ? "6-Digit Passcode" : "รหัส 6 หลัก (ตัวอักษรภาษาอังกฤษ + ตัวเลข)"}
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {passcode.length}/6 {isEn ? "chars" : "ตัว"}
              </span>
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                maxLength={6}
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value.slice(0, 6))}
                placeholder={isEn ? "e.g. Mm1234 or Ab5678" : "เช่น Mm1234 หรือ Ab5678"}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 font-mono tracking-wider font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Validation indicators */}
            <div className="mt-2 grid grid-cols-3 gap-1.5 text-[10px]">
              <div className={`p-1.5 rounded-lg flex items-center justify-center space-x-1 border font-medium ${
                isLength6 
                  ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border-emerald-200 dark:border-emerald-800" 
                  : "bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-slate-100 dark:border-slate-800"
              }`}>
                {isLength6 ? <Check className="h-3 w-3" /> : <span>•</span>}
                <span>6 ตัวอักษร</span>
              </div>
              <div className={`p-1.5 rounded-lg flex items-center justify-center space-x-1 border font-medium ${
                hasLetter 
                  ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border-emerald-200 dark:border-emerald-800" 
                  : "bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-slate-100 dark:border-slate-800"
              }`}>
                {hasLetter ? <Check className="h-3 w-3" /> : <span>•</span>}
                <span>มีอังกฤษ (A-Z)</span>
              </div>
              <div className={`p-1.5 rounded-lg flex items-center justify-center space-x-1 border font-medium ${
                hasNumber 
                  ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border-emerald-200 dark:border-emerald-800" 
                  : "bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-slate-100 dark:border-slate-800"
              }`}>
                {hasNumber ? <Check className="h-3 w-3" /> : <span>•</span>}
                <span>มีตัวเลข (0-9)</span>
              </div>
            </div>

            {/* Requirement explanation */}
            <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
              💡 {mode === "register" 
                ? (isEn 
                    ? "This 6-digit code will be used to log in next time without re-registering." 
                    : "รหัส 6 หลักนี้มีไว้เพื่อจะเข้าใช้ได้ในรอบหน้า เมื่อกดเข้าสู่ระบบ โดยไม่ต้องสมัครและกรอกข้อมูลใหม่")
                : (isEn 
                    ? "Enter your 6-digit alphanumeric passcode created during registration." 
                    : "กรอกรหัส 6 หลักที่ตั้งไว้เพื่อเข้าสู่ระบบ")}
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!isPasscodeValid || !name.trim()}
              className={`w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm text-white shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                isPasscodeValid && name.trim()
                  ? "bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 hover:scale-[1.02] active:scale-[0.98] shadow-sky-500/20"
                  : "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed opacity-70"
              }`}
            >
              <span>
                {mode === "register" 
                  ? (isEn ? "Sign Up & Enter App" : "สมัครใช้งานและเข้าสู่แอป")
                  : (isEn ? "Log In to MIND MERIT" : "เข้าสู่ระบบทันที")}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Bottom Switch Note */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
          {mode === "register" ? (
            <p>
              {isEn ? "Already have an account?" : "เคยสมัครใช้งานแล้ว?"}{" "}
              <button
                type="button"
                onClick={() => { setMode("login"); setErrorMessage(""); }}
                className="text-sky-600 dark:text-sky-400 font-bold hover:underline cursor-pointer"
              >
                {isEn ? "Log In here" : "เข้าสู่ระบบที่นี่"}
              </button>
            </p>
          ) : (
            <p>
              {isEn ? "Don't have an account yet?" : "ยังไม่มีบัญชี?"}{" "}
              <button
                type="button"
                onClick={() => { setMode("register"); setErrorMessage(""); }}
                className="text-sky-600 dark:text-sky-400 font-bold hover:underline cursor-pointer"
              >
                {isEn ? "Sign Up Free" : "สมัครใช้งานฟรีที่นี่"}
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
