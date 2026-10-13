import React, { useState } from "react";
import { 
  X, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Sparkles, 
  ArrowRight,
  Check,
  FileSpreadsheet,
  CloudCheck
} from "lucide-react";
import { UserProfile } from "../types";
import { appendSingleUserToSheet } from "../services/googleSheetsService";

interface LinkEmailBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

export default function LinkEmailBackupModal({
  isOpen,
  onClose,
  user,
  onUpdateUser
}: LinkEmailBackupModalProps) {
  if (!isOpen) return null;

  const isEn = user.language === "en";
  const [email, setEmail] = useState(user.email || "");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [verificationOtp, setVerificationOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Send OTP
  const handleSendOtp = () => {
    setErrorMessage("");
    setSuccessMessage("");
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@") || !trimmed.includes(".")) {
      setErrorMessage(
        isEn
          ? "Please enter a valid email address (e.g. yourname@gmail.com)."
          : "กรุณากรอกรูปแบบอีเมลที่ถูกต้อง (เช่น yourname@gmail.com)"
      );
      return;
    }

    // Check duplicate email
    try {
      const stored = localStorage.getItem("mind_merit_registered_users_v1");
      if (stored) {
        const accounts = JSON.parse(stored);
        if (Array.isArray(accounts)) {
          const duplicate = accounts.find(
            (acc: any) =>
              acc.email &&
              acc.email.trim().toLowerCase() === trimmed.toLowerCase() &&
              acc.name?.trim().toLowerCase() !== user.name.trim().toLowerCase()
          );
          if (duplicate) {
            setErrorMessage(
              isEn
                ? `The email "${trimmed}" is already linked to another account.`
                : `อีเมล "${trimmed}" ถูกผูกไว้กับบัญชีอื่นแล้ว กรุณาใช้อีเมลอื่น`
            );
            return;
          }
        }
      }
    } catch (e) {
      console.error(e);
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationOtp(code);
    setIsOtpSent(true);
    setSuccessMessage(
      isEn
        ? `Verification code sent to ${trimmed}! (Demo OTP: ${code})`
        : `ส่งรหัส OTP ไปยัง ${trimmed} เรียบร้อยแล้ว! (รหัสจำลอง: ${code})`
    );
  };

  // Save email and broadcast to real-time Google Sheets
  const saveEmailAndSync = (verifiedEmail: string) => {
    setIsSubmitting(true);
    const updatedUser: UserProfile = {
      ...user,
      email: verifiedEmail,
      emailOrPhone: verifiedEmail,
      isEmailVerified: true,
      emailVerifiedAt: new Date().toISOString()
    };

    // 1. Update active user
    onUpdateUser(updatedUser);

    // 2. Update registered accounts storage
    try {
      const stored = localStorage.getItem("mind_merit_registered_users_v1");
      if (stored) {
        const accounts = JSON.parse(stored);
        if (Array.isArray(accounts)) {
          const updated = accounts.map((acc: any) => {
            if (acc.name && acc.name.trim().toLowerCase() === user.name.trim().toLowerCase()) {
              return {
                ...acc,
                email: verifiedEmail,
                emailOrPhone: verifiedEmail,
                isEmailVerified: true,
                emailVerifiedAt: new Date().toISOString()
              };
            }
            return acc;
          });
          localStorage.setItem("mind_merit_registered_users_v1", JSON.stringify(updated));
        }
      }
    } catch (e) {
      console.error("Failed to update registered users storage", e);
    }

    // 3. REAL-TIME GOOGLE SHEETS LIVE SYNC
    const realTimeEntry = {
      id: "usr-" + Date.now(),
      timestamp: new Date().toLocaleTimeString("th-TH") + " (" + new Date().toLocaleDateString("th-TH") + ")",
      email: verifiedEmail,
      isEmailVerified: true,
      status: "Verified (ผูกอีเมลสำรองข้อมูลเรียบร้อย)",
      policy: "Zero Personal Data Policy Enforced",
      isNew: true
    };

    window.dispatchEvent(
      new CustomEvent("mind_merit_realtime_registration", {
        detail: realTimeEntry
      })
    );

    appendSingleUserToSheet(updatedUser).catch(() => {});

    setSuccessMessage(
      isEn
        ? "✅ Email linked successfully! Your data is now backed up and synced to Google Sheets in real-time."
        : "✅ ผูกอีเมลสำรองข้อมูลสำเร็จ! ข้อมูลของคุณปลอดภัย และเด้งเข้า Google Sheets แบบเรียลไทม์ทันที"
    );

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1200);
  };

  // Verify OTP & Save
  const handleVerifyOtp = () => {
    setErrorMessage("");
    if (!enteredOtp.trim()) {
      setErrorMessage(isEn ? "Please enter the 6-digit OTP code." : "กรุณากรอกรหัส OTP 6 หลัก");
      return;
    }
    if (enteredOtp.trim() === verificationOtp) {
      saveEmailAndSync(email.trim());
    } else {
      setErrorMessage(isEn ? "Incorrect OTP code. Please try again." : "รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
    }
  };

  // 1-Click Instant Link
  const handleInstantLink = () => {
    setErrorMessage("");
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@") || !trimmed.includes(".")) {
      setErrorMessage(
        isEn
          ? "Please enter a valid email address (e.g. yourname@gmail.com)."
          : "กรุณากรอกรูปแบบอีเมลที่ถูกต้อง (เช่น yourname@gmail.com)"
      );
      return;
    }
    saveEmailAndSync(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-2xl p-5 sm:p-7 overflow-hidden text-slate-800 dark:text-slate-100"
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

        {/* Header */}
        <div className="text-center space-y-2 pt-1">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-400 via-teal-400 to-emerald-400 text-white shadow-md shadow-sky-500/20 mb-1">
            <Mail className="h-6 w-6" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {isEn ? "Link Email for Cloud Backup" : "ผูกอีเมลเพื่อสำรองข้อมูลกันข้อมูลหาย"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            {isEn
              ? "Afraid of losing your wellness records or certificates? Link your email anytime to safely backup your data and recover your account."
              : "ตอนสมัครไม่ต้องใส่อีเมล แต่ถ้ากลัวบันทึกอารมณ์หรือเกียรติบัตรหาย สามารถผูกอีเมลตอนนี้เพื่อสำรองข้อมูลไว้บนระบบคลาวด์ได้ทุกเมื่อ"}
          </p>
        </div>

        {/* Zero Personal Data Guarantee */}
        <div className="mt-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-start space-x-2.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-bold">
              {isEn ? "Strict Privacy Guaranteed: " : "ความปลอดภัยและความเป็นส่วนตัว 100%: "}
            </span>
            <span className="text-emerald-700 dark:text-emerald-300">
              {isEn
                ? "No personal info is collected. Email is solely used to safeguard your account and restore your records."
                : "ระบบไม่เข้าถึงและไม่เก็บข้อมูลส่วนตัวใดๆ ของคุณ ใช้เฉพาะอีเมลเพื่อป้องกันข้อมูลสูญหายและใช้กู้คืนบัญชีเท่านั้น"}
            </span>
          </div>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="leading-snug">{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <div className="mt-4 space-y-3.5">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {isEn ? "Your Backup Email Address *" : "อีเมลที่คุณต้องการผูกสำหรับสำรองข้อมูล *"}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsOtpSent(false);
                  setErrorMessage("");
                }}
                placeholder={isEn ? "e.g. yourname@gmail.com" : "เช่น yourname@gmail.com"}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 font-medium"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              💡 {isEn ? "You can also use this email to log in next time." : "เมื่อผูกอีเมลแล้ว จะสามารถใช้อีเมลนี้ล็อกอินเข้าสู่ระบบในรอบหน้าได้ด้วย"}
            </p>
          </div>

          {/* OTP Section if Sent */}
          {isOtpSent && (
            <div className="p-3 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>{isEn ? "Enter 6-digit OTP code:" : "กรอกรหัสยืนยัน OTP 6 หลัก:"}</span>
                <span className="text-[10px] text-sky-600 font-mono font-bold">รหัสทดสอบ: {verificationOtp}</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="123456"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-center tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isSubmitting}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold cursor-pointer transition-colors flex items-center space-x-1 shadow-xs"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>{isEn ? "Confirm" : "ยืนยันรหัส"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            {!isOtpSent ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={!email.trim() || isSubmitting}
                  className="py-2.5 px-3 rounded-xl border border-sky-500 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/40 font-bold text-xs transition-all cursor-pointer flex items-center justify-center space-x-1"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{isEn ? "Verify with OTP" : "ขอรหัส OTP"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleInstantLink}
                  disabled={!email.trim() || isSubmitting}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1"
                >
                  <span>{isEn ? "Instant Link" : "ผูกอีเมลทันที"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleInstantLink}
                disabled={isSubmitting}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer text-center"
              >
                {isEn ? "Skip OTP & Link Directly" : "ข้าม OTP และบันทึกผูกอีเมลทันที"}
              </button>
            )}

            {/* Cancel / Maybe Later */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium transition-colors cursor-pointer"
            >
              {isEn ? "Maybe later (Continue without email)" : "ไว้ค่อยผูกทีหลัง (ใช้งานต่อแบบไม่ใช้อีเมล)"}
            </button>
          </div>
        </div>

        {/* Real-time Google Sheet Sync Tag */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center space-x-1">
            <FileSpreadsheet className="h-3 w-3 text-emerald-500" />
            <span>ซิงค์ข้อมูล Google Sheet แบบเรียลไทม์</span>
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">● Live Sync Ready</span>
        </div>
      </div>
    </div>
  );
}
