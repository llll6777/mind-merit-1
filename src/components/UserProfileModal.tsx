import React, { useState } from "react";
import { 
  X, Award, Shield, Compass, BookOpen, Clock, Zap, Calendar, 
  ChevronRight, ToggleLeft, ToggleRight, Check, Printer, FileText, BadgeCheck, Trophy, Sparkles
} from "lucide-react";
import { UserProfile, Certificate, Badge } from "../types";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  certificates: Certificate[];
  onUpdateUser: (updated: UserProfile) => void;
  systemBadges: Badge[];
}

export default function UserProfileModal({ 
  isOpen, 
  onClose, 
  user, 
  certificates, 
  onUpdateUser, 
  systemBadges 
}: UserProfileModalProps) {
  const [bio, setBio] = useState<string>(() => {
    return localStorage.getItem("mind_merit_profile_bio") || (user.language === "en" ? "Mindful traveler seeking balance." : "ผู้ร่วมทางผู้มีสติ กำลังมองหาความสมดุลในชีวิต");
  });
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  if (!isOpen) return null;

  const isEn = user.language === "en";

  const handleSaveBio = () => {
    localStorage.setItem("mind_merit_profile_bio", bio);
    setIsEditingBio(false);
  };

  const handleToggleAnonymous = () => {
    onUpdateUser({
      ...user,
      anonymousMode: !user.anonymousMode
    });
  };

  // Calculate XP required for next level
  const xpNeeded = user.level * 100;
  const progressPercent = Math.min(100, Math.round((user.xp / xpNeeded) * 100));

  return (
    <div id="profile-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="profile-modal-backdrop" 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        id="profile-modal-container" 
        className="relative z-10 w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col transition-colors duration-300"
      >
        {/* Banner Cover Cover with Wave decoration */}
        <div className="relative h-28 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 p-6 flex items-end">
          <div className="absolute top-4 right-4 flex space-x-2">
            <button 
              id="profile-modal-close-btn"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all cursor-pointer"
              title={isEn ? "Close" : "ปิด"}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-indigo-900 to-slate-900 pointer-events-none" />
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Main User Card Section */}
          <div className="relative -mt-16 flex flex-col sm:flex-row items-center sm:items-end sm:space-x-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            {/* Avatar Circle */}
            <div className="h-24 w-24 rounded-full border-4 border-white dark:border-slate-900 bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-5xl shadow-md shrink-0 transition-transform hover:scale-105">
              {user.avatar || "🧘"}
            </div>
            
            {/* Name and Status */}
            <div className="mt-3 sm:mt-0 text-center sm:text-left flex-1 space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 justify-center sm:justify-start">
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                  {user.name}
                </h2>
                <span className="inline-flex self-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/20">
                  {user.role === "student" ? (isEn ? "Student" : "นักศึกษา") : (isEn ? "Working Adult" : "วัยทำงาน")}
                </span>
              </div>
              
              {/* Editable Bio */}
              <div className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                {isEditingBio ? (
                  <div className="flex items-center space-x-1.5 mt-1">
                    <input 
                      type="text" 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="flex-1 px-2.5 py-1 text-xs border border-purple-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none"
                    />
                    <button 
                      onClick={handleSaveBio}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-md cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center sm:justify-start space-x-1.5">
                    <p className="italic">"{bio}"</p>
                    <button 
                      onClick={() => setIsEditingBio(true)}
                      className="text-[10px] text-purple-500 hover:underline cursor-pointer"
                    >
                      {isEn ? "Edit" : "แก้ไข"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Gamified Points & Stats Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Level & XP Card */}
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>{isEn ? "Level & Progress" : "ระดับและคะแนน XP"}</span>
                <Trophy className="h-4 w-4 text-amber-500" />
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Lv. {user.level}</span>
                <span className="text-xs text-slate-400">({user.xp} / {xpNeeded} XP)</span>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-400">
                  <span>{progressPercent}%</span>
                  <span>{isEn ? `${xpNeeded - user.xp} XP to next level` : `ขาดอีก ${xpNeeded - user.xp} XP จะเลเวลอัพ`}</span>
                </div>
              </div>
            </div>

            {/* Streak Tracker */}
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>{isEn ? "Active Streak" : "สถิติต่อเนื่อง"}</span>
                <Zap className="h-4 w-4 text-orange-500 animate-bounce" />
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{user.streak}</span>
                <span className="text-xs text-slate-400">{isEn ? "Days" : "วันต่อเนื่อง"}</span>
              </div>
              <p className="text-[10px] text-slate-400">
                {isEn ? "Log in every day to boost your mindfulness index!" : "เช็คอินอารมณ์สม่ำเสมอเพื่ออัพสถิติสถิติสุขภาพใจ"}
              </p>
            </div>

            {/* Certificate count / badges */}
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>{isEn ? "Credentials Earned" : "ความสำเร็จที่ได้รับ"}</span>
                <BadgeCheck className="h-4 w-4 text-purple-500" />
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                  {certificates.length}
                </span>
                <span className="text-xs text-slate-400">{isEn ? "Certificates" : "เกียรติบัตร"}</span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <span>🏆 {user.badges.length} {isEn ? "Badges Unlocked" : "เหรียญตราเกียรติยศ"}</span>
              </div>
            </div>

          </div>

          {/* Badges Cabinet (ตู้สะสมเหรียญตรา) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-purple-500" />
              <span>{isEn ? "Milestone Badges" : "เหรียญเกียรติยศความสำเร็จ (Badges)"}</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {systemBadges.map((badge) => {
                const isUnlocked = user.badges.includes(badge.id);
                return (
                  <div 
                    key={badge.id}
                    className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all ${
                      isUnlocked 
                        ? 'bg-gradient-to-br from-purple-500/5 to-indigo-500/5 border-purple-200/50 dark:border-purple-950/40 text-slate-800 dark:text-slate-200' 
                        : 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-100 dark:border-slate-800 opacity-50 grayscale'
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg mb-2 ${isUnlocked ? 'bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-300 shadow-sm' : 'bg-slate-200 text-slate-400 dark:bg-slate-800'}`}>
                      {badge.id === "welcome_badge" ? "⚡" : badge.id === "streak_champion" ? "🔥" : badge.id === "assessment_guru" ? "🧠" : "🛡️"}
                    </div>
                    <span className="text-[11px] font-bold line-clamp-1">
                      {isEn ? badge.titleEn : badge.titleTh}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5 leading-tight line-clamp-2">
                      {isEn ? badge.descEn : badge.descTh}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Certificates & Diplomas list (เกียรติบัตรสุขภาพจิต) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-emerald-500" />
                <span>{isEn ? "Verified Certificates" : "เกียรติบัตรและประกาศนียบัตรที่ได้รับ"}</span>
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                {certificates.length} {isEn ? "Completed" : "ใบสำเร็จ"}
              </span>
            </div>

            {certificates.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>{isEn ? "No certificates earned yet." : "ยังไม่ได้รับเกียรติบัตรในระบบ"}</p>
                <p className="mt-1 text-[10px] text-slate-400/80">
                  {isEn ? "Complete quizzes in Learning Academy to receive verified credentials!" : "สำเร็จบทเรียนและตอบแบบทดสอบในคลังความรู้เพื่อรับเกียรติบัตรดิจิทัล"}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {certificates.map((cert) => (
                  <div 
                    key={cert.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-100 dark:border-emerald-900/20 shadow-sm hover:shadow transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100">
                          {isEn ? cert.courseNameEn : cert.courseNameTh}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {isEn ? "Earned on:" : "ได้รับเมื่อ:"} {cert.date} • ID: {cert.certificateId}
                        </p>
                      </div>
                    </div>
                    <button
                      id={`view-cert-btn-${cert.id}`}
                      onClick={() => setSelectedCertificate(cert)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>{isEn ? "View" : "เปิดดูเกียรติบัตร"}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Privacy & Settings in Modal */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-3.5">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              {isEn ? "Privacy Options" : "การตั้งค่าความเป็นส่วนตัว"}
            </h3>
            
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-800">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {isEn ? "Anonymous Mode" : "โหมดไม่ประสงค์ออกนาม"}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {isEn ? "Hide your name in community posts & comments." : "ซ่อนชื่อจริงของคุณเมื่อทำโพสต์หรือคอมเมนต์ในชุมชน"}
                </p>
              </div>
              <button 
                id="toggle-anon-btn"
                onClick={handleToggleAnonymous}
                className="text-purple-600 dark:text-purple-400 cursor-pointer"
              >
                {user.anonymousMode ? (
                  <ToggleRight className="h-8 w-8" />
                ) : (
                  <ToggleLeft className="h-8 w-8 text-slate-400" />
                )}
              </button>
            </div>
          </div>

        </div>
        
        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
          <button
            id="profile-modal-footer-close"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            {isEn ? "Close Window" : "ปิดหน้าต่าง"}
          </button>
        </div>
      </div>

      {/* Embedded Certificate Viewer Popup Detail */}
      {selectedCertificate && (
        <div id="certificate-viewer-overlay" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in zoom-in duration-150">
          <div className="absolute inset-0" onClick={() => setSelectedCertificate(null)} />
          
          <div className="relative z-10 w-full max-w-xl bg-amber-50/90 dark:bg-slate-900 border-8 border-double border-amber-600 dark:border-amber-700 p-8 rounded-2xl shadow-2xl text-slate-800 dark:text-slate-100 flex flex-col items-center text-center space-y-6">
            
            {/* Stamp decoration */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button 
                onClick={() => setSelectedCertificate(null)}
                className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Certificate design header */}
            <div className="space-y-1">
              <div className="text-amber-600 dark:text-amber-500 font-serif text-3xl font-extrabold tracking-widest uppercase">
                {isEn ? "CERTIFICATE OF ACHIEVEMENT" : "เกียรติบัตรความสำเร็จ"}
              </div>
              <div className="text-[10px] tracking-widest text-slate-400 uppercase">
                {isEn ? "MIND MERIT DIGITAL CREDENTIAL" : "ใบรับรองสากลแบบดิจิทัล MIND MERIT"}
              </div>
            </div>

            {/* Ribbon icon */}
            <div className="h-16 w-16 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-full flex items-center justify-center shadow-lg text-white">
              <Award className="h-9 w-9" />
            </div>

            {/* Certificate content */}
            <div className="space-y-4">
              <p className="text-xs italic text-slate-500">
                {isEn ? "This is proudly presented to" : "เกียรติบัตรฉบับนี้ขอมอบไว้เพื่อแสดงว่า"}
              </p>
              
              <div className="text-2xl font-bold font-serif border-b border-dashed border-amber-600/50 pb-1.5 px-8 inline-block text-slate-900 dark:text-white">
                {selectedCertificate.userName}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                {isEn ? "for outstanding dedication and active completion of the professional mental wellness module" : "ได้ผ่านการศึกษาและทำแบบทดสอบหลักสูตรสุขภาวะทางจิตและการฝึกสติสากล"}
                <br />
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-sm mt-2 block">
                  " {isEn ? selectedCertificate.courseNameEn : selectedCertificate.courseNameTh} "
                </span>
              </p>
            </div>

            {/* Signature and verification code blocks */}
            <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-amber-600/20 text-left text-[10px] text-slate-500">
              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase block">{isEn ? "Authorized Signee" : "ผู้ออกใบรับรองดิจิทัล"}</span>
                <span className="italic font-serif font-bold text-slate-700 dark:text-slate-300 block">Dr. Somsak P., Mind Merit Clinic</span>
                <span className="text-[8px] text-slate-400 block font-mono">{selectedCertificate.digitalSignature.substring(0, 32)}...</span>
              </div>
              <div className="space-y-1 text-right">
                <span className="font-bold text-slate-400 uppercase block">{isEn ? "Credential Details" : "รหัสอ้างอิงประกาศนียบัตร"}</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 block">ID: {selectedCertificate.certificateId}</span>
                <span className="block">{isEn ? "Verified on:" : "ตรวจสอบได้เมื่อ:"} {selectedCertificate.date}</span>
              </div>
            </div>

            {/* Visual Action Button to Simulated Print */}
            <div className="pt-4 flex space-x-2 w-full">
              <button
                onClick={() => {
                  alert(isEn ? "Connecting to secure blockchain register... Certificate details are registered. Ready to print!" : "กำลังติดต่อเครื่องพิมพ์และตรวจสอบบล็อกเชน... เกียรติบัตรนี้ได้รับการจดทะเบียนอย่างสมบูรณ์แล้ว!");
                }}
                className="flex-1 py-2 px-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>{isEn ? "Print / Save PDF" : "พิมพ์ / เซฟเกียรติบัตรเป็น PDF"}</span>
              </button>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="py-2 px-3.5 rounded-xl bg-slate-200 dark:bg-slate-850 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                {isEn ? "Back" : "ย้อนกลับ"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
