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
  Check
} from "lucide-react";
import { UserProfile } from "../types";

export interface RegisteredAccount {
  id: string;
  name: string;
  role: string;
  avatar: string;
  passcode: string;
  packageType: string;
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

  // Form states
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [avatar, setAvatar] = useState("🧘");
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
      setErrorMessage("");
      setSuccessMessage("");
      try {
        const stored = localStorage.getItem("mind_merit_registered_users_v1");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setSavedAccounts(parsed);
            if (initialMode === "login" && parsed.length > 0) {
              // Pre-fill latest account name
              setName(parsed[parsed.length - 1].name);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load saved accounts", e);
      }
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // Validation checks for 6-character code (must have English letters and numbers)
  const isLength6 = passcode.length === 6;
  const hasLetter = /[a-zA-Z]/.test(passcode);
  const hasNumber = /[0-9]/.test(passcode);
  const isPasscodeValid = isLength6 && hasLetter && hasNumber;

  // Handle Register
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage(isEn ? "Please enter your name." : "กรุณากรอกชื่อของคุณ");
      return;
    }

    if (!isPasscodeValid) {
      setErrorMessage(
        isEn 
          ? "Passcode must be exactly 6 characters containing both English letters and numbers." 
          : "รหัสต้องมีความยาว 6 หลัก และต้องมีตัวอักษรภาษาอังกฤษและตัวเลข"
      );
      return;
    }

    // Check if duplicate name exists (ห้ามมีชื่อซ้ำกัน เช่นถ้ามีคนชื่อ กุ้ง แล้ว จะกุ้งอีกไม่ได้ แต่ กุ้งง แบบนี้ได้เพราะมีความแตกต่าง)
    const existing = savedAccounts.find(
      (acc) => acc.name && acc.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );
    if (existing) {
      setErrorMessage(
        isEn 
          ? `The name "${trimmedName}" is already taken. Please choose a different name (e.g. add extra letters) or log in.` 
          : `ชื่อ "${trimmedName}" มีผู้ใช้งานแล้ว ไม่สามารถใช้ชื่อซ้ำกันได้ (เช่น ถ้ามีคนชื่อ กุ้ง แล้ว จะกุ้งอีกไม่ได้ แต่ "${trimmedName}ง" แบบนี้ได้ หรือกดเข้าสู่ระบบ)`
      );
      return;
    }

    // Create new account
    const newAccount: RegisteredAccount = {
      id: "usr-" + Date.now(),
      name: trimmedName,
      role,
      avatar,
      passcode,
      packageType: selectedPackage,
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
      password: passcode
    };

    setSuccessMessage(isEn ? "Registration successful! Welcome to MIND MERIT." : "สมัครใช้งานสำเร็จ! กำลังเข้าสู่ระบบ...");
    
    setTimeout(() => {
      onLoginSuccess(profile);
      onClose();
    }, 1000);
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage(isEn ? "Please enter your registered name." : "กรุณากรอกชื่อที่เคยตั้งไว้");
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

    // Find account
    const matchedAccount = savedAccounts.find(
      (acc) => 
        acc.name.toLowerCase() === trimmedName.toLowerCase() &&
        acc.passcode === passcode
    );

    if (!matchedAccount) {
      // Check if user exists with different code
      const nameMatch = savedAccounts.find(
        (acc) => acc.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (nameMatch) {
        setErrorMessage(isEn ? "Incorrect 6-digit passcode. Please try again." : "รหัส 6 หลักไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
      } else {
        setErrorMessage(
          isEn 
            ? "Account not found. Please check name or register a new account." 
            : "ไม่พบบัญชีชื่อนี้ในระบบ กรุณาตรวจสอบชื่อ หรือกดสมัครใช้งานใหม่"
        );
      }
      return;
    }

    // Successfully found account!
    const profile: UserProfile = {
      name: matchedAccount.name,
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
      password: matchedAccount.passcode
    };

    setSuccessMessage(isEn ? "Login successful! Welcome back." : "เข้าสู่ระบบสำเร็จ ยินดีต้อนรับกลับมา!");
    
    setTimeout(() => {
      onLoginSuccess(profile);
      onClose();
    }, 900);
  };

  const selectExistingAccount = (acc: RegisteredAccount) => {
    setName(acc.name);
    setRole(acc.role);
    setAvatar(acc.avatar);
    setPasscode("");
    setErrorMessage("");
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

          {/* Package Badge if registering */}
          {mode === "register" && (
            <div className="pt-1">
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[11px] font-bold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/60">
                <ShieldCheck className="h-3 w-3 text-sky-500" />
                <span>
                  {selectedPackage === "premium" 
                    ? (isEn ? "Package: B2C Premium (100 THB/mo)" : "แพ็กเกจ: B2C Premium (100 บาท/เดือน)")
                    : selectedPackage === "b2b"
                    ? (isEn ? "Package: B2B Enterprise / School" : "แพ็กเกจ: B2B Enterprise / โรงเรียน")
                    : (isEn ? "Package: B2C Basic (Free)" : "แพ็กเกจ: B2C Basic (ฟรี)")}
                </span>
              </span>
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
                    name === acc.name
                      ? "bg-sky-500 text-white border-sky-500 shadow-2xs"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-sky-200/80 hover:bg-sky-100/50"
                  }`}
                >
                  <span>{acc.avatar}</span>
                  <span>{acc.name}</span>
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

        {/* MAIN FORM */}
        <form onSubmit={mode === "register" ? handleRegister : handleLogin} className="mt-4 space-y-3.5">
          
          {/* 1. Name Field */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {mode === "register" 
                ? (isEn ? "Full Name / Display Name" : "ชื่อของคุณ / นามแฝง")
                : (isEn ? "Registered Name" : "ชื่อที่ตั้งไว้ตอนสมัคร")}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isEn ? "e.g. Alex, Maya" : "เช่น สมชาย, มายด์, Alex"}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 font-medium"
              />
            </div>
          </div>

          {/* 2. Status / Role Field (Only in Register mode) */}
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
